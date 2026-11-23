/**
 * Minimal Upstash Redis REST client (Vercel KV / Upstash via the Vercel
 * Marketplace). Uses the generic "command as JSON array" endpoint so values
 * of any size travel in the request body, not the URL.
 */
export function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kv<T = unknown>(command: (string | number)[]): Promise<T> {
  const base = (process.env.KV_REST_API_URL as string).replace(/\/$/, "");
  const res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV ${String(command[0])} failed (${res.status})`);
  }
  const json = (await res.json()) as { result: T; error?: string };
  if (json.error) throw new Error(`KV ${String(command[0])}: ${json.error}`);
  return json.result;
}
