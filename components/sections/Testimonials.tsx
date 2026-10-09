"use client";

import { Container, Section } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/content/marketing";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { useGsap } from "@/lib/motion/useGsap";

/**
 * Testimonials as a horizontal track driven by vertical scroll.
 *
 * Desktop only: the section pins and the track translates sideways as the
 * visitor scrolls down. On small screens — and whenever motion is reduced — the
 * same markup is a native horizontal scroll area with snap points, which is
 * both simpler and what touch users expect.
 *
 * The track is a real scroll container either way, so keyboard users can reach
 * every card with arrow keys.
 */
export function Testimonials() {
  const ref = useGsap<HTMLDivElement>(({ root, gsap }) => {
    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      const track = root.querySelector<HTMLElement>("[data-track]");
      const viewport = root.querySelector<HTMLElement>("[data-viewport]");
      if (!track || !viewport) return;

      const distance = () => track.scrollWidth - viewport.clientWidth;
      if (distance() <= 0) return;

      // Native overflow must be off while GSAP owns the horizontal position,
      // otherwise the two fight and the track jitters.
      viewport.style.overflowX = "hidden";

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 15%",
          end: () => `+=${distance() + 240}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        viewport.style.overflowX = "";
        tween.scrollTrigger?.kill();
        tween.kill();
        ScrollTrigger.refresh();
      };
    });

    return () => media.revert();
  });

  return (
    <Section className="overflow-hidden">
      <div ref={ref}>
        <Container width="wide">
          <SectionHeading
            eyebrow="Customer stories"
            title="Finance teams who stopped dreading the third week"
            align="left"
          />
        </Container>

        <div
          data-viewport
          className="mt-12 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul
            data-track
            className="flex w-max gap-6 px-5 will-change-transform sm:px-8"
          >
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.name}
                className="w-[min(85vw,30rem)] shrink-0 snap-center"
              >
                <GlassCard className="h-full rounded-panel p-7 sm:p-9">
                  {/* figure wraps the quote and its attribution, so the
                      citation is programmatically tied to the blockquote. */}
                  <figure className="flex h-full flex-col justify-between gap-8">
                    <blockquote className="font-display text-lg leading-relaxed text-ink-soft sm:text-xl">
                      “{testimonial.quote}”
                    </blockquote>

                    <figcaption className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-from),var(--color-accent-via))] font-mono text-xs font-semibold text-canvas"
                      >
                        {testimonial.initials}
                      </span>
                      <span className="text-sm">
                        <span className="block font-medium text-ink">
                          {testimonial.name}
                        </span>
                        <span className="block text-ink-dim">
                          {testimonial.role}, {testimonial.company}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
