import Image from "next/image";

import { WpContent } from "@/components/wp/WpContent";
import { Container, Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Badge";
import type { WpPage } from "@/lib/wp/types";

/**
 * Shared presentation for any WordPress page.
 *
 * Used by `/about` and by the `[...uri]` catch-all, so a page added in wp-admin
 * renders in the site design with no new code.
 */
export function WpPageView({
  page,
  eyebrow = "Company",
}: {
  page: WpPage;
  eyebrow?: string;
}) {
  return (
    <>
      <Section spacing="pageTopTight">
        <Container>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-display font-semibold text-ink">{page.title}</h1>
          <div aria-hidden="true" className="hairline mt-10" />
        </Container>

        {page.image ? (
          <Container className="mt-10">
            <div className="relative aspect-[16/7] overflow-hidden rounded-panel border border-edge">
              <Image
                src={page.image.url}
                alt={page.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </Container>
        ) : null}
      </Section>

      <Section spacing="continuedFlush">
        <Container>
          <WpContent html={page.content} />
        </Container>
      </Section>
    </>
  );
}
