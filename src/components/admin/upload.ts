"use client";

import { csrfToken } from "./adminFetch";
import type { MediaItem } from "@/lib/cms/types";
import { formatBytes, kindForType, maxBytesFor, safeMediaFilename } from "@/lib/media/rules";
import { prepareImage, prepareVideo } from "./normalizeMedia";

export type UploadProgress = (fraction: number) => void;

export type StorageInfo = { blob: boolean; hosted: boolean };

/** Upload into a "Photos & videos" section: the server checks kind and room first. */
export type SectionTarget = { section: string; replace?: boolean };

/** Extra facts measured in the browser and stored with the library item. */
type Extra = {
  width?: number;
  height?: number;
  blurDataURL?: string;
  posterUrl?: string;
  duration?: number;
};

/** Read pixel size in the browser so Blob uploads carry width/height too. */
function imageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/** Problem with a file before uploading, in plain language (or null). */
export function checkFile(file: File): string | null {
  const type = file.type || "";
  if (/heic|heif/i.test(type) || /\.hei[cf]$/i.test(file.name)) {
    return `${file.name}: iPhone HEIC photos can't be shown on websites. On the phone, choose “Most Compatible” or share the photo as JPEG, then try again.`;
  }
  const kind = kindForType(type);
  if (!kind) {
    return `${file.name}: please choose a photo (JPEG, PNG, WebP, GIF, AVIF) or a video (MP4, WebM, MOV).`;
  }
  if (file.size > maxBytesFor(kind)) {
    return `${file.name} is ${formatBytes(file.size)} — the limit is ${formatBytes(maxBytesFor(kind))}.`;
  }
  return null;
}

function localUpload(
  file: File,
  alt: string,
  extra: Extra,
  onProgress?: UploadProgress,
  target?: SectionTarget,
): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media/upload");
    xhr.setRequestHeader("content-type", file.type);
    xhr.setRequestHeader("x-filename", encodeURIComponent(file.name));
    xhr.setRequestHeader("x-alt", encodeURIComponent(alt));
    xhr.setRequestHeader("x-csrf-token", csrfToken());
    if (extra.blurDataURL) xhr.setRequestHeader("x-blur", extra.blurDataURL);
    if (extra.posterUrl) xhr.setRequestHeader("x-poster-url", encodeURIComponent(extra.posterUrl));
    if (extra.duration) xhr.setRequestHeader("x-duration", String(extra.duration));
    if (extra.width && extra.height) xhr.setRequestHeader("x-dimensions", `${extra.width}x${extra.height}`);
    if (target) {
      xhr.setRequestHeader("x-section", target.section);
      if (target.replace) xhr.setRequestHeader("x-section-replace", "1");
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      let body: { item?: MediaItem; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.item) resolve(body.item);
      else reject(new Error(body.error || `Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("The upload was interrupted. Check your connection and try again."));
    xhr.send(file);
  });
}

/** Shown when the server will not start a direct-to-storage upload. */
export const UPLOAD_NOT_STARTED =
  "Couldn't start the upload. This section may be full or not take this kind of file. Reload the page and try again.";

async function blobUpload(
  file: File,
  alt: string,
  extra: Extra,
  onProgress?: UploadProgress,
  target?: SectionTarget,
): Promise<MediaItem> {
  const { upload } = await import("@vercel/blob/client");
  const dims =
    extra.width && extra.height
      ? { width: extra.width, height: extra.height }
      : file.type.startsWith("image/")
        ? await imageDimensions(file)
        : null;
  const pathname = `uploads/${new Date().getFullYear()}/${safeMediaFilename(file.name, file.type)}`;
  let blob: Awaited<ReturnType<typeof upload>>;
  try {
    blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/media/blob",
      headers: { "x-csrf-token": csrfToken() },
      ...(target
        ? { clientPayload: JSON.stringify({ ...target, kind: file.type.startsWith("video/") ? "video" : "image" }) }
        : {}),
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: (p) => onProgress?.(p.percentage / 100),
    });
  } catch (err) {
    // The server refused to start the upload (section full, wrong kind of
    // file, signed out, CSRF expired). @vercel/blob reports that as a
    // technical "Failed to retrieve the client token" error; say it plainly.
    const msg = err instanceof Error ? err.message : String(err);
    if (/client token/i.test(msg)) throw new Error(UPLOAD_NOT_STARTED);
    throw err;
  }
  const res = await fetch("/api/admin/media", {
    method: "POST",
    headers: { "content-type": "application/json", "x-csrf-token": csrfToken() },
    body: JSON.stringify({
      url: blob.url,
      filename: blob.pathname.split("/").pop(),
      contentType: file.type,
      bytes: file.size,
      ...(dims ?? {}),
      ...(extra.blurDataURL ? { blurDataURL: extra.blurDataURL } : {}),
      ...(extra.posterUrl ? { posterUrl: extra.posterUrl } : {}),
      ...(extra.duration ? { duration: extra.duration } : {}),
      ...(target ? { section: target.section, replace: Boolean(target.replace) } : {}),
      alt,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { item?: MediaItem; error?: string };
  if (!res.ok || !body.item) throw new Error(body.error || "Could not add the file to the library.");
  return body.item;
}

function send(
  file: File,
  storage: StorageInfo,
  alt: string,
  extra: Extra,
  onProgress?: UploadProgress,
  target?: SectionTarget,
) {
  return storage.blob
    ? blobUpload(file, alt, extra, onProgress, target)
    : localUpload(file, alt, extra, onProgress, target);
}

/**
 * Upload one file to the right place (Vercel Blob when connected, else this
 * computer). Photos are straightened (EXIF) and capped at a web-friendly
 * size first; videos get a poster frame (added to the library as a photo).
 */
export async function uploadMedia(
  original: File,
  storage: StorageInfo,
  opts: { alt?: string; onProgress?: UploadProgress; target?: SectionTarget } = {},
): Promise<MediaItem> {
  const problem = checkFile(original);
  if (problem) throw new Error(problem);
  if (!storage.blob && storage.hosted) {
    throw new Error("Uploads are switched off: photo storage (Vercel Blob) is not connected on the live site yet.");
  }
  const alt = opts.alt ?? "";
  if (original.type.startsWith("image/")) {
    const prepared = await prepareImage(original);
    const { file, ...extra } = prepared;
    return send(file, storage, alt, extra, opts.onProgress, opts.target);
  }
  const video = await prepareVideo(original);
  let posterUrl: string | undefined;
  if (video.poster) {
    try {
      const poster = await send(
        video.poster,
        storage,
        alt ? `Poster frame: ${alt}` : "",
        { width: undefined, height: undefined, blurDataURL: video.posterBlur },
      );
      posterUrl = poster.url;
    } catch {
      /* the video still uploads without a poster */
    }
  }
  return send(
    original,
    storage,
    alt,
    {
      width: video.width,
      height: video.height,
      duration: video.duration,
      posterUrl,
      blurDataURL: video.posterBlur,
    },
    opts.onProgress,
    opts.target,
  );
}
