"use client";

/**
 * fetch() for the admin UI. Adds:
 * - the CSRF double-submit header on every change,
 * - the editor's base version (`x-cms-base`) so the server can detect that
 *   someone else saved in the meantime,
 * - a friendly conflict prompt (reload theirs / keep mine) on HTTP 409,
 * - a toast when the session has expired.
 * Editors keep calling it exactly like fetch().
 */
import { toast } from "./toast";

const versions: Record<string, string> = {};

export function setDocVersions(map: Record<string, string>) {
  Object.assign(versions, map);
}
export function getDocVersion(doc: string) {
  return versions[doc];
}

const ROUTE_DOCS: [RegExp, string][] = [
  [/^\/api\/admin\/homepage/, "homepage.json"],
  [/^\/api\/admin\/home-layout/, "home-layout.json"],
  [/^\/api\/admin\/site/, "site.json"],
  [/^\/api\/admin\/family-archives/, "family-archives.json"],
  [/^\/api\/admin\/featured-interviews/, "featured-interviews.json"],
  [/^\/api\/admin\/people-frames/, "people-frames.json"],
  [/^\/api\/admin\/cathedrals/, "cathedrals.json"],
  [/^\/api\/admin\/curator-profile/, "curator-profile.json"],
  [/^\/api\/admin\/blog/, "blog.json"],
  [/^\/api\/admin\/docs\/([a-z-]+)\/revisions\/[^/]+$/, "$1.json"],
];

export function docForUrl(url: string): string | null {
  const pathname = url.split("?")[0]!;
  for (const [re, doc] of ROUTE_DOCS) {
    const m = pathname.match(re);
    if (m) return doc.replace("$1", m[1] ?? "");
  }
  return null;
}

export function csrfToken(): string {
  const m = document.cookie.match(/(?:^|;\s*)hcop_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]!) : "";
}

export type ConflictInfo = {
  doc: string;
  updatedBy?: string;
  updatedAt?: string;
};
type ConflictChoice = "overwrite" | "reload" | "cancel";

/** Ask the user what to do about a conflict (rendered by <ConflictDialog/>). */
function askConflict(info: ConflictInfo): Promise<ConflictChoice> {
  return new Promise((resolve) => {
    const event = new CustomEvent("admin-conflict", {
      detail: { info, resolve },
      cancelable: true,
    });
    const handled = !window.dispatchEvent(event);
    if (!handled) {
      resolve(
        window.confirm(
          "Someone else saved this section since you opened it. Press OK to overwrite their changes with yours, or Cancel to stop.",
        )
          ? "overwrite"
          : "cancel",
      );
    }
  });
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  const doc = docForUrl(input);
  if (method !== "GET") {
    headers.set("x-csrf-token", csrfToken());
    if (doc && versions[doc]) headers.set("x-cms-base", versions[doc]!);
  }
  let res: Response;
  try {
    res = await fetch(input, { ...init, headers, credentials: "same-origin" });
  } catch (err) {
    toast.error("Could not reach the server. Check your internet connection and try again.");
    throw err;
  }
  const newVersion = res.headers.get("x-cms-version");
  if (doc && newVersion) {
    versions[doc] = newVersion;
    window.dispatchEvent(new CustomEvent("admin-saved", { detail: { doc } }));
  }
  if (res.status === 401) {
    toast.error("Your sign-in has expired. Please sign in again (your changes are still on screen — copy anything important first).", {
      action: { label: "Sign in", href: "/admin/login" },
    });
  }
  if (res.status === 409 && doc && method !== "GET") {
    const body = (await res.clone().json().catch(() => ({}))) as {
      conflict?: boolean;
      currentVersion?: string;
      updatedBy?: string;
      updatedAt?: string;
    };
    if (body.conflict) {
      const choice = await askConflict({ doc, updatedBy: body.updatedBy, updatedAt: body.updatedAt });
      if (choice === "overwrite") {
        headers.set("x-cms-force", "1");
        return adminFetch(input, { ...init, headers });
      }
      if (choice === "reload") {
        window.location.reload();
      }
    }
  }
  return res;
}
