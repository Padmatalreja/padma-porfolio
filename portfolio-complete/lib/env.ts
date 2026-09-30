/**
 * Environment variable helpers.
 *
 * Required vars (all must be set in production — enforced by scripts/check-env.mjs):
 *   NEXT_PUBLIC_SITE_URL     — canonical public URL of the site (no trailing slash)
 *   DATABASE_URL             — Neon PostgreSQL pooled connection string
 *   CONTACT_RATE_LIMIT_SALT  — random string to salt IP hashes for rate-limiting
 *   LOCAL_ADMIN_EMAIL        — admin login email
 *   LOCAL_ADMIN_PASSWORD     — admin login password (also used as HMAC session secret)
 */

/** True when a Neon (PostgreSQL) DATABASE_URL is configured. */
export function hasNeonEnv(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** True when local admin credential env vars are both set. */
export function hasLocalAdminEnv(): boolean {
  return Boolean(process.env.LOCAL_ADMIN_EMAIL && process.env.LOCAL_ADMIN_PASSWORD);
}

/**
 * The canonical public URL of the site (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in your environment.
 * Defaults to http://localhost:3000 for local development only.
 */
export const siteUrl: string =
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
