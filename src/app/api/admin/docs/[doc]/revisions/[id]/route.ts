import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { isContentDoc, readRevision, writeDoc } from "@/lib/cms/store";
import { DOC_SCHEMAS } from "@/lib/cms/schemas";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ doc: string; id: string }> };

async function resolve(ctx: Ctx) {
  const { doc, id } = await ctx.params;
  const name = `${doc}.json`;
  if (!isContentDoc(name)) return null;
  return { name, id };
}

/** Read one saved version (for preview before restoring). */
export const GET = adminRoute<Ctx>(async (_req, ctx) => {
  const r = await resolve(ctx);
  if (!r) return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  const data = await readRevision(r.name, r.id);
  if (!data) return NextResponse.json({ error: "That version was not found." }, { status: 404 });
  return NextResponse.json({ data });
});

/** Restore a saved version. The restore itself becomes a new revision. */
export const POST = adminRoute<Ctx>(async (_req, ctx) => {
  const r = await resolve(ctx);
  if (!r) return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  const data = await readRevision(r.name, r.id);
  if (!data) return NextResponse.json({ error: "That version was not found." }, { status: 404 });
  const parsed = DOC_SCHEMAS[r.name].safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That older version no longer passes today's checks, so it can't be restored automatically." },
      { status: 422 },
    );
  }
  await writeDoc(r.name, parsed.data, {
    summary: "Restored an earlier version",
    restoredFrom: r.id,
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
});
