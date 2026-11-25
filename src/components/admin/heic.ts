"use client";

import { WEBSITE_UPDATED, loadFresh } from "./freshCode";

/**
 * HEIC/HEIF → JPEG in the browser, before upload.
 * Safari decodes HEIC itself; other browsers load a converter (heic-to, CSP
 * build) only when a HEIC file is actually chosen, so the admin bundle stays light.
 */

const JPEG_QUALITY = 0.92;

function jpegName(name: string) {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}

function canvasJpeg(source: CanvasImageSource, width: number, height: number): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
}

/** Try the browser's own decoder (Safari); null when it can't read HEIC. */
async function nativeDecode(file: File): Promise<Blob | null> {
  if (typeof createImageBitmap !== "function") return null;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    try {
      if (!bitmap.width || !bitmap.height) return null;
      return await canvasJpeg(bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close();
    }
  } catch {
    return null;
  }
}

export const HEIC_CONVERT_FAILED =
  "couldn't be converted from HEIC. Please save or share it as a JPEG photo, then try again.";

/** A JPEG copy of a HEIC/HEIF photo, ready for the normal photo upload. */
export async function heicToJpeg(file: File): Promise<File> {
  let jpeg = await nativeDecode(file);
  if (!jpeg || jpeg.type !== "image/jpeg") {
    // An out-of-date page can't fetch the converter: say so (and reload) instead of blaming the photo.
    try {
      const { heicTo } = await loadFresh(() => import("heic-to/csp"));
      jpeg = await heicTo({ blob: file, type: "image/jpeg", quality: JPEG_QUALITY });
    } catch (err) {
      if (err instanceof Error && err.message.startsWith(WEBSITE_UPDATED)) throw err;
      jpeg = null;
    }
  }
  if (!jpeg || !jpeg.size) throw new Error(`${file.name} ${HEIC_CONVERT_FAILED}`);
  return new File([jpeg], jpegName(file.name), { type: "image/jpeg", lastModified: file.lastModified });
}
