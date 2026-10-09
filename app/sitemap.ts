import type { MetadataRoute } from "next";

import { getAllPageUris, getAllPostSlugs, getCategories } from "@/lib/wp/api";
import { absoluteUrl, postHref, wpUriToHref } from "@/lib/wp/uri";

/**
 * Sitemap built from WordPress, so publishing content updates it with no code
 * change. Routes go through the same URI mapper as the nav, which keeps the
 * sitemap and the links on the site in agreement.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, categories] = await Promise.all([
    getAllPostSlugs(),
    getAllPageUris(),
    getCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map(({ slug, modified }) => ({
    url: absoluteUrl(postHref(slug)),
    lastModified: modified || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => !page.isFrontPage && !page.isPostsPage)
    .map((page) => ({
      url: absoluteUrl(wpUriToHref(page.uri)),
      lastModified: page.modified || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
    // The mapper can send several WordPress pages to one route (both `blog-2`
    // and `blog-inspiro` resolve to /blog); a sitemap must not repeat a URL.
    .filter(
      (entry, index, all) => all.findIndex((other) => other.url === entry.url) === index,
    )
    .filter((entry) => !staticRoutes.some((route) => route.url === entry.url));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(category.href),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...categoryRoutes];
}
