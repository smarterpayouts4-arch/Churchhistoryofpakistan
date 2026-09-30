import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getPeopleFrames, savePeopleFrames } from "@/lib/cms/store";
import { peopleFramesFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const data = await getPeopleFrames();
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

  const parsed = peopleFramesFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const current = await getPeopleFrames();
  const currentIds = current.frames.map((frame) => frame.id).join("\n");
  const nextIds = parsed.data.frames.map((frame) => frame.id).join("\n");
  if (currentIds !== nextIds) {
    return NextResponse.json(
      { error: "People frames can be updated in place. Ids stay as published." },
      { status: 400 },
    );
  }

  await savePeopleFrames(parsed.data);
  revalidatePath("/people");
  return NextResponse.json({ ok: true, data: parsed.data });
}
