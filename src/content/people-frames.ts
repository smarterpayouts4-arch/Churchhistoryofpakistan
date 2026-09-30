/**
 * People page stills — loaded from data/cms/people-frames.json.
 * Titles and alts only. Do not invent biographies.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { PeopleFrame, PeopleFramesFile } from "@/lib/cms/types";

export type { PeopleFrame };

export async function loadPeopleFrames(): Promise<PeopleFrame[]> {
  const data = (await readCmsPublic("people-frames.json")) as PeopleFramesFile;
  return data.frames;
}
