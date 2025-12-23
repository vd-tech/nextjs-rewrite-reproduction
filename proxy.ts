import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rewrite route-a, route-b, route-c to shared-page
  if (pathname.startsWith("/route-a")) {
    const response = NextResponse.rewrite(
      new URL("/shared-page", request.nextUrl)
    );
    response.headers.set("x-route-label", "Route A");
    return response;
  }

  if (pathname.startsWith("/route-b")) {
    const response = NextResponse.rewrite(
      new URL("/shared-page", request.nextUrl)
    );
    response.headers.set("x-route-label", "Route B");
    return response;
  }

  if (pathname.startsWith("/route-c")) {
    const response = NextResponse.rewrite(
      new URL("/shared-page", request.nextUrl)
    );
    response.headers.set("x-route-label", "Route C");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next|favicon.ico|favicon.png|favicon.svg|robots.txt|manifest.json).*)",
  ],
};
