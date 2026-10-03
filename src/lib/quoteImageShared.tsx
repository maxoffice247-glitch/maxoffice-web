import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { qt, type QuoteLang } from "./quoteImageDictionary";

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
  marginX = MARGIN_X,
}: {
  logoSrc: string;
  badgeLabel: string;
  dateLabel: string;
  /** Lề 2 bên TUỲ CHỌN — mặc định dùng đúng MARGIN_X dùng chung (hành vi cũ,
   * route quote-image/tong-hop không truyền gì vẫn y hệt trước). Route
   * payment-request-image truyền lề RIÊNG (rộng hơn) cho tool đó, KHÔNG đụng
   * tới MARGIN_X dùng chung nên không ảnh hưởng route kia. */
  marginX?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: `48px ${marginX}px 32px`,
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

/** Icon web/email NHỎ, SVG INLINE (không tải ảnh ngoài, không thêm request)
 * — dùng fill tường minh thay vì stroke/currentColor để tương thích chắc
 * chắn với Satori (đã test render thật qua route.tsx trước khi chốt). */
function WebIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "flex" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="2" />
      <path d="M3 12 H21" fill="none" stroke={color} strokeWidth="2" />
      <path d="M12 3 C7 3 7 21 12 21 C17 21 17 3 12 3" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function EmailIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "flex" }}>
      <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <path d="M3 6 L12 13 L21 6" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/** Hotline — Web — Email — nút "Liên hệ ngay" GỘP CHUNG 1 HÀNG NGANG, dàn
 * đều bằng justify-content:"space-between" (trước đây Hotline+Web+Email
 * xếp DỌC 3 dòng bên trái, chỉ nút CTA bên phải — chiếm nhiều chiều cao
 * hơn hẳn). CARD_WIDTH cố định 1080px (ảnh PNG tĩnh, không responsive) nên
 * không cần lo "độ rộng khác nhau" — đã đo thực tế tổng độ rộng 4 phần tử
 * ở cỡ chữ này đủ chỗ trong CONTENT_WIDTH (968px), không tràn/chồng lấn
 * (xem báo cáo cuối phiên). */
export function QuoteFooterRow({
  lang = "vi",
  marginX = MARGIN_X,
}: { lang?: QuoteLang; marginX?: number } = {}) {
  return (
    <div
      style={{
        display: "flex",
        margin: `0 ${marginX}px`,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px solid ${QUOTE_COLOR.line}`,
        paddingTop: 24,
        paddingBottom: 40,
      }}
    >
      <div style={{ display: "flex", fontSize: 18, fontWeight: 800, color: QUOTE_COLOR.navy }}>
        {qt("hotlineLabel", lang)}: 089 8082 188
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: QUOTE_COLOR.bodyText }}>
        <WebIcon color={QUOTE_COLOR.bodyText} />
        www.maxoffice.vn
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: QUOTE_COLOR.bodyText }}>
        <EmailIcon color={QUOTE_COLOR.bodyText} />
        cskh@maxoffice.vn
      </div>
      <div
        style={{
          display: "flex",
          borderRadius: 9999,
          backgroundColor: QUOTE_COLOR.accent,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {qt("contactNowLabel", lang)}
      </div>
    </div>
  );
}
