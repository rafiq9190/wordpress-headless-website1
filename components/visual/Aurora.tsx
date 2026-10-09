/**
 * Fixed background: three drifting gradient blobs plus a film-grain overlay.
 *
 * Server Component with zero JS. Deliberately CSS rather than canvas or WebGL:
 * blurred radial gradients animating only `transform` stay on the compositor,
 * cost nothing on the main thread, and render identically on first paint —
 * no hydration flash, nothing to tear down. `prefers-reduced-motion` freezes
 * the drift globally via the base layer in globals.css.
 */
export function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Blobs. `will-change` is scoped here only, never globally. */}
      <div className="absolute top-[-16%] left-[-8%] h-[46rem] w-[46rem] animate-drift-a rounded-full bg-[radial-gradient(circle_at_center,_var(--color-accent-from)_0%,_transparent_64%)] opacity-[0.5] blur-[100px] will-change-transform" />
      <div className="absolute top-[8%] right-[-12%] h-[42rem] w-[42rem] animate-drift-b rounded-full bg-[radial-gradient(circle_at_center,_var(--color-accent-via)_0%,_transparent_64%)] opacity-[0.34] blur-[110px] will-change-transform" />
      <div className="absolute bottom-[-18%] left-[20%] h-[38rem] w-[38rem] animate-drift-c rounded-full bg-[radial-gradient(circle_at_center,_var(--color-accent-to)_0%,_transparent_64%)] opacity-[0.26] blur-[120px] will-change-transform" />

      {/*
        Vignette. Tuned carefully: fading all the way to opaque canvas erases
        the gradient entirely and the page reads as flat black. This only
        darkens the lower two thirds, which is where body copy sits, so the
        colour survives behind the hero while text contrast stays safe.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_130%_90%_at_50%_-5%,_transparent_40%,_color-mix(in_oklab,var(--color-canvas)_88%,transparent)_100%)]" />

      <Grain />
    </div>
  );
}

/**
 * SVG turbulence grain, inlined as a data URI so it adds no network request.
 * At 3.5% opacity it breaks up the gradient banding that large blurred
 * gradients produce on 8-bit displays.
 */
function Grain() {
  const grain = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(%23n)" opacity="1"/></svg>`;

  return (
    <div
      className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,${grain}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
