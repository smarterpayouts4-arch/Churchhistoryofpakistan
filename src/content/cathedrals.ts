/**
 * Cathedral / diocese content — loaded from data/cms/cathedrals.json.
 * Do not invent cathedral identities, photo credits, or licenses.
 */

import { readCmsPublic } from "@/lib/cms/store";
import type { CathedralRecord, CathedralsFile, PhotoStatus } from "@/lib/cms/types";

export type { CathedralRecord, CathedralsFile, PhotoStatus };

export async function loadCathedrals(): Promise<CathedralsFile> {
  return (await readCmsPublic("cathedrals.json")) as CathedralsFile;
}

export async function loadCathedralItems(): Promise<CathedralRecord[]> {
  const data = await loadCathedrals();
  return data.items;
}

export async function loadCathedralNote(): Promise<string> {
  const data = await loadCathedrals();
  return data.note;
}
