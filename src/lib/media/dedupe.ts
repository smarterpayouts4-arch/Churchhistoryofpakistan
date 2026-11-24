/**
 * Same-photo detection for public pages, so one picture is not shown twice
 * in the same place (e.g. the homepage slideshow and the Family Archive
 * preview right under it).
 *
 * A photo's key is its file name without folder, extension, query string or
 * the random suffix Vercel Blob adds to uploads. Different files that are the
 * same picture (re-saved, re-cropped or re-toned copies) are mapped onto one
 * key below. Those pairs were found with a perceptual-hash scan of
 * public/media (difference hash, 8x8: 3-10 of 64 bits apart) and checked by eye.
 */
const SAME_PHOTO: Record<string, string> = {
  // Bishop W. G. Young, two Facebook posts of the same portrait
  "fb-bishop-william-g-young": "fb-bishop-wg-young",
  // Bishop Bashir Jewan, same portrait (the "portrait" copy is not used in content today)
  "fb-bashir-jewan-portrait": "fb-bashir-jewan-moderator-1981",
  // Interview placeholders cropped from archive photos
  "forthcoming-life-of-service": "fb-bishop-johnston-qadir-bakhsh-35th-death-anniversary",
  "forthcoming-witness-in-community": "fb-historic-preacher-july-8",
  "forthcoming-faith-in-classroom": "fb-gujranwala-seminary-memorial-tablet",
};

export function photoKey(src: string | undefined | null): string {
  if (!src) return "";
  let s = src.trim();
  // next/image URLs: /_next/image?url=<encoded>&w=...
  const m = s.match(/[?&]url=([^&]+)/);
  if (m) s = decodeURIComponent(m[1]!);
  s = s.split(/[?#]/)[0]!;
  let base = (s.split("/").pop() ?? s).toLowerCase();
  base = base.replace(/\.(jpe?g|png|webp|avif|gif)$/i, "");
  // Vercel Blob random suffix: name-<21 alphanumerics>
  base = base.replace(/-[a-z0-9]{21,32}$/i, "");
  return SAME_PHOTO[base] ?? base;
}

/** Keep the first of each photo, in order. */
export function uniqueByPhoto<T>(items: T[], src: (item: T) => string | undefined): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = photoKey(src(item));
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Items whose photo is not already shown elsewhere on the page (`taken`). */
export function withoutPhotos<T>(items: T[], src: (item: T) => string | undefined, taken: Iterable<string | undefined>): T[] {
  const used = new Set([...taken].map((t) => photoKey(t)).filter(Boolean));
  return items.filter((item) => !used.has(photoKey(src(item))));
}
