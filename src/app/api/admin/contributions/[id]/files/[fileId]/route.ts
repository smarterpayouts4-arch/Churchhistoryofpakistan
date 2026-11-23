import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { readDoc } from "@/lib/cms/store";
import type { ContributionsFile } from "@/lib/cms/types";
import { readAttachment } from "@/lib/contributions/intake";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string; fileId: string }> };

/** Download a private contribution attachment (signed-in curators only). */
export const GET = adminRoute<Ctx>(async (req, ctx) => {
  const { id, fileId } = await ctx.params;
  const file = await readDoc<ContributionsFile>("contributions.json");
  const att = file.items.find((i) => i.id === id)?.attachments.find((a) => a.id === fileId);
  if (!att) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = await readAttachment(att.key, att.storage);
  if (!body) return NextResponse.json({ error: "File missing." }, { status: 404 });
  const inline = new URL(req.url).searchParams.get("inline") === "1" && att.contentType.startsWith("image/");
  return new Response(body as BodyInit, {
    headers: {
      "Content-Type": att.contentType,
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${att.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
