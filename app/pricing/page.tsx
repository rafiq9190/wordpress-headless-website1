import type { Metadata } from "next";

import { PricingCards } from "@/components/pricing/PricingCards";
import { PricingTable } from "@/components/pricing/PricingTable";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPageByUri } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";

const WP_URI = "/pricing/";

/**
 * Title and description come from the WordPress `pricing` page, so marketing
 * can retitle it in wp-admin. The page *body* is intentionally not rendered:
 * on the live install it is a theme-built pricing layout with hardcoded light
 * colours that duplicates the tiers below.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByUri(WP_URI);

  return {
    title: page?.title ?? "Pricing",
    description:
      "Transparent per-editor pricing. Start free, upgrade when the board starts asking for a pack.",
    alternates: { canonical: absoluteUrl("/pricing") },
  };
}

export default async function PricingPage() {
  const page = await getPageByUri(WP_URI);

  return (
    <>
      <Section spacing="pageTop">
        <Container width="wide" className="flex flex-col items-center text-center">
          <Badge dot>14-day trial on Growth · no card</Badge>
          <h1 className="mt-7 max-w-3xl text-display font-semibold text-ink">
            {page?.title ?? "Pricing"} that stays legible as you grow
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
            One price per editor. Everyone who only reads the numbers is free,
            because charging for viewers is how finance tools end up with one login
            and a shared password.
          </p>
        </Container>

        <Container width="wide">
          <PricingCards className="mt-16" />
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          <SectionHeading
            eyebrow="Compare"
            title="Everything, side by side"
            align="left"
          />
          <div className="mt-10">
            <PricingTable />
          </div>
        </Container>
      </Section>

      <Faq id="pricing-faq" />
      <CtaBand />
    </>
  );
}
