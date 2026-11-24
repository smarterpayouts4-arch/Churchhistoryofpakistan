"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * A date and time in the reader's own time zone. The server (in UTC) cannot
 * know that zone, so the time is filled in once the page is running in the
 * browser; before that a neutral "recently" is shown. This keeps the server
 * and browser copies of the page identical (no React hydration error).
 */
export function LocalTime({ iso }: { iso?: string }) {
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  if (!iso) return null;
  return (
    <time dateTime={iso}>
      {inBrowser ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "recently"}
    </time>
  );
}
