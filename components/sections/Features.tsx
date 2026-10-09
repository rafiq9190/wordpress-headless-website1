"use client";

import { useState } from "react";

import { Eyebrow } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/content/marketing";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { useGsap } from "@/lib/motion/useGsap";
import { cn } from "@/lib/utils";

/**
 * Pinned feature walkthrough.
 *
 * On large screens the right-hand visual pins while the copy columns scroll
 * past, and the active visual swaps as each block reaches the viewport centre.
 * Below `lg` the pin is removed entirely and the layout falls back to a plain
 * stack — a pinned panel on a short screen traps the scroll.
 *
 * `gsap.matchMedia` owns the breakpoint so crossing it at runtime rebuilds the
 * triggers instead of leaving a stale pin behind.
 */
export function Features() {
  const [active, setActive] = useState(0);

  const ref = useGsap<HTMLDivElement>(({ root, gsap }) => {
    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      const visual = root.querySelector<HTMLElement>("[data-feature-visual]");
      const track = root.querySelector<HTMLElement>("[data-feature-track]");
      if (!visual || !track) return;

      ScrollTrigger.create({
        trigger: track,
        start: "top 22%",
        end: "bottom 78%",
        pin: visual,
        pinSpacing: false,
      });
    });

    // Active-block detection runs at every width; only the pin is conditional.
    const blocks = root.querySelectorAll<HTMLElement>("[data-feature-block]");
    blocks.forEach((block, index) => {
      ScrollTrigger.create({
        trigger: block,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) setActive(index);
        },
      });
    });

    return () => media.revert();
  });

  return (
    <Section id="features">
      <Container width="wide">
        <SectionHeading
          eyebrow="What you get"
          title={
            <>
              Three systems that usually fight.{" "}
              <span className="text-gradient">One model.</span>
            </>
          }
          description="Ledgerline replaces the spreadsheet seam between your ledger, your forecast and your board pack."
        />

        <div ref={ref} className="mt-16 lg:grid lg:grid-cols-2 lg:gap-16">
          <div data-feature-track className="flex flex-col gap-16 lg:gap-32">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                data-feature-block
                className={cn(
                  "transition-opacity duration-500",
                  // Dim inactive copy on desktop only; on mobile everything is read in sequence.
                  "lg:opacity-40",
                  active === index && "lg:opacity-100",
                )}
              >
                <Eyebrow>
                  {String(index + 1).padStart(2, "0")} · {feature.eyebrow}
                </Eyebrow>
                <h3 className="mt-4 font-display text-2xl leading-tight font-semibold text-ink sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-relaxed text-ink-dim">
                  {feature.description}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-ink-soft">
                      <Check />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Mobile gets the matching visual inline. */}
                <div className="mt-8 lg:hidden">
                  <FeatureVisual index={index} />
                </div>
              </div>
            ))}
          </div>

          <div
            data-feature-visual
            className="hidden h-fit lg:block"
            aria-hidden="true"
          >
            <FeatureVisual index={active} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="7.25" stroke="var(--color-accent-via)" strokeOpacity="0.4" fill="none" />
      <path
        d="M5 8.25 7 10.25l4-4.5"
        stroke="var(--color-accent-via)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Abstract diagram per feature. Drawn with tokens rather than screenshotted so
 * it stays sharp, themeable and free of image weight.
 */
function FeatureVisual({ index }: { index: number }) {
  const feature = features[index] ?? features[0];
  if (!feature) return null;

  return (
    <Panel className="rounded-panel p-6 sm:p-8">
      <p className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
        {feature.eyebrow}
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, row) => {
          // Deterministic widths: no randomness, so SSR and client agree.
          const width = 94 - ((row * 13 + index * 7) % 46);
          const highlighted = row === (index + 1) % 6;

          return (
            <div key={row} className="flex items-center gap-3">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  highlighted ? "bg-accent-via" : "bg-edge-strong",
                )}
              />
              <span
                className={cn(
                  "h-2 rounded-full",
                  highlighted
                    ? "bg-[linear-gradient(90deg,var(--color-accent-from),var(--color-accent-via))]"
                    : "bg-surface-soft",
                )}
                style={{ width: `${width}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-edge pt-6">
        {feature.bullets.map((bullet, slot) => (
          <div key={bullet}>
            <p className="font-display text-lg font-semibold text-ink tabular">
              {String((index + 1) * (slot + 3) * 7).padStart(2, "0")}
            </p>
            <p className="mt-1 font-mono text-[0.5625rem] tracking-[0.12em] text-ink-faint uppercase">
              {bullet.split(" ").slice(0, 2).join(" ")}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
