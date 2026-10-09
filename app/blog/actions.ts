"use server";

import { getCategoryArchive, getPosts, POSTS_PER_PAGE } from "@/lib/wp/api";
import type { Paginated, PostCard } from "@/lib/wp/types";

/**
 * Cursor-paginated "load more" for archives.
 *
 * Server Actions rather than a route handler: the client only needs to send an
 * opaque cursor and gets back already-mapped domain objects, so no response
 * shape has to be duplicated or re-validated on the client.
 */
export async function loadMorePosts(after: string): Promise<Paginated<PostCard>> {
  return getPosts({ first: POSTS_PER_PAGE, after });
}

export async function loadMoreCategoryPosts(
  slug: string,
  after: string,
): Promise<Paginated<PostCard>> {
  const archive = await getCategoryArchive(slug, { first: POSTS_PER_PAGE, after });
  return archive?.posts ?? { items: [], hasNextPage: false, endCursor: null };
}
