import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasLocalAdminEnv } from "@/lib/env";
import { COOKIE_NAME, verifyLocalSessionToken } from "@/lib/local-auth";

/**
 * Returns the authenticated admin user object, or null.
 * Uses local credential auth (HMAC-signed cookie).
 */
export async function getAdminUser() {
  if (!hasLocalAdminEnv()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const email = await verifyLocalSessionToken(token);
  if (!email) return null;

  return {
    id: "local-admin",
    email,
    app_metadata: {},
    user_metadata: {},
    aud: "local",
  } as const;
}

/**
 * Requires an authenticated admin. Redirects to /admin/login if not found.
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
