"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasLocalAdminEnv } from "@/lib/env";
import { createLocalSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/local-auth";

export async function loginAction(formData: FormData) {
  const email    = String(formData.get("email")    || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/admin/login?error=Email%20and%20password%20are%20required");
  }

  if (!hasLocalAdminEnv()) {
    redirect("/admin/login?error=Admin%20authentication%20is%20not%20configured");
  }

  const validEmail    = process.env.LOCAL_ADMIN_EMAIL!;
  const validPassword = process.env.LOCAL_ADMIN_PASSWORD!;

  if (email !== validEmail || password !== validPassword) {
    redirect(`/admin/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  const token = await createLocalSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    // secure: true  — enable when deploying to HTTPS
  });

  redirect("/admin/dashboard");
}
