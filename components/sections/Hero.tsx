"use client";

import { Line, RevealLines } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AppPreview } from "@/components/visual/AppPreview";
import { useGsap } from "@/lib/motion/useGsap";
import { hero } from "@/content/marketing";

/**
 * Above-the-fold hero.
 *
 * The headline uses masked line-reveals; the surrounding copy and buttons fade
 * up on a short stagger. The product mock scales in, then parallaxes gently as
 * the visitor scrolls — all transform/opacity, so scrolling never triggers
 * layout. Everything is authored visible and animated *from* a hidden state, so
 * reduced-motion visitors get the finished composition immediately.
 */
export function Hero() {
  const ref = useGsap<HTMLDivElement>(({ root, gsap }) => {
    const fade = root.querySelectorAll<HTMLElement>("[data-hero-fade]");
    const frame = root.querySelector<HTMLElement>("[data-hero-frame]");

    gsap.fromTo(
      fade,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.45, immediateRender: true },
    );

    if (!frame) return;

    gsap.fromTo(
      frame,
      { opacity: 0, y: 48, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.55,
        ease: "power3.out",
        immediateRender: true,
      },
    );

    gsap.to(frame, {
      yPercent: -9,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <div ref={ref} className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Decorative grid behind the hero only. */}
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />

      <Container width="wide" className="flex flex-col items-center text-center">
        <div data-hero-fade>
          <Badge dot>{hero.badge}</Badge>
        </div>

        <h1 className="mt-7 max-w-4xl text-mega font-semibold text-ink">
          <RevealLines>
            {hero.headline.map((line, index) => (
              <Line key={line}>
                {index === hero.headline.length - 1 ? (
                  <span className="text-gradient">{line}</span>
                ) : (
                  line
                )}
              </Line>
            ))}
          </RevealLines>
        </h1>

        <p
          data-hero-fade
          className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-dim sm:text-xl"
        >
          {hero.subhead}
        </p>

        <div
          data-hero-fade
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href={hero.primaryCta.href} size="lg">
            {hero.primaryCta.label}
            <ArrowRight />
          </Button>
          <Button href={hero.secondaryCta.href} variant="glass" size="lg">
            {hero.secondaryCta.label}
          </Button>
        </div>

        <ul
          data-hero-fade
          className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-mono text-xs text-ink-faint"
        >
          {hero.proofPoints.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-1 rounded-full bg-accent-via" />
              {point}
            </li>
          ))}
        </ul>

        <div
          data-hero-frame
          className="mt-16 w-full max-w-3xl will-change-transform"
        >
          <AppPreview />
        </div>
      </Container>
    </div>
  );
}
