/**
 * Local open-preview gate for curator one-click Sign in.
 *
 * Double-guard (fail closed):
 * - NODE_ENV === "production" → never allowed
 * - ADMIN_OPEN_PREVIEW must be exactly the string "true"
 *
 * A mis-set or truthy-looking flag (e.g. "1", "yes") cannot open preview.
 */

export function isAdminPreviewAllowed(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  if (process.env.ADMIN_OPEN_PREVIEW !== "true") {
    return false;
  }
  return true;
}
