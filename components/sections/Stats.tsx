"use client";

import { Container, Section } from "@/components/ui/Container";
import { stats } from "@/content/marketing";
import { useGsap } from "@/lib/motion/useGsap";

/**
 * Count-up statistics band.
 *
 * The final values are rendered in the HTML, so they are present for search
 * engines and for anyone with motion reduced or JS disabled. GSAP overwrites
 * the text while counting and lands exactly on the authored number — the
 * animation is additive, never the source of the content.
 */
export function Stats() {
  const ref = useGsap<HTMLDivElement>(({ root, gsap }) => {
    const nodes = root.querySelectorAll<HTMLElement>("[data-count]");

    nodes.forEach((node) => {
      const target = Number(node.dataset["count"]);
      const precision = Number(node.dataset["precision"] ?? 0);
      if (!Number.isFinite(target)) return;

      const counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = counter.value.toFixed(precision);
        },
        scrollTrigger: { trigger: node, start: "top 85%", once: true },
      });
    });
  });

  return (
    <Section spacing="tight">
      <Container width="wide">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-edge py-12 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {stat.prefix ? (
                  <span className="text-ink-dim">{stat.prefix}</span>
                ) : null}
                <span
                  data-count={stat.value}
                  data-precision={stat.precision ?? 0}
                  className="tabular"
                >
                  {stat.value.toFixed(stat.precision ?? 0)}
                </span>
                <span className="text-gradient">{stat.suffix}</span>
              </p>
              <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-snug text-ink-dim">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
