import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
]);

export default clerkMiddleware(
  async (auth, request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const hostWithPort = request.headers.get("host") || "";
    const hostname = hostWithPort.replace(/:\d+$/, "");

    // Skip static files & API
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Protect non-public routes
    if (!isPublicRoute(request)) {
      await auth.protect();
    }

    let tenantSlug: string | null = null;
    const rootDomain = "local.cursorschool.test";

    // 1. Subdomain routing
    if (hostname.endsWith(rootDomain) && hostname !== rootDomain) {
      tenantSlug = hostname.replace(`.${rootDomain}`, "");
    }

    // 2. Demo fallback
    if (!tenantSlug && (hostname.includes("demo") || pathname.startsWith("/demo"))) {
      if (!tenantSlug) tenantSlug = "demo";
    }

    // 3. Path-based fallback
    if (!tenantSlug && pathname.startsWith("/tenant/")) {
      tenantSlug = pathname.split("/")[2];
    }

    if (tenantSlug) {
      const headers = new Headers(request.headers);
      headers.set("x-tenant-slug", tenantSlug);

      let newPathname = pathname;
      if (pathname.startsWith("/tenant/")) {
        newPathname = pathname.replace(/^\/tenant\/[^/]+/, "") || "/";
      }

      const url = request.nextUrl.clone();
      url.pathname = `/${tenantSlug}${newPathname}`;
      return NextResponse.rewrite(url, { request: { headers } });
    }

    return NextResponse.next();
  },
  { debug: false }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};