import { NextRequest, NextResponse } from "next/server";
import type { AdminRole } from "@/lib/cms/types";
import { requireAdminApi } from "@/lib/auth/require-admin";
import type { AdminSession } from "@/lib/auth/session";
import { checkCsrf } from "@/lib/auth/csrf";
import {
  CmsConflictError,
  StorageNotConfiguredError,
  cmsContext,
  type CmsWriteContext,
} from "@/lib/cms/context";

export const CMS_VERSION_HEADER = "x-cms-version";
export const CMS_BASE_HEADER = "x-cms-base";
export const CMS_FORCE_HEADER = "x-cms-force";

type Handler<C> = (
  req: NextRequest,
  ctx: C,
  session: AdminSession,
) => Promise<Response>;

/**
 * Wrap an admin API handler with:
 * - session + role check,
 * - CSRF check on every non-GET request,
 * - CMS write context (base version for conflict detection, user for
 *   revision history),
 * - friendly JSON errors for conflicts and missing storage.
 */
export function adminRoute<C = unknown>(
  handler: Handler<C>,
  opts: { role?: AdminRole } = {},
) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const gate = await requireAdminApi(opts.role ?? "editor");
    if (!gate.ok) return gate.response;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const csrf = checkCsrf(req);
      if (csrf) return NextResponse.json({ error: csrf }, { status: 403 });
    }
    const store: CmsWriteContext = {
      user: gate.session.sub || gate.session.email,
      baseVersion: req.headers.get(CMS_BASE_HEADER) || undefined,
      force: req.headers.get(CMS_FORCE_HEADER) === "1",
    };
    try {
      const res = await cmsContext.run(store, () => handler(req, ctx, gate.session));
      if (store.written) {
        res.headers.set(CMS_VERSION_HEADER, store.written.version);
      }
      return res;
    } catch (err) {
      if (err instanceof CmsConflictError) {
        return NextResponse.json(
          {
            error: err.message,
            conflict: true,
            currentVersion: err.currentVersion,
            updatedBy: err.updatedBy,
            updatedAt: err.updatedAt,
          },
          { status: 409 },
        );
      }
      if (err instanceof StorageNotConfiguredError) {
        return NextResponse.json({ error: err.message }, { status: 503 });
      }
      console.error("[admin api]", err);
      return NextResponse.json(
        { error: "Something went wrong on the server. Nothing was changed." },
        { status: 500 },
      );
    }
  };
}

export async function readJsonBody(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}
