import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { isContentDoc, listRevisions, readDocWithVersion } from "@/lib/cms/store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ doc: string }> };

/** History list for one content document (newest first). */
export const GET = adminRoute<Ctx>(async (_req, ctx) => {
  const { doc } = await ctx.params;
  const name = `${doc}.json`;
  if (!isContentDoc(name)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }
  const [revisions, current] = await Promise.all([
    listRevisions(name),
    readDocWithVersion(name),
  ]);
  return NextResponse.json({ revisions, currentVersion: current.version });
});
