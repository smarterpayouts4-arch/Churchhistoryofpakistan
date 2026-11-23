import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Request-scoped CMS write context, set by `adminRoute()` for every admin API
 * call. The store reads it to:
 *  - compare the editor's base version (optimistic concurrency),
 *  - stamp revisions with the signed-in user,
 *  - report the new version back in the `x-cms-version` response header.
 */
export type CmsWriteContext = {
  user?: string;
  baseVersion?: string;
  force?: boolean;
  written?: { doc: string; version: string };
};

export const cmsContext = new AsyncLocalStorage<CmsWriteContext>();

export class CmsConflictError extends Error {
  constructor(
    public doc: string,
    public currentVersion: string,
    public updatedBy?: string,
    public updatedAt?: string,
  ) {
    super("This section was changed by someone else since you opened it.");
  }
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Saving is not available: production storage (Vercel KV) is not connected. Ask the site maintainer to connect it.",
    );
  }
}
