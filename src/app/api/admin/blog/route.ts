import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import { getBlogPosts, saveBlogPosts } from "@/lib/cms/store";
import { blogFileSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

export const GET = adminRoute(async () => {
  const data = await getBlogPosts();
  return NextResponse.json(data);
});

export const PUT = adminRoute(async (req: NextRequest) => {

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = blogFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const slugs = parsed.data.posts.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json(
      { error: "Validation failed: two posts share the same slug." },
      { status: 400 },
    );
  }

  await saveBlogPosts(parsed.data);
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, data: parsed.data });
});
