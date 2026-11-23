/** Shared (client + server) upload rules for the media library. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;

export const MAX_IMAGE_BYTES = 30 * 1024 * 1024; // 30 MB — keep full-resolution scans
export const MAX_VIDEO_BYTES = 1024 * 1024 * 1024; // 1 GB

export function kindForType(type: string): "image" | "video" | null {
  if ((IMAGE_TYPES as readonly string[]).includes(type)) return "image";
  if ((VIDEO_TYPES as readonly string[]).includes(type)) return "video";
  return null;
}

export function maxBytesFor(kind: "image" | "video") {
  return kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

/** kebab-case, collision-safe filename (AGENTS.md: publishable media is kebab-case). */
export function safeMediaFilename(original: string, type: string) {
  const stem =
    original
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "upload";
  return `${stem}-${Date.now().toString(36)}${EXT[type] ?? ""}`;
}

export function isImageUrl(url: string) {
  return /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(url);
}
export function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/** A tiny base64 blur preview made in the browser (kept small: ≤ 3 KB). */
export const BLUR_DATA_URL_RE = /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/;
export const MAX_BLUR_DATA_URL = 3000;
