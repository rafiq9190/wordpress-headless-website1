"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ArrowRight, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/wp/types";

/** Scroll position is external state, so it is read with a store subscription. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function Header({ menu }: { menu: MenuItem[] }) {
  /**
   * Condense the bar once the visitor leaves the hero.
   *
   * `useSyncExternalStore` rather than state-in-an-effect: it reads the real
   * scroll position during the first client render, so the header cannot flash
   * in its tall state when the page is loaded already scrolled.
   */
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false,
  );

  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500 ease-[var(--ease-out-expo)]",
          scrolled
            ? "glass border-b border-edge py-2.5"
            : "border-b border-transparent py-4",
        )}
      >
        <Container width="wide" className="flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0 rounded-lg" aria-label="Ledgerline — home">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            {/*
              Only the active-link highlight needs the current URL, and
              `usePathname()` is request data that cannot be prerendered. Keeping
              it behind Suspense means the rest of the layout — and every route
              that uses it — still gets a static shell. The fallback is the same
              list without the highlight, so nothing moves when it resolves.
            */}
            <Suspense fallback={<NavList menu={menu} pathname={null} />}>
              <ActiveNavList menu={menu} />
            </Suspense>
          </nav>

          <div className="flex items-center gap-3">
            <Button href="/contact" variant="ghost" size="sm" className="hidden sm:flex">
              Sign in
            </Button>
            <Button href="/pricing" size="sm" className="hidden sm:flex">
              Start free
              <ArrowRight />
            </Button>

            <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
          </div>
        </Container>
      </div>

      <MobileSheet open={open} menu={menu} onClose={close} />
    </header>
  );
}

function ActiveNavList({ menu }: { menu: MenuItem[] }) {
  return <NavList menu={menu} pathname={usePathname()} />;
}

function NavList({ menu, pathname }: { menu: MenuItem[]; pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {menu.map((item) => (
        <li key={item.id}>
          <NavLink item={item} pathname={pathname} />
        </li>
      ))}
    </ul>
  );
}

function NavLink({ item, pathname }: { item: MenuItem; pathname: string | null }) {
  const active =
    pathname === null
      ? false
      : item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href);

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full px-4 py-2 text-sm text-ink-dim transition-colors hover:text-ink"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-full px-4 py-2 text-sm transition-colors",
        active ? "text-ink" : "text-ink-dim hover:text-ink",
      )}
    >
      {item.label}
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-4 -bottom-0.5 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent-via),transparent)]"
        />
      ) : null}
    </Link>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      className="glass glass-ring relative grid size-10 place-items-center rounded-full lg:hidden"
    >
      <span className="relative z-2 flex h-3 w-4 flex-col justify-between">
        <span
          className={cn(
            "h-px w-full origin-center bg-ink transition-transform duration-300",
            open && "translate-y-[5.5px] rotate-45",
          )}
        />
        <span
          className={cn(
            "h-px w-full bg-ink transition-opacity duration-200",
            open && "opacity-0",
          )}
        />
        <span
          className={cn(
            "h-px w-full origin-center bg-ink transition-transform duration-300",
            open && "-translate-y-[5.5px] -rotate-45",
          )}
        />
      </span>
    </button>
  );
}

/**
 * Full-screen mobile navigation.
 *
 * Hand-rolled rather than pulled from a dialog library, so the focus handling
 * is explicit: focus moves into the sheet on open, Tab is cycled within it,
 * Escape closes, background scroll is locked, and focus returns to the trigger
 * on close. Every link also closes the sheet on click, so navigation never
 * leaves it covering the new page.
 */
function MobileSheet({
  open,
  menu,
  onClose,
}: {
  open: boolean;
  menu: MenuItem[];
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      hidden={!open}
      className="glass fixed inset-x-0 top-0 z-40 border-b border-edge pt-20 pb-8 lg:hidden"
    >
      <Container>
        <ul className="flex flex-col">
          {menu.map((item) => (
            <li key={item.id} className="border-b border-edge last:border-0">
              <Link
                href={item.href}
                onClick={onClose}
                className="block py-4 font-display text-2xl text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <Button href="/pricing" size="lg" onClick={onClose}>
            Start free
            <ArrowRight />
          </Button>
          <Button href="/contact" variant="outline" size="lg" onClick={onClose}>
            Talk to sales
          </Button>
        </div>
      </Container>
    </div>
  );
}
