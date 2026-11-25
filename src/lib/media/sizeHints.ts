/**
 * The best shape and size of photo for each place on the website, shown in
 * the admin next to every photo slot (with a ready-made sentence to give
 * ChatGPT along with the photo). Sizes are about twice what a computer
 * screen shows, so photos stay sharp on phones and good screens.
 */

export type PhotoSize = {
  /** "any" = the website shows the whole photo, whatever its shape. */
  shape: "landscape" | "portrait" | "square" | "any";
  width: number;
  height?: number;
  /** e.g. "4:3" */
  ratio?: string;
  /** Short extra advice, e.g. where the trimming happens. */
  tip?: string;
};

export const PHOTO_SIZES = {
  /** Homepage slideshow: 4:3 frame, filled (cropped to fit). */
  hero: { shape: "landscape", width: 1600, height: 1200, ratio: "4:3", tip: "Keep the main subject in the middle; the edges may be trimmed a little." },
  /** Family Archive: tall 4:5 tiles on computers, wide 4:3 on phones, so square crops least. */
  gallery: { shape: "square", width: 1500, height: 1500, ratio: "1:1", tip: "Keep the main subject in the middle; computers show it a little tall, phones a little wide." },
  /** People page: 4:3 frame, filled. */
  people: { shape: "landscape", width: 1200, height: 900, ratio: "4:3", tip: "Keep faces in the middle; the edges may be trimmed a little." },
  /** Churches: 4:3 frame. */
  churches: { shape: "landscape", width: 1200, height: 900, ratio: "4:3", tip: "Show the whole building in the middle of the photo." },
  /** Curator photo: upright 4:5 frame; also a small round photo on the homepage. */
  portrait: { shape: "portrait", width: 1200, height: 1500, ratio: "4:5", tip: "Face in the middle, near the top; the homepage also shows a small round crop of it." },
  /** About page: each photo is shown whole, at its own shape. */
  about: { shape: "any", width: 1600, tip: "Nothing is cut off here: the whole photo is shown, at its own shape." },
  /** Video cover pictures: 16:9 frame, filled. */
  videoCover: { shape: "landscape", width: 1600, height: 900, ratio: "16:9", tip: "Keep the main subject in the middle; the edges may be trimmed a little." },
  /** Blog cover: 3:2 cards, 21:10 at the top of the post, so 16:9 crops least. */
  blogCover: { shape: "landscape", width: 1920, height: 1080, ratio: "16:9", tip: "Keep the main subject in the middle; the top and bottom may be trimmed a little." },
} satisfies Record<string, PhotoSize>;

export type PhotoSlot = keyof typeof PHOTO_SIZES;

const SHAPE_WORDS: Record<PhotoSize["shape"], string> = {
  landscape: "landscape (wide)",
  portrait: "portrait (upright)",
  square: "square",
  any: "any shape",
};

const px = (n: number) => String(n);

/** "Best: landscape (wide) photo, 1600 × 1200 pixels" */
export function sizeLine(s: PhotoSize): string {
  if (s.shape === "any") return `Best: any shape of photo, at least ${px(s.width)} pixels across`;
  return `Best: ${SHAPE_WORDS[s.shape]} photo, ${px(s.width)} × ${px(s.height!)} pixels`;
}

/** The sentence to paste into ChatGPT together with the photo. */
export function chatGptText(s: PhotoSize): string {
  if (s.shape === "any") {
    return `Please make my photo at least ${px(s.width)} pixels across, keeping its own shape. Do not crop it, and do not add or change anything in the picture. Give me the result as a JPEG file.`;
  }
  return `Please resize and crop my photo to ${s.shape} ${px(s.width)} × ${px(s.height!)} pixels (${s.ratio} shape). Keep the main subject centered, and do not add or change anything in the picture. Give me the result as a JPEG file.`;
}

/**
 * A gentle note when a chosen photo's shape (or size) is far from the
 * best one for its place. Never blocks the upload. null = looks fine.
 */
export function shapeAdvice(s: PhotoSize, w: number, h: number): string | null {
  if (!w || !h) return null;
  const best = s.shape === "any" ? null : s.width / s.height!;
  const differentShape = best ? Math.abs(Math.log(w / h / best)) > 0.25 : false;
  const small = s.shape === "any" ? w < s.width / 2 : Math.max(w, h) < Math.max(s.width, s.height!) / 2;
  if (!differentShape && !small) return null;
  const parts: string[] = [];
  if (differentShape) parts.push("This photo is a different shape than this spot, so it may be cropped.");
  if (small) parts.push(`This photo is quite small (${px(w)} × ${px(h)} pixels), so it may look a little blurry.`);
  parts.push(`${sizeLine(s)}. It is still uploaded; you can replace it any time.`);
  return parts.join(" ");
}

/** Width and height of a photo file, or null if this browser can't read it (e.g. HEIC on a computer). */
export function photoDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const done = (v: { width: number; height: number } | null) => {
      URL.revokeObjectURL(url);
      resolve(v);
    };
    const timer = window.setTimeout(() => done(null), 8000);
    img.onload = () => {
      window.clearTimeout(timer);
      done(img.naturalWidth ? { width: img.naturalWidth, height: img.naturalHeight } : null);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      done(null);
    };
    img.src = url;
  });
}
