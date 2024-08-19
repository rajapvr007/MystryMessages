import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/sing-in") ||
      url.pathname.startsWith("/sing-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sing-in"));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sing-in", "/sing-up", "/", "/dashboard/:path*", "/verfiy/:path*"],
};
