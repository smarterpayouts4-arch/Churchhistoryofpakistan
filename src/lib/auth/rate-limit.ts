/**
 * Lightweight in-memory rate limiter (per process).
 * Enough for a single-curator local/admin deploy; not a substitute for WAF.
 * Fail closed: when a bucket is exhausted, callers must return 429.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 8;
const MAX_PREVIEW_ATTEMPTS = 20;

function checkRateLimit(
  key: string,
  maxAttempts: number,
): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (existing.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  existing.count += 1;
  return { allowed: true };
}

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  return checkRateLimit(key, MAX_LOGIN_ATTEMPTS);
}

export function checkPreviewRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  return checkRateLimit(key, MAX_PREVIEW_ATTEMPTS);
}

export function clearLoginRateLimit(key: string): void {
  buckets.delete(key);
}
