import { ImageResponse } from "next/og";

import { truncate } from "@/lib/utils";
import { getPostBySlug } from "@/lib/wp/api";

export const alt = "Ledgerline article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-article social card, titled from WordPress. */
export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post ? truncate(post.title, 110) : "Ledgerline";
  const category = post?.categories[0]?.name ?? "Writing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#06060a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -120,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(34,211,238,0.4), rgba(34,211,238,0) 65%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#22d3ee",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {category}
        </div>

        <div
          style={{
            color: "#f4f4f8",
            fontSize: title.length > 70 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
              }}
            />
            <div style={{ color: "#f4f4f8", fontSize: 26, fontWeight: 600 }}>
              Ledgerline
            </div>
          </div>
          <div style={{ color: "#5d5d6e", fontSize: 22 }}>
            {post ? `${post.readingMinutes} min read` : ""}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
