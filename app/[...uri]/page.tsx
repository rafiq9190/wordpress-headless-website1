import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CtaBand } from "@/components/sections/CtaBand";
import { WpPageView } from "@/components/wp/WpPageView";
import { stripHtml, truncate } from "@/lib/utils";
import { getAllPageUris, getPageByUri, getPostBySlug } from "@/lib/wp/api";
import { absoluteUrl, wpUriToHref } from "@/lib/wp/uri";

/**
 * Catch-all for WordPress pages that have no bespoke route.
 *
 * This is what makes the site resilient to editors: publish a page in wp-admin
 * and it is live here immediately, in the site design, with no deploy. On the
 * current install this is what serves `/our-services`.
 *
 * Routes with their own file (`/pricing`, `/about`, `/contact`, `/blog/...`)
 * take precedence — Next prefers the more specific segment.
 *
 * KNOWN LIMITATION — soft 404s. Under `cacheComponents` the layout shell is
 * prerendered, so Next commits a 200 before this route's WordPress lookup has
 * run. A genuinely missing path therefore renders the 404 *page* with a 200
 * *status*. `generateMetadata` compensates with `noindex, nofollow`, which
 * removes the indexing harm even though the status line is wrong.
 *
 * The cases that actually matter to crawlers are handled with real 308s
 * elsewhere: legacy post permalinks in `redirects()` (next.config.ts) and the
 * `blog-2` style page aliases in proxy.ts. To get a true 404 here as well, the
 * root layout would have to stop being prerenderable for every route — not a
 * trade worth making for a status line on URLs that do not exist.
 */

/** Paths that already have a dedicated route and must not be duplicated here. */
const RESERVED = new Set(["/", "/blog", "/pricing", "/about", "/contact"]);

function toPath(segments: string[]): string {
  return `/${segments.join("/")}`;
}

/** WordPress wants a URI with a trailing slash for `idType: URI`. */
function toWpUri(segments: string[]): string {
  return `/${segments.join("/")}/`;
}

export async function generateStaticParams() {
  const pages = await getAllPageUris();

  return pages
    .filter((page) => !page.isFrontPage && !page.isPostsPage)
    // A page whose URI maps elsewhere (the menu's `blog-2` becomes `/blog`)
    // must not be prerendered here too — that would publish the same content at
    // two URLs. proxy.ts redirects those paths instead.
    .filter((page) => wpUriToHref(page.uri) === page.uri.replace(/\/$/, ""))
    .map((page) => page.uri.replace(/^\/|\/$/g, ""))
    .filter((path) => path.length > 0 && !RESERVED.has(`/${path}`))
    .map((path) => ({ uri: path.split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[...uri]">): Promise<Metadata> {
  const { uri } = await params;
  const page = await getPageByUri(toWpUri(uri));

  // Keep soft 404s out of the index — see the limitation note above.
  if (!page) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  return {
    title: page.title,
    description: truncate(stripHtml(page.content), 160),
    alternates: { canonical: absoluteUrl(toPath(uri)) },
  };
}

export default async function CatchAllPage({ params }: PageProps<"/[...uri]">) {
  const { uri } = await params;
  const path = toPath(uri);

  if (RESERVED.has(path)) notFound();

  // Backstop for canonicalisation; proxy.ts handles the known aliases with
  // a 308 before this route is ever reached.
  const canonical = wpUriToHref(toWpUri(uri));
  if (canonical !== path) redirect(canonical);

  const page = await getPageByUri(toWpUri(uri));
  if (page) {
    return (
      <>
        <WpPageView page={page} eyebrow="Ledgerline" />
        <CtaBand />
      </>
    );
  }

  // WordPress permalinks put posts at `/<slug>/`. Anyone arriving from an old
  // link, a search result or in-content markup gets moved to the canonical
  // `/blog/<slug>` rather than a 404.
  if (uri.length === 1 && uri[0]) {
    const post = await getPostBySlug(uri[0]);
    if (post) redirect(post.href);
  }

  notFound();
}
