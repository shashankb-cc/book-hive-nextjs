import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "kn"],
  defaultLocale: "en",
});

// export const config = {
//   matcher: ["/", "/(kn|en)/:path*"],
// };
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
