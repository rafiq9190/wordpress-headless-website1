# Ledgerline — headless WordPress frontend

A Next.js 16 marketing site and blog served from a headless WordPress backend
over WPGraphQL. Dark glassmorphic design, Tailwind CSS v4, GSAP for motion.

## Requirements

- **Node ≥ 20.9** (built and tested on 24.21.0). Next 16 will not run on 18.
- A WordPress install with the **WPGraphQL** plugin active.

## Getting started

```bash
cp .env.example .env.local      # then set WP_GRAPHQL_URL and a secret
npm install
npm run dev                     # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `WP_GRAPHQL_URL` | WPGraphQL endpoint, e.g. `http://my-plugin-local.test/graphql` |
| `WP_REVALIDATE_SECRET` | Shared secret for the revalidation webhook |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used for canonicals and the sitemap |

The WordPress site must be reachable at build time — `generateStaticParams`,
the sitemap and the legacy-permalink redirects all read from it.

## How it's put together

```
app/                  routes, metadata, OG images, revalidation webhook
  [...uri]/           catch-all: serves any WordPress page with no new code
  blog/               archive, post, category archive
components/
  ui/                 design-system primitives
  sections/           composed marketing sections
  wp/                 WordPress content rendering + sanitisation
  motion/             GSAP wrappers
content/              typed marketing copy with no home in WordPress
lib/wp/               data layer: client, queries, schemas, mappers, URI mapping
lib/motion/           GSAP registration and the useGsap hook
proxy.ts              canonical redirects for WordPress page aliases
```

Routing notes specific to this WordPress install:

- The nav menu links to `/blog-2/` and the posts page is `blog-inspiro`. Both
  are mapped to `/blog` by `lib/wp/uri.ts` and redirected with a 308 by
  `proxy.ts`.
- WordPress serves posts at `/<slug>/`; this app serves them at `/blog/<slug>`.
  `redirects()` in `next.config.ts` enumerates the legacy permalinks at build
  time and emits real 308s.
- Any other WordPress page is served by `app/[...uri]/page.tsx`, so publishing
  a page in wp-admin needs no code change.

## Content from WordPress vs. local

WordPress drives: posts, categories, authors, media, the nav menu, and the
`about`, `contact` and `our-services` page bodies.

Local typed modules in `content/` drive the marketing sections — hero, features,
pricing tiers, testimonials, FAQ. This install exposes no custom post types, so
there is nowhere in WordPress for that content to live. The modules are shaped
so an ACF or CPT loader could replace them without touching components.

## Rendering WordPress content

Never render block HTML with `dangerouslySetInnerHTML`. Use `<WpContent>`.

WordPress bakes its theme's light-mode colours into block markup — the `pricing`
page contains `background-color:#f5f9fe` and `color:#010109` inline. On a dark
canvas that is unreadable. `components/wp/sanitize.ts` strips those declarations
and the theme-only classes, `<WpContent>` swaps `<img>` for `next/image` and
internal `<a>` for `next/link`, and `.prose-glass` in `app/globals.css` supplies
the typography.

## Revalidation

Content is cached for an hour. To publish instantly, have WordPress call the
webhook on save:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H 'Content-Type: application/json' \
  -H "x-revalidate-secret: $WP_REVALIDATE_SECRET" \
  -d '{"type":"post","slug":"my-post"}'
```

A WordPress mu-plugin snippet is in the comment at the top of
`app/api/revalidate/route.ts`.

## Checks

```bash
npx tsc --noEmit     # types
npx eslint .         # lint
npm run build        # prerender — where most real errors surface
```

## Known gaps

- **The contact form does not deliver anywhere.** It validates with Zod and logs
  server-side. WPForms needs a form ID and a nonce from a rendered WordPress
  page, which a headless frontend has no way to obtain. See the note at the top
  of `app/contact/actions.ts` for how to finish it.
- **Missing URLs return the 404 page with a 200 status.** Partial Prerendering
  commits the status before the WordPress lookup resolves. Those routes emit
  `noindex, nofollow` so they stay out of search results; the redirects that
  matter to crawlers are handled with real 308s before render.
- **The site reads from a local WordPress host**, so it can't be deployed until
  WordPress is on a public URL. Only `WP_GRAPHQL_URL` needs to change — and the
  `dangerouslyAllowLocalIP` image flag then disables itself automatically.

## Conventions

The reasoning behind each decision lives in a comment at the point of use.
The headers of `lib/wp/api.ts`, `components/wp/sanitize.ts`,
`components/ui/Container.tsx` and `next.config.ts` are the places to start.
