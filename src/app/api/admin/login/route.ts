import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getAdminUsername,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth/session";
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
} from "@/lib/auth/rate-limit";
import { loginSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "local";
}

export async function POST(req: NextRequest) {
  const key = `login:${clientKey(req)}`;
  const limit = checkLoginRateLimit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const expectedUser = getAdminUsername();
  const userOk =
    parsed.data.username.trim().toLowerCase() === expectedUser.toLowerCase();
  const passOk = await verifyAdminPassword(parsed.data.password);

  if (!userOk || !passOk) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  clearLoginRateLimit(key);
  const token = await createSessionToken(expectedUser);
  const res = NextResponse.json({ ok: true, username: expectedUser });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
