/**
 * Translate WordPress URIs into Next.js routes.
 *
 * This exists because WordPress permalinks and our route tree don't match:
 *
 *  - The nav menu links to `/blog-2/`, and the assigned posts page is
 *    `/blog-inspiro/`. Both must land on `/blog`.
 *  - The front page is the `homepage-inspiro` page, which must be `/`.
 *  - Posts live at `/<slug>/` in WordPress but `/blog/<slug>` here.
 *  - Content HTML contains absolute `http://my-plugin-local.test/...` links
 *    that would otherwise navigate the visitor out of the Next app.
 */

/** Page slugs that must not resolve to `/<slug>`. Derived from the live site. */
const PAGE_ROUTE_OVERRIDES: Record<string, string> = {
  "homepage-inspiro": "/",
  "blog-inspiro": "/blog",
  "blog-2": "/blog",
};

export const BLOG_BASE = "/blog";

/** The WordPress origin, derived from the GraphQL endpoint so there's one source of truth. */
export function wpOrigin(): string | null {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) return null;
  try {
    return new URL(endpoint).origin;
  } catch {
    return null;
  }
}

function normalise(path: string): string {
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  const trimmed = withLeading.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * Convert any WordPress href — absolute or relative — to an app route.
 * Returns `null` when the URL points somewhere outside WordPress.
 */
export function wpUrlToHref(href: string): string | null {
  const origin = wpOrigin();

  let path = href;
  if (/^https?:\/\//i.test(href)) {
    let parsed: URL;
    try {
      parsed = new URL(href);
    } catch {
      return null;
    }
    if (!origin || parsed.origin !== origin) return null;
    path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } else if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }

  return wpUriToHref(path);
}

/** Convert a WordPress URI (always same-origin, e.g. `/pricing/`) to an app route. */
export function wpUriToHref(uri: string): string {
  const [pathOnly = "", ...rest] = uri.split(/(?=[?#])/);
  const suffix = rest.join("");
  const path = normalise(pathOnly);

  if (path === "/") return "/";

  const segments = path.slice(1).split("/");
  const first = segments[0] ?? "";

  // /category/<slug>/ -> /blog/category/<slug>
  if (first === "category" && segments[1]) {
    return `${BLOG_BASE}/category/${segments[1]}${suffix}`;
  }

  // Single-segment paths may be an overridden page, a page, or a post.
  if (segments.length === 1) {
    const override = PAGE_ROUTE_OVERRIDES[first];
    if (override) return `${override}${suffix}`;
    return `/${first}${suffix}`;
  }

  return `${path}${suffix}`;
}

export function postHref(slug: string): string {
  return `${BLOG_BASE}/${slug}`;
}

export function categoryHref(slug: string): string {
  return `${BLOG_BASE}/category/${slug}`;
}

/** True for routes we can hand to `next/link`. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * Absolute URL for metadata, sitemaps and JSON-LD.
 * Falls back to localhost so `next build` never produces `undefined/...`.
 */
export function absoluteUrl(path = "/"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}
