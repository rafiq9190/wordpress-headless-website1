"use client";

import type { ReactNode } from "react";

import { useGsap } from "@/lib/motion/useGsap";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered fade-and-rise for a block, or for its direct children when
 * `stagger` is set.
 *
 * Animates only `opacity` and `y` (a transform) — both compositor properties,
 * so no layout is recalculated while scrolling. The markup renders fully
 * visible; GSAP applies the hidden start state itself via `fromTo`, which means
 * content is never stuck invisible if JS fails or motion is reduced.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  y?: number;
}) {
  const ref = useGsap(({ root, gsap }) => {
    const targets = stagger ? Array.from(root.children) : root;

    gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.09 : 0,
        immediateRender: true,
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Headline line-reveal: each line slides up from behind its own clip mask.
 * Expects children wrapped in `.reveal-line` elements.
 */
export function RevealLines({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useGsap<HTMLSpanElement>(({ root, gsap }) => {
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    if (lines.length === 0) return;

    gsap.fromTo(
      lines,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.1,
        delay,
        ease: "power4.out",
        stagger: 0.11,
        immediateRender: true,
      },
    );
  });

  return (
    <span ref={ref} className={cn("block", className)}>
      {children}
    </span>
  );
}

/** One masked line inside RevealLines. */
export function Line({ children }: { children: ReactNode }) {
  return (
    <span className="reveal-line">
      <span data-line className="block">
        {children}
      </span>
    </span>
  );
}
