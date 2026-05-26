/**
 * /api/webhooks/lemon.ts  — Lemon Squeezy Webhook Handler
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  GÜVENLİK MİMARİSİ                                                     │
 * │                                                                         │
 * │  1. HMAC-SHA256 İmza Doğrulama                                         │
 * │     X-Signature header'ı ham (raw) payload ile karşılaştırılır.        │
 * │     Eşleşmezse anında 401 — payload hiç işlenmez.                      │
 * │     timing-safe comparison (timingSafeEqual) ile timing attack önlenir. │
 * │                                                                         │
 * │  2. İdempotency                                                         │
 * │     Aynı event iki kez gelirse (LS yeniden deneyebilir) profil ve kota │
 * │     tekrar üzerine yazılır — zararı yoktur, çünkü SET işlemidir.       │
 * │                                                                         │
 * │  3. Hızlı 200 OK                                                        │
 * │     Lemon Squeezy 5 sn içinde 200 almazsa yeniden dener.               │
 * │     DB işlemleri paralel yürütülür (Promise.all), gecikme minimumda.   │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Desteklenen Olaylar:
 *   • order_created           → tek seferlik satın alma (Local plan)
 *   • subscription_created    → yeni abonelik başladı
 *   • subscription_updated    → plan değişti / yenilendi
 *   • subscription_resumed    → iptal edilmiş abonelik yeniden aktif
 *   • subscription_cancelled  → abonelik iptal edildi → Free'ye düş
 *   • subscription_expired    → abonelik süresi doldu → Free'ye düş
 *
 * ENV vars (Vercel Dashboard):
 *   LEMON_SQUEEZY_WEBHOOK_SECRET  — LS Dashboard → Webhooks → Signing Secret
 *   VITE_SUPABASE_URL             — Supabase proje URL'i
 *   SUPABASE_SERVICE_ROLE_KEY     — RLS bypass için service role key
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { Database, PlanType, ProfileUpdate, UserUsageUpdate } from '../../src/types/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Lemon Squeezy Payload Tipleri
// ─────────────────────────────────────────────────────────────────────────────

interface LsCustomData {
  user_id?: string;
  [key: string]: unknown;
}

interface LsMeta {
  event_name: string;
  custom_data?: LsCustomData;
}

interface LsOrderAttributes {
  status: string;
  customer_id: number;
  first_order_item?: {
    product_name?: string;
    variant_name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface LsSubscriptionAttributes {
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'trial' | 'on_trial';
  customer_id: number;
  renews_at?: string | null;
  ends_at?: string | null;
  trial_ends_at?: string | null;
  product_name?: string;
  variant_name?: string;
  [key: string]: unknown;
}

interface LsPayload {
  meta: LsMeta;
  data: {
    id: string;
    type: 'orders' | 'subscriptions';
    attributes: LsOrderAttributes | LsSubscriptionAttributes;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan Eşlemesi — Lemon Squeezy ürün/varyant adı → PlanType
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lemon Squeezy'deki ürün/varyant isminden PlanType çıkarır.
 * Eşleşme bulunamazsa null döner (bilinmeyen ürün).
 *
 * NOT: LS Dashboard'da ürün isimlerini tam bu şekilde adlandırın,
 * ya da bu fonksiyonu variant_id üzerinden çalışacak şekilde güncelleyin.
 */
function resolvePlan(productName: string | undefined, variantName: string | undefined): PlanType | null {
  const combined = `${productName ?? ''} ${variantName ?? ''}`.toLowerCase();

  if (combined.includes('local') || combined.includes('sovereign')) return 'Local';
  if (combined.includes('elite'))                                     return 'Elite';
  if (combined.includes('pro'))                                       return 'Pro';
  if (combined.includes('core'))                                      return 'Core';

  return null; // Tanımsız ürün
}

/**
 * Plan türüne göre aylık token kotası.
 * src/types/supabase.ts'deki PLAN_QUOTA sabitleriyle senkronize tutulmalı.
 */
const PLAN_TOKEN_QUOTA: Record<PlanType, number> = {
  Free:  0,            // BYOK — proxy kota yok
  Core:  500_000,
  Pro:   2_000_000,
  Elite: 10_000_000,
  Local: 0,            // Sınırsız — kota yok
};

