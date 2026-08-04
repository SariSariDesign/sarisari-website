import { ImageResponse } from "next/og";

// Static link-preview card. Brand colors from the DS (neutral-100 bg, primary-400
// accent, neutral-800 text). Uses Satori's default sans — the licensed brand faces
// aren't embeddable here yet, and the card reads fine without them.
export const alt = "Sari Sari — Your fractional product team.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf9f7",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#1f5fa6",
            fontSize: "26px",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Product design &amp; development
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#403e3c",
            fontSize: "82px",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            maxWidth: "1000px",
          }}
        >
          <span>Your fractional</span>
          {/* Satori has no italic-synthesis without an italic font file, so emphasis is
              carried by the brand blue instead of the site's editorial italic. */}
          <span style={{ color: "#1f5fa6" }}>product team.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontStyle: "italic",
              fontSize: "44px",
              color: "#1f1d1c",
            }}
          >
            sarisari
          </span>
          <span style={{ fontSize: "24px", color: "#575452" }}>
            A digital product design and development studio that gets you.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
