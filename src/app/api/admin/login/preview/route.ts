import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { isAdminPreviewAllowed } from "@/lib/auth/preview";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { checkCsrf } from "@/lib/auth/csrf";
import { getUsers } from "@/lib/auth/users";

export const runtime = "nodejs";

/**
 * One-click local sign-in as the first administrator — no password.
 * Fail closed: never in production / on Vercel; needs ADMIN_OPEN_PREVIEW=true.
 */
export async function POST(req: NextRequest) {
  if (!isAdminPreviewAllowed()) {
    return NextResponse.json({ error: "Preview login is disabled." }, { status: 403 });
  }
  const csrf = checkCsrf(req);
  if (csrf) return NextResponse.json({ error: csrf }, { status: 403 });
  const limit = await rateLimit(`preview:${clientIp(req.headers)}`, 20, 900);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }
  const admin = (await getUsers()).find((u) => u.active && u.role === "admin");
  if (!admin) {
    return NextResponse.json(
      { error: "No admin account exists yet. Sign in once with your email and password first." },
      { status: 400 },
    );
  }
  const token = await createSessionToken(admin);
  const res = NextResponse.json({ ok: true, name: admin.name, preview: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
