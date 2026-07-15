import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEFAULT_SUBTITLE = "12 chi nhánh TP.HCM • 500+ doanh nghiệp tin dùng";
const DEFAULT_HOTLINE = "Hotline: 089 8082 188";

let fontsPromise: ReturnType<typeof loadFonts> | null = null;
let logoPromise: ReturnType<typeof loadLogo> | null = null;

async function loadFonts() {
  // Inter, not Be Vietnam Pro — Be Vietnam Pro's TTF export has a glyph-width
  // quirk in satori that inserts a stray gap after certain accented words
  // (e.g. "Toán "); Inter renders the same Vietnamese diacritics cleanly.
  const [regular, bold, extraBold] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "src/fonts/Inter-Bold.ttf")),
    readFile(join(process.cwd(), "src/fonts/Inter-ExtraBold.ttf")),
  ]);
  return [
    { name: "Inter", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Inter", data: bold, style: "normal" as const, weight: 700 as const },
    { name: "Inter", data: extraBold, style: "normal" as const, weight: 800 as const },
  ];
}

async function loadLogo() {
  const data = await readFile(join(process.cwd(), "public/images/logo-white.png"));
  return `data:image/png;base64,${data.toString("base64")}`;
}

// Drop a trailing " | MAX OFFICE" / " - MAX OFFICE" brand suffix — it's
// redundant next to the logo mark and, on longer titles, was wrapping onto
// its own orphan line ("...OFFICE").
function stripBrandSuffix(title: string) {
  return title.replace(/\s*[|\-–]\s*MAX OFFICE\s*$/i, "").trim();
}

export async function renderOgImage({
  title: rawTitle,
  backgroundImagePath,
  subtitle = DEFAULT_SUBTITLE,
  hotline = DEFAULT_HOTLINE,
}: {
  title: string;
  backgroundImagePath: string;
  subtitle?: string;
  hotline?: string;
}) {
  const title = stripBrandSuffix(rawTitle);
  if (!fontsPromise) fontsPromise = loadFonts();
  if (!logoPromise) logoPromise = loadLogo();

  const [fonts, logoSrc, bgData] = await Promise.all([
    fontsPromise,
    logoPromise,
    readFile(join(process.cwd(), "public", backgroundImagePath)),
  ]);
  const bgSrc = `data:image/jpeg;base64,${bgData.toString("base64")}`;

  // Longer titles wrap to 3 lines — step the font size down so they still
  // fit the fixed vertical slot above the subtitle without crowding it.
  const titleFontSize = title.length > 55 ? 42 : title.length > 40 ? 47 : 52;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        <img
          src={bgSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        {/* Same left-to-right wash recipe as the live Hero section, reused
            here so the OG card and the on-site hero read as one brand. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(9,15,28,0.68) 0%, rgba(9,15,28,0.30) 45%, rgba(9,15,28,0) 65%)",
          }}
        />
        {/* Every element below is absolutely positioned with fixed
            coordinates rather than a flex `space-between` column — satori
            was under-measuring the height of wrapped 3-line titles inside a
            flex sibling, so the subtitle/hotline ended up overlapping it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={210}
          height={42}
          style={{ position: "absolute", top: 52, left: 64, objectFit: "contain" }}
        />
        <div
          style={{
            position: "absolute",
            top: 210,
            left: 64,
            width: "740px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: titleFontSize,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 92,
            left: 64,
            width: "740px",
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            color: "#8FC1F5",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 64,
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {hotline}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
