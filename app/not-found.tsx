import { ArrowRight, Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <Section spacing="center">
      <Container className="flex flex-col items-center text-center">
        <p className="font-display text-mega leading-none font-semibold text-gradient">
          404
        </p>
        <Eyebrow className="mt-6">Page not found</Eyebrow>
        <h1 className="mt-4 max-w-xl text-display font-semibold text-ink">
          This line doesn’t reconcile
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-ink-dim">
          The page you asked for isn’t here. It may have been renamed in
          WordPress, or the link was wrong to begin with.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to home
            <ArrowRight />
          </Button>
          <Button href="/blog" variant="glass" size="lg">
            Browse the blog
          </Button>
        </div>
      </Container>
    </Section>
  );
}
