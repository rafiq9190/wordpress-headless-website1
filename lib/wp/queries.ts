import {
  AUTHOR_FIELDS,
  MEDIA_FIELDS,
  PAGE_FIELDS,
  POST_CARD_FIELDS,
  POST_FIELDS,
  TERM_FIELDS,
} from "./fragments";

const CARD_DEPS = [MEDIA_FIELDS, AUTHOR_FIELDS, TERM_FIELDS, POST_CARD_FIELDS].join("\n");

export const GET_SITE_SETTINGS = /* GraphQL */ `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;

export const GET_MENU = /* GraphQL */ `
  query GetMenu($id: ID!) {
    menu(id: $id, idType: SLUG) {
      name
      menuItems(first: 100) {
        nodes {
          id
          label
          uri
          target
          parentId
          order
        }
      }
    }
  }
`;

export const GET_POSTS_PAGE = `
  query GetPostsPage($first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...PostCardFields
      }
    }
  }
  ${CARD_DEPS}
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFields
    }
  }
  ${CARD_DEPS}
  ${POST_FIELDS}
`;

export const GET_POST_SLUGS = /* GraphQL */ `
  query GetPostSlugs {
    posts(first: 200, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`;

export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      ...PageFields
    }
  }
  ${MEDIA_FIELDS}
  ${PAGE_FIELDS}
`;

export const GET_PAGE_URIS = /* GraphQL */ `
  query GetPageUris {
    pages(first: 200, where: { status: PUBLISH }) {
      nodes {
        uri
        slug
        modified
        isFrontPage
        isPostsPage
      }
    }
  }
`;

export const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories(first: 50, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
      nodes {
        databaseId
        name
        slug
        count
      }
    }
  }
`;

export const GET_CATEGORY_POSTS = `
  query GetCategoryPosts($slug: ID!, $first: Int!, $after: String) {
    category(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description
      count
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...PostCardFields
        }
      }
    }
  }
  ${CARD_DEPS}
`;

/** Posts in the same category as the current post, excluding it. */
export const GET_RELATED_POSTS = `
  query GetRelatedPosts($categoryIn: [ID], $notIn: [ID], $first: Int!) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        categoryIn: $categoryIn
        notIn: $notIn
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        ...PostCardFields
      }
    }
  }
  ${CARD_DEPS}
`;
