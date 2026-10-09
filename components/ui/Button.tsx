import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  /** Gradient fill. One per view, reserved for the primary action. */
  primary:
    "bg-[linear-gradient(100deg,var(--color-accent-from),var(--color-accent-via))] text-canvas shadow-[0_8px_30px_-8px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] hover:shadow-[0_14px_44px_-10px_color-mix(in_oklab,var(--color-accent)_85%,transparent)] hover:-translate-y-0.5",
  /** Frosted, for secondary actions on top of imagery or gradients. */
  glass:
    "glass glass-ring text-ink hover:bg-[color-mix(in_oklab,var(--color-surface)_75%,transparent)] hover:-translate-y-0.5",
  /** Text-only. */
  ghost: "text-ink-soft hover:text-ink hover:bg-white/5",
  /** Outlined, lower emphasis than glass. */
  outline:
    "border border-edge-strong text-ink hover:border-accent-via/60 hover:bg-white/5 hover:-translate-y-0.5",
} as const;

const sizes = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
} as const;

interface CommonProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}

type AnchorProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;

type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;

    // External links leave the app, so they can't go through next/link.
    if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Trailing arrow that nudges on hover. Pairs with Button. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1",
        className,
      )}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
