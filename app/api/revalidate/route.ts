import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { tags } from "@/lib/wp/api";

/**
 * On-demand revalidation webhook for WordPress.
 *
 * Point a `save_post` / `wp_update_nav_menu` hook at this endpoint and edits in
 * wp-admin appear immediately instead of waiting out the one-hour cache window.
 *
 * Example WordPress snippet (mu-plugin):
 *
 *   add_action('save_post', function ($id, $post) {
 *     if (wp_is_post_revision($id)) return;
 *     wp_remote_post('http://localhost:3000/api/revalidate', [
 *       'headers' => ['Content-Type' => 'application/json', 'x-revalidate-secret' => WP_REVALIDATE_SECRET],
 *       'body'    => wp_json_encode(['type' => $post->post_type, 'slug' => $post->post_name]),
 *     ]);
 *   }, 10, 2);
 */

const payloadSchema = z.object({
  /** "post" | "page", matching WordPress's post_type. */
  type: z.enum(["post", "page"]).optional(),
  slug: z.string().trim().min(1).optional(),
  /** Escape hatch: purge explicit tags. */
  tags: z.array(z.string().trim().min(1)).optional(),
});

export async function POST(request: NextRequest) {
  const secret = process.env.WP_REVALIDATE_SECRET;

  // Fail closed: an unset secret must not mean "open to everyone".
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: "WP_REVALIDATE_SECRET is not configured." },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret." },
      { status: 401 },
    );
  }

  let body: unknown = {};
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { revalidated: false, error: "Body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { revalidated: false, error: "Unexpected payload.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { type, slug, tags: explicit } = parsed.data;
  const purged = new Set<string>(explicit ?? []);

  if (type === "post") {
    purged.add(tags.posts);
    purged.add(tags.categories);
    if (slug) purged.add(tags.post(slug));
  }

  if (type === "page") {
    purged.add(tags.menu);
    if (slug) purged.add(tags.page(`/${slug}/`));
  }

  // No hints at all: purge everything the data layer owns.
  if (purged.size === 0) {
    purged.add(tags.posts);
    purged.add(tags.categories);
    purged.add(tags.menu);
    purged.add(tags.settings);
  }

  // Next 16 requires an expiry profile; "max" purges the entry outright rather
  // than letting it serve stale while revalidating in the background.
  for (const tag of purged) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tags: [...purged] });
}
