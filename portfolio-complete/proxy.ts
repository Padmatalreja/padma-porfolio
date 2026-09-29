import { NextResponse, type NextRequest } from "next/server";
import { verifyLocalSessionToken, COOKIE_NAME } from "@/lib/local-auth";

export async function proxy(request: NextRequest) {
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminRoute) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const email = token ? await verifyLocalSessionToken(token) : null;
    if (!email) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
