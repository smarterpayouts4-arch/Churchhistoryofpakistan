/**
 * Homepage content — loaded from data/cms/homepage.json.
 * Do not invent names, dates, biographies, or photo identities.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type {
  HomepageContent,
  HomepageFile,
  PurposeCard,
  TimelineEntry,
} from "@/lib/cms/types";

export type { HomepageContent, PurposeCard, TimelineEntry };

export async function loadHomepage(): Promise<HomepageContent> {
  const data = (await readCmsPublic("homepage.json")) as HomepageFile;
  return data;
}
