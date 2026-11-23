import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { getMediaInspectItems } from "@/lib/media-inspect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {

  const items = await getMediaInspectItems();
  return NextResponse.json({ items });
});
