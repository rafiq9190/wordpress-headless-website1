import { Panel } from "@/components/ui/Panel";
import { comparison, plans } from "@/content/marketing";

/**
 * Plan comparison table.
 *
 * A real `<table>` with a proper header row and `scope` attributes, so screen
 * readers can announce "Growth, board pack automation, included" instead of
 * reading a wall of cells. Booleans get an icon *and* visually-hidden text —
 * a tick alone is not a label.
 */
export function PricingTable() {
  return (
    <Panel className="overflow-hidden rounded-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <caption className="sr-only">
            Feature comparison across the Starter, Growth and Scale plans
          </caption>
          <thead>
            <tr className="border-b border-edge">
              <th
                scope="col"
                className="px-6 py-5 text-left font-mono text-[0.6875rem] tracking-[0.14em] text-ink-dim uppercase"
              >
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className="px-6 py-5 text-left font-display text-base font-semibold text-ink"
                >
                  {plan.name}
                  {plan.featured ? (
                    <span className="ml-2 align-middle font-mono text-[0.625rem] font-normal text-accent-via">
                      popular
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.label} className="border-b border-edge last:border-0">
                <th
                  scope="row"
                  className="px-6 py-4 text-left font-normal text-ink-soft"
                >
                  {row.label}
                </th>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-ink-dim">
                    <Cell value={row.values[plan.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Cell({ value }: { value: string | boolean | undefined }) {
  if (value === true) {
    return (
      <>
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
          <path
            d="M3.5 8.5 6.5 11.5l6-7"
            stroke="var(--color-accent-via)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="sr-only">Included</span>
      </>
    );
  }

  if (value === false || value === undefined) {
    return (
      <>
        <span aria-hidden="true" className="block h-px w-3 bg-ink-faint" />
        <span className="sr-only">Not included</span>
      </>
    );
  }

  return <span>{value}</span>;
}
