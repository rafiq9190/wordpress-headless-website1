"use client";

import { useState, useTransition } from "react";

import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/Button";
import type { Paginated, PostCard as PostCardData } from "@/lib/wp/types";

/**
 * Appends further pages of an archive below the server-rendered first page.
 *
 * Progressive enhancement: the first page is already in the HTML from the
 * server, so this component only ever adds to it. If JS never loads, the
 * archive still shows its first page and the button simply does nothing.
 *
 * `aria-live` on the status line means keyboard and screen-reader users are
 * told that more articles arrived, rather than silently gaining content.
 */
export function LoadMorePosts({
  initial,
  loadMore,
  total,
}: {
  initial: Paginated<PostCardData>;
  loadMore: (after: string) => Promise<Paginated<PostCardData>>;
  total?: number;
}) {
  const [extra, setExtra] = useState<PostCardData[]>([]);
  const [cursor, setCursor] = useState(initial.endCursor);
  const [hasNext, setHasNext] = useState(initial.hasNextPage);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const shown = initial.items.length + extra.length;

  function handleClick() {
    if (!cursor || pending) return;

    setError(null);
    startTransition(async () => {
      try {
        const next = await loadMore(cursor);
        setExtra((current) => [...current, ...next.items]);
        setCursor(next.endCursor);
        setHasNext(next.hasNextPage);
      } catch {
        setError("Could not load more articles. Please try again.");
      }
    });
  }

  return (
    <>
      {extra.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {extra.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      <div className="mt-14 flex flex-col items-center gap-4">
        <p aria-live="polite" className="font-mono text-xs text-ink-faint">
          {total ? `Showing ${shown} of ${total} articles` : `Showing ${shown} articles`}
        </p>

        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}

        {hasNext ? (
          <Button
            variant="outline"
            size="lg"
            onClick={handleClick}
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Loading…" : "Load more articles"}
          </Button>
        ) : (
          <p className="text-sm text-ink-faint">You have reached the end.</p>
        )}
      </div>
    </>
  );
}
