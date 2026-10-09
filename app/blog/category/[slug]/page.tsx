import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { loadMoreCategoryPosts } from "@/app/blog/actions";
import { LoadMorePosts } from "@/components/blog/LoadMorePosts";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Eyebrow } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { getCategories, getCategoryArchive, POSTS_PER_PAGE } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";
import { stripHtml } from "@/lib/utils";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const archive = await getCategoryArchive(slug);

  if (!archive) {
    return { title: "Topic not found", robots: { index: false, follow: false } };
  }

  return {
    title: archive.name,
    description:
      archive.description
        ? stripHtml(archive.description)
        : `Articles filed under ${archive.name}.`,
    alternates: { canonical: absoluteUrl(`/blog/category/${slug}`) },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;

  const [archive, categories] = await Promise.all([
    getCategoryArchive(slug, { first: POSTS_PER_PAGE }),
    getCategories(),
  ]);

  if (!archive) notFound();

  return (
    <>
      <Section spacing="pageTopFlush">
        <Container width="wide">
          <Eyebrow>Topic</Eyebrow>
          <h1 className="mt-5 text-display font-semibold text-ink">
            {archive.name}
          </h1>
          <p className="mt-4 text-ink-dim">
            {archive.count} {archive.count === 1 ? "article" : "articles"}
            {archive.description ? ` · ${stripHtml(archive.description)}` : ""}
          </p>

          <nav aria-label="Filter by topic" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/blog"
                  className="inline-flex rounded-full border border-edge px-4 py-2 text-xs text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
                >
                  All
                </Link>
              </li>
              {categories.map((category) => {
                const current = category.slug === slug;
                return (
                  <li key={category.id}>
                    <Link
                      href={category.href}
                      aria-current={current ? "page" : undefined}
                      className={
                        current
                          ? "inline-flex rounded-full border border-accent-via/50 bg-accent/10 px-4 py-2 text-xs font-medium text-ink"
                          : "inline-flex rounded-full border border-edge px-4 py-2 text-xs text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
                      }
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </Section>

      <Section spacing="continued">
        <Container width="wide">
          {archive.posts.items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archive.posts.items.map((post, index) => (
                <PostCard key={post.id} post={post} priority={index < 3} />
              ))}
            </div>
          ) : (
            <p className="text-ink-dim">No articles in this topic yet.</p>
          )}

          <LoadMorePosts
            initial={archive.posts}
            loadMore={loadMoreCategoryPosts.bind(null, slug)}
            total={archive.count}
          />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
