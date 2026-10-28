import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: { role?: string } | null } }) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Admin routes require ADMIN or STAFF role
    if (pathname.startsWith("/admin")) {
      if (!token || !["ADMIN", "STAFF"].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow through — middleware function handles specific redirects
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
