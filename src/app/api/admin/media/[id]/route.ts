import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { getMediaIndex, mediaUsage, saveMediaIndex, UPLOAD_PUBLIC_PREFIX } from "@/lib/media/library";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = adminRoute<Ctx>(async (req, ctx) => {
  const { id } = await ctx.params;
  const parsed = z.object({ alt: z.string().max(1000) }).safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Please check the description." }, { status: 400 });
  const items = await getMediaIndex();
  const item = items.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "File not found." }, { status: 404 });
  item.alt = parsed.data.alt;
  await saveMediaIndex(items);
  return NextResponse.json({ ok: true, item });
});

/** Delete an uploaded file — refused while any page still uses it. */
export const DELETE = adminRoute<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  const items = await getMediaIndex();
  const item = items.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "File not found." }, { status: 404 });
  const usedIn = (await mediaUsage()).get(item.url) ?? [];
  if (usedIn.length) {
    return NextResponse.json(
      { error: `This file is still used in: ${usedIn.join(", ")}. Replace it there first.`, usedIn },
      { status: 409 },
    );
  }
  if (item.storage === "vercel-blob") {
    const { del } = await import("@vercel/blob");
    await del(item.url);
  } else if (item.url.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) {
    const rel = item.url.replace(/^\/+/, "");
    const full = path.join(process.cwd(), "public", rel);
    const root = path.join(process.cwd(), "public", "media", "uploads");
    if (full.startsWith(root + path.sep)) await fs.unlink(full).catch(() => {});
  }
  await saveMediaIndex(items.filter((i) => i.id !== id));
  return NextResponse.json({ ok: true });
});
