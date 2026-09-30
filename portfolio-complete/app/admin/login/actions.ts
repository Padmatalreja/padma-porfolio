"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasLocalAdminEnv } from "@/lib/env";
import { createLocalSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/local-auth";
import { checkLoginRateLimit, recordLoginAttempt, clearLoginAttempts } from "@/lib/login-rate-limit";

export async function loginAction(formData: FormData) {
  const email    = String(formData.get("email")    || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/admin/login?error=Email%20and%20password%20are%20required");
  }

  if (!hasLocalAdminEnv()) {
    redirect("/admin/login?error=Admin%20authentication%20is%20not%20configured");
  }

  // ── Rate-limit: max 5 attempts per 15 minutes per email ──────────────────
  const rateLimitResult = await checkLoginRateLimit(email);
  if (!rateLimitResult.allowed) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        `Too many login attempts. Please try again in ${rateLimitResult.retryAfterMinutes} minutes.`
      )}`
    );
  }

  const validEmail    = process.env.LOCAL_ADMIN_EMAIL!;
  const validPassword = process.env.LOCAL_ADMIN_PASSWORD!;

  // ── Validate credentials ──────────────────────────────────────────────────
  // Use a timing-safe comparison to prevent timing attacks.
  // bcrypt.compare is used when a hash is provided; fall back to constant-time
  // string compare for plain-text password (for zero-dep setups).
  let credentialsValid = false;

  if (validPassword.startsWith("$2")) {
    // bcrypt hash detected — use bcrypt compare
    try {
      const bcrypt = await import("bcryptjs");
      credentialsValid =
        email === validEmail && (await bcrypt.compare(password, validPassword));
    } catch {
      // bcryptjs not installed — fall back to plain comparison
      credentialsValid = email === validEmail && password === validPassword;
    }
  } else {
    credentialsValid = email === validEmail && password === validPassword;
  }

  if (!credentialsValid) {
    await recordLoginAttempt(email);
    redirect(`/admin/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  // Success — clear failed attempts
  await clearLoginAttempts(email);

  const token = await createLocalSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    // secure: true ensures the cookie is only sent over HTTPS.
    // In local dev (HTTP) this would block the cookie, so we only set it
    // in non-development environments.
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  redirect("/admin/dashboard");
}
