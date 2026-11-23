import { NextRequest, NextResponse } from "next/server";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { isSectionId } from "@/lib/sections/config";
import { discardDrafts, loadSectionsState, saveDraft, saveDraftSchema } from "@/lib/sections/server";
import { sectionErrorResponse } from "@/lib/sections/respond";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Save a section's draft (nothing changes on the website until Publish). */
export const PUT = adminRoute<Ctx>(async (req: NextRequest, ctx, session) => {
  const { id } = await ctx.params;
  if (!isSectionId(id)) return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  const parsed = saveDraftSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the details." }, { status: 400 });
  }
  try {
    const draft = await saveDraft(id, parsed.data.items, parsed.data.rev, session.sub || session.email);
    return NextResponse.json({ ok: true, draft });
  } catch (err) {
    return sectionErrorResponse(err);
  }
});

/** Throw away this section's unpublished changes. */
export const DELETE = adminRoute<Ctx>(async (_req, ctx) => {
  const { id } = await ctx.params;
  if (!isSectionId(id)) return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  await discardDrafts(id);
  return NextResponse.json(await loadSectionsState());
});
