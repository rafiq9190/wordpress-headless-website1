import { cn } from "@/lib/utils";

/**
 * Wordmark. The glyph is an ascending ledger line drawn as a path, so it scales
 * crisply and inherits the accent gradient rather than shipping an image.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 28" className="size-7 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="logo-stroke" x1="0" y1="28" x2="28" y2="0">
            <stop offset="0%" stopColor="var(--color-accent-from)" />
            <stop offset="55%" stopColor="var(--color-accent-via)" />
            <stop offset="100%" stopColor="var(--color-accent-to)" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="8"
          fill="none"
          stroke="url(#logo-stroke)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path
          d="M6.5 19.5 11 14l3.5 3 6-9"
          fill="none"
          stroke="url(#logo-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20.5" cy="8" r="2" fill="var(--color-accent-to)" />
      </svg>
      <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
        Ledgerline
      </span>
    </span>
  );
}
