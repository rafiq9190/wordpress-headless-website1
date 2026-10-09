/** Clean domain types. Components never see WPGraphQL's `.node` / `.nodes` shape. */

export interface WpImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface WpAuthor {
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  href: string;
  count: number;
}

export interface PostCard {
  id: number;
  slug: string;
  href: string;
  /** Plain text, entities already decoded. */
  title: string;
  /** Plain text, entities decoded and WordPress's "Read more" tail removed. */
  excerpt: string;
  date: string;
  image: WpImage | null;
  author: WpAuthor | null;
  categories: WpTerm[];
}

export interface Post extends PostCard {
  /** Raw Gutenberg HTML — render through `<WpContent>`, never directly. */
  content: string;
  modified: string;
  tags: { name: string; slug: string }[];
  readingMinutes: number;
}

export interface WpPage {
  id: number;
  slug: string;
  uri: string;
  href: string;
  title: string;
  content: string;
  date: string;
  modified: string;
  isFrontPage: boolean;
  isPostsPage: boolean;
  image: WpImage | null;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  children: MenuItem[];
}

export interface CategoryArchive {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  count: number;
  posts: Paginated<PostCard>;
}

export interface Paginated<T> {
  items: T[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface SiteSettings {
  title: string;
  description: string;
  url: string;
}
