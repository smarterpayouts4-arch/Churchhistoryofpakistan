/**
 * DEPRECATED / UNWIRED — thematic interview placeholder slots.
 *
 * Featured Interviews now load exclusively from
 * `data/cms/featured-interviews.json` via `@/content/featured-interviews`.
 * The duplicate parchment placeholders under `/media/interviews/*` are
 * SHA-identical to `/media/archive/interviews/forthcoming-*` and are not
 * published on any route. Keep this empty export so accidental imports
 * cannot re-wire the placeholders; do not invent interviewee names.
 */

export type InterviewSlot = {
  id: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
};

/** Intentionally empty — superseded by CMS featured interviews. */
export const interviewSlots: InterviewSlot[] = [];
