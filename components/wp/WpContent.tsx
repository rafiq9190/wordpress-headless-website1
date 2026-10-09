import parse, {
  attributesToProps,
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { createElement, type ReactElement } from "react";

import { cn } from "@/lib/utils";
import { isInternalHref, wpUrlToHref } from "@/lib/wp/uri";

import { isOptimisableImage, sanitizeClassName, sanitizeStyle } from "./sanitize";

/** Tags that carry theme behaviour or styling we deliberately never render. */
const DROPPED_TAGS = new Set(["script", "style", "noscript", "link"]);

/** HTML void elements — these must not be given children. */
const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "source",
  "track",
  "wbr",
]);

/**
 * Render WordPress block HTML as React.
 *
 * Server Component: the parse happens once on the server and the result
 * streams as plain markup, so none of html-react-parser reaches the browser.
 *
 * Three things happen here that `dangerouslySetInnerHTML` cannot do:
 *  1. theme-coupled colours and spacing are stripped (see ./sanitize.ts);
 *  2. `<img>` becomes `next/image`, so WordPress uploads get optimised and
 *     lazy-loaded instead of shipping 1920px JPEGs;
 *  3. internal `<a>` becomes `next/link`, so in-content links client-navigate
 *     instead of bouncing the visitor to the WordPress origin.
 */
export function WpContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  if (!html.trim()) return null;

  return (
    <div className={cn("prose-glass", className)}>{parse(html, parserOptions)}</div>
  );
}

const parserOptions: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) return;

    if (DROPPED_TAGS.has(node.name)) return <></>;

    if (node.name === "img") return renderImage(node);
    if (node.name === "a") return renderLink(node);
    if (node.name === "iframe") return renderEmbed(node);

    return renderCleaned(node);
  },
};

/** Re-emit an element with theme styling stripped, recursing into children. */
function renderCleaned(node: Element): ReactElement | undefined {
  const originalClass = node.attribs["class"] || undefined;
  const originalStyle = node.attribs["style"] || undefined;

  const className = sanitizeClassName(originalClass);
  const style = sanitizeStyle(originalStyle);

  // Nothing to rewrite — let the parser handle this node normally.
  if (className === originalClass && style === originalStyle) return;

  // Rebuild the attribute map without the dropped keys. Assigning `undefined`
  // is not enough: `attributesToProps` types every value as a string.
  const attribs: Record<string, string> = { ...node.attribs };
  delete attribs["class"];
  delete attribs["style"];
  if (className) attribs["class"] = className;
  if (style) attribs["style"] = style;

  const props = attributesToProps(attribs);

  if (VOID_TAGS.has(node.name)) {
    return createElement(node.name, props);
  }

  return createElement(
    node.name,
    props,
    domToReact(node.children as DOMNode[], parserOptions),
  );
}

function renderImage(node: Element): ReactElement {
  const src = node.attribs["src"];
  if (!src) return <></>;

  const alt = node.attribs["alt"] ?? "";
  const className = sanitizeClassName(node.attribs["class"]);
  const width = Number(node.attribs["width"]);
  const height = Number(node.attribs["height"]);
  const hasIntrinsicSize = Number.isFinite(width) && Number.isFinite(height) && width > 0;

  // Hosts not declared in next.config.ts would throw at request time.
  if (!isOptimisableImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-auto w-full rounded-card", className)}
        {...(hasIntrinsicSize ? { width, height } : {})}
      />
    );
  }

  if (hasIntrinsicSize) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        className={cn("h-auto w-full rounded-card", className)}
      />
    );
  }

  // No dimensions in the markup: reserve a 16/9 box so nothing shifts.
  return (
    <span className="relative block aspect-[16/9] w-full overflow-hidden rounded-card">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
    </span>
  );
}

function renderLink(node: Element): ReactElement {
  const href = node.attribs["href"];
  const children = domToReact(node.children as DOMNode[], parserOptions);
  const className = sanitizeClassName(node.attribs["class"]);

  if (!href) return <span className={className}>{children}</span>;

  const internal = wpUrlToHref(href);

  if (internal && isInternalHref(internal)) {
    return (
      <Link href={internal} className={className}>
        {children}
      </Link>
    );
  }

  // Hash links and mailto/tel stay as-is; everything else leaves the site.
  const sameDocument = href.startsWith("#");
  const protocolLink = /^(mailto|tel):/i.test(href);

  return (
    <a
      href={href}
      className={className}
      {...(sameDocument || protocolLink
        ? {}
        : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}

/** Keep video embeds but give them a stable aspect ratio and no theme styling. */
function renderEmbed(node: Element): ReactElement {
  const src = node.attribs["src"];
  if (!src) return <></>;

  return (
    <span className="relative block aspect-video w-full overflow-hidden rounded-card border border-edge">
      <iframe
        src={src}
        title={node.attribs["title"] ?? "Embedded media"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </span>
  );
}
