import Image from "next/image";
import Link from "next/link";

import { Panel } from "@/components/ui/Panel";
import { cn, formatDate } from "@/lib/utils";
import type { PostCard as PostCardData } from "@/lib/wp/types";

/**
 * Archive card. Server Component — an archive grid ships no JavaScript.
 *
 * The whole card is one link, with the heading as the accessible name and the
 * surrounding tile made clickable by a stretched overlay, so there is a single
 * tab stop per card rather than three.
 */
export function PostCard({
  post,
  priority = false,
  className,
}: {
  post: PostCardData;
  priority?: boolean;
  className?: string;
}) {
  const category = post.categories[0];

  return (
    <Panel
      as="article"
      className={cn(
        "group flex flex-col transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="dot-grid absolute inset-0 opacity-60"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-canvas)_85%,transparent),transparent_55%)]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
          {category ? (
            <span className="text-accent-via">{category.name}</span>
          ) : null}
          <time dateTime={post.date} className="text-ink-faint">
            {formatDate(post.date)}
          </time>
        </div>

        <h3 className="font-display text-lg leading-snug font-semibold text-ink">
          <Link href={post.href} className="transition-colors hover:text-accent-via">
            {/* Stretched hit area: makes the tile clickable without extra tab stops. */}
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-dim">
            {post.excerpt}
          </p>
        ) : null}

        {post.author ? (
          <p className="mt-auto pt-3 text-xs text-ink-faint">By {post.author.name}</p>
        ) : null}
      </div>
    </Panel>
  );
}
