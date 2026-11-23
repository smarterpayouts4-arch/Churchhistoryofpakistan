/**
 * Local open-preview gate for one-click sign-in on a developer machine.
 * Fail closed: never in production; ADMIN_OPEN_PREVIEW must be exactly "true".
 */
export function isAdminPreviewAllowed(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.VERCEL) return false;
  return process.env.ADMIN_OPEN_PREVIEW === "true";
}
