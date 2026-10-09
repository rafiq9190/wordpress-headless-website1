import { Container, Section } from "@/components/ui/Container";

/** Route-level skeleton. Mirrors the common page rhythm so nothing jumps. */
export default function Loading() {
  return (
    <Section spacing="pageTop">
      <Container width="wide">
        <div className="sr-only" role="status">
          Loading
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-3 w-24 rounded-full bg-surface-soft/70" />
          <div className="h-12 w-3/4 max-w-2xl rounded-2xl bg-surface-soft/60" />
          <div className="h-4 w-1/2 max-w-md rounded-full bg-surface-soft/50" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="glass glass-ring h-72 rounded-card"
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
