import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Static link-preview card, built from Pam's Figma frame "og-image 1200x630"
// (file "Website | Twitter OG Card", v2 with gridlines). Colors, fonts and the logo
// come from Patti's DS. Type runs larger than the DS text styles (104px / 32px) so it
// stays readable at feed size (~0.42x). The bottom-left corner stays empty because X
// lays the page title over it.
export const alt = "Sari Sari | Design that turns users into regulars.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// DS tokens used on the card.
const SURFACE_ELEVATED = "#faf9f7";
const TEXT_PRIMARY = "#403e3c";
const TEXT_SECONDARY = "#575452";
const BRAND_BLUE = "#1f5fa6";
const BORDER_PRIMARY = "#e6e5e4"; // neutral-300, solid edge lines
const BORDER_SECONDARY = "#dad8d6"; // neutral-400, dashed lines

// Gridlines, same geometry as the site's `.gridlines` (globals.css) on a 1200px card
// with content inset 80px: edges 8px outside the content, dashes every 3 of 12 columns.
const EDGE_LINES_X = [72, 1127];
const DASH_LINES_X = [336, 600, 864];

export default async function OgImage() {
  const fontsDir = join(process.cwd(), "src/app/og-fonts");
  const [serif, sans] = await Promise.all([
    readFile(join(fontsDir, "InstrumentSerif-Regular.ttf")),
    readFile(join(fontsDir, "InstrumentSans-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: SURFACE_ELEVATED,
        }}
      >
        {/* Gridlines sit behind the logo and text. */}
        {EDGE_LINES_X.map((x) => (
          <div
            key={`edge-${x}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: 630,
              backgroundColor: BORDER_PRIMARY,
            }}
          />
        ))}
        {DASH_LINES_X.map((x) => (
          <div
            key={`dash-${x}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: 630,
              // 4px dash, 5px gap, as on the site.
              backgroundImage: `repeating-linear-gradient(to bottom, ${BORDER_SECONDARY} 0px, ${BORDER_SECONDARY} 4px, transparent 4px, transparent 9px)`,
            }}
          />
        ))}

        {/* DS logo with icon (Brand Assets node 9352:4031), 226x64, 80px from top/right. */}
        <svg
          width="226"
          height="64"
          viewBox="0 0 226 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", left: 894, top: 80 }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.3651 6.09523C32.9029 6.09523 40.6349 13.8272 40.6349 23.3651H46.7301C46.7301 10.4609 36.2692 0 23.3651 0C10.4609 0 0 10.4609 0 23.3651C0 36.0998 10.188 46.455 22.8581 46.7247V62C22.8581 63.1046 23.7535 64 24.8581 64H61.493C62.5976 64 63.493 63.1046 63.493 62V25.3651C63.493 24.2605 62.5976 23.3651 61.493 23.3651H24.8581C23.7535 23.3651 22.8581 24.2605 22.8581 25.3651V40.6276C13.5547 40.3594 6.09523 32.7334 6.09523 23.3651C6.09523 13.8272 13.8272 6.09523 23.3651 6.09523ZM41.1438 29.4604H29.9533C29.4011 29.4604 28.9533 29.9081 28.9533 30.4604V56.9048C28.9533 57.4571 29.4011 57.9048 29.9533 57.9048H56.3978C56.95 57.9048 57.3978 57.4571 57.3978 56.9048V48.2381C57.3978 47.6858 56.95 47.2381 56.3978 47.2381H43.1438C42.0392 47.2381 41.1438 46.3426 41.1438 45.2381V29.4604ZM48.239 29.4604C47.6868 29.4604 47.239 29.9081 47.239 30.4604V40.1428C47.239 40.6951 47.6868 41.1428 48.239 41.1428H56.3978C56.95 41.1428 57.3978 40.6951 57.3978 40.1428V30.4604C57.3978 29.9081 56.95 29.4604 56.3978 29.4604H48.239Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M208.088 22.8573V26.4157C209.726 23.2319 212.535 22.436 215.532 22.2955V30.2081C215.017 30.2081 211.974 30.1145 210.803 30.7232C209.539 31.3786 208.368 32.2214 208.368 36.9034V47.0634H199.941V22.8573H208.088Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M174.937 30.4425C175.733 25.5263 179.806 21.9212 186.127 21.9212C191.886 21.9212 197.457 24.4026 197.457 33.2517V39.8533C197.457 41.7262 197.411 45.0972 197.926 47.0637H189.779C189.685 46.7359 189.592 46.0336 189.592 45.4718V44.3481H189.545C188.421 46.3145 186.642 47.8128 182.382 47.8128C177.793 47.8128 173.954 45.2845 173.954 40.462C173.954 34.0476 181.024 32.8771 184.067 32.4089C187.11 31.9407 189.311 32.128 189.311 30.1147C189.311 28.3824 187.578 27.7269 186.08 27.7269C184.488 27.7269 182.99 28.3824 182.569 30.4425H174.937ZM182.382 39.8065C182.382 40.7897 182.85 42.0539 185.331 42.0539C187.485 42.0539 189.451 40.5556 189.451 35.78V35.1245C188.843 36.295 187.532 36.81 185.799 37.1846C182.943 37.8401 182.382 38.7765 182.382 39.8065Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M165.216 29.9743C164.795 28.4292 163.858 27.5396 162.22 27.5396C160.534 27.5396 159.738 28.4292 159.738 29.3188C159.738 30.5361 160.3 31.0979 163.484 32.0344C164.607 32.3621 165.731 32.643 166.855 32.9708C171.583 34.2817 173.035 36.6696 173.035 40.1343C173.035 44.114 169.898 48.0001 162.22 48.0001C155.431 48.0001 152.013 44.8163 151.123 39.3851H159.223C159.457 41.0238 160.487 42.2412 162.173 42.2412C164.233 42.2412 164.888 41.2111 164.888 40.3684C164.888 38.5892 163.296 38.1678 162.079 37.7932L158.334 36.7164C153.839 35.4054 152.06 33.0644 152.06 29.3188C152.06 25.3391 155.478 21.9212 162.173 21.9212C168.681 21.9212 172.052 25.0113 172.848 29.9743H165.216Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M140.996 23.1953V47.0637H149.423V23.3716C148.479 24.6357 146.971 25.454 145.272 25.454C143.496 25.454 141.928 24.559 140.996 23.1953Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M149.099 19.8266C149.099 21.94 147.386 23.6533 145.272 23.6533C143.159 23.6533 141.446 21.94 141.446 19.8266C141.446 17.7132 143.159 15.9999 145.272 15.9999C147.386 15.9999 149.099 17.7132 149.099 19.8266Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M216.72 23.1953V47.0637H225.147V23.3716C224.203 24.6357 222.695 25.454 220.996 25.454C219.22 25.454 217.652 24.559 216.72 23.1953Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M224.823 19.8266C224.823 21.94 223.11 23.6533 220.996 23.6533C218.883 23.6533 217.17 21.94 217.17 19.8266C217.17 17.7132 218.883 15.9999 220.996 15.9999C223.11 15.9999 224.823 17.7132 224.823 19.8266Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M132.455 22.8573V26.4157C134.093 23.2319 136.903 22.436 139.899 22.2955V30.2081C139.384 30.2081 136.341 30.1145 135.17 30.7232C133.906 31.3786 132.736 32.2214 132.736 36.9034V47.0634H124.308V22.8573H132.455Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M99.3069 30.4425C100.103 25.5263 104.176 21.9212 110.497 21.9212C116.256 21.9212 121.827 24.4026 121.827 33.2517V39.8533C121.827 41.7262 121.78 45.0972 122.295 47.0637H114.149C114.055 46.7359 113.961 46.0336 113.961 45.4718V44.3481H113.915C112.791 46.3145 111.012 47.8128 106.751 47.8128C102.163 47.8128 98.3237 45.2845 98.3237 40.462C98.3237 34.0476 105.393 32.8771 108.437 32.4089C111.48 31.9407 113.681 32.128 113.681 30.1147C113.681 28.3824 111.948 27.7269 110.45 27.7269C108.858 27.7269 107.36 28.3824 106.939 30.4425H99.3069ZM106.751 39.8065C106.751 40.7897 107.219 42.0539 109.701 42.0539C111.855 42.0539 113.821 40.5556 113.821 35.78V35.1245C113.212 36.295 111.901 36.81 110.169 37.1846C107.313 37.8401 106.751 38.7765 106.751 39.8065Z"
            fill={TEXT_PRIMARY}
          />
          <path
            d="M89.5857 29.9743C89.1644 28.4292 88.228 27.5396 86.5893 27.5396C84.9038 27.5396 84.1079 28.4292 84.1079 29.3188C84.1079 30.5361 84.6697 31.0979 87.8534 32.0344C88.9771 32.3621 90.1008 32.643 91.2244 32.9708C95.9532 34.2817 97.4046 36.6696 97.4046 40.1343C97.4046 44.114 94.2677 48.0001 86.5893 48.0001C79.8004 48.0001 76.3826 44.8163 75.493 39.3851H83.5928C83.8269 41.0238 84.857 42.2412 86.5425 42.2412C88.6025 42.2412 89.258 41.2111 89.258 40.3684C89.258 38.5892 87.6661 38.1678 86.4488 37.7932L82.7033 36.7164C78.2086 35.4054 76.4294 33.0644 76.4294 29.3188C76.4294 25.3391 79.8473 21.9212 86.5425 21.9212C93.0504 21.9212 96.4214 25.0113 97.2173 29.9743H89.5857Z"
            fill={TEXT_PRIMARY}
          />
        </svg>

        {/* Text block: 755x272 at x 80, y 195 (vertically centered, +16px offset). */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 195,
            width: 755,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Instrument Serif",
              fontSize: 104,
              lineHeight: "100px",
              letterSpacing: "-1px",
              color: TEXT_PRIMARY,
            }}
          >
            {/* Mirrors the homepage hero (hero.headline in content/site.ts). */}
            <span>Design that turns</span>
            <span style={{ color: BRAND_BLUE }}>users into regulars.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: "Instrument Sans",
              fontSize: 32,
              lineHeight: "40px",
              color: TEXT_SECONDARY,
            }}
          >
            Product Design &amp; Development for funded startups
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
        { name: "Instrument Sans", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
