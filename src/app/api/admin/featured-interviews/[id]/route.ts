import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute } from "@/lib/admin/route";
import {
  getFeaturedInterviews,
  saveFeaturedInterviews,
} from "@/lib/cms/store";
import { featuredInterviewPatchSchema } from "@/lib/cms/schemas";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = adminRoute(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = featuredInterviewPatchSchema.safeParse({
    ...(typeof body === "object" && body ? body : {}),
    id,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = await getFeaturedInterviews();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const current = data.items[idx]!;
  const next = {
    ...current,
    ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
    ...(parsed.data.copy !== undefined ? { copy: parsed.data.copy } : {}),
    ...(parsed.data.alt !== undefined ? { alt: parsed.data.alt } : {}),
    ...(parsed.data.featuredOnHome !== undefined
      ? { featuredOnHome: parsed.data.featuredOnHome }
      : {}),
    ...(parsed.data.videoSrc !== undefined
      ? { videoSrc: parsed.data.videoSrc }
      : {}),
    ...(parsed.data.posterSrc !== undefined
      ? { posterSrc: parsed.data.posterSrc }
      : {}),
    ...(parsed.data.width ? { width: parsed.data.width } : {}),
    ...(parsed.data.height ? { height: parsed.data.height } : {}),
    ...(parsed.data.orientation ? { orientation: parsed.data.orientation } : {}),
  };
  if (parsed.data.coverPosition !== undefined) {
    if (parsed.data.coverPosition) next.coverPosition = parsed.data.coverPosition;
    else delete next.coverPosition;
  }
  for (const key of ["speaker", "captionsSrc", "transcript"] as const) {
    const value = parsed.data[key];
    if (value === undefined) continue;
    if (value.trim()) next[key] = value.trim();
    else delete next[key];
  }
  if (parsed.data.durationSeconds !== undefined) {
    if (parsed.data.durationSeconds > 0) next.durationSeconds = Math.round(parsed.data.durationSeconds);
    else delete next.durationSeconds;
  }
  if (parsed.data.coverSrc !== undefined) {
    if (parsed.data.coverSrc) next.coverSrc = parsed.data.coverSrc;
    else delete next.coverSrc;
  }

  // Cap homepage features at 3 when turning on
  if (next.featuredOnHome) {
    const othersOn = data.items.filter(
      (i, iIdx) => iIdx !== idx && i.featuredOnHome,
    );
    if (othersOn.length >= 3) {
      return NextResponse.json(
        {
          error:
            "At most 3 interviews can be featured on the homepage. Turn one off first.",
        },
        { status: 400 },
      );
    }
  }

  data.items[idx] = next;
  await saveFeaturedInterviews(data);
  revalidatePath("/");
  revalidatePath("/interviews");
  return NextResponse.json({ ok: true, item: next });
});
