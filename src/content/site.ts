/**
 * Site-wide settings — loaded from data/cms/site.json.
 * Marketing/UI copy only. Historical facts live in the typed content
 * loaders and must not be invented here.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { SiteSettings } from "@/lib/cms/types";

export type { SiteSettings };

/**
 * "Interviews" was renamed "Videos" (page moved to /videos). The live copy of
 * site.json is stored in the database and still has the old wording, so the
 * old default texts are swapped here. Only exact old defaults are changed;
 * anything the owner wrote himself is shown as he wrote it.
 */
const RENAMED: Record<string, string> = {
  Interviews: "Videos",
  "homepage highlights four verified open-license cathedral photographs. The full gallery covers all eight dioceses; Faisalabad, Hyderabad, and Raiwind remain permission-pending SVG placeholders until diocesan-approved images arrive.":
    "The full gallery covers all eight dioceses. Each photograph is marked with its credit or permission status; unfilled spaces show a placeholder.",
  "Cathedral seats of the Church of Pakistan dioceses, drawn from the verified content register. Photo badges reflect rights status · three remain placeholders pending permission.":
    "Cathedral seats of the Church of Pakistan dioceses, drawn from the verified content register. Photo badges reflect the credit or permission status of each picture.",
  "Faisalabad, Hyderabad, and Raiwind use SVG placeholders until licensed or diocesan-approved images are supplied.":
    "Spaces without a photograph show a placeholder until the curator supplies a photo.",
  "Watch Interviews": "Watch Videos",
  "Featured Interviews": "Videos",
  "from the History: Church of Pakistan Facebook page (Rab Ki Khidmat / Youth Empowerment). Additional oral-history interviews remain forthcoming.":
    "from the History: Church of Pakistan Facebook page (Rab Ki Khidmat / Youth Empowerment). More videos are coming.",
  "Oral-history interviews still forthcoming": "More videos coming soon",
  "Enter the living memory of the Church of Pakistan: photographs, documents, interviews and family stories that honour our forefathers, preserve their sacrifice and service, and keep their legacy alive for generations to come.":
    "Enter the living memory of the Church of Pakistan: photographs, documents, videos and family stories that honour our forefathers, preserve their sacrifice and service, and keep their legacy alive for generations to come.",
  "Additional oral-history interviews (verified interviewees, roles, transcripts, and citations) remain forthcoming. The videos below are youth motivational programmes published on the Facebook page; they are not Family Archive stills or interview records.":
    "More videos are coming. The videos below are youth motivational programmes published on the Facebook page.",
};

/** "/interviews" and "/interviews#…" links → "/videos…". */
export function renamedHref(href: string): string {
  return href.replace(/^\/interviews(?=$|[#?/])/, "/videos");
}

export function withVideosRename<T>(value: T): T {
  if (typeof value === "string") return (RENAMED[value] ?? value) as T;
  if (Array.isArray(value)) return value.map(withVideosRename) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        typeof v === "string" && (k === "href" || k.endsWith("_href")) ? renamedHref(v) : withVideosRename(v),
      ]),
    ) as T;
  }
  return value;
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  return withVideosRename((await readCmsPublic("site.json")) as SiteSettings);
}
