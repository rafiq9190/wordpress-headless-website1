import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal strip.
 *
 * The children are rendered twice and translated by exactly -50%, which is what
 * makes the loop seamless. Pure CSS animation — no JS, no measurement, and it
 * stops under `prefers-reduced-motion` via the global base layer.
 */
export function Marquee({
  children,
  className,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
    >
      {/* Two identical halves, so translating the track by exactly -50% loops
          seamlessly regardless of content width. */}
      <div
        className={cn(
          "flex min-w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        <div className="flex items-center gap-14 pr-14">{children}</div>
        {/* Decorative duplicate — hidden so screen readers read the list once. */}
        <div aria-hidden="true" className="flex items-center gap-14 pr-14">
          {children}
        </div>
      </div>
    </div>
  );
}
