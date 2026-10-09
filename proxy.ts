import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical redirects for WordPress page aliases.
 *
 * Uses the `proxy` file convention (Next 16 renamed `middleware` to `proxy`).
 *
 * Done here rather than in the page, because a redirect issued during render
 * arrives after the response status is already committed — the visitor is moved
 * by client-side navigation, but a crawler following `/blog-2` records a 200
 * for duplicate content. Here it gets a real 308 before anything renders.
 *
 * These slugs come from the live install: the nav menu points at `/blog-2/`,
 * `blog-inspiro` is the page assigned as the posts page, and
 * `homepage-inspiro` is the front page. Legacy *post* permalinks are handled
 * separately by `redirects()` in next.config.ts, which can enumerate them at
 * build time.
 */
const PERMANENT_REDIRECTS: Record<string, string> = {
  "/blog-2": "/blog",
  "/blog-inspiro": "/blog",
  "/homepage-inspiro": "/",
};

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const target = PERMANENT_REDIRECTS[path];

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  /** Only the paths above can match; everything else skips this entirely. */
  matcher: ["/blog-2", "/blog-inspiro", "/homepage-inspiro"],
};
