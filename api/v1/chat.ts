/**
 * /api/v1/chat  — Must-b LLM Proxy (Load Balancer)
 *
 * Masaüstü uygulaması OpenRouter API anahtarlarını doğrudan tutmak yerine
 * tüm chat isteklerini bu Edge Function üzerinden geçirir.
 *
 * Güvenlik:
 *   Her istekte "X-Mustb-Node" header'ı zorunludur.
 *   Header değeri MUSTB_NODE_SECRET env değişkeniyle eşleşmelidir.
 *
 * Load Balancer:
 *   OPENROUTER_API_KEYS (virgülle ayrılmış liste) içinden
 *   Math.random() ile rastgele bir key seçilir.
 *
 * Stream:
 *   OpenRouter'dan gelen SSE/chunked yanıt hiç tamponlanmadan
 *   doğrudan istemciye iletilir (TransformStream pass-through).
 *
 * ENV vars required (Vercel Dashboard → Settings → Environment Variables):
 *   OPENROUTER_API_KEYS   — "sk-or-xxx,sk-or-yyy,sk-or-zzz"
 *   MUSTB_NODE_SECRET     — masaüstü uygulamasının bildiği gizli değer
 *
 * İsteğe bağlı:
 *   OPENROUTER_SITE_URL   — OpenRouter loglama için; varsayılan "https://must-b.com"
 *   OPENROUTER_SITE_NAME  — OpenRouter loglama için; varsayılan "must-b"
 */

// Vercel Edge Runtime — stream desteği zorunlu kılar
export const config = { runtime: 'edge' };

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// ── Yardımcı: düz JSON hata yanıtı ──────────────────────────────────────────

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Ana Handler ──────────────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {

  // ── CORS preflight ────────────────────────────────────────────────────────
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Mustb-Node, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // ── Yalnızca POST ─────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Güvenlik Kontrolü: X-Mustb-Node header ───────────────────────────────
  const nodeHeader = req.headers.get('X-Mustb-Node');
  if (!nodeHeader) {
    return new Response(JSON.stringify({ error: 'Missing X-Mustb-Node header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const nodeSecret = process.env.MUSTB_NODE_SECRET;
  // Secret tanımlıysa header ile karşılaştır; tanımlı değilse sadece varlığı yeter
  if (nodeSecret && nodeHeader !== nodeSecret) {
    return new Response(JSON.stringify({ error: 'Invalid X-Mustb-Node secret' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Load Balancer: Rastgele API Key Seç ─────────────────────────────────
  const rawKeys = process.env.OPENROUTER_API_KEYS ?? '';
  const keys = rawKeys
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (keys.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: no OPENROUTER_API_KEYS defined' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const selectedKey = keys[Math.floor(Math.random() * keys.length)];

  // ── İstek Gövdesini Al ───────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // stream: true'yu her zaman zorla — masaüstü uygulaması göndermese bile
  const upstreamBody = JSON.stringify({
    ...(body as Record<string, unknown>),
    stream: true,
  });

  // ── OpenRouter'a İlet ────────────────────────────────────────────────────
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization':    `Bearer ${selectedKey}`,
        'Content-Type':     'application/json',
        'HTTP-Referer':     process.env.OPENROUTER_SITE_URL  ?? 'https://must-b.com',
        'X-Title':          process.env.OPENROUTER_SITE_NAME ?? 'must-b',
      },
      body: upstreamBody,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upstream fetch failed';
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // OpenRouter hata döndürdüyse body'yi olduğu gibi ilet
  if (!upstreamRes.ok) {
    const errText = await upstreamRes.text();
    return new Response(errText, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders,
        'Content-Type': upstreamRes.headers.get('Content-Type') ?? 'application/json',
      },
    });
  }

  // ── Stream'i Tampon'suz İlet ─────────────────────────────────────────────
  // upstreamRes.body bir ReadableStream<Uint8Array>'dir.
  // Bunu doğrudan istemciye aktarıyoruz; hiç buffer yapmıyoruz.
  return new Response(upstreamRes.body, {
    status: 200,
    headers: {
      ...corsHeaders,
      // SSE / chunked transfer — istemci ikisini de desteklemeli
      'Content-Type':      upstreamRes.headers.get('Content-Type') ?? 'text/event-stream',
      'Cache-Control':     'no-store',
      'X-Accel-Buffering': 'no', // Nginx/Vercel proxy tamponlamasını kapat
    },
  });
}
