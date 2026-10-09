import { PricingCards } from "@/components/pricing/PricingCards";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PricingPreview() {
  return (
    <Section id="pricing">
      <Container width="wide">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Priced per editor. <span className="text-gradient">Viewers are free.</span>
            </>
          }
          description="Start on the free tier and move up when the board starts asking for a pack."
        />
        <PricingCards className="mt-12" />
      </Container>
    </Section>
  );
}
