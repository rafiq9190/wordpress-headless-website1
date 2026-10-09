"use client";

import type { ElementType, MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Frosted panel with a hairline gradient border and an optional cursor
 * spotlight.
 *
 * The spotlight writes two CSS custom properties on pointer move and lets CSS
 * paint the gradient. No React state is involved, so moving the mouse never
 * triggers a re-render — the whole effect costs one style write per frame.
 */
export function GlassCard({
  as: Tag = "div",
  spotlight = true,
  className,
  children,
}: {
  as?: ElementType;
  spotlight?: boolean;
  className?: string;
  children: ReactNode;
}) {
  function handleMove(event: MouseEvent<HTMLElement>) {
    if (!spotlight) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    target.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <Tag
      onMouseMove={handleMove}
      className={cn(
        "glass glass-ring relative overflow-hidden rounded-card",
        spotlight && "spotlight",
        className,
      )}
    >
      {/* z-2 lifts content above the glass-ring (z-1) and spotlight (z-0);
          h-full lets cards in a grid stretch their content to equal height. */}
      <div className="relative z-2 h-full">{children}</div>
    </Tag>
  );
}
