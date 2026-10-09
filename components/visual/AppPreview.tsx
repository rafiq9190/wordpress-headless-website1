import { Panel } from "@/components/ui/Panel";

/**
 * Decorative product mock for the hero.
 *
 * Deliberately `aria-hidden`: it depicts a product surface, not real data, so
 * announcing its numbers would be misleading. It is drawn rather than
 * screenshotted so it stays crisp at any density, themes with our tokens, and
 * costs no image bytes.
 *
 * Figure conventions, even though it is decorative:
 *  - one series, so no legend — the caption names it;
 *  - a single value axis (never two scales);
 *  - 2px stroke, recessive grid, no marker on every point;
 *  - numbers in ink tokens with tabular figures, identity carried by the mark.
 */

const SERIES = [18, 24, 21, 32, 29, 41, 38, 52, 47, 63, 58, 74];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const WIDTH = 520;
const HEIGHT = 180;
const PAD = { top: 12, right: 8, bottom: 22, left: 8 };

export function AppPreview() {
  return (
    <Panel aria-hidden="true" className="w-full rounded-panel p-3 shadow-lift sm:p-4">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-2 pb-3">
        <span className="size-2 rounded-full bg-danger/60" />
        <span className="size-2 rounded-full bg-warning/60" />
        <span className="size-2 rounded-full bg-positive/60" />
        <span className="ml-3 font-mono text-[0.625rem] tracking-wide text-ink-faint">
          ledgerline.app / close / november
        </span>
      </div>

      <div className="rounded-card border border-edge bg-canvas-raised p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
              Net cash position
            </p>
            {/* Hero number: the headline value gets size, not a chart. */}
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink tabular">
              $4,182,640
            </p>
          </div>
          <p className="flex items-center gap-1.5 rounded-full bg-positive/12 px-2.5 py-1 font-mono text-[0.6875rem] text-positive tabular">
            <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
              <path
                d="M5 1.5v7M5 1.5 2 4.5M5 1.5l3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            12.4%
          </p>
        </div>

        <Sparkline />

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-edge pt-4">
          <Kpi label="Close day" value="9.4" />
          <Kpi label="Unreconciled" value="3" />
          <Kpi label="Accounts" value="26" />
        </div>
      </div>
    </Panel>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[0.5625rem] tracking-[0.14em] text-ink-faint uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-display text-base font-semibold text-ink tabular">
        {value}
      </p>
    </div>
  );
}

function Sparkline() {
  const max = Math.max(...SERIES);
  const min = Math.min(...SERIES);
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const points = SERIES.map((value, index) => {
    const x = PAD.left + (index / (SERIES.length - 1)) * plotWidth;
    const y = PAD.top + (1 - (value - min) / (max - min)) * plotHeight;
    return { x, y, value };
  });

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const area = `${line} L${points[points.length - 1]?.x ?? 0} ${PAD.top + plotHeight} L${points[0]?.x ?? 0} ${PAD.top + plotHeight} Z`;

  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="mt-4 w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-via)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-accent-via)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Recessive grid: three reference lines, no labels competing with the data. */}
      {[0, 0.5, 1].map((ratio) => (
        <line
          key={ratio}
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={PAD.top + ratio * plotHeight}
          y2={PAD.top + ratio * plotHeight}
          stroke="var(--color-edge)"
          strokeWidth="1"
        />
      ))}

      <path d={area} fill="url(#spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--color-accent-via)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* One marker, on the value that matters — not on every point. */}
      {last ? (
        <>
          <circle
            cx={last.x}
            cy={last.y}
            r="5"
            fill="var(--color-accent-via)"
            stroke="var(--color-canvas-raised)"
            strokeWidth="2"
          />
        </>
      ) : null}

      {MONTHS.map((month, index) => (
        <text
          key={`${month}-${index}`}
          x={PAD.left + (index / (SERIES.length - 1)) * plotWidth}
          y={HEIGHT - 6}
          textAnchor="middle"
          className="fill-[var(--color-ink-faint)] font-mono text-[9px]"
        >
          {month}
        </text>
      ))}
    </svg>
  );
}
