/** Homepage section order + visibility — data/cms/home-layout.json. */
import { readCmsPublic } from "@/lib/cms/store";
import { HOME_SECTION_IDS, type HomeLayoutFile, type HomeLayoutSection } from "@/lib/cms/types";

/** Known sections in saved order; any missing section is appended (visible). */
export function resolveHomeLayout(file: HomeLayoutFile | null | undefined): HomeLayoutSection[] {
  const saved = (file?.sections ?? []).filter((s) =>
    (HOME_SECTION_IDS as readonly string[]).includes(s.id),
  );
  const seen = new Set(saved.map((s) => s.id));
  return [...saved, ...HOME_SECTION_IDS.filter((id) => !seen.has(id)).map((id) => ({ id, visible: true }))];
}

export async function loadHomeLayout(): Promise<HomeLayoutSection[]> {
  const file = (await readCmsPublic("home-layout.json").catch(() => null)) as HomeLayoutFile | null;
  return resolveHomeLayout(file);
}
