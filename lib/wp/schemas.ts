import { z } from "zod";

/**
 * Zod schemas mirroring the WPGraphQL response shape.
 *
 * WordPress is an external system we don't control: a deactivated plugin or an
 * edited field can change a payload without warning. Validating at the boundary
 * turns that into one clear error instead of a scatter of `undefined` crashes
 * deep in the component tree.
 *
 * Nearly everything is nullable, because WPGraphQL returns `null` for empty
 * fields rather than omitting them (verified against the live site: a post with
 * no featured image returns `featuredImage: null`, and author `description` is
 * `null` rather than `""`).
 */

const nullableString = z.string().nullish();

export const mediaSchema = z.object({
  sourceUrl: nullableString,
  altText: nullableString,
  mediaDetails: z
    .object({
      width: z.number().nullish(),
      height: z.number().nullish(),
    })
    .nullish(),
});

export const authorSchema = z.object({
  name: nullableString,
  slug: nullableString,
  description: nullableString,
  avatar: z.object({ url: nullableString }).nullish(),
});

export const termSchema = z.object({
  databaseId: z.number(),
  name: nullableString,
  slug: z.string(),
  count: z.number().nullish(),
});

export const postCardSchema = z.object({
  databaseId: z.number(),
  slug: z.string(),
  uri: nullableString,
  title: nullableString,
  excerpt: nullableString,
  date: nullableString,
  featuredImage: z.object({ node: mediaSchema.nullish() }).nullish(),
  author: z.object({ node: authorSchema.nullish() }).nullish(),
  categories: z.object({ nodes: z.array(termSchema) }).nullish(),
});

export const postSchema = postCardSchema.extend({
  content: nullableString,
  modified: nullableString,
  tags: z
    .object({ nodes: z.array(z.object({ name: nullableString, slug: z.string() })) })
    .nullish(),
});

export const pageSchema = z.object({
  databaseId: z.number(),
  slug: z.string(),
  uri: nullableString,
  title: nullableString,
  content: nullableString,
  date: nullableString,
  modified: nullableString,
  isFrontPage: z.boolean().nullish(),
  isPostsPage: z.boolean().nullish(),
  featuredImage: z.object({ node: mediaSchema.nullish() }).nullish(),
});

export const pageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: nullableString,
});

export const menuItemSchema = z.object({
  id: z.string(),
  label: nullableString,
  uri: nullableString,
  target: nullableString,
  parentId: nullableString,
  order: z.number().nullish(),
});

// --- Full operation responses -------------------------------------------------

export const siteSettingsResponse = z.object({
  generalSettings: z
    .object({
      title: nullableString,
      description: nullableString,
      url: nullableString,
    })
    .nullish(),
});

export const menuResponse = z.object({
  menu: z
    .object({
      name: nullableString,
      menuItems: z.object({ nodes: z.array(menuItemSchema) }).nullish(),
    })
    .nullish(),
});

export const postsPageResponse = z.object({
  posts: z
    .object({
      pageInfo: pageInfoSchema,
      nodes: z.array(postCardSchema),
    })
    .nullish(),
});

export const postResponse = z.object({ post: postSchema.nullish() });

export const postSlugsResponse = z.object({
  posts: z
    .object({
      nodes: z.array(z.object({ slug: z.string(), modified: nullableString })),
    })
    .nullish(),
});

export const pageResponse = z.object({ page: pageSchema.nullish() });

export const pageUrisResponse = z.object({
  pages: z
    .object({
      nodes: z.array(
        z.object({
          uri: nullableString,
          slug: z.string(),
          modified: nullableString,
          isFrontPage: z.boolean().nullish(),
          isPostsPage: z.boolean().nullish(),
        }),
      ),
    })
    .nullish(),
});

export const categoriesResponse = z.object({
  categories: z.object({ nodes: z.array(termSchema) }).nullish(),
});

export const categoryPostsResponse = z.object({
  category: z
    .object({
      databaseId: z.number(),
      name: nullableString,
      slug: z.string(),
      description: nullableString,
      count: z.number().nullish(),
      posts: z
        .object({ pageInfo: pageInfoSchema, nodes: z.array(postCardSchema) })
        .nullish(),
    })
    .nullish(),
});

export const relatedPostsResponse = z.object({
  posts: z.object({ nodes: z.array(postCardSchema) }).nullish(),
});

export type RawMedia = z.infer<typeof mediaSchema>;
export type RawAuthor = z.infer<typeof authorSchema>;
export type RawTerm = z.infer<typeof termSchema>;
export type RawPostCard = z.infer<typeof postCardSchema>;
export type RawPost = z.infer<typeof postSchema>;
export type RawPage = z.infer<typeof pageSchema>;
export type RawMenuItem = z.infer<typeof menuItemSchema>;
