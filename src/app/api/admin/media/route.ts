import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { adminRoute, readJsonBody } from "@/lib/admin/route";
import { addMediaItem, BLOB_HOST_RE, listLibrary } from "@/lib/media/library";
import { BLUR_DATA_URL_RE, MAX_BLUR_DATA_URL, kindForType, maxBytesFor } from "@/lib/media/rules";
import { storageStatus } from "@/lib/cms/store";
import type { MediaItem } from "@/lib/cms/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  const entries = await listLibrary();
  return NextResponse.json({ entries, storage: storageStatus() });
});

const registerSchema = z.object({
  url: z.string().regex(BLOB_HOST_RE, "Only Vercel Blob URLs can be registered."),
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  bytes: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  blurDataURL: z.string().max(MAX_BLUR_DATA_URL).regex(BLUR_DATA_URL_RE).optional(),
  posterUrl: z.string().regex(BLOB_HOST_RE).optional(),
  duration: z.number().nonnegative().max(86400).optional(),
  alt: z.string().max(1000).default(""),
});

/** Register a file that the browser uploaded straight to Vercel Blob. */
export const POST = adminRoute(async (req: NextRequest, _ctx, session) => {
  const parsed = registerSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const kind = kindForType(parsed.data.contentType);
  if (!kind || parsed.data.bytes > maxBytesFor(kind)) {
    return NextResponse.json({ error: "That file type or size is not allowed." }, { status: 400 });
  }
  const item: MediaItem = {
    id: randomUUID(),
    ...parsed.data,
    kind,
    storage: "vercel-blob",
    uploadedAt: new Date().toISOString(),
    uploadedBy: session.sub,
  };
  await addMediaItem(item);
  return NextResponse.json({ ok: true, item }, { status: 201 });
});
