import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getMediaInspectItems } from "@/lib/media-inspect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const items = await getMediaInspectItems();
  return NextResponse.json({ items });
}
