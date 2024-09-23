import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "kn"],
  defaultLocale: "en",
});

export async function middleware(request) {
  try {
    // Handle internationalization first
    const response = await intlMiddleware(request);

    // Check if the response is a redirect (for locale prefixing)
    if (response.status !== 200) {
      return response;
    }

    const { pathname } = request.nextUrl;

    // Allow access to public routes without token check
    if (
      pathname === "/" ||
      pathname.endsWith("/login") ||
      pathname.endsWith("/register")
    ) {
      return response;
    }

    // Attempt to get the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If token is missing, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based access control
    if (pathname.includes("/admin-dashboard") && token.role !== "librarian") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.endsWith("/dashboard") && token.role === "librarian") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }

    // For all other cases, return the internationalized response
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of any error, allow the request to proceed to avoid blocking the application
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
