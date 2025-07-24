import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/users", "/logs"];
const AUTH_ROUTES = ["/login", "/signup"];
const PUBLIC_ROOT = "/";

const DASHBOARD_PATH = "/users";
const LOGIN_PATH = "/login";
const SIGNUP_PATH = "/signup";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("logged_in")?.value === "true";

  const isProtectedRoute = PROTECTED_ROUTES.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));
  const isPublicRoot = pathname === PUBLIC_ROOT;

  if (isLoggedIn && (isAuthRoute || isPublicRoot)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (!isLoggedIn && isPublicRoot) {
    return NextResponse.redirect(new URL(SIGNUP_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)"],
};
