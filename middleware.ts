import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const HIGH_ARENA_SLUGS = new Set(
  Array.from({ length: 9 }, (_, index) => `arena-${index + 12}`),
);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.endsWith("/")
    ? request.nextUrl.pathname.slice(0, -1) || "/"
    : request.nextUrl.pathname;

  if (!pathname.startsWith("/arena/")) {
    return NextResponse.next();
  }

  const slug = pathname.slice("/arena/".length);
  if (!HIGH_ARENA_SLUGS.has(slug)) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/__arena-resolved/${slug}`;

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/arena/:path*"],
};
