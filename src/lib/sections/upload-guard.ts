import { fullMessage, isSectionId, sectionConfig } from "./config";
import { currentSectionCount } from "./server";

/**
 * Server-side check before an upload into a "Photos & videos" section:
 * right kind of file, and the section isn't full. Returns a friendly
 * problem (with an HTTP status) or null. Uploads without a section
 * (the general library) skip this.
 */
export async function sectionUploadProblem(
  section: string | null | undefined,
  kind: "image" | "video",
  /** Replacing a file already in the section doesn't need a free space. */
  replace = false,
): Promise<{ error: string; status: number } | null> {
  if (!section) return null;
  if (!isSectionId(section)) return { error: "Unknown section.", status: 400 };
  const cfg = sectionConfig(section)!;
  if (cfg.kind !== kind) {
    return { error: cfg.kind === "video" ? "This section only takes videos." : "This section only takes photos.", status: 415 };
  }
  if (!replace && (await currentSectionCount(section)) >= cfg.max) return { error: fullMessage(cfg), status: 409 };
  return null;
}
