import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getFeaturedInterviews } from "@/lib/cms/store";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const data = await getFeaturedInterviews();
  return NextResponse.json(data);
}
