import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPosts } from "@/lib/wp/api";

/**
 * Latest WordPress posts on the marketing home page.
 *
 * Fetches its own data instead of receiving it as a prop, so it can be wrapped
 * in its own Suspense boundary — the hero and features stream immediately even
 * if WordPress is slow to answer.
 */
export async function LatestPosts() {
  const { items } = await getPosts({ first: 3 });
  if (items.length === 0) return null;

  return (
    <Section>
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="From the blog"
            title="Written by people who close the books"
            align="left"
          />
          <Button href="/blog" variant="ghost" size="sm">
            All articles
            <ArrowRight />
          </Button>
        </div>

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/** Matches the grid's footprint while the posts stream in. */
export function LatestPostsSkeleton() {
  return (
    <Section>
      <Container width="wide">
        <div className="h-10 w-64 rounded-full bg-surface-soft/60" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="glass glass-ring h-80 animate-pulse rounded-card"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
