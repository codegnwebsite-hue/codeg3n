# API for token generation (Vercel)

Purpose: a Vercel serverless endpoint that issues signed JWT tokens.

- Endpoint path: `/api/generate-token`
- Vercel environment variables:
  - `GENERATOR_KEY` — bearer API key required in `x-api-key` header.
  - `TOKEN_SECRET` — secret used to sign JWTs.
  - `TOKEN_EXPIRES` (optional) — token expiry, e.g. `7d`, `1h`. Defaults to `7d`.

Example request (server-side):

```bash
curl -X POST https://<your-project>.vercel.app/api/generate-token \
  -H "Content-Type: application/json" \
  -H "x-api-key: $GENERATOR_KEY"
```

Response:

```json
{ "token": "<jwt>", "expiresIn": "7d" }
```

Discord bot usage (example): have your bot request a token for internal auth with your backend. Example Node snippet:

```js
import fetch from 'node-fetch';

async function getToken() {
  const res = await fetch('https://<your-project>.vercel.app/api/generate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GENERATOR_KEY }
  });
  return res.json();
}

// In your bot
getToken().then(r => console.log('Backend token:', r.token));
```

Make sure **not** to use these generated tokens as Discord bot tokens — Discord bot tokens are issued by Discord and must be kept secret.
