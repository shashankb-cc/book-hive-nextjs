import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // Dynamically getting the base URL from the request
  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  // Allow access to public routes
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // If token is missing, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL(`${baseUrl}/login`, req.url));
  }

  // Role-based access control for admin-dashboard
  if (pathname.startsWith("/admin-dashboard")) {
    if (token.role !== "librarian") {
      return NextResponse.redirect(new URL(`${baseUrl}/dashboard`, req.url));
    }
  }

  // Redirect librarian users accessing /dashboard to /admin-dashboard
  if (pathname === "/dashboard" && token.role === "librarian") {
    return NextResponse.redirect(
      new URL(`${baseUrl}/admin-dashboard`, req.url)
    );
  }

  // Allow access if everything checks out
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
