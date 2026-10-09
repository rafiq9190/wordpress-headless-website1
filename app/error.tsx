"use client";

import { useEffect } from "react";

import { Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";

/**
 * Route-level error boundary.
 *
 * The most likely cause here is WordPress being unreachable — the local site
 * stopped, or `WP_GRAPHQL_URL` pointing somewhere wrong — so the copy says so
 * rather than showing a generic apology. The underlying message is shown in
 * development only; in production it could leak internal detail.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="center">
      <Container className="flex flex-col items-center text-center">
        <Eyebrow>Something broke</Eyebrow>
        <h1 className="mt-4 max-w-xl text-display font-semibold text-ink">
          We couldn’t load this page
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-ink-dim">
          This usually means the WordPress backend didn’t answer. Check that your
          local site is running and that <code className="font-mono text-ink-soft">WP_GRAPHQL_URL</code>{" "}
          is correct.
        </p>

        {process.env.NODE_ENV === "development" ? (
          <pre className="mt-8 max-w-xl overflow-x-auto rounded-card border border-danger/30 bg-danger/5 p-4 text-left font-mono text-xs text-danger">
            {error.message}
          </pre>
        ) : null}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button href="/" variant="glass" size="lg">
            Back to home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
