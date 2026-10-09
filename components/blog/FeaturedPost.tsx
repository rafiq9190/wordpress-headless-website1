import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { formatDate } from "@/lib/utils";
import type { PostCard as PostCardData } from "@/lib/wp/types";

/** Lead article on the blog index: wider, with the excerpt given room. */
export function FeaturedPost({ post }: { post: PostCardData }) {
  const category = post.categories[0];

  return (
    <Panel as="article" className="group grid lg:grid-cols-2">
      <div className="relative aspect-[16/11] overflow-hidden bg-surface-soft lg:aspect-auto lg:min-h-[22rem]">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-60" />
        )}
      </div>

      <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
        <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent-via">
            Latest
          </span>
          {category ? <span className="text-ink-dim">{category.name}</span> : null}
          <time dateTime={post.date} className="text-ink-faint">
            {formatDate(post.date)}
          </time>
        </div>

        <h2 className="font-display text-2xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-3xl">
          <Link href={post.href} className="transition-colors hover:text-accent-via">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="line-clamp-4 leading-relaxed text-ink-dim">{post.excerpt}</p>
        ) : null}

        <p className="inline-flex items-center gap-2 text-sm font-medium text-accent-via">
          Read the article
          <ArrowRight />
        </p>
      </div>
    </Panel>
  );
}
