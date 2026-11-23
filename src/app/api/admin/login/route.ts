import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { authenticate, touchLastLogin } from "@/lib/auth/users";
import { rateLimit, clearRateLimit, clientIp } from "@/lib/auth/rate-limit";
import { checkCsrf } from "@/lib/auth/csrf";
import { loginSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

const IP_MAX = 10; // attempts per IP per window
const ACCOUNT_MAX = 6; // attempts per account per window
const WINDOW_SECONDS = 15 * 60;

function tooMany(retryAfterSeconds?: number) {
  return NextResponse.json(
    {
      error: "Too many sign-in attempts. Please wait a few minutes and try again.",
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
    },
  );
}

export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return NextResponse.json({ error: csrf }, { status: 403 });

  const ip = clientIp(req.headers);
  const ipLimit = await rateLimit(`login-ip:${ip}`, IP_MAX, WINDOW_SECONDS);
  if (!ipLimit.allowed) return tooMany(ipLimit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 },
    );
  }
  const login = parsed.data.username.trim().toLowerCase();
  const accountKey = `login-acct:${login}`;
  const acctLimit = await rateLimit(accountKey, ACCOUNT_MAX, WINDOW_SECONDS);
  if (!acctLimit.allowed) return tooMany(acctLimit.retryAfterSeconds);

  const user = await authenticate(login, parsed.data.password);
  if (!user) {
    return NextResponse.json(
      { error: "That email or password is not right. Please try again." },
      { status: 401 },
    );
  }

  await Promise.all([
    clearRateLimit(accountKey),
    clearRateLimit(`login-ip:${ip}`),
    touchLastLogin(user.id),
  ]);
  const token = await createSessionToken(user);
  const res = NextResponse.json({ ok: true, name: user.name, role: user.role });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
