import type { NextConfig } from "next";

/**
 * Legacy WordPress permalinks -> canonical app routes.
 *
 * WordPress serves posts at `/<slug>/`; this app serves them at `/blog/<slug>`.
 * Old links, bookmarks and search results point at the former.
 *
 * Generated here, at build time, rather than redirected from inside the
 * catch-all route: with Partial Prerendering a `redirect()` during render
 * arrives after the 200 is already committed, so a crawler records 200 for a
 * URL that should be a 308. `redirects()` emits a genuine 308 before any
 * rendering happens.
 *
 * Trade-off worth knowing: this list is fixed at build time, so a post
 * published afterwards has no legacy redirect until the next build. Its
 * canonical `/blog/<slug>` URL works immediately either way — only the old-style
 * permalink lags.
 */
async function wordpressPermalinkRedirects() {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) return [];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ posts(first: 200, where: { status: PUBLISH }) { nodes { slug } } }`,
      }),
    });

    if (!response.ok) return [];

    const json = (await response.json()) as {
      data?: { posts?: { nodes?: { slug: string }[] } };
    };

    return (json.data?.posts?.nodes ?? []).map(({ slug }) => ({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
      permanent: true,
    }));
  } catch {
    // A build must not fail because WordPress was briefly unreachable.
    console.warn(
      "[next.config] Could not reach WordPress for permalink redirects; skipping them.",
    );
    return [];
  }
}

/**
 * Next 16 refuses to optimise images whose hostname resolves to a private IP,
 * as SSRF protection. `my-plugin-local.test` resolves to 127.0.0.1, so every
 * WordPress upload is rejected with `"url" parameter is not allowed` until this
 * is opted into explicitly.
 *
 * Scoped deliberately: it is enabled only while the configured WordPress host
 * is itself a local address. Point `WP_GRAPHQL_URL` at a public domain and the
 * flag switches itself off, so the SSRF protection comes back automatically
 * rather than being left permanently disabled in production.
 */
function wordpressHostIsLocal(): boolean {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) return false;

  try {
    const { hostname } = new URL(endpoint);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  /**
   * Custom cache profile for WordPress reads.
   *
   * The built-in profiles top out at `max` (revalidate 30 days, expire 1 year),
   * which is shorter than we want. This content is treated as effectively
   * static, so time-based revalidation is switched off in practice and the
   * cache is refreshed by explicit purge instead.
   *
   *   stale      1 hour   — how long a client may reuse its router cache
   *   revalidate 1 year   — when the server starts a background refresh
   *   expire     Infinity — never evicted for being idle
   *
   * `expire` must be greater than `revalidate`, which is why it is `Infinity`
   * rather than another year.
   *
   * CONSEQUENCE: with revalidation this far out, `/api/revalidate` is the only
   * thing that makes edits appear. Wire the WordPress `save_post` hook to it
   * (snippet at the top of app/api/revalidate/route.ts) or published changes
   * will not show up until the next deploy.
   */
  cacheLife: {
    wordpress: {
      stale: 60 * 60,
      revalidate: 60 * 60 * 24 * 365,
      expire: Infinity,
    },
  },
  /**
   * Build year for the footer copyright, resolved once here.
   *
   * Reading the clock during render is a dynamic API under `cacheComponents`,
   * so it has to sit behind a cache — and `cacheLife` keeps the *lowest* value
   * across everything rendered in a request. A one-day cached clock read in
   * the footer therefore capped every page at a one-day revalidate, silently
   * defeating the year-long profile above. Inlining the value at build time
   * removes the dynamic read entirely.
   */
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // See wordpressHostIsLocal() above — required for a Local/Flywheel site.
    dangerouslyAllowLocalIP: wordpressHostIsLocal(),
    remotePatterns: [
      // Local WordPress uploads. Served over plain HTTP by Local/Flywheel.
      {
        protocol: "http",
        hostname: "my-plugin-local.test",
        pathname: "/wp-content/uploads/**",
      },
      // Author avatars come from Gravatar, not the WP media library.
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  redirects: wordpressPermalinkRedirects,
};

export default nextConfig;
