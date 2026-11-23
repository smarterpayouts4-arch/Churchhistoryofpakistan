import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { getPeopleFrames, savePeopleFrames } from "@/lib/cms/store";
import { peopleFramesFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export const GET = adminRoute(async () => {
  const data = await getPeopleFrames();
  return NextResponse.json(data);
});

export const PUT = adminRoute(async (req: NextRequest) => {

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
});
