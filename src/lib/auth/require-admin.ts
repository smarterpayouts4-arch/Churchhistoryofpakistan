import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import type { AdminRole } from "@/lib/cms/types";
import { getAdminSession, type AdminSession } from "./session";

/** Defense in depth: call in Server Components, Route Handlers, and Server Actions. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdminPage(role: AdminRole = "editor"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (role === "admin" && session.role !== "admin") redirect("/admin");
  return session;
}

export function unauthorizedJson(message = "Please sign in again.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function requireAdminApi(
  role: AdminRole = "editor",
): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) return { ok: false, response: unauthorizedJson() };
  if (role === "admin" && session.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Only an administrator can do this." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, session };
}
