import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  const isAgentLogin = pathname === "/agent";
  const isClientLogin = pathname === "/client";

  // Public link from the client onboarding email:
  // /client/reset-password?email=...&token=...
  // The recipient is never logged in at this point, so this route must be
  // excluded from the generic "portal requires a session" check below —
  // but it's only valid to view with both query params present.
  const isResetPasswordRoute = pathname === "/client/reset-password";
  if (isResetPasswordRoute) {
    const email = nextUrl.searchParams.get("email");
    const token = nextUrl.searchParams.get("token");
    // if (!email || !token) {
    //   return NextResponse.redirect(new URL("/client", nextUrl));
    // }
    return NextResponse.next();
  }

  const isAgentPortal = pathname.startsWith("/agent") && !isAgentLogin;
  const isClientPortal = pathname.startsWith("/client") && !isClientLogin;

  if ((isAgentPortal || isClientPortal) && !isLoggedIn) {
    const loginPath = isAgentPortal ? "/agent" : "/client";
    return NextResponse.redirect(new URL(loginPath, nextUrl));
  }

  if (isAgentPortal && role === "Client") {
    return NextResponse.redirect(new URL("/client/dashboard", nextUrl));
  }
  if (isClientPortal && role && role !== "Client") {
    return NextResponse.redirect(new URL("/agent/dashboard", nextUrl));
  }

  if (isLoggedIn && (isAgentLogin || isClientLogin)) {
    return NextResponse.redirect(
      new URL(role === "Client" ? "/client/dashboard" : "/agent/dashboard", nextUrl)
    );
  }
});

export const config = {
  matcher: ["/agent/:path*", "/client/:path*"],
};
