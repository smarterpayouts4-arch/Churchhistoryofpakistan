"use client";

import { adminFetch } from "./adminFetch";
import type { MediaItem } from "@/lib/cms/types";

export type LibraryEntry = {
  url: string;
  kind: "image" | "video";
  filename: string;
  alt: string;
  item?: MediaItem;
  usedIn: string[];
  group: "uploaded" | "site";
};

export type LibraryState = {
  entries: LibraryEntry[];
  storage: { blob: boolean; hosted: boolean; kv: boolean; production: boolean };
};

let cache: Promise<LibraryState> | null = null;

export function loadLibrary(force = false): Promise<LibraryState> {
  if (!cache || force) {
    cache = adminFetch("/api/admin/media").then(async (res) => {
      if (!res.ok) {
        cache = null;
        throw new Error("Could not load the media library.");
      }
      return (await res.json()) as LibraryState;
    });
  }
  return cache;
}

export function invalidateLibrary() {
  cache = null;
  window.dispatchEvent(new Event("media-changed"));
}
