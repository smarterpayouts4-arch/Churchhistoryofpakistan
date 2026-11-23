import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { getUsers, saveUsers, toPublicUser } from "@/lib/auth/users";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

/** Change your own name or password. */
export const PATCH = adminRoute(async (req: NextRequest, _ctx, session) => {
  const parsed = schema.safeParse(await readJsonBody(req));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form." }, { status: 400 });
  }
  const users = await getUsers();
  const me = users.find((u) => u.id === session.userId);
  if (!me) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  const next = { ...me, updatedAt: new Date().toISOString() };
  if (parsed.data.name) next.name = parsed.data.name;
  if (parsed.data.newPassword) {
    if (!(await verifyPassword(parsed.data.currentPassword ?? "", me.passwordHash))) {
      return NextResponse.json({ error: "Your current password is not right." }, { status: 400 });
    }
    const problem = passwordProblem(parsed.data.newPassword);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });
    next.passwordHash = await hashPassword(parsed.data.newPassword);
    next.tokenVersion += 1;
  }
  await saveUsers(users.map((u) => (u.id === me.id ? next : u)));
  const res = NextResponse.json({ ok: true, user: toPublicUser(next) });
  // Keep this browser signed in after a password change (other sessions end).
  res.cookies.set(ADMIN_SESSION_COOKIE, await createSessionToken(next), sessionCookieOptions());
  return res;
});
