"use client";

import { useEffect, useRef } from "react";

/**
 * Gradient progress bar for article pages.
 *
 * Writes `scaleX` directly on the element inside a rAF-throttled scroll
 * handler — no React state, so scrolling never re-renders the tree. Hidden from
 * assistive tech because scroll position is not information a screen reader
 * needs narrated.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-accent-from),var(--color-accent-via),var(--color-accent-to))]"
      />
    </div>
  );
}
