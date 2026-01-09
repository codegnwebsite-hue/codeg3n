import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

    const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
    if (!process.env.GENERATOR_KEY) return res.status(500).json({ success: false, error: 'Server misconfigured' });
    if (!apiKey || apiKey !== process.env.GENERATOR_KEY) return res.status(401).json({ success: false, error: 'Invalid API key' });

    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const uid = String(body.uid || '').trim();
    if (!uid) return res.status(400).json({ success: false, error: 'Missing uid' });

    const secret = process.env.TOKEN_SECRET;
    if (!secret) return res.status(500).json({ success: false, error: 'Server misconfigured (missing TOKEN_SECRET)' });

    const jti = randomUUID();
    const expiresIn = process.env.TOKEN_EXPIRES || '7d';
    const payload = { uid, jti };

    const token = jwt.sign(payload, secret, { expiresIn });

    const base = process.env.VERCEL_BASE_URL || process.env.BASE_URL || '';
    const urlPath = `/verify?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`;
    const fullUrl = base ? `${base.replace(/\/$/, '')}${urlPath}` : urlPath;

    return res.status(200).json({ success: true, uid, token, url: fullUrl, expiresIn });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
}
