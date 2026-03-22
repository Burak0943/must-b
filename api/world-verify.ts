/**
 * /api/world-verify
 *
 * Must-b Worlds mode verification endpoint.
 *
 * The local Gateway pings this endpoint to confirm that a given MUSTB_UID
 * holds an active CloudAuth JWT and is entitled to World mode features.
 *
 * Request:
 *   GET /api/world-verify?uid=MUSTB_UID
 *   Authorization: Bearer <CloudAuth JWT issued by /api/auth/connect>
 *
 * Response 200:
 *   { uid, world_mode: true, user_id, email, issued_at, expires_at }
 *
 * Response 401 / 403:
 *   { error: "..." }
 *
 * ENV vars required on Vercel:
 *   MUSTB_JWT_SECRET  — same secret used in /api/auth/connect
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// ── JWT verification (no external deps) ──────────────────────────────────

function base64urlDecode(s: string): string {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (padded.length % 4);
  return Buffer.from(pad < 4 ? padded + '='.repeat(pad) : padded, 'base64').toString('utf-8');
}

interface CloudPayload {
  iss: string;
  sub: string;
  email?: string;
  uid: string;
  iat: number;
  exp: number;
}

function verifyJwt(token: string, secret: string): CloudPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');

  const [headerB64, payloadB64, sigB64] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  if (!crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(base64urlDecode(payloadB64)) as CloudPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  if (payload.iss !== 'must-b.com') throw new Error('Invalid issuer');

  return payload;
}

// ── Handler ────────────────────────────────────────────────────────────────

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — the local Gateway calls from localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' });

  const secret = process.env.MUSTB_JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server misconfigured' });

  let payload: CloudPayload;
  try {
    payload = verifyJwt(token, secret);
  } catch (err: any) {
    return res.status(401).json({ error: err.message ?? 'Invalid token' });
  }

  // If a uid query param is provided, confirm it matches the token's uid
  const queryUid = (req.query.uid as string | undefined) ?? '';
  if (queryUid && queryUid !== payload.uid) {
    return res.status(403).json({ error: 'UID mismatch — token does not belong to this agent' });
  }

  return res.status(200).json({
    uid:        payload.uid,
    world_mode: true,
    user_id:    payload.sub,
    email:      payload.email ?? null,
    issued_at:  payload.iat,
    expires_at: payload.exp,
  });
}
