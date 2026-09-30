import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getAdminUsername,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { isAdminPreviewAllowed } from "@/lib/auth/preview";
import { checkPreviewRateLimit } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "local";
}

/**
 * One-click local curator Sign in — no password.
 * Double-guard: blocked when NODE_ENV==="production" OR ADMIN_OPEN_PREVIEW is not exactly "true".
 */
export async function POST(req: NextRequest) {
  // Explicit fail-closed checks (order matters for clarity in audits)
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Preview login is not available in production." },
      { status: 403 },
    );
  }
  if (process.env.ADMIN_OPEN_PREVIEW !== "true") {
    return NextResponse.json(
      {
        error:
          "Preview login is disabled. Set ADMIN_OPEN_PREVIEW=true in local .env only (never in production).",
      },
      { status: 403 },
    );
  }
  // Belt-and-suspenders: shared helper must also agree
  if (!isAdminPreviewAllowed()) {
    return NextResponse.json(
      { error: "Preview login is disabled." },
      { status: 403 },
    );
  }

  const key = `preview:${clientKey(req)}`;
  const limit = checkPreviewRateLimit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many preview login attempts. Please try again later.",
        retryAfterSeconds: limit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: limit.retryAfterSeconds
          ? { "Retry-After": String(limit.retryAfterSeconds) }
          : undefined,
      },
    );
  }

  const username = getAdminUsername();
  const token = await createSessionToken(username);
  const res = NextResponse.json({
    ok: true,
    username,
    preview: true,
  });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
