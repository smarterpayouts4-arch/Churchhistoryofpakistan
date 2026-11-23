import { randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

/**
 * CSRF defence for admin mutations (two layers):
 * 1. Same-origin check on the Origin (or Referer) header.
 * 2. Double-submit token: the proxy sets a readable `hcop_csrf` cookie on
 *    /admin pages; the admin UI echoes it in the `x-csrf-token` header.
 * The session cookie is also SameSite=Strict.
 */
export const CSRF_COOKIE = "hcop_csrf";
export const CSRF_HEADER = "x-csrf-token";

export function newCsrfToken() {
  return randomBytes(24).toString("base64url");
}

function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function checkCsrf(req: NextRequest): string | null {
  if (!sameOrigin(req)) return "Request blocked: it did not come from this site.";
  const cookie = req.cookies.get(CSRF_COOKIE)?.value ?? "";
  const header = req.headers.get(CSRF_HEADER) ?? "";
  if (!cookie || !header || cookie.length !== header.length) {
    return "Your session form token is missing. Please reload the page and try again.";
  }
  if (!timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) {
    return "Your session form token does not match. Please reload the page and try again.";
  }
  return null;
}
