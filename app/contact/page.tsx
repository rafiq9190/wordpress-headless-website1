import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { Eyebrow } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { WpContent } from "@/components/wp/WpContent";
import { getPageByUri } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";

const WP_URI = "/contact/";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Ledgerline team about implementation, consolidation or pricing.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default async function ContactPage() {
  const page = await getPageByUri(WP_URI);

  return (
    <Section spacing="pageTop">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-display font-semibold text-ink">
              {page?.title ?? "Talk to us"}
            </h1>

            {/* Editable in wp-admin: whatever the Contact page says appears here. */}
            {page?.content ? (
              <WpContent html={page.content} className="mt-8 text-[1rem]" />
            ) : (
              <p className="mt-8 leading-relaxed text-ink-dim">
                Tell us what your close looks like today and we will tell you
                honestly whether Ledgerline helps.
              </p>
            )}

            <dl className="mt-10 flex flex-col gap-5 border-t border-edge pt-8">
              <div>
                <dt className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
                  Sales
                </dt>
                <dd className="mt-1 text-sm text-ink-soft">sales@ledgerline.example</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
                  Support
                </dt>
                <dd className="mt-1 text-sm text-ink-soft">help@ledgerline.example</dd>
              </div>
            </dl>
          </div>

          <Panel className="rounded-panel p-7 sm:p-9">
            <ContactForm />
          </Panel>
        </div>
      </Container>
    </Section>
  );
}
