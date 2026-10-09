"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Single-open accordion.
 *
 * Accessibility notes, since this is hand-rolled rather than from a library:
 *  - each trigger is a real `<button>`, so Enter/Space and focus work natively;
 *  - `aria-expanded` and `aria-controls` tie the trigger to its panel;
 *  - the panel stays in the DOM and is hidden with `hidden` only once collapsed,
 *    so the height transition can run and collapsed text is not announced.
 *
 * Height animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * cleanly without measuring the content or hardcoding a max-height.
 */
export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-edge", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const triggerId = `${baseId}-trigger-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-ink"
              >
                <span
                  className={cn(
                    "font-display text-base font-medium transition-colors sm:text-lg",
                    isOpen ? "text-ink" : "text-ink-soft",
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full border border-edge transition-all duration-300",
                    isOpen && "rotate-45 border-accent-via/60 bg-accent/10",
                  )}
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current" />
                </span>
              </button>
            </h3>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="overflow-hidden"
              >
                <p className="pr-12 pb-6 leading-relaxed text-ink-dim">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
