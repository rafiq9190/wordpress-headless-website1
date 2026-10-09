/**
 * Strip the theme-coupled presentation that WordPress bakes into block HTML.
 *
 * This is the single most important transform in the app. Verified against the
 * live site, the `pricing` page content contains markup like:
 *
 *   <div class="wp-block-group alignfull has-background wp-container-core-group-is-layout-1d2ebf90"
 *        style="background-color:#f5f9fe; padding-right:var(--wp--preset--spacing--x-small)">
 *     <h1 class="wp-block-heading has-text-color wp-elements-1" style="color:#010109">
 *
 * Those colours assume the Inspiro theme's light palette, and the spacing uses
 * `--wp--preset--*` variables that only exist when the theme stylesheet is
 * loaded. Rendered as-is on our dark canvas that produces near-black text on
 * near-white panels — unreadable. We drop the colour and theme-variable
 * declarations and let our own `.prose-glass` layer style the content.
 */

/** Declarations that exist only to apply the WordPress theme's palette. */
const DROPPED_STYLE_PROPS = new Set([
  "color",
  "background",
  "background-color",
  "background-image",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "box-shadow",
  "text-shadow",
  // Fixed heights on spacers and groups fight our own rhythm.
  "height",
  "min-height",
  "line-height",
  "font-size",
  "font-family",
  "letter-spacing",
]);

/** Classes that are hooks for theme CSS we never load. */
const DROPPED_CLASS_PATTERNS: RegExp[] = [
  /^wp-container-/,
  /^wp-elements-/,
  /^has-background$/,
  /^has-text-color$/,
  /^has-link-color$/,
  /^has-[a-z0-9-]+-background-color$/,
  /^has-[a-z0-9-]+-color$/,
  /^has-[a-z0-9-]+-font-size$/,
  /^is-layout-/,
  /^wp-block-[a-z-]+-is-layout-/,
];

/**
 * Remove colour/spacing declarations that reference the theme.
 * Returns `undefined` when nothing survives, so the attribute is dropped.
 */
export function sanitizeStyle(style: string | undefined): string | undefined {
  if (!style) return undefined;

  const kept = style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => {
      const colonAt = declaration.indexOf(":");
      if (colonAt === -1) return false;

      const property = declaration.slice(0, colonAt).trim().toLowerCase();
      const value = declaration.slice(colonAt + 1).trim();

      if (DROPPED_STYLE_PROPS.has(property)) return false;
      // Anything referencing a theme preset variable resolves to nothing here.
      if (value.includes("--wp--preset")) return false;
      if (value.includes("--wp--style")) return false;
      return true;
    });

  return kept.length > 0 ? `${kept.join("; ")};` : undefined;
}

export function sanitizeClassName(className: string | undefined): string | undefined {
  if (!className) return undefined;

  const kept = className
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !DROPPED_CLASS_PATTERNS.some((pattern) => pattern.test(token)));

  return kept.length > 0 ? kept.join(" ") : undefined;
}

/**
 * next/image can only load hosts declared in next.config.ts. WordPress content
 * can reference images from anywhere (plugin assets, external embeds, pasted
 * URLs), and an undeclared host is a hard runtime error — so callers fall back
 * to a plain <img> when this returns false.
 */
export function isOptimisableImage(src: string): boolean {
  if (src.startsWith("/")) return true;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }

  const wpHost = (() => {
    try {
      return process.env.WP_GRAPHQL_URL
        ? new URL(process.env.WP_GRAPHQL_URL).hostname
        : null;
    } catch {
      return null;
    }
  })();

  if (url.hostname === wpHost && url.pathname.startsWith("/wp-content/uploads/")) {
    return true;
  }
  return url.hostname === "secure.gravatar.com" && url.pathname.startsWith("/avatar/");
}
