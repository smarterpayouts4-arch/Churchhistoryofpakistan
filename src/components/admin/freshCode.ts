"use client";

/**
 * A page left open while the website is updated still runs the old version,
 * and some of its pieces are fetched only when needed (the uploader, the
 * iPhone-photo converter). After an update those old pieces are gone, so the
 * upload fails with "Failed to load chunk …". Here we spot that, say it in
 * plain words, and reload the page once so the newest version is used.
 */

/** Start of every "out of date" message (so callers can pass it on unchanged). */
export const WEBSITE_UPDATED = "The website was just updated.";
export const SITE_UPDATED = `${WEBSITE_UPDATED} The page is reloading to get the newest version. Then add the photo again.`;

const RELOADED_AT = "hcop-reloaded-for-update";

export function isStaleCodeError(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return /ChunkLoadError|Failed to load chunk|Loading chunk|dynamically imported module|Importing a module script failed|error loading dynamically imported/i.test(
    msg,
  );
}

/** Run a lazy import; if the page is out of date, reload it (at most once a minute). */
export async function loadFresh<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (err) {
    if (!isStaleCodeError(err)) throw err;
    const last = Number(sessionStorage.getItem(RELOADED_AT) || 0);
    if (Date.now() - last > 60_000) {
      sessionStorage.setItem(RELOADED_AT, String(Date.now()));
      window.setTimeout(() => window.location.reload(), 3000);
      throw new Error(SITE_UPDATED);
    }
    throw new Error(`${WEBSITE_UPDATED} Please close this page and open it again, then add the photo again.`);
  }
}

/** Fetch the uploader as soon as the admin opens, while it matches this page. */
export function preloadUploader() {
  void import("@vercel/blob/client").catch(() => {});
}
