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
  signal?: AbortSignal,
): Promise<MediaItem> {
  const guard = watchdog(file.size, signal);
  const sending = new Promise<MediaItem>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    guard.signal.addEventListener("abort", () => xhr.abort(), { once: true });
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
      guard.tick();
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
  sending.catch(() => {});
  return Promise.race([sending, guard.stopped]).finally(() => guard.done());
}

/** Shown when the server will not start a direct-to-storage upload. */
export const UPLOAD_NOT_STARTED =
  "Couldn't start the upload. This section may be full or not take this kind of file. Reload the page and try again.";

/** No bytes moving for this long means the upload is stuck. */
export const UPLOAD_STALL_MS = 30_000;

/** Why an upload was stopped before it finished. */
export class UploadStoppedError extends Error {
  constructor(public reason: "stalled" | "timeout" | "cancelled") {
    super(
      reason === "cancelled"
        ? "Upload cancelled."
        : reason === "stalled"
          ? "The upload stopped: nothing was sent for 30 seconds. Check the internet connection, then press Try again."
          : "The upload took too long and was stopped. Check the internet connection, then press Try again.",
    );
    this.name = "UploadStoppedError";
  }
}

/** Longest any one upload may take: 5 minutes plus 1 minute per 5 MB. */
function overallLimitMs(bytes: number) {
  return 5 * 60_000 + Math.ceil(bytes / (5 * 1024 * 1024)) * 60_000;
}

/**
 * Stall + overall timeout for one network upload. `tick()` on every progress
 * event; `stopped` rejects with an UploadStoppedError when the upload is
 * stuck, too slow, or cancelled through the caller's AbortSignal.
 */
function watchdog(bytes: number, outer?: AbortSignal) {
  const ctrl = new AbortController();
  const started = Date.now();
  let last = started;
  let reason: UploadStoppedError["reason"] | null = null;
  let reject: (e: Error) => void = () => {};
  const stopped = new Promise<never>((_, rej) => (reject = rej));
  stopped.catch(() => {});
  const stop = (r: UploadStoppedError["reason"]) => {
    if (reason) return;
    reason = r;
    ctrl.abort();
    reject(new UploadStoppedError(r));
  };
  const limit = overallLimitMs(bytes);
  const timer = window.setInterval(() => {
    const now = Date.now();
    if (now - last > UPLOAD_STALL_MS) stop("stalled");
    else if (now - started > limit) stop("timeout");
  }, 1000);
  const onOuter = () => stop("cancelled");
  if (outer?.aborted) stop("cancelled");
  else outer?.addEventListener("abort", onOuter, { once: true });
  return {
    signal: ctrl.signal,
    stopped,
    tick: () => {
      last = Date.now();
    },
    done: () => {
      window.clearInterval(timer);
      outer?.removeEventListener("abort", onOuter);
    },
  };
}

async function blobUpload(
  file: File,
  alt: string,
  extra: Extra,
  onProgress?: UploadProgress,
  target?: SectionTarget,
  signal?: AbortSignal,
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
  const guard = watchdog(file.size, signal);
  try {
    const sending = upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/media/blob",
      headers: { "x-csrf-token": csrfToken() },
      ...(target
        ? { clientPayload: JSON.stringify({ ...target, kind: file.type.startsWith("video/") ? "video" : "image" }) }
        : {}),
      multipart: file.size > 8 * 1024 * 1024,
      abortSignal: guard.signal,
      onUploadProgress: (p) => {
        guard.tick();
        onProgress?.(p.percentage / 100);
      },
    });
    sending.catch(() => {});
    blob = await Promise.race([sending, guard.stopped]);
  } catch (err) {
    if (err instanceof UploadStoppedError) throw err;
    // The server refused to start the upload (section full, wrong kind of
    // file, signed out, CSRF expired). @vercel/blob reports that as a
    // technical "Failed to retrieve the client token" error; say it plainly.
    const msg = err instanceof Error ? err.message : String(err);
    if (/client token/i.test(msg)) throw new Error(UPLOAD_NOT_STARTED);
    throw err;
  } finally {
    guard.done();
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
  signal?: AbortSignal,
) {
  return storage.blob
    ? blobUpload(file, alt, extra, onProgress, target, signal)
    : localUpload(file, alt, extra, onProgress, target, signal);
}

/**
 * Upload one file to the right place (Vercel Blob when connected, else this
 * computer). Photos are straightened (EXIF) and capped at a web-friendly
 * size first; videos get a poster frame (added to the library as a photo).
 */
export async function uploadMedia(
  original: File,
  storage: StorageInfo,
  opts: { alt?: string; onProgress?: UploadProgress; target?: SectionTarget; signal?: AbortSignal } = {},
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
    return send(file, storage, alt, extra, opts.onProgress, opts.target, opts.signal);
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
        undefined,
        undefined,
        opts.signal,
      );
      posterUrl = poster.url;
    } catch (err) {
      if (err instanceof UploadStoppedError && err.reason === "cancelled") throw err;
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
    opts.signal,
  );
}
