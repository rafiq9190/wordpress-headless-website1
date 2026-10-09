import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Static frosted panel — the Server Component counterpart to GlassCard.
 *
 * Most glass surfaces (post cards, stat tiles, footers) never need the cursor
 * spotlight. Using this instead of GlassCard keeps them out of the client
 * bundle entirely; an archive grid of 9 cards ships zero JS.
 */
export function Panel({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn("glass glass-ring relative overflow-hidden rounded-card", className)}
    >
      {children}
    </Tag>
  );
}
