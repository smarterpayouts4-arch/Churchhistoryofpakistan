import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  getCuratorProfileFile,
  saveCuratorProfileFile,
} from "@/lib/cms/store";
import { curatorProfileFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const data = await getCuratorProfileFile();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = curatorProfileFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await saveCuratorProfileFile(parsed.data);
  revalidatePath("/about");
  revalidatePath("/");
  return NextResponse.json({ ok: true, data: parsed.data });
}
