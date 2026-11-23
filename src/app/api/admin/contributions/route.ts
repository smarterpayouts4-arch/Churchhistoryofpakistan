import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { readDoc } from "@/lib/cms/store";
import type { ContributionsFile } from "@/lib/cms/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  const file = await readDoc<ContributionsFile>("contributions.json");
  return NextResponse.json({ items: file.items ?? [] });
});
