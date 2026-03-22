/**
 * /api/auth/connect
 *
 * Must-b CloudAuth handshake endpoint.
 *
 * The local Gateway (must-b v1.2+) redirects here via:
 *   GET must-b.com/auth/connect?uid=X&pub=Y&state=Z&sig=W&callback=http://localhost:PORT/api/auth/cloud-callback
 *
 * This function is called by the React page /auth/connect AFTER the user
 * confirms the connection in the browser. It:
 *   1. Verifies the Supabase session JWT from the Authorization header
 *   2. Builds and signs a CloudAuth JWT (HMAC-SHA256)
 *   3. Returns { token, redirect } so the frontend can call the local callback
 *
 * ENV vars required on Vercel:
 *   VITE_SUPABASE_URL        — Supabase project URL
 *   VITE_SUPABASE_ANON_KEY   — Supabase anon key
 *   MUSTB_JWT_SECRET         — 32+ char secret used to sign CloudAuth JWTs
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ── Helpers ────────────────────────────────────────────────────────────────

function base64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function signJwt(payload: object, secret: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = base64url(JSON.stringify(payload));
  const sig    = base64url(
    crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${sig}`;
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local gateway (localhost)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 1. Verify Supabase session
  const authHeader = req.headers.authorization ?? '';
  const supabaseJwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!supabaseJwt) return res.status(401).json({ error: 'Missing Authorization header' });

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseJwt);
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired Supabase session' });

  // 2. Validate request body
  const { uid, state, callback } = req.body as { uid?: string; state?: string; callback?: string };
  if (!uid || !state || !callback) {
    return res.status(400).json({ error: 'Missing uid, state, or callback' });
  }

  // callback must target localhost (the local Gateway)
  try {
    const cbUrl = new URL(callback);
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(cbUrl.hostname);
    if (!isLocal) return res.status(400).json({ error: 'callback must target localhost' });
  } catch {
    return res.status(400).json({ error: 'Invalid callback URL' });
  }

  // 3. Issue CloudAuth JWT
  const secret = process.env.MUSTB_JWT_SECRET;
  if (!secret || secret.length < 16) {
    return res.status(500).json({ error: 'Server misconfigured: MUSTB_JWT_SECRET missing' });
  }

  const now = Math.floor(Date.now() / 1000);
  const token = signJwt(
    {
      iss: 'must-b.com',
      sub: user.id,
      email: user.email,
      uid,          // MUSTB_UID of the connecting local agent
      iat: now,
      exp: now + 86400, // 24 h
    },
    secret
  );

  // 4. Build the local callback URL that the frontend will redirect to
  const redirectUrl = new URL(callback);
  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('token', token);

  return res.status(200).json({ token, redirect: redirectUrl.toString() });
}