// ─────────────────────────────────────────────────────────────────────────────
// HMAC İmza Doğrulama
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lemon Squeezy'nin X-Signature header'ını timing-safe olarak doğrular.
 * Ham (raw) body string kullanılmalı — JSON.stringify edilmiş değil!
 */
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex');

    // timing attack'a karşı sabit zamanlı karşılaştırma
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex'),
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ana Handler
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Yalnızca POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── ENV Kontrolleri ────────────────────────────────────────────────────────
  const webhookSecret  = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  const supabaseUrl    = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret) {
    console.error('[lemon-webhook] LEMON_SQUEEZY_WEBHOOK_SECRET env var eksik');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[lemon-webhook] Supabase env vars eksik');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  // ── Ham Body ve İmza ───────────────────────────────────────────────────────
  // Vercel, body'yi otomatik parse eder. HMAC için ham string lazım.
  // Ham body'yi elde etmek için req.body yerine rawBody kullanıyoruz.
  // Vercel'de ham body için bodyParser'ı devre dışı bırakmamız gerekiyor
  // (aşağıdaki config export ile).
  const rawBody = await getRawBody(req);
  const signature = req.headers['x-signature'] as string | undefined;

  if (!signature) {
    console.warn('[lemon-webhook] X-Signature header eksik');
    return res.status(401).json({ error: 'Missing X-Signature header' });
  }

  // ── İmza Doğrulama ─────────────────────────────────────────────────────────
  if (!verifySignature(rawBody, signature, webhookSecret)) {
    console.warn('[lemon-webhook] Geçersiz imza — olası replay/sahte istek');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // ── Payload Parse ──────────────────────────────────────────────────────────
  let payload: LsPayload;
  try {
    payload = JSON.parse(rawBody) as LsPayload;
  } catch {
    console.error('[lemon-webhook] Payload JSON parse hatası');
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const eventName  = payload.meta?.event_name;
  const customData = payload.meta?.custom_data;
  const userId     = customData?.user_id;

  console.info(`[lemon-webhook] Olay alındı: ${eventName} | user_id: ${userId ?? '(yok)'}`);

  // ── Erken 200 stratejisi ───────────────────────────────────────────────────
  // Lemon Squeezy 5 sn içinde yanıt bekler. İşlemi başlatıp hemen 200 dönüyoruz.
  // Hata olursa console.error ile logluyoruz.
  res.status(200).json({ received: true });

  // ── Asenkron Olay İşleme ───────────────────────────────────────────────────
  // res.json() sonrası da devam edebiliriz (Vercel serverless fonksiyonları
  // response gönderildikten sonra işlemi tamamlar).
  try {
    await processEvent(eventName, userId, payload, supabaseUrl, serviceRoleKey);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[lemon-webhook] İşlem hatası (${eventName}):`, msg);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Olay İşleme
// ─────────────────────────────────────────────────────────────────────────────

async function processEvent(
  eventName: string,
  userId: string | undefined,
  payload: LsPayload,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<void> {

  const db = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  switch (eventName) {

    // ── Tek seferlik satın alma (genellikle Local/Lifetime plan) ─────────────
    case 'order_created': {
      if (!userId) {
        console.warn('[lemon-webhook] order_created: custom_data.user_id yok — atlanıyor');
        break;
      }

      const attrs = payload.data.attributes as LsOrderAttributes;
      if (attrs.status !== 'paid') {
        console.info(`[lemon-webhook] order_created: status=${attrs.status} — ödeme tamamlanmamış, atlanıyor`);
        break;
      }

      const plan = resolvePlan(
        attrs.first_order_item?.product_name as string | undefined,
        attrs.first_order_item?.variant_name as string | undefined,
      );

      if (!plan) {
        console.warn('[lemon-webhook] order_created: bilinmeyen ürün adı');
        break;
      }

      const customerId = String(attrs.customer_id);
      // Local plan için expires_at null (ömür boyu)
      const expiresAt = null;

      await activateUserPlan(db, userId, plan, customerId, expiresAt);
      break;
    }

    // ── Yeni abonelik başladı ─────────────────────────────────────────────
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_resumed': {
      if (!userId) {
        console.warn(`[lemon-webhook] ${eventName}: custom_data.user_id yok — atlanıyor`);
        break;
      }

      const attrs = payload.data.attributes as LsSubscriptionAttributes;
      const activeStatuses: LsSubscriptionAttributes['status'][] = ['active', 'on_trial', 'trial'];

      if (!activeStatuses.includes(attrs.status)) {
        console.info(`[lemon-webhook] ${eventName}: status=${attrs.status} — aktif değil, atlanıyor`);
        break;
      }

      const plan = resolvePlan(attrs.product_name, attrs.variant_name);
      if (!plan) {
        console.warn(`[lemon-webhook] ${eventName}: bilinmeyen ürün adı`);
        break;
      }

      const customerId = String(attrs.customer_id);
      // renews_at varsa plan bitiş tarihi olarak kullan
      const expiresAt = attrs.renews_at ?? attrs.ends_at ?? null;

      await activateUserPlan(db, userId, plan, customerId, expiresAt);
      break;
    }

    // ── Abonelik iptal edildi veya süresi doldu → Free'ye düş ─────────────
    case 'subscription_cancelled':
    case 'subscription_expired': {
      if (!userId) {
        console.warn(`[lemon-webhook] ${eventName}: custom_data.user_id yok — atlanıyor`);
        break;
      }

      await deactivateUserPlan(db, userId);
      break;
    }

    default:
      // Desteklenmeyen olay — sessizce geç (yeni LS olayları gelebilir)
      console.info(`[lemon-webhook] Desteklenmeyen olay tipi: ${eventName} — atlanıyor`);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DB İşlemleri
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kullanıcının planını aktif eder.
 * profiles + user_usage tablolarını paralel günceller (waterfall yok).
 */
async function activateUserPlan(
  db: ReturnType<typeof createClient<Database>>,
  userId: string,
  plan: PlanType,
  lsCustomerId: string,
  expiresAt: string | null,
): Promise<void> {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const resetDate = nextMonth.toISOString();

  const profileUpdate: ProfileUpdate = {
    active_plan:               plan,
    plan_expires_at:           expiresAt,
    lemon_squeezy_customer_id: lsCustomerId,
  };

  const usageUpdate: UserUsageUpdate = {
    monthly_token_quota: PLAN_TOKEN_QUOTA[plan],
    reset_date:          resetDate,
    // used_token_count sıfırlanmaz — ay ortası plan değişikliklerinde adil davranış
  };

  const [profileResult, usageResult] = await Promise.all([
    db
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId),
    db
      .from('user_usage')
      .update(usageUpdate)
      .eq('user_id', userId),
  ]);

  if (profileResult.error) {
    throw new Error(`profiles güncelleme hatası: ${profileResult.error.message}`);
  }
  if (usageResult.error) {
    throw new Error(`user_usage güncelleme hatası: ${usageResult.error.message}`);
  }

  console.info(
    `[lemon-webhook] ✅ Plan aktif edildi | user=${userId} | plan=${plan} | quota=${PLAN_TOKEN_QUOTA[plan]} | reset=${resetDate}`,
  );
}

/**
 * Kullanıcıyı Free plana düşürür.
 * Kota sıfırlanır; geçmiş kullanım korunur (istatistik kaybı olmasın).
 */
async function deactivateUserPlan(
  db: ReturnType<typeof createClient<Database>>,
  userId: string,
): Promise<void> {
  const profileUpdate: ProfileUpdate = {
    active_plan:     'Free',
    plan_expires_at: null,
  };

  const usageUpdate: UserUsageUpdate = {
    monthly_token_quota: PLAN_TOKEN_QUOTA['Free'], // 0 — BYOK
  };

  const [profileResult, usageResult] = await Promise.all([
    db
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId),
    db
      .from('user_usage')
      .update(usageUpdate)
      .eq('user_id', userId),
  ]);

  if (profileResult.error) {
    throw new Error(`profiles downgrade hatası: ${profileResult.error.message}`);
  }
  if (usageResult.error) {
    throw new Error(`user_usage downgrade hatası: ${usageResult.error.message}`);
  }

  console.info(`[lemon-webhook] ⬇️  Plan düşürüldü | user=${userId} | plan=Free`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Ham Body Okuyucu
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vercel Node.js runtime'da body-parser aktifken req.body zaten parse edilmiş gelir.
 * HMAC doğrulaması için orijinal ham string lazım — bu yüzden bodyParser'ı
 * devre dışı bırakıyoruz (aşağıdaki config export) ve stream'den okuyoruz.
 */
async function getRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString('utf8'); });
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Vercel Konfigürasyonu
// ─────────────────────────────────────────────────────────────────────────────

/**
 * bodyParser devre dışı — getRawBody() stream'den okusun.
 * HMAC doğrulaması için ham payload zorunludur.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
