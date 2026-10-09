import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/content/marketing";

export function Faq({ id = "faq" }: { id?: string }) {
  return (
    <Section id={id}>
      <Container>
        <SectionHeading
          eyebrow="Questions"
          title="The things people ask before signing up"
        />
        <Panel className="mt-12 rounded-panel px-6 py-2 sm:px-9">
          <Accordion items={faqs} />
        </Panel>
      </Container>
    </Section>
  );
}
