import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // Allow access to public routes
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // If token is missing, redirect to login
  if (!token) {
    return NextResponse.redirect(
      new URL(
        "https://bookhive-atbcj9tij-shashank-bs-projects-ded4bbd9.vercel.app/login",
        req.url
      )
    );
  }

  // Role-based access control for admin-dashboard
  if (pathname.startsWith("/admin-dashboard")) {
    if (token.role !== "librarian") {
      return NextResponse.redirect(
        new URL(
          "https://bookhive-atbcj9tij-shashank-bs-projects-ded4bbd9.vercel.app/dashboard",
          req.url
        )
      );
    }
  }

  // Redirect librarian users accessing /dashboard to /admin-dashboard
  if (pathname === "/dashboard" && token.role === "librarian") {
    return NextResponse.redirect(
      new URL(
        "https://bookhive-atbcj9tij-shashank-bs-projects-ded4bbd9.vercel.app/admin-dashboard",
        req.url
      )
    );
  }

  // Allow access if everything checks out
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
