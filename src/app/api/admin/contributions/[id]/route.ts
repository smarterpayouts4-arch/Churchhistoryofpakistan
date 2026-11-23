import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { readDoc, writeDoc } from "@/lib/cms/store";
import type { ContributionsFile } from "@/lib/cms/types";
import { deleteAttachments } from "@/lib/contributions/intake";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = adminRoute<Ctx>(async (req, ctx) => {
  const { id } = await ctx.params;
  const parsed = z
    .object({ status: z.enum(["new", "reviewed", "archived"]) })
    .safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const file = await readDoc<ContributionsFile>("contributions.json");
  const item = file.items.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  item.status = parsed.data.status;
  await writeDoc("contributions.json", file);
  return NextResponse.json({ ok: true, item });
});

export const DELETE = adminRoute<Ctx>(
  async (_req, ctx) => {
    const { id } = await ctx.params;
    const file = await readDoc<ContributionsFile>("contributions.json");
    const item = file.items.find((i) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await deleteAttachments(item.attachments);
    await writeDoc("contributions.json", { items: file.items.filter((i) => i.id !== id) });
    return NextResponse.json({ ok: true });
  },
  { role: "admin" },
);
