/**
 * Site-wide settings — loaded from data/cms/site.json.
 * Marketing/UI copy only. Historical facts live in the typed content
 * loaders and must not be invented here.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { SiteSettings } from "@/lib/cms/types";

export type { SiteSettings };

export async function loadSiteSettings(): Promise<SiteSettings> {
  return (await readCmsPublic("site.json")) as SiteSettings;
}
