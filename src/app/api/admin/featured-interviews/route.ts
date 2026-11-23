import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/route";
import { getFeaturedInterviews } from "@/lib/cms/store";

export const runtime = "nodejs";

export const GET = adminRoute(async () => {
  const data = await getFeaturedInterviews();
  return NextResponse.json(data);
});
