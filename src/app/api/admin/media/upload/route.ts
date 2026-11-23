import { NextRequest, NextResponse } from "next/server";
import { createWriteStream, promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";
import { imageSize } from "image-size";
import { adminRoute } from "@/lib/admin/route";
import { addMediaItem, UPLOAD_PUBLIC_PREFIX } from "@/lib/media/library";
import { kindForType, maxBytesFor, safeMediaFilename, formatBytes } from "@/lib/media/rules";
import type { MediaItem } from "@/lib/cms/types";

export const runtime = "nodejs";

function sniff(buf: Buffer, type: string): boolean {
  const hex = buf.subarray(0, 12).toString("hex");
  const ascii = buf.subarray(0, 12).toString("latin1");
  switch (type) {
    case "image/jpeg":
      return hex.startsWith("ffd8ff");
    case "image/png":
      return hex.startsWith("89504e47");
    case "image/gif":
      return ascii.startsWith("GIF8");
    case "image/webp":
      return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
    case "image/avif":
    case "video/mp4":
    case "video/quicktime":
      return ascii.slice(4, 8) === "ftyp";
    case "video/webm":
      return hex.startsWith("1a45dfa3");
    default:
      return false;
  }
}

/**
 * Local-machine upload (no Vercel Blob token): streams the file into
 * public/media/uploads/<year>/ and adds it to the media library.
 * The body is the raw file; metadata comes in headers so large videos are
 * never buffered in memory.
 */
export const POST = adminRoute(async (req: NextRequest, _ctx, session) => {
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "On the live site, uploads go to Vercel Blob. Connect Blob storage first." },
      { status: 503 },
    );
  }
  const type = (req.headers.get("content-type") || "").split(";")[0]!.trim();
  const kind = kindForType(type);
  if (!kind) {
    return NextResponse.json(
      { error: "Please choose a JPEG, PNG, WebP, GIF or AVIF photo, or an MP4, WebM or MOV video." },
      { status: 415 },
    );
  }
  const declared = Number(req.headers.get("content-length") || 0);
  const max = maxBytesFor(kind);
  if (declared > max) {
    return NextResponse.json(
      { error: `That file is too large (limit ${formatBytes(max)}).` },
      { status: 413 },
    );
  }
  if (!req.body) return NextResponse.json({ error: "No file received." }, { status: 400 });

  const original = decodeURIComponent(req.headers.get("x-filename") || "upload");
  const alt = decodeURIComponent(req.headers.get("x-alt") || "").slice(0, 1000);
  const filename = safeMediaFilename(original, type);
  const year = String(new Date().getFullYear());
  const dir = path.join(process.cwd(), "public", "media", "uploads", year);
  await fs.mkdir(dir, { recursive: true });
  const full = path.join(dir, filename);

  let bytes = 0;
  const limited = Readable.fromWeb(req.body as import("stream/web").ReadableStream).on(
    "data",
    (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > max) limited.destroy(new Error("too-large"));
    },
  );
  try {
    await pipeline(limited, createWriteStream(full));
  } catch {
    await fs.unlink(full).catch(() => {});
    return NextResponse.json(
      { error: bytes > max ? `That file is too large (limit ${formatBytes(max)}).` : "The upload was interrupted. Please try again." },
      { status: bytes > max ? 413 : 400 },
    );
  }

  const handle = await fs.open(full, "r");
  const head = Buffer.alloc(16);
  await handle.read(head, 0, 16, 0);
  await handle.close();
  if (!sniff(head, type)) {
    await fs.unlink(full).catch(() => {});
    return NextResponse.json(
      { error: "That file doesn't look like the photo or video it claims to be." },
      { status: 415 },
    );
  }

  let width: number | undefined;
  let height: number | undefined;
  if (kind === "image") {
    try {
      const dim = imageSize(await fs.readFile(full));
      width = dim.width;
      height = dim.height;
    } catch {
      /* dimensions are optional */
    }
  }

  const item: MediaItem = {
    id: randomUUID(),
    url: `${UPLOAD_PUBLIC_PREFIX}/${year}/${filename}`,
    kind,
    filename,
    contentType: type,
    bytes,
    ...(width && height ? { width, height } : {}),
    alt,
    storage: "local",
    uploadedAt: new Date().toISOString(),
    uploadedBy: session.sub,
  };
  await addMediaItem(item);
  return NextResponse.json({ ok: true, item }, { status: 201 });
});
