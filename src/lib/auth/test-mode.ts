import type { AdminSession } from "./session";

/**
 * ============================================================================
 * TODO(BEFORE OWNER HANDOFF): set this to `false` to lock the admin again.
 * ============================================================================
 * TEMPORARY TEST MODE. While `true`, /admin and every /api/admin/* route act
 * as if a signed-in administrator is present: NO username or password is
 * needed, on local dev AND on the live Vercel site. Anyone who finds /admin
 * can change or delete content. CSRF checks still apply (the admin UI gets
 * its token cookie from the proxy), and /admin stays noindex.
 *
 * The real login code is untouched; flipping this one line back to `false`
 * restores normal password sign-in.
 */
export const TEMP_OPEN_ADMIN_FOR_TESTING = true;

/** The stand-in session used while test mode is on. */
export const TEST_MODE_SESSION: AdminSession = {
  userId: "test-mode",
  sub: "Test mode (no login)",
  email: "test-mode@localhost",
  role: "admin",
};