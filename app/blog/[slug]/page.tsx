import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/PostCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { CtaBand } from "@/components/sections/CtaBand";
import { ArrowRight, Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { WpContent } from "@/components/wp/WpContent";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";

/**
 * Pre-render every published post at build time.
 *
 * The install has 9 posts, so this is cheap and every article is static on
 * first request. New posts added later still work — they fall through to
 * on-demand rendering and are cached from then on.
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Partial prerendering commits a 200 before this lookup resolves, so a
  // missing slug is a soft 404. `noindex` keeps it out of search results.
  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }

  const description = post.excerpt || truncate(stripHtml(post.content), 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: absoluteUrl(post.href) },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author ? [post.author.name] : undefined,
      images: post.image ? [{ url: post.image.url }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const category = post.categories[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    description: post.excerpt,
    image: post.image ? [post.image.url] : undefined,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Ledgerline",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(post.href),
    },
  };

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        // Structured data: serialised server-side, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Section spacing="pageTopTight">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
                <li>
                  <Link href="/blog" className="text-ink-faint hover:text-ink">
                    Blog
                  </Link>
                </li>
                {category ? (
                  <>
                    <li aria-hidden="true" className="text-ink-faint">
                      /
                    </li>
                    <li>
                      <Link
                        href={category.href}
                        className="text-accent-via hover:text-ink"
                      >
                        {category.name}
                      </Link>
                    </li>
                  </>
                ) : null}
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-dim">
              {post.author ? (
                <span className="flex items-center gap-2.5">
                  {post.author.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full border border-edge"
                    />
                  ) : null}
                  <span className="text-ink-soft">{post.author.name}</span>
                </span>
              ) : null}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-ink-faint">
                {post.readingMinutes} min read
              </span>
            </div>
          </Container>
        </Section>

        {post.image ? (
          <Container width="wide">
            <div className="relative aspect-[16/8] overflow-hidden rounded-panel border border-edge">
              <Image
                src={post.image.url}
                alt={post.image.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Container>
        ) : null}

        <Section spacing="continued">
          <Container>
            {/* All Gutenberg output is sanitised and re-themed here. */}
            <WpContent html={post.content} />

            {post.tags.length > 0 ? (
              <ul className="mt-14 flex flex-wrap gap-2 border-t border-edge pt-8">
                {post.tags.map((tag) => (
                  <li
                    key={tag.slug}
                    className="rounded-full border border-edge px-3 py-1.5 font-mono text-[0.6875rem] text-ink-dim"
                  >
                    #{tag.name}
                  </li>
                ))}
              </ul>
            ) : null}

            {post.author ? (
              <Panel className="mt-12 rounded-panel p-7">
                <div className="flex flex-wrap items-start gap-5">
                  {post.author.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="size-14 rounded-full border border-edge"
                    />
                  ) : null}
                  <div className="flex-1">
                    <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
                      Written by
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-ink">
                      {post.author.name}
                    </p>
                    {post.author.bio ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                        {post.author.bio}
                      </p>
                    ) : null}
                  </div>
                  <Button href="/blog" variant="outline" size="sm">
                    More articles
                    <ArrowRight />
                  </Button>
                </div>
              </Panel>
            ) : null}
          </Container>
        </Section>
      </article>

      {related.length > 0 ? (
        <Section spacing="continuedFlush">
          <Container width="wide">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
