import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  dot = false,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "glass glass-ring inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink-soft",
        className,
      )}
    >
      {dot ? (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent-via" />
          <span className="relative size-1.5 rounded-full bg-accent-via" />
        </span>
      ) : null}
      <span className="relative z-2">{children}</span>
    </span>
  );
}

/** Small uppercase label used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs tracking-[0.22em] text-ink-dim uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
