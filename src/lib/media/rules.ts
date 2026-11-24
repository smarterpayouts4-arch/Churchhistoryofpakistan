/** Shared (client + server) upload rules for the media library. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;
/**
 * HEIC/HEIF photos (iPhone default, some Android cameras). Browsers can't show
 * them, so the admin converts them to JPEG before upload; the server never
 * stores a HEIC file.
 */
export const HEIC_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"] as const;

/** `accept` lists for the admin file pickers (types plus extensions, for files the OS doesn't label). */
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,.mp4,.m4v,.mov,.webm";

const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  m4v: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

/** The file's type, or one worked out from its extension when the browser gives none. */
export function effectiveType(file: { type: string; name: string }): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXTENSION[ext] ?? "";
}

export function isHeicType(type: string, name = ""): boolean {
  return (HEIC_TYPES as readonly string[]).includes(type.toLowerCase()) || /\.hei[cf]$/i.test(name);
}

/**
 * Upload size caps (one place, used by the browser and the server).
 * The free Vercel Blob plan has 1 GB of storage in total, so a video is
 * capped at 100 MB (five videos then fit with plenty of room for photos).
 * Photos are resized in the browser before upload, so 20 MB is generous.
 */
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
/** Total storage on the free Vercel Blob plan (shown as a meter in the admin). */
export const STORAGE_BUDGET_BYTES = 1024 * 1024 * 1024; // 1 GB

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
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(n % (1024 * 1024) === 0 ? 0 : 1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(n % (1024 * 1024 * 1024) === 0 ? 0 : 2)} GB`;
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
