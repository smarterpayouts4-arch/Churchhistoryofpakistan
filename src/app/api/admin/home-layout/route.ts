import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { getHomeLayout, saveHomeLayout } from "@/lib/cms/store";
import { homeLayoutFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export const GET = adminRoute(async () => NextResponse.json(await getHomeLayout()));

export const PUT = adminRoute(async (req: NextRequest) => {
  const parsed = homeLayoutFileSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the layout." },
      { status: 400 },
    );
  }
  await saveHomeLayout(parsed.data);
  revalidatePath("/");
  return NextResponse.json({ ok: true, data: parsed.data });
});
