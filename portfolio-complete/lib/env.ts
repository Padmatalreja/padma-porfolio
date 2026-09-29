/** True when a Neon (PostgreSQL) DATABASE_URL is configured. */
export function hasNeonEnv(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** True when local credential env vars are set. */
export function hasLocalAdminEnv(): boolean {
  return Boolean(process.env.LOCAL_ADMIN_EMAIL && process.env.LOCAL_ADMIN_PASSWORD);
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
