import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { getCathedrals, saveCathedrals } from "@/lib/cms/store";
import { cathedralsFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export const GET = adminRoute(async () => {
  const data = await getCathedrals();
  return NextResponse.json(data);
});

export const PUT = adminRoute(async (req: NextRequest) => {

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = cathedralsFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await saveCathedrals(parsed.data);
  revalidatePath("/");
  revalidatePath("/churches");
  revalidatePath("/sources");
  return NextResponse.json({ ok: true, data: parsed.data });
});
