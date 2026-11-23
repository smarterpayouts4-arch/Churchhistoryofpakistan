import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { getUsers, saveUsers, toPublicUser } from "@/lib/auth/users";
import { hashPassword, passwordProblem } from "@/lib/auth/password";
import type { AdminUser } from "@/lib/cms/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["admin", "editor"]).optional(),
  active: z.boolean().optional(),
  password: z.string().optional(),
});

function activeAdmins(users: AdminUser[]) {
  return users.filter((u) => u.active && u.role === "admin");
}

export const PATCH = adminRoute<Ctx>(
  async (req, ctx, session) => {
    const { id } = await ctx.params;
    const parsed = patchSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form." }, { status: 400 });
    }
    const users = await getUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const next: AdminUser = { ...target, updatedAt: new Date().toISOString() };
    if (parsed.data.name !== undefined) next.name = parsed.data.name;
    if (parsed.data.role !== undefined) next.role = parsed.data.role;
    if (parsed.data.active !== undefined) {
      next.active = parsed.data.active;
      if (!parsed.data.active) next.tokenVersion += 1;
    }
    if (parsed.data.password) {
      const problem = passwordProblem(parsed.data.password);
      if (problem) return NextResponse.json({ error: problem }, { status: 400 });
      next.passwordHash = await hashPassword(parsed.data.password);
      next.tokenVersion += 1;
    }
    if (target.id === session.userId && (next.role !== "admin" || !next.active)) {
      return NextResponse.json(
        { error: "You can't remove your own administrator access." },
        { status: 400 },
      );
    }
    const after = users.map((u) => (u.id === id ? next : u));
    if (activeAdmins(after).length === 0) {
      return NextResponse.json(
        { error: "There must always be at least one active administrator." },
        { status: 400 },
      );
    }
    await saveUsers(after);
    return NextResponse.json({ ok: true, user: toPublicUser(next) });
  },
  { role: "admin" },
);

export const DELETE = adminRoute<Ctx>(
  async (_req, ctx, session) => {
    const { id } = await ctx.params;
    if (id === session.userId) {
      return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
    }
    const users = await getUsers();
    const after = users.filter((u) => u.id !== id);
    if (after.length === users.length) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }
    if (activeAdmins(after).length === 0) {
      return NextResponse.json(
        { error: "There must always be at least one active administrator." },
        { status: 400 },
      );
    }
    await saveUsers(after);
    return NextResponse.json({ ok: true });
  },
  { role: "admin" },
);
