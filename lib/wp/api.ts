import { cacheLife, cacheTag } from "next/cache";

import { wpQuery } from "./client";
import { mapMenuItems, mapPage, mapPost, mapPostCard, mapTerm } from "./map";
import * as Q from "./queries";
import * as S from "./schemas";
import type {
  CategoryArchive,
  MenuItem,
  Paginated,
  Post,
  PostCard,
  SiteSettings,
  WpPage,
  WpTerm,
} from "./types";

/**
 * Cache tags. `/api/revalidate` accepts these so a WordPress save hook can
 * purge exactly what changed instead of the whole site.
 */
export const tags = {
  posts: "wp:posts",
  post: (slug: string) => `wp:post:${slug}`,
  page: (uri: string) => `wp:page:${uri}`,
  menu: "wp:menu",
  categories: "wp:categories",
  settings: "wp:settings",
} as const;

export const POSTS_PER_PAGE = 6;

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(tags.settings);
  cacheLife("hours");

  const data = S.siteSettingsResponse.parse(
    await wpQuery(Q.GET_SITE_SETTINGS),
  ).generalSettings;

  return {
    title: data?.title ?? "Headless WP",
    description: data?.description ?? "",
    url: data?.url ?? "",
  };
}

export async function getMenu(slug = "main"): Promise<MenuItem[]> {
  "use cache";
  cacheTag(tags.menu);
  cacheLife("hours");

  const data = S.menuResponse.parse(await wpQuery(Q.GET_MENU, { id: slug }));
  return mapMenuItems(data.menu?.menuItems?.nodes ?? []);
}

export async function getPosts(
  { first = POSTS_PER_PAGE, after = null }: { first?: number; after?: string | null } = {},
): Promise<Paginated<PostCard>> {
  "use cache";
  cacheTag(tags.posts);
  cacheLife("hours");

  const data = S.postsPageResponse.parse(
    await wpQuery(Q.GET_POSTS_PAGE, { first, after }),
  );

  return {
    items: (data.posts?.nodes ?? []).map(mapPostCard),
    hasNextPage: data.posts?.pageInfo.hasNextPage ?? false,
    endCursor: data.posts?.pageInfo.endCursor ?? null,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(tags.post(slug), tags.posts);
  cacheLife("hours");

  const data = S.postResponse.parse(await wpQuery(Q.GET_POST_BY_SLUG, { slug }));
  return data.post ? mapPost(data.post) : null;
}

export async function getAllPostSlugs(): Promise<{ slug: string; modified: string }[]> {
  "use cache";
  cacheTag(tags.posts);
  cacheLife("hours");

  const data = S.postSlugsResponse.parse(await wpQuery(Q.GET_POST_SLUGS));
  return (data.posts?.nodes ?? []).map((node) => ({
    slug: node.slug,
    modified: node.modified ?? "",
  }));
}

export async function getPageByUri(uri: string): Promise<WpPage | null> {
  "use cache";
  cacheTag(tags.page(uri), tags.posts);
  cacheLife("hours");

  const data = S.pageResponse.parse(await wpQuery(Q.GET_PAGE_BY_URI, { uri }));
  return data.page ? mapPage(data.page) : null;
}

export async function getAllPageUris(): Promise<
  { uri: string; slug: string; modified: string; isFrontPage: boolean; isPostsPage: boolean }[]
> {
  "use cache";
  cacheTag(tags.posts);
  cacheLife("hours");

  const data = S.pageUrisResponse.parse(await wpQuery(Q.GET_PAGE_URIS));
  return (data.pages?.nodes ?? []).map((node) => ({
    uri: node.uri ?? `/${node.slug}/`,
    slug: node.slug,
    modified: node.modified ?? "",
    isFrontPage: node.isFrontPage ?? false,
    isPostsPage: node.isPostsPage ?? false,
  }));
}

export async function getCategories(): Promise<WpTerm[]> {
  "use cache";
  cacheTag(tags.categories);
  cacheLife("hours");

  const data = S.categoriesResponse.parse(await wpQuery(Q.GET_CATEGORIES));
  return (data.categories?.nodes ?? []).map(mapTerm);
}

export async function getCategoryArchive(
  slug: string,
  { first = POSTS_PER_PAGE, after = null }: { first?: number; after?: string | null } = {},
): Promise<CategoryArchive | null> {
  "use cache";
  cacheTag(tags.categories, tags.posts);
  cacheLife("hours");

  const data = S.categoryPostsResponse.parse(
    await wpQuery(Q.GET_CATEGORY_POSTS, { slug, first, after }),
  );
  const category = data.category;
  if (!category) return null;

  return {
    id: category.databaseId,
    name: category.name ?? category.slug,
    slug: category.slug,
    description: category.description ?? null,
    count: category.count ?? 0,
    posts: {
      items: (category.posts?.nodes ?? []).map(mapPostCard),
      hasNextPage: category.posts?.pageInfo.hasNextPage ?? false,
      endCursor: category.posts?.pageInfo.endCursor ?? null,
    },
  };
}

export async function getRelatedPosts(
  post: Pick<Post, "id" | "categories">,
  limit = 3,
): Promise<PostCard[]> {
  "use cache";
  cacheTag(tags.posts);
  cacheLife("hours");

  const categoryIn = post.categories.map((category) => String(category.id));
  if (categoryIn.length === 0) return [];

  const data = S.relatedPostsResponse.parse(
    await wpQuery(Q.GET_RELATED_POSTS, {
      categoryIn,
      notIn: [String(post.id)],
      first: limit,
    }),
  );
  return (data.posts?.nodes ?? []).map(mapPostCard);
}
