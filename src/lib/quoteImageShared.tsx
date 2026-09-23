import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Phần dùng chung (màu, load font/logo, header/footer) CHỈ cho route ảnh
 * báo giá TỔNG HỢP mới (src/app/api/quote-image/tong-hop/route.tsx).
 *
 * CỐ Ý không đụng tới 2 route ảnh báo giá hiện có
 * (src/app/api/quote-image/[slug]/[plan]/route.tsx và
 * src/app/api/quote-image/goi/[groupKey]/route.tsx) — 2 route đó đang chạy
 * ổn định, mỗi route tự khai báo COLOR/load font/load logo riêng của nó
 * (xem chú thích trong 2 file đó). Module này KHÔNG thay thế hay refactor
 * lại 2 route đó, chỉ tránh bản sao thứ 3 của cùng logic cho route mới.
 */

export const CARD_WIDTH = 1080;
export const MARGIN_X = 56;
export const CONTENT_WIDTH = CARD_WIDTH - MARGIN_X * 2;

export const QUOTE_COLOR = {
  primary: "#1565c0",
  primaryTint: "#e9f2fc",
  navy: "#0b1f3a",
  ink: "#0f1b2d",
  bodyText: "#4b5768",
  line: "#e5e9f0",
  bgTint: "#f3f7fc",
  accent: "#dc3530",
} as const;

let fontsPromise: ReturnType<typeof loadFontsInternal> | null = null;
let logoPromise: ReturnType<typeof loadLogoInternal> | null = null;

async function loadFontsInternal() {
  // Inter, không dùng Be Vietnam Pro — cùng lý do đã ghi chú ở og.tsx/2
  // route quote-image hiện có: TTF của Be Vietnam Pro lỗi đo bề rộng glyph
  // trong Satori, chèn khoảng trắng lạ sau vài từ có dấu.
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

async function loadLogoInternal() {
  return readFile(join(process.cwd(), "public/images/logo-red.png")).then(
    (data) => `data:image/png;base64,${data.toString("base64")}`
  );
}

/** Cache theo tiến trình server (module-level) — cùng kiểu cache đã dùng ở
 * 2 route quote-image hiện có, tránh đọc lại font/logo mỗi request. Đường
 * dẫn đọc ở đây là CHUỖI TĨNH (không phụ thuộc tham số runtime nào) nên,
 * khác với route [slug]/[plan] (đọc ảnh mặt tiền theo `slug`), route này
 * KHÔNG cần khai báo thêm gì trong `outputFileTracingIncludes` — Next.js tự
 * dò được đường dẫn tĩnh lúc build, giống og.tsx. */
export function loadQuoteImageFonts() {
  if (!fontsPromise) fontsPromise = loadFontsInternal();
  return fontsPromise;
}

export function loadQuoteImageLogo() {
  if (!logoPromise) logoPromise = loadLogoInternal();
  return logoPromise;
}

export function QuoteHeaderRow({
  logoSrc,
  badgeLabel,
  dateLabel,
}: {
  logoSrc: string;
  badgeLabel: string;
  dateLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: `48px ${MARGIN_X}px 32px`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} alt="" width={283} height={56} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            borderRadius: 9999,
            backgroundColor: QUOTE_COLOR.navy,
            padding: "10px 24px",
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {badgeLabel}
        </div>
        <div style={{ display: "flex", marginTop: 8, fontSize: 13, color: QUOTE_COLOR.bodyText }}>
          {dateLabel}
        </div>
      </div>
    </div>
  );
}

export function QuoteFooterRow() {
  return (
    <div
      style={{
        display: "flex",
        margin: `0 ${MARGIN_X}px`,
        marginTop: 40,
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px solid ${QUOTE_COLOR.line}`,
        paddingTop: 28,
        paddingBottom: 48,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.navy }}>
          Hotline: 089 8082 188
        </div>
        <div style={{ display: "flex", marginTop: 4, fontSize: 16, color: QUOTE_COLOR.bodyText }}>
          maxoffice.vn
        </div>
      </div>
      <div
        style={{
          display: "flex",
          borderRadius: 9999,
          backgroundColor: QUOTE_COLOR.accent,
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Liên hệ tư vấn ngay
      </div>
    </div>
  );
}
