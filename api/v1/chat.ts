/**
 * /api/v1/chat  — Must-b LLM Proxy  (Aşama 2: Edge Proxy Güvenliği)
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  KATMAN 1 — Shared Secret (X-Mustb-Node)                           │
 * │    Yalnızca must-b masaüstü uygulaması bu header'ı bilir.          │
 * │    İnternetten gelecek ham scrape/spam isteklerini ilk katta keser. │
 * │                                                                     │
 * │  KATMAN 2 — Supabase JWT (Authorization: Bearer <token>)           │
 * │    Kullanıcı kimliği doğrulanır; plan ve kota DB'den okunur.       │
 * │    Free plan veya kota doluysa → 402 Payment Required              │
 * │                                                                     │
 * │  KATMAN 3 — OpenRouter Proxy                                       │
 * │    Sunucudaki gizli OPENROUTER_API_KEY kullanılır; istemci asla    │
 * │    göremez. SSE stream buffer'sız aktarılır.                       │
 * │                                                                     │
 * │  KATMAN 4 — Kota Düşme (Increment)                                │
 * │    Başarılı yanıt sonrası used_token_count güncellenir.            │
 * │    Service Role key zorunludur (RLS bypass).                       │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ENV vars (Vercel Dashboard → Settings → Environment Variables):
 *   OPENROUTER_API_KEYS        — "sk-or-xxx,sk-or-yyy"   (yük dengeleme)
 *   MUSTB_NODE_SECRET          — masaüstü uygulamasının paylaşımlı sırrı
 *   VITE_SUPABASE_URL          — Supabase proje URL'i
 *   SUPABASE_SERVICE_ROLE_KEY  — RLS bypass için service role key (sadece backend!)
 *   OPENROUTER_SITE_URL        — opsiyonel, OpenRouter loglama
 *   OPENROUTER_SITE_NAME       — opsiyonel, OpenRouter loglama
 */

// Vercel Edge Runtime — stream desteği zorunlu kılar
export const config = { runtime: 'edge' };

import { createClient } from '@supabase/supabase-js';
import type { Database, Profile, UserUsage } from '../../src/types/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Sabitler
// ─────────────────────────────────────────────────────────────────────────────

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// CORS başlıkları — tüm yanıtlara eklenir
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Mustb-Node',
};

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcı fonksiyonlar
// ─────────────────────────────────────────────────────────────────────────────

