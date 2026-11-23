import { kv, kvConfigured } from "@/lib/cms/kv";

/**
 * Fixed-window rate limiter. Uses Vercel KV when configured (shared across
 * serverless instances), otherwise an in-memory map (single local process).
 * Fails closed: callers must return 429 when `allowed` is false.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateResult = { allowed: boolean; retryAfterSeconds?: number };

export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateResult> {
  if (kvConfigured()) {
    try {
      const k = `rl:${key}`;
      const count = await kv<number>(["INCR", k]);
      if (count === 1) await kv(["EXPIRE", k, windowSeconds]);
      if (count > max) {
        const ttl = await kv<number>(["TTL", k]);
        return { allowed: false, retryAfterSeconds: ttl > 0 ? ttl : windowSeconds };
      }
      return { allowed: true };
    } catch {
      // KV hiccup: fall through to the in-memory limiter rather than open up.
    }
  }
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true };
  }
  existing.count += 1;
  if (existing.count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  return { allowed: true };
}

export async function clearRateLimit(key: string) {
  buckets.delete(key);
  if (kvConfigured()) await kv(["DEL", `rl:${key}`]).catch(() => {});
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "local";
}
