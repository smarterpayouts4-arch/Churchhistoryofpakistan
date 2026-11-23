import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { getUsers, saveUsers, toPublicUser } from "@/lib/auth/users";
import { hashPassword, passwordProblem } from "@/lib/auth/password";
import type { AdminUser } from "@/lib/cms/types";

export const runtime = "nodejs";

const createSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  name: z.string().trim().min(1, "Please enter a name.").max(120),
  role: z.enum(["admin", "editor"]),
  password: z.string(),
});

export const GET = adminRoute(
  async () => {
    const users = await getUsers();
    return NextResponse.json({ users: users.map(toPublicUser) });
  },
  { role: "admin" },
);

export const POST = adminRoute(
  async (req: NextRequest) => {
    const parsed = createSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check the form." },
        { status: 400 },
      );
    }
    const problem = passwordProblem(parsed.data.password);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });
    const users = await getUsers();
    if (users.some((u) => u.email.toLowerCase() === parsed.data.email)) {
      return NextResponse.json(
        { error: "Someone with that email already has an account." },
        { status: 409 },
      );
    }
    const now = new Date().toISOString();
    const user: AdminUser = {
      id: randomUUID(),
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password),
      active: true,
      tokenVersion: 1,
      createdAt: now,
      updatedAt: now,
    };
    await saveUsers([...users, user]);
    return NextResponse.json({ ok: true, user: toPublicUser(user) }, { status: 201 });
  },
  { role: "admin" },
);