/** Düz JSON hata yanıtı */
function err(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

/**
 * OpenRouter SSE stream'inden harcanan toplam token sayısını hesaplar.
 * Stream bitiminde `usage` alanı geliyorsa onu kullanır,
 * gelmiyorsa chunk sayısını yaklaşık token sayısı olarak döner.
 */
function extractTokensFromSSE(chunks: Uint8Array[]): number {
  try {
    const decoder = new TextDecoder();
    let totalTokens = 0;

    for (const chunk of chunks) {
      const text = decoder.decode(chunk, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data) as {
            usage?: { total_tokens?: number; completion_tokens?: number };
          };
          // OpenRouter son chunk'ta usage bilgisi gönderir
          if (parsed.usage?.total_tokens) {
            totalTokens = parsed.usage.total_tokens;
          }
        } catch {
          // JSON parse hatası → bu chunk'u atla
        }
      }
    }

    // usage gelmemişse chunk sayısını yaklaşık ölçek olarak kullan (1 chunk ≈ 4 token)
    return totalTokens > 0 ? totalTokens : Math.max(chunks.length * 4, 1);
  } catch {
    return 1; // En kötü durumda 1 sayıyoruz; kota sonsuz döngüye girmesin
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ana Handler
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {

  // ── CORS Preflight ──────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== 'POST') {
    return err('Method not allowed', 405);
  }

  // ── KATMAN 1: Shared Secret (X-Mustb-Node) ──────────────────────────────
  // Masaüstü uygulaması dışından gelen ham istekleri ilk katta blokla.
  const nodeHeader = req.headers.get('X-Mustb-Node');
  if (!nodeHeader) {
    return err('Missing X-Mustb-Node header', 401);
  }

  const nodeSecret = process.env.MUSTB_NODE_SECRET;
  if (nodeSecret && nodeHeader !== nodeSecret) {
    return err('Invalid X-Mustb-Node secret', 401);
  }

  // ── KATMAN 2: Supabase JWT Doğrulama ────────────────────────────────────
  const authHeader = req.headers.get('Authorization') ?? '';
  const supabaseJwt = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!supabaseJwt) {
    return err('Missing Authorization header (Bearer <supabase_token>)', 401);
  }

  // ENV kontrolü
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return err('Server misconfigured: Supabase env vars missing', 500);
  }

  // Kullanıcı doğrulama için anon key yetmez — JWT'yi getUser ile doğrula.
  // Service Role client aynı zamanda kullanıcı verisini ve kota güncellemesini
  // tek bağlantıdan RLS bypass yaparak halleder.
  const adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // JWT'den kullanıcı kimliğini al (Supabase sunucu tarafında doğrular)
  const { data: { user }, error: authError } = await adminClient.auth.getUser(supabaseJwt);

  if (authError || !user) {
    return err('Invalid or expired Supabase token', 401);
  }

  const userId = user.id;

  // ── Plan ve Kota Kontrolü ─────────────────────────────────────────────────
  // İki tabloyu paralel sorgula (waterfall yerine paralel → daha hızlı)
  const [profileResult, usageResult] = await Promise.all([
    adminClient
      .from('profiles')
      .select('active_plan, plan_expires_at')
      .eq('id', userId)
      .single(),
    adminClient
      .from('user_usage')
      .select('monthly_token_quota, used_token_count, reset_date')
      .eq('user_id', userId)
      .single(),
  ]);

  if (profileResult.error || !profileResult.data) {
    return err('User profile not found', 404);
  }
  if (usageResult.error || !usageResult.data) {
    return err('User usage record not found', 404);
  }

  const profile = profileResult.data as Pick<Profile, 'active_plan' | 'plan_expires_at'>;
  const usage   = usageResult.data  as Pick<UserUsage, 'monthly_token_quota' | 'used_token_count' | 'reset_date'>;

  // Plan süresi dolmuşsa Free'ye düş (soft check; webhook güncellemiş olmalı)
  const planExpired =
    profile.plan_expires_at !== null &&
    new Date(profile.plan_expires_at) < new Date();

  const effectivePlan = planExpired ? 'Free' : profile.active_plan;

  // Free plan → Sunucu proxy kotası yok; BYOK akışına yönlendir
  if (effectivePlan === 'Free') {
    return err(
      'Proxy access requires an active paid plan. Use your own API key (BYOK) instead.',
      402
    );
  }

  // Local plan → Sınırsız; kota kontrolü atla
  const isLocalPlan = effectivePlan === 'Local';

  // Kota dolmuşsa reddet
  if (!isLocalPlan && usage.used_token_count >= usage.monthly_token_quota) {
    const remaining = usage.monthly_token_quota - usage.used_token_count;
    return err(
      `Monthly token quota exceeded. ` +
      `Used: ${usage.used_token_count} / ${usage.monthly_token_quota}. ` +
      `Remaining: ${Math.max(0, remaining)}. ` +
      `Resets at: ${usage.reset_date}`,
      402
    );
  }

  // ── KATMAN 3: Load Balancer + OpenRouter Proxy ───────────────────────────
  const rawKeys = process.env.OPENROUTER_API_KEYS ?? '';
  const keys = rawKeys.split(',').map((k) => k.trim()).filter(Boolean);

  if (keys.length === 0) {
    return err('Server misconfigured: no OPENROUTER_API_KEYS defined', 500);
  }

  const selectedKey = keys[Math.floor(Math.random() * keys.length)];

  // İstek gövdesini al ve stream'i zorla
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const upstreamBody = JSON.stringify({
    ...(body as Record<string, unknown>),
    stream: true,
    // OpenRouter usage bilgisini son chunk'ta iletsin (kota hesabı için)
    stream_options: { include_usage: true },
  });

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedKey}`,
        'Content-Type':  'application/json',
        'HTTP-Referer':  process.env.OPENROUTER_SITE_URL  ?? 'https://must-b.com',
        'X-Title':       process.env.OPENROUTER_SITE_NAME ?? 'must-b',
      },
      body: upstreamBody,
    });
  } catch (fetchErr: unknown) {
    const msg = fetchErr instanceof Error ? fetchErr.message : 'Upstream fetch failed';
    return err(msg, 502);
  }

  // OpenRouter hata döndürdüyse body'yi olduğu gibi ilet
  if (!upstreamRes.ok) {
    const errText = await upstreamRes.text();
    return new Response(errText, {
      status: upstreamRes.status,
      headers: {
        ...CORS,
        'Content-Type': upstreamRes.headers.get('Content-Type') ?? 'application/json',
      },
    });
  }

  if (!upstreamRes.body) {
    return err('Empty response from upstream', 502);
  }

  // ── KATMAN 4: Kota Düşme — Stream Tee ──────────────────────────────────
  // Stream'i ikiye bölüyoruz:
  //   • Branch 1 → istemciye anında iletilir (sıfır gecikme)
  //   • Branch 2 → arkaplanda okunur, token sayısı hesaplanır, DB güncellenir
  const [clientStream, countStream] = upstreamRes.body.tee();

  // Token sayımı + kota güncelleme arkaplanda çalışır (istemciyi bekletmez)
  // Local plan'da bu adım atlanır (0 = sınırsız)
  if (!isLocalPlan) {
    (async () => {
      try {
        const reader = countStream.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }

        const tokensUsed = extractTokensFromSSE(chunks);

        // RLS bypass ile used_token_count'u artır
        const { error: updateErr } = await adminClient
          .from('user_usage')
          .update({ used_token_count: usage.used_token_count + tokensUsed })
          .eq('user_id', userId);

        if (updateErr) {
          // Hata log'la ama istemciye yansıtma; stream zaten gitti
          console.error('[chat] Kota güncelleme hatası:', updateErr.message);
        }
      } catch (bgErr: unknown) {
        const msg = bgErr instanceof Error ? bgErr.message : String(bgErr);
        console.error('[chat] Arkaplan kota sayacı hatası:', msg);
      }
    })();
  } else {
    // Local plan: countStream'i tüketmeden kapat (bellek sızıntısı önlenir)
    countStream.cancel().catch(() => undefined);
  }

  // ── Stream'i Tampon'suz İstemciye İlet ──────────────────────────────────
  return new Response(clientStream, {
    status: 200,
    headers: {
      ...CORS,
      'Content-Type':      upstreamRes.headers.get('Content-Type') ?? 'text/event-stream',
      'Cache-Control':     'no-store',
      'X-Accel-Buffering': 'no', // Nginx/Vercel proxy tamponlamasını kapat
    },
  });
}
