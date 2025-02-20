import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated as isNativeAuthenticated } from "@/app/api/middlewares/loginAuth"; // adjust the import path as needed
import { getToken } from "next-auth/jwt";
import { xssMiddleware } from "@/app/api/middlewares/xss";

export default async function middleware(req: NextRequest) {
  // First, run the XSS middleware to validate/sanitize headers, URL params, etc.
  const xssResponse = await xssMiddleware(req);
  // If XSS middleware returns an error response (non-200 status), stop further processing.
  if (xssResponse.status !== 200) {
    return xssResponse;
  }

  // Initialize variables to track authentication state.
  let authType: "native" | "oauth" | null = null;
  let userId: string | null = null;
  let surveyed: boolean | undefined = undefined;

  // Check if the custom native auth cookie is present.
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  }

    if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  }  
  // Fetch the session from an API route (since middleware cannot access Prisma)
  const sessionRes = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
    headers: { Cookie: `next-auth.session-token=${sessionToken}` },
    credentials: "include",
  });

  if (!sessionRes.ok) {
    return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  }

  const session = await sessionRes.json();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  }

    // Redirect users who haven't completed the survey
    if (session.user.surveyed === false) {
      return NextResponse.redirect(new URL("/register/survey", req.url));
    }

      // Authentication is valid; proceed with request
  const response = NextResponse.next();
  response.headers.set("X-User-Id", session.user.id);
  return response;
  
}

export const config = {
  matcher: [
    "/health/:path*",
    "/user",
    "/log/:path*",
    "/pantry/:path*",
    "/profile/:path*",
    "/recipes/:path*",
  ],
  runtime: "nodejs",
};
