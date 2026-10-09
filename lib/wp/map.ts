import { readingTime, stripHtml, truncate } from "@/lib/utils";
import type {
  RawAuthor,
  RawMedia,
  RawMenuItem,
  RawPage,
  RawPost,
  RawPostCard,
  RawTerm,
} from "./schemas";
import type {
  MenuItem,
  Post,
  PostCard,
  WpAuthor,
  WpImage,
  WpPage,
  WpTerm,
} from "./types";
import { categoryHref, postHref, wpUriToHref } from "./uri";

export function mapImage(raw: RawMedia | null | undefined): WpImage | null {
  if (!raw?.sourceUrl) return null;
  return {
    url: raw.sourceUrl,
    alt: raw.altText?.trim() ?? "",
    width: raw.mediaDetails?.width ?? null,
    height: raw.mediaDetails?.height ?? null,
  };
}

export function mapAuthor(raw: RawAuthor | null | undefined): WpAuthor | null {
  if (!raw?.name) return null;
  return {
    name: stripHtml(raw.name),
    slug: raw.slug ?? "",
    bio: raw.description ? stripHtml(raw.description) : null,
    avatarUrl: raw.avatar?.url ?? null,
  };
}

export function mapTerm(raw: RawTerm): WpTerm {
  return {
    id: raw.databaseId,
    name: raw.name ? stripHtml(raw.name).replace(/:$/, "") : raw.slug,
    slug: raw.slug,
    href: categoryHref(raw.slug),
    count: raw.count ?? 0,
  };
}

/**
 * WordPress excerpts arrive as HTML and end with a theme-injected
 * `<p class="link-more">Read more…</p>` block. Strip that before anything else
 * or every card ends with "Read more Post with Slideshow".
 */
export function mapExcerpt(html: string | null | undefined, max = 180): string {
  if (!html) return "";
  const withoutReadMore = html.replace(
    /<p[^>]*class=["'][^"']*link-more[^"']*["'][\s\S]*?<\/p>/gi,
    "",
  );
  return truncate(stripHtml(withoutReadMore).replace(/\s*…\s*$/, ""), max);
}

export function mapPostCard(raw: RawPostCard): PostCard {
  return {
    id: raw.databaseId,
    slug: raw.slug,
    href: postHref(raw.slug),
    title: raw.title ? stripHtml(raw.title) : "Untitled",
    excerpt: mapExcerpt(raw.excerpt),
    date: raw.date ?? "",
    image: mapImage(raw.featuredImage?.node),
    author: mapAuthor(raw.author?.node),
    categories: (raw.categories?.nodes ?? []).map(mapTerm),
  };
}

export function mapPost(raw: RawPost): Post {
  const content = raw.content ?? "";
  return {
    ...mapPostCard(raw),
    content,
    modified: raw.modified ?? raw.date ?? "",
    tags: (raw.tags?.nodes ?? []).map((tag) => ({
      name: tag.name ? stripHtml(tag.name) : tag.slug,
      slug: tag.slug,
    })),
    readingMinutes: readingTime(content),
  };
}

export function mapPage(raw: RawPage): WpPage {
  const uri = raw.uri ?? `/${raw.slug}/`;
  return {
    id: raw.databaseId,
    slug: raw.slug,
    uri,
    href: wpUriToHref(uri),
    title: raw.title ? stripHtml(raw.title) : "Untitled",
    content: raw.content ?? "",
    date: raw.date ?? "",
    modified: raw.modified ?? raw.date ?? "",
    isFrontPage: raw.isFrontPage ?? false,
    isPostsPage: raw.isPostsPage ?? false,
    image: mapImage(raw.featuredImage?.node),
  };
}

/** Flatten WordPress's parentId-linked menu items into a two-level tree. */
export function mapMenuItems(raw: RawMenuItem[]): MenuItem[] {
  const sorted = [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const toItem = (item: RawMenuItem): MenuItem => {
    const uri = item.uri ?? "/";
    const external = /^https?:\/\//i.test(uri);
    return {
      id: item.id,
      label: item.label ? stripHtml(item.label) : "",
      href: external ? uri : wpUriToHref(uri),
      external: external || item.target === "_blank",
      children: [],
    };
  };

  const byId = new Map<string, MenuItem>();
  for (const item of sorted) byId.set(item.id, toItem(item));

  const roots: MenuItem[] = [];
  for (const item of sorted) {
    const mapped = byId.get(item.id);
    if (!mapped) continue;
    const parent = item.parentId ? byId.get(item.parentId) : undefined;
    if (parent) parent.children.push(mapped);
    else roots.push(mapped);
  }

  return roots;
}
