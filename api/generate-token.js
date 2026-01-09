import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
    if (!process.env.GENERATOR_KEY) {
      res.status(500).json({ error: 'Server not configured (missing GENERATOR_KEY)' });
      return;
    }
    if (!apiKey || apiKey !== process.env.GENERATOR_KEY) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }

    let body = {};
    try {
      body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    } catch (e) {
      // ignore, keep body as empty object
    }

    const uid = body.uid || randomUUID();
    const expiresIn = process.env.TOKEN_EXPIRES || '7d';
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server not configured (missing TOKEN_SECRET)' });
      return;
    }

    const payload = {
      uid,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, secret, { expiresIn });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ token, expiresIn });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
