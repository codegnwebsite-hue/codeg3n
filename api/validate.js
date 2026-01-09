import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { uid, token } = body;
    if (!uid || !token) return res.status(400).json({ success: false, error: 'Missing uid or token' });

    const secret = process.env.TOKEN_SECRET;
    if (!secret) return res.status(500).json({ success: false, error: 'Server misconfigured (missing TOKEN_SECRET)' });

    try {
      const payload = jwt.verify(token, secret);
      if (payload && payload.uid && String(payload.uid) === String(uid)) {
        return res.status(200).json({ success: true, uid });
      }
      return res.status(400).json({ success: false, error: 'Token does not match uid' });
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
}
