import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

const widths = {
  prose: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  as: Tag = "div",
  width = "default",
  className,
  children,
}: {
  as?: ElementType;
  width?: keyof typeof widths;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8", widths[width], className)}>
      {children}
    </Tag>
  );
}

/**
 * Vertical rhythm for page sections.
 *
 * Spacing is a named prop rather than something you pass through `className`,
 * because the responsive default cannot be overridden by a base-only utility:
 * `className="pb-0"` against a `sm:py-28` default still leaves 7rem of padding
 * at every breakpoint above `sm`. That produced ~220px of dead space between
 * sections. Naming the combinations makes the whole class of bug impossible.
 */
const spacings = {
  default: "py-20 sm:py-28",
  tight: "py-12 sm:py-16",
  /** First section on a page — clears the fixed header. */
  pageTop: "pt-32 pb-20 sm:pt-40 sm:pb-28",
  /** First section that flows straight into the next one. */
  pageTopFlush: "pt-32 pb-0 sm:pt-40 sm:pb-0",
  /** First section with only a small gap below (a header above an image). */
  pageTopTight: "pt-32 pb-8 sm:pt-40 sm:pb-10",
  /** Continues from a flush section above, with a modest gap. */
  continued: "pt-12 pb-20 sm:pt-14 sm:pb-28",
  /** Continues from the section above with no gap at all. */
  continuedFlush: "pt-0 pb-20 sm:pb-28",
  /** Centred full-page states (404, error). */
  center: "pt-40 pb-32",
  none: "py-0",
} as const;

export function Section({
  spacing = "default",
  className,
  children,
  id,
}: {
  spacing?: keyof typeof spacings;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative", spacings[spacing], className)}>
      {children}
    </section>
  );
}
