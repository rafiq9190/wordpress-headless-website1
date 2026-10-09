import { ImageResponse } from "next/og";

export const alt = "Ledgerline — financial clarity, engineered";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card.
 *
 * Deliberately uses no custom font files: `ImageResponse` would have to fetch
 * and embed them at render time, which is a build-time network dependency for
 * a decorative asset. The gradient and layout carry the brand instead.
 */
export default function OpengraphImage() {
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
            top: -220,
            left: -140,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(124,92,255,0.55), rgba(124,92,255,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(34,211,238,0.38), rgba(34,211,238,0) 65%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
            }}
          />
          <div style={{ color: "#f4f4f8", fontSize: 30, fontWeight: 600 }}>
            Ledgerline
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#f4f4f8",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Financial clarity, engineered for the close.
          </div>
          <div style={{ color: "#8b8b9c", fontSize: 28, maxWidth: 820 }}>
            One live model for your ledger, forecast and board pack.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
