import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAdminSession, type AdminSession } from "./session";

/** Defense in depth: call in Server Components, Route Handlers, and Server Actions. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export function unauthorizedJson(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function requireAdminApi(): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, response: unauthorizedJson() };
  }
  return { ok: true, session };
}
