import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ACTIVE_BRANCH_COUNT } from "./locationsData";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEFAULT_SUBTITLE = `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • 500+ doanh nghiệp tin dùng`;
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
  backgroundFit = "cover",
}: {
  title: string;
  backgroundImagePath: string;
  subtitle?: string;
  hotline?: string;
  /**
   * "cover" (mặc định) — ảnh phủ kín toàn khung 1200x630, cắt bớt nếu tỉ lệ
   * khác 1.9:1. Đúng cho ảnh hero đã chọn/crop riêng cho mục đích OG.
   *
   * "contain" — hiển thị TOÀN BỘ ảnh, không cắt mất phần nào, đặt trong 1
   * khung cố định bên phải (object-contain, giống kỹ thuật facadeAspectRatio
   * + object-contain đã dùng cho ảnh mặt tiền trên trang chi nhánh và trong
   * PlanQuoteCard) trên nền navy thương hiệu — dùng cho ẢNH MẶT TIỀN GỐC
   * (chưa crop riêng cho OG, tỉ lệ dọc/ngang/vuông tuỳ chi nhánh). Vì đọc
   * đúng ảnh gốc `/images/dia-diem-{slug}.jpg` thay vì 1 bản crop 1200x630
   * dựng sẵn, chi nhánh MỚI thêm sau này tự động ra đúng kỹ thuật này,
   * không cần chạy lại bước tạo ảnh OG riêng.
   */
  backgroundFit?: "cover" | "contain";
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
  // Ở chế độ "contain", khung ảnh chiếm dải bên phải rộng 460px (x=740-1200)
  // — thu hẹp cột chữ bên trái để không đè lên ảnh, dù ảnh mặt tiền ngang,
  // dọc hay vuông (contain luôn căn giữa trong khung 460x630 cố định).
  const textWidth = backgroundFit === "contain" ? 620 : 740;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          fontFamily: "Inter",
          backgroundColor: "#0b1f3a",
        }}
      >
        {backgroundFit === "cover" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgSrc}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgSrc}
            alt=""
            width={460}
            height={630}
            style={{ position: "absolute", top: 0, left: 740, objectFit: "contain" }}
          />
        )}
        {/* Same left-to-right wash recipe as the live Hero section, reused
            here so the OG card and the on-site hero read as one brand. Ở
            chế độ "contain", nền đã là navy đặc nên chỉ cần lớp phủ nhẹ hơn
            (không cần tối dần che hết khung ảnh bên phải như ở chế độ cover). */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              backgroundFit === "cover"
                ? "linear-gradient(to right, rgba(9,15,28,0.68) 0%, rgba(9,15,28,0.30) 45%, rgba(9,15,28,0) 65%)"
                : "linear-gradient(to right, rgba(11,31,58,0.5) 0%, rgba(11,31,58,0) 62%)",
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
            width: `${textWidth}px`,
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
            width: `${textWidth}px`,
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
