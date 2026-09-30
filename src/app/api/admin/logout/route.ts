import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { requireAdminApi } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

export async function POST() {
  const gate = await requireAdminApi();
  // Always clear cookie even if session already invalid
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });
  if (!gate.ok) {
    // Still return ok so logout is idempotent from the UI
    return res;
  }
  return res;
}
