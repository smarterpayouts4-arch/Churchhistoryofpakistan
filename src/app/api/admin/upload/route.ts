import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminApi } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const DESTINATIONS = {
  uploads: "public/media/uploads",
  facebook: "public/media/archive/facebook",
  cathedrals: "public/media/cathedrals",
} as const;

function safeFilename(original: string): string {
  const base = path
    .basename(original)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const ext = path.extname(base);
  const stem = path.basename(base, ext).slice(0, 60) || "upload";
  const stamp = Date.now().toString(36);
  const safeExt =
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png" ||
    ext === ".webp" ||
    ext === ".gif"
      ? ext === ".jpeg"
        ? ".jpg"
        : ext
      : ".jpg";
  return `${stem}-${stamp}${safeExt}`;
}

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 8 MB)." },
      { status: 400 },
    );
  }

  const destKey = String(form.get("destination") || "uploads");
  const destRel =
    DESTINATIONS[destKey as keyof typeof DESTINATIONS] || DESTINATIONS.uploads;
  const filename = safeFilename(file.name || "upload.jpg");

  // Vercel Blob (ADR-008): when BLOB_READ_WRITE_TOKEN exists, uploads go to
  // Blob and the public URL is returned. Existing /media/... paths keep
  // working unchanged. Local/dev without the token keeps the file store.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const buf = Buffer.from(await file.arrayBuffer());
    const blob = await put(`${destKey}/${filename}`, buf, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return NextResponse.json({
      ok: true,
      path: blob.url,
      filename,
      bytes: buf.length,
      contentType: file.type,
      storage: "vercel-blob",
    });
  }

  // Keep build tracing inside the media directory; destinations remain allowlisted.
  const absDir = path.join(process.cwd(), "public", "media", destRel.replace(/^public\/media\//, ""));
  await fs.mkdir(absDir, { recursive: true });
  const absPath = path.join(absDir, filename);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(absPath, buf);

  const publicPath = `/${destRel.replace(/^public\//, "")}/${filename}`;
  return NextResponse.json({
    ok: true,
    path: publicPath,
    filename,
    bytes: buf.length,
    contentType: file.type,
  });
}
