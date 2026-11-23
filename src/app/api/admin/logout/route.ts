import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { checkCsrf } from "@/lib/auth/csrf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const csrf = checkCsrf(req);
  if (csrf) return NextResponse.json({ error: csrf }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return res;
}
