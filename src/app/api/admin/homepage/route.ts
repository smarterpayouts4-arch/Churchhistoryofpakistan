import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { getHomepage, saveHomepage } from "@/lib/cms/store";
import { homepageFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export const GET = adminRoute(async () => {
  const data = await getHomepage();
  return NextResponse.json(data);
});

export const PUT = adminRoute(async (req: NextRequest) => {

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = homepageFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await saveHomepage(parsed.data);
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/archive");
  revalidatePath("/interviews");
  revalidatePath("/people");
  revalidatePath("/contribute");
  return NextResponse.json({ ok: true, data: parsed.data });
});
