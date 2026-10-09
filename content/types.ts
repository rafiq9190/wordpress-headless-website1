/**
 * Shapes for the marketing copy that has no home in WordPress.
 *
 * The live WordPress install exposes only `post`, `page` and `attachment` —
 * there are no custom post types for features or pricing tiers. Rather than
 * invent throwaway mocks, this content is authored here as typed data.
 *
 * Each interface is intentionally flat and serialisable, so a later move to
 * WordPress (ACF fields, or a `feature`/`plan` CPT) only needs a loader that
 * returns these same shapes — no component changes.
 */

export interface HeroContent {
  badge: string;
  headline: string[];
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  proofPoints: string[];
}

export interface Feature {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface Stat {
  value: number;
  /** Rendered after the counted value, e.g. "%" or "h". */
  suffix: string;
  prefix?: string;
  label: string;
  /** Decimal places to show while counting. */
  precision?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthly: number | null;
  annual: number | null;
  /** Shown instead of a number when `monthly` is null. */
  customLabel?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string | boolean>;
}
