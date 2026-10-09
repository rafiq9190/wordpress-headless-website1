"use client";

import { useState } from "react";

import { ArrowRight, Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { plans } from "@/content/marketing";
import { cn } from "@/lib/utils";

export type BillingPeriod = "monthly" | "annual";

/**
 * Plan cards with a monthly/annual switch.
 *
 * The switch is a real `role="radiogroup"` with two radio buttons rather than a
 * styled checkbox, because "monthly or annual" is a choice between two labelled
 * options — a checkbox would announce as "annual, checked" with no indication
 * of what unchecking means.
 */
export function PricingCards({ className }: { className?: string }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div className={className}>
      <BillingToggle period={period} onChange={setPeriod} />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} period={period} />
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-xs text-ink-faint">
        Prices in USD, per editor. Viewers are always free on Growth and Scale.
      </p>
    </div>
  );
}

export function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}) {
  const options: { value: BillingPeriod; label: string; hint?: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual", hint: "Save 20%" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="glass glass-ring mx-auto flex w-fit items-center gap-1 rounded-full p-1"
    >
      {options.map((option) => {
        const selected = period === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-2 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
              selected
                ? "bg-[linear-gradient(100deg,var(--color-accent-from),var(--color-accent-via))] text-canvas"
                : "text-ink-dim hover:text-ink",
            )}
          >
            {option.label}
            {option.hint ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[0.625rem]",
                  selected ? "bg-canvas/20 text-canvas" : "bg-accent/15 text-accent-via",
                )}
              >
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function PlanCard({
  plan,
  period,
}: {
  plan: (typeof plans)[number];
  period: BillingPeriod;
}) {
  const price = period === "monthly" ? plan.monthly : plan.annual;
  const headingId = `plan-${plan.id}`;

  return (
    <GlassCard
      className={cn(
        "flex h-full flex-col rounded-panel p-7 sm:p-8",
        plan.featured && "shadow-glow",
      )}
    >
      <div className="flex h-full flex-col" aria-labelledby={headingId}>
        <div className="flex items-center justify-between gap-3">
          <h3 id={headingId} className="font-display text-lg font-semibold text-ink">
            {plan.name}
          </h3>
          {plan.featured ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[0.625rem] tracking-wide text-accent-via uppercase">
              Most chosen
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-ink-dim">{plan.tagline}</p>

        <p className="mt-7 flex items-baseline gap-1.5">
          {price === null ? (
            <span className="font-display text-4xl font-semibold tracking-tight text-ink">
              {plan.customLabel ?? "Custom"}
            </span>
          ) : (
            <>
              <span className="font-display text-4xl font-semibold tracking-tight text-ink tabular">
                ${price}
              </span>
              <span className="text-sm text-ink-dim">
                {price === 0 ? "forever" : "/ editor / mo"}
              </span>
            </>
          )}
        </p>
        {price !== null && price > 0 && period === "annual" ? (
          <p className="mt-1 font-mono text-[0.6875rem] text-ink-faint">
            Billed annually at ${price * 12}
          </p>
        ) : null}

        <ul className="mt-7 flex flex-col gap-3 border-t border-edge pt-7">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm text-ink-soft">
              <svg
                viewBox="0 0 16 16"
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8.5 6.5 11.5l6-7"
                  stroke="var(--color-accent-via)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          href={plan.cta.href}
          variant={plan.featured ? "primary" : "outline"}
          size="lg"
          className="mt-8 w-full"
        >
          {plan.cta.label}
          <ArrowRight />
        </Button>
      </div>
    </GlassCard>
  );
}
