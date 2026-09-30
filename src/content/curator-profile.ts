/**
 * Curator profile · loaded from data/cms/curator-profile.json.
 * Source biography PDF remains at reference/curator/javed-qadir-bakhsh-profile.pdf.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { CuratorProfile } from "@/lib/cms/types";

export type { CuratorProfile } from "@/lib/cms/types";

export async function loadCuratorProfile(): Promise<{
  source: string;
  profile: CuratorProfile;
}> {
  return (await readCmsPublic("curator-profile.json")) as {
    source: string;
    profile: CuratorProfile;
  };
}

/** Static fallback label when a sync import is needed (nav/footer). */
export const CURATOR_PROFILE_SOURCE =
  "Supplied biography PDF · Javed Qadir Bakhsh: A Life of Public Service, Christian Leadership and Preservation of History";
