"use client";

/**
 * Browser-side clean-up before an admin upload, so new photos and videos
 * behave like the bundled media (npm run media:normalize):
 *  - photos: EXIF rotation applied (no sideways phone photos), very large
 *    camera files reduced to a sensible web master, tiny blur preview made;
 *  - videos: size/length read and a poster frame captured (uploaded as a
 *    photo) so the player shows a picture and a blurred backdrop.
 * Videos are not re-encoded in the browser; run `npm run media:normalize --
 * --videos` on the computer with ffmpeg for that.
 */

/** Longest edge kept for uploaded photos (sharp enough for a full-screen lightbox). */
export const MAX_PHOTO_EDGE = 3200;

export type PreparedImage = {
  file: File;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

export type PreparedVideo = {
  width?: number;
  height?: number;
  duration?: number;
  poster?: File;
  posterBlur?: string;
};

/** EXIF orientation tag of a JPEG (1 = upright), or 1 when absent. */
async function jpegOrientation(file: File): Promise<number> {
  if (file.type !== "image/jpeg") return 1;
  const view = new DataView(await file.slice(0, 128 * 1024).arrayBuffer());
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1;
  let offset = 2;
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) {
      const tiff = offset + 10;
      const little = view.getUint16(tiff) === 0x4949;
      const ifd = tiff + view.getUint32(tiff + 4, little);
      const entries = view.getUint16(ifd, little);
      for (let i = 0; i < entries; i++) {
        const entry = ifd + 2 + i * 12;
        if (entry + 10 > view.byteLength) break;
        if (view.getUint16(entry, little) === 0x0112) return view.getUint16(entry + 8, little);
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00) break;
    offset += 2 + size;
  }
  return 1;
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** 16px-wide preview as a data URL (WebP where the browser can encode it). */
function blurFrom(source: CanvasImageSource, w: number, h: number): string | undefined {
  try {
    const bw = 16;
    const bh = Math.max(1, Math.round((h / w) * bw));
    const c = document.createElement("canvas");
    c.width = bw;
    c.height = bh;
    c.getContext("2d")?.drawImage(source, 0, 0, bw, bh);
    const webp = c.toDataURL("image/webp", 0.6);
    return webp.startsWith("data:image/webp") ? webp : c.toDataURL("image/jpeg", 0.6);
  } catch {
    return undefined;
  }
}

function renamed(name: string, type: string) {
  const ext = type === "image/webp" ? "webp" : "jpg";
  return name.replace(/\.[^.]+$/, "") + "." + ext;
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  // GIFs may be animated and AVIF/SVG are left exactly as chosen.
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || typeof createImageBitmap !== "function") {
    return { file };
  }
  try {
    const orientation = await jpegOrientation(file);
    // Browsers apply EXIF orientation when decoding ("from-image").
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(width, height));
    const blurDataURL = blurFrom(bitmap, width, height);
    if (orientation === 1 && scale === 1) {
      bitmap.close();
      return { file, width, height, blurDataURL };
    }
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, width, height, blurDataURL };
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const type = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const out = await canvasBlob(canvas, type, 0.92);
    if (!out || out.type !== type) return { file, width, height, blurDataURL };
    return {
      file: new File([out], renamed(file.name, type), { type, lastModified: file.lastModified }),
      width: w,
      height: h,
      blurDataURL,
    };
  } catch {
    return { file };
  }
}

export function prepareVideo(file: File): Promise<PreparedVideo> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let done = false;
    const finish = (result: PreparedVideo) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
      resolve(result);
    };
    const timer = window.setTimeout(() => finish({}), 15000);
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.onerror = () => {
      window.clearTimeout(timer);
      finish({});
    };
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : undefined;
      video.currentTime = Math.min(8, (duration ?? 0) * 0.1);
    };
    video.onseeked = async () => {
      window.clearTimeout(timer);
      const width = video.videoWidth || undefined;
      const height = video.videoHeight || undefined;
      const duration = Number.isFinite(video.duration) ? Math.round(video.duration) : undefined;
      if (!width || !height) return finish({ duration });
      try {
        const scale = Math.min(1, 1280 / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasBlob(canvas, "image/jpeg", 0.85);
        finish({
          width,
          height,
          duration,
          poster: blob
            ? new File([blob], file.name.replace(/\.[^.]+$/, "") + "-poster.jpg", { type: "image/jpeg" })
            : undefined,
          posterBlur: blurFrom(canvas, canvas.width, canvas.height),
        });
      } catch {
        finish({ width, height, duration });
      }
    };
    video.src = url;
  });
}
