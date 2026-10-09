import type { Metadata } from "next";
import Link from "next/link";

import { loadMorePosts } from "@/app/blog/actions";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { LoadMorePosts } from "@/components/blog/LoadMorePosts";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Eyebrow } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { getAllPostSlugs, getCategories, getPosts, POSTS_PER_PAGE } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Essays on closing the books, forecasting, and the financial plumbing behind growing companies.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default async function BlogIndexPage() {
  const [page, categories, slugs] = await Promise.all([
    getPosts({ first: POSTS_PER_PAGE }),
    getCategories(),
    getAllPostSlugs(),
  ]);

  const [featured, ...rest] = page.items;

  if (!featured) {
    return (
      <Section spacing="pageTop">
        <Container>
          <h1 className="text-display font-semibold text-ink">Blog</h1>
          <p className="mt-6 text-ink-dim">
            No published posts yet. Publish one in WordPress and it will appear
            here within the hour, or immediately if you trigger a revalidation.
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section spacing="pageTopFlush">
        <Container width="wide">
          <Eyebrow>Writing</Eyebrow>
          <h1 className="mt-5 max-w-2xl text-display font-semibold text-ink">
            Notes from the <span className="text-gradient">close</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-dim">
            Practical writing on reconciliation, forecasting and reporting — from
            the people building the tooling.
          </p>

          {/* Topic filters, driven entirely by WordPress categories. */}
          {categories.length > 0 ? (
            <nav aria-label="Filter by topic" className="mt-10">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <span
                    aria-current="page"
                    className="inline-flex rounded-full border border-accent-via/50 bg-accent/10 px-4 py-2 text-xs font-medium text-ink"
                  >
                    All
                  </span>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.href}
                      className="inline-flex items-center gap-2 rounded-full border border-edge px-4 py-2 text-xs text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
                    >
                      {category.name}
                      <span className="font-mono text-[0.625rem] text-ink-faint tabular">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="mt-12">
            <FeaturedPost post={featured} />
          </div>
        </Container>
      </Section>

      <Section spacing="continued">
        <Container width="wide">
          {rest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          <LoadMorePosts
            initial={page}
            loadMore={loadMorePosts}
            total={slugs.length}
          />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
