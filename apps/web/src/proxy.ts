import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "accessToken";
// Holding the auth cookie implies a verified email: signup issues no session
// and signin rejects unverified users, so these pages are all moot once in
const PUBLIC_AUTH_PAGES = [
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-email-pending",
  "/auth/forgot-password",
  "/auth/reset-password",
];

/**
 * Server-side route protection (Next.js 16 renamed `middleware.ts` to
 * `proxy.ts`): gates all protected pages on the presence of the httpOnly
 * auth cookie, avoiding a flash of protected content before the client-side
 * 401/403 interceptor would catch it.
 */
export default function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
  }

  if (isAuthenticated && PUBLIC_AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)",
  ],
};
