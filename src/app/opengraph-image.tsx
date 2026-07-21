import { ImageResponse } from "next/og";

// Static link-preview card. Brand colors from the DS (neutral-100 bg, primary-400
// accent, neutral-800 text). Uses Satori's default sans — the licensed brand faces
// aren't embeddable here yet, and the card reads fine without them.
export const alt = "Sari Sari Design — Design to help SaaS apps work just right.";
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
          Seed → Series A
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
          <span>Design to help SaaS apps</span>
          {/* Satori has no italic-synthesis without an italic font file, and trims
              whitespace around nested spans — so emphasis is the brand blue, and the
              trailing space is baked into the leading text node. */}
          <span style={{ display: "flex" }}>
            <span>work&nbsp;</span>
            <span style={{ color: "#1f5fa6" }}>just right.</span>
          </span>
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
            A digital product design studio that gets you.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
