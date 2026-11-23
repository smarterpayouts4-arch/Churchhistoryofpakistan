import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { discardDrafts, loadSectionsState } from "@/lib/sections/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every photo & video section: what's live and any unpublished draft. */
export const GET = adminRoute(async () => NextResponse.json(await loadSectionsState()));

/** Discard all unpublished changes. */
export const DELETE = adminRoute(async () => {
  await discardDrafts();
  return NextResponse.json(await loadSectionsState());
});
