import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { getCategories } from "@/lib/wp/api";
import type { MenuItem } from "@/lib/wp/types";

const productLinks = [
  { label: "Forecasting", href: "/pricing" },
  { label: "Reporting", href: "/pricing" },
  { label: "Integrations", href: "/our-services" },
  { label: "Changelog", href: "/blog" },
];

export async function Footer({ menu }: { menu: MenuItem[] }) {
  // Topic list comes from WordPress, so publishing a new category updates the
  // footer with no code change.
  const categories = await getCategories();

  // Inlined at build time by next.config.ts — see the note there. Reading the
  // clock here would cap every route's revalidate at this component's cache life.
  const year = process.env.NEXT_PUBLIC_BUILD_YEAR;

  return (
    <footer className="relative mt-24 border-t border-edge">
      <Container width="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-dim">
              The financial operating system for teams that would rather close the
              month in an afternoon than a fortnight.
            </p>
            <p className="font-mono text-xs text-ink-faint">
              Built headless on WordPress · Next.js
            </p>
          </div>

          <FooterColumn title="Company" links={menu.map(toLink)} />
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn
            title="Topics"
            links={categories.slice(0, 5).map((category) => ({
              label: category.name,
              href: category.href,
            }))}
          />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-edge pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Ledgerline. All rights reserved.</p>
          <p className="font-mono">
            Content served from WordPress via WPGraphQL
          </p>
        </div>
      </Container>
    </footer>
  );
}

function toLink(item: MenuItem) {
  return { label: item.label, href: item.href };
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-mono text-xs tracking-[0.18em] text-ink-dim uppercase">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
