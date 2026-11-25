/**
 * Curator profile · loaded from data/cms/curator-profile.json.
 * Source biography PDF remains at reference/curator/javed-qadir-bakhsh-profile.pdf.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { CuratorProfileFile } from "@/lib/cms/types";
import bundled from "../../data/cms/curator-profile.json";

export type { CuratorProfile, CuratorProfileFile } from "@/lib/cms/types";

export async function loadCuratorProfile(): Promise<CuratorProfileFile> {
  const data = (await readCmsPublic("curator-profile.json")) as Partial<CuratorProfileFile> | null;
  // A copy saved in the older short layout (before the full life story) can't
  // be shown by this page: show the full life story instead of an error.
  if (!data?.profile || !Array.isArray(data.profile.sections)) return bundled as CuratorProfileFile;
  return { ...(data as CuratorProfileFile), photos: data.photos ?? [] };
}

/** Static fallback label when a sync import is needed (nav/footer). */
export const CURATOR_PROFILE_SOURCE =
  "Supplied biography PDF · Javed Qadir Bakhsh: A Life of Public Service, Christian Leadership and Preservation of History";
