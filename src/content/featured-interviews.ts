/**
 * Featured Interviews = youth motivational videos (Rab Ki Khidmat / Youth Empowerment).
 * Loaded from data/cms/featured-interviews.json.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { FeaturedInterview, FeaturedInterviewsFile } from "@/lib/cms/types";

export type { FeaturedInterview } from "@/lib/cms/types";

export async function loadFeaturedInterviews(): Promise<FeaturedInterview[]> {
  const data = (await readCmsPublic(
    "featured-interviews.json",
  )) as FeaturedInterviewsFile;
  return data.items;
}

export async function loadHomeFeaturedInterviews(): Promise<FeaturedInterview[]> {
  const items = await loadFeaturedInterviews();
  return items.filter((item) => item.featuredOnHome);
}
