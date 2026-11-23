"use client";

import { csrfToken } from "./adminFetch";
import type { MediaItem } from "@/lib/cms/types";
import { formatBytes, kindForType, maxBytesFor, safeMediaFilename } from "@/lib/media/rules";

export type UploadProgress = (fraction: number) => void;

export type StorageInfo = { blob: boolean; hosted: boolean };

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

function localUpload(file: File, alt: string, onProgress?: UploadProgress): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media/upload");
    xhr.setRequestHeader("content-type", file.type);
    xhr.setRequestHeader("x-filename", encodeURIComponent(file.name));
    xhr.setRequestHeader("x-alt", encodeURIComponent(alt));
    xhr.setRequestHeader("x-csrf-token", csrfToken());
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

async function blobUpload(file: File, alt: string, onProgress?: UploadProgress): Promise<MediaItem> {
  const { upload } = await import("@vercel/blob/client");
  const dims = file.type.startsWith("image/") ? await imageDimensions(file) : null;
  const pathname = `uploads/${new Date().getFullYear()}/${safeMediaFilename(file.name, file.type)}`;
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/admin/media/blob",
    headers: { "x-csrf-token": csrfToken() },
    multipart: file.size > 8 * 1024 * 1024,
    onUploadProgress: (p) => onProgress?.(p.percentage / 100),
  });
  const res = await fetch("/api/admin/media", {
    method: "POST",
    headers: { "content-type": "application/json", "x-csrf-token": csrfToken() },
    body: JSON.stringify({
      url: blob.url,
      filename: blob.pathname.split("/").pop(),
      contentType: file.type,
      bytes: file.size,
      ...(dims ?? {}),
      alt,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { item?: MediaItem; error?: string };
  if (!res.ok || !body.item) throw new Error(body.error || "Could not add the file to the library.");
  return body.item;
}

/** Upload one file to the right place (Vercel Blob when connected, else this computer). */
export function uploadMedia(
  file: File,
  storage: StorageInfo,
  opts: { alt?: string; onProgress?: UploadProgress } = {},
): Promise<MediaItem> {
  const problem = checkFile(file);
  if (problem) return Promise.reject(new Error(problem));
  if (storage.blob) return blobUpload(file, opts.alt ?? "", opts.onProgress);
  if (storage.hosted) {
    return Promise.reject(
      new Error("Uploads are switched off: photo storage (Vercel Blob) is not connected on the live site yet."),
    );
  }
  return localUpload(file, opts.alt ?? "", opts.onProgress);
}
