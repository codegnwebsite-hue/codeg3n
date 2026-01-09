// Example non-blocking Discord bot call for `.gen` command
// Usage: set process.env.GENERATOR_KEY and call getVerificationUrl(uid)
import fetch from 'node-fetch';

export async function getVerificationUrl(uid) {
  const res = await fetch(process.env.GENERATE_API_URL || '/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GENERATOR_KEY },
    body: JSON.stringify({ uid })
  });
  if (!res.ok) throw new Error('Failed to generate verification link');
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.url || data;
}

// Example usage inside a command handler (pseudo):
// const url = await getVerificationUrl(discordUserId);
// message.author.send(`Verify: ${url}`);
