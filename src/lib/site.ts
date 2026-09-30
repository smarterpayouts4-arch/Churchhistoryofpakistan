/** Defaults. The public header, footer, and page title read homepage CMS `site_title` and `strapline`. */
export const SITE_NAME = "History: Church of Pakistan";
export const SITE_STRAPLINE =
  "Preserving History · Honouring Our Forefathers · Inspiring Future Generations";
export const SITE_DESCRIPTION =
  "Photographs, documents, interviews and family memories preserving the history and people of the Church of Pakistan for future generations.";
export const DEFAULT_SITE_URL = "http://127.0.0.1:4000";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}
