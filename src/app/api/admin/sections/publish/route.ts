import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { loadSectionsState, publishDrafts } from "@/lib/sections/server";
import { sectionErrorResponse } from "@/lib/sections/respond";

export const runtime = "nodejs";

/** The one Publish button: put every unpublished change on the live website. */
export const POST = adminRoute(async () => {
  try {
    const result = await publishDrafts();
    // Pages read content on every request; this also drops any cached copy.
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, ...result, state: await loadSectionsState() });
  } catch (err) {
    return sectionErrorResponse(err);
  }
});
