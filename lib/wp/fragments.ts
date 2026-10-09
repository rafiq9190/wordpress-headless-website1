/** Reusable GraphQL fragments, kept in one place so field sets stay consistent. */

export const MEDIA_FIELDS = /* GraphQL */ `
  fragment MediaFields on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

export const AUTHOR_FIELDS = /* GraphQL */ `
  fragment AuthorFields on User {
    name
    slug
    description
    avatar {
      url
    }
  }
`;

export const TERM_FIELDS = /* GraphQL */ `
  fragment TermFields on Category {
    databaseId
    name
    slug
  }
`;

/** Everything a card in an archive grid needs — no `content`, to keep payloads small. */
export const POST_CARD_FIELDS = /* GraphQL */ `
  fragment PostCardFields on Post {
    databaseId
    slug
    uri
    title
    excerpt
    date
    featuredImage {
      node {
        ...MediaFields
      }
    }
    author {
      node {
        ...AuthorFields
      }
    }
    categories(first: 3) {
      nodes {
        ...TermFields
      }
    }
  }
`;

/** Full single-post payload. */
export const POST_FIELDS = /* GraphQL */ `
  fragment PostFields on Post {
    ...PostCardFields
    content
    modified
    tags(first: 10) {
      nodes {
        name
        slug
      }
    }
  }
`;

export const PAGE_FIELDS = /* GraphQL */ `
  fragment PageFields on Page {
    databaseId
    slug
    uri
    title
    content
    date
    modified
    isFrontPage
    isPostsPage
    featuredImage {
      node {
        ...MediaFields
      }
    }
  }
`;
