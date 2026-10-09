import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";

export function CtaBand() {
  return (
    <Section>
      <Container width="wide">
        <Reveal>
          <Panel className="relative overflow-hidden rounded-panel px-7 py-14 text-center sm:px-14 sm:py-20">
            {/* Local glow, distinct from the page-wide aurora. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-accent)_38%,transparent),transparent_70%)] blur-2xl"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-display font-semibold text-ink">
                Close your next month in{" "}
                <span className="text-gradient">nine days</span>, not three weeks.
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-dim">
                Connect your accounts and Ledgerline backfills two years of history
                before your coffee goes cold. No card, no sales call.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/pricing" size="lg">
                  Start free
                  <ArrowRight />
                </Button>
                <Button href="/contact" variant="glass" size="lg">
                  Talk to sales
                </Button>
              </div>
            </div>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
