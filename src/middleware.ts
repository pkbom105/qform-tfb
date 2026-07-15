import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Toffy Boutique (qform-tfb)
 *
 * Security protections:
 * 1. Protects /dashboard routes - requires auth cookie
 * 2. Allows public routes (/, /form, /api/*, /login)
 * 3. Redirects unauthenticated users to /login
 * 4. Redirects authenticated users away from /login to /dashboard
 * 5. Protects /api/* from unauthorized access (except /api/users/login, /api/submit, /api/report-name)
 */

// Public API paths that don't require authentication
const publicApiPaths = [
  "/api/users/login",
  "/api/users/logout",
  "/api/submit",
  "/api/report-name",
  "/api/settings/health",
  "/api/settings/health-pg",
];

// Public page paths that don't require authentication
const publicPaths = [
  "/",
  "/form",
  "/login",
];

// Static asset extensions that should never be checked
const staticExtensions = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
  ".mp4", ".webm", ".ogg",
  ".css", ".js", ".json", ".xml", ".txt",
  ".ico", ".woff", ".woff2", ".ttf", ".eot",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------
  // 1. Skip static assets (images, fonts, CSS, JS, etc.)
  // -------------------------------------------------------
  const ext = pathname.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  if (ext && staticExtensions.includes(ext)) {
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // 2. Skip Next.js internal routes
  // -------------------------------------------------------
  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // 3. Check auth cookie
  // -------------------------------------------------------
  const authCookie = request.cookies.get("dashboard_session")?.value;
  const isAuthenticated = !!authCookie;
  const isDevelopment = process.env.NODE_ENV !== "production";

  // -------------------------------------------------------
  // 4. Public API routes - always allow
  // -------------------------------------------------------
  if (publicApiPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // 5. Other API routes - require authentication
  // -------------------------------------------------------
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated && !isDevelopment) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // 6. Dashboard routes - require authentication
  // -------------------------------------------------------
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated && !isDevelopment) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------
  // 7. Login page - redirect to dashboard if already authenticated
  // -------------------------------------------------------
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // -------------------------------------------------------
  // 8. All public paths - allow
  // -------------------------------------------------------
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image).*)",
  ],
};