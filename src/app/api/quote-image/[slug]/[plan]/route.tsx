import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getOfferedPlan, formatVoPrice } from "@/lib/planFinder";
import { LOCATIONS_DATA, resolveTimedPromotions } from "@/lib/locationsData";

/**
 * Tạo ảnh báo giá 1 chi nhánh HOÀN TOÀN Ở SERVER (Satori/next-og), thay cho
 * luồng cũ chụp lại DOM off-screen bằng html-to-image ở trình duyệt
 * (PlanQuoteCard.tsx + waitForImages.ts). Sau 4 lần sửa lỗi thiếu ảnh
 * mặt tiền/logo trên iPhone (fetch nội bộ lỗi, PNG phình dung lượng, thiếu
 * width/height <img>, card đặt quá xa khung nhìn) mà lỗi vẫn còn — kể cả
 * khi đã xác nhận qua ảnh chụp màn hình thật từ máy lỗi rằng BOTH logo lẫn
 * ảnh mặt tiền đều trắng trơn ngay trong bước xem trước (không phải lỗi
 * hiển thị/chia sẻ sau đó) — nguyên nhân nhiều khả năng là hạn chế ĐÃ BIẾT
 * và không vá được ở tầng ứng dụng của html-to-image trên Safari/WebKit:
 * thư viện này đóng gói toàn bộ nội dung vào 1 SVG rồi nạp SVG đó như 1
 * "ảnh" (`data:image/svg+xml...`) để rasterize — Safari có chính sách bảo
 * mật riêng cho "SVG dùng làm ảnh" thường từ chối vẽ ảnh raster nhúng BÊN
 * TRONG <foreignObject> trong ngữ cảnh đó, bất kể ảnh đó đã nhúng đúng
 * data URL hay chưa. Đây là lỗi nổi tiếng của cả họ thư viện
 * html2canvas/dom-to-image/html-to-image trên Safari, không sửa được bằng
 * cách tinh chỉnh thêm ở phía DOM/CSS.
 *
 * Render ở server né hoàn toàn vấn đề này: trình duyệt của khách CHỈ tải về
 * 1 file PNG đã dựng sẵn, không cần tự "chụp" hay rasterize gì cả.
 *
 * Tái sử dụng nguyên hạ tầng renderOgImage() đã có (src/lib/og.tsx): đọc
 * font Inter (không dùng Be Vietnam Pro — TTF của Be Vietnam Pro có lỗi đo
 * bề rộng glyph trong satori, xem og.tsx) + đọc ảnh cục bộ qua
 * readFile -> base64 data URL (không fetch qua mạng).
 *
 * QUAN TRỌNG: route này đọc file trong public/images/quote/ và
 * public/images/logo-red.png lúc RUNTIME (biến `slug`) — phải khai báo
 * trong `outputFileTracingIncludes` (next.config.ts), nếu không sẽ
 * ENOENT trên Vercel dù `next build` local vẫn sạch (xem chú thích trong
 * next.config.ts, đã từng xảy ra với chính renderOgImage()).
 */
export const runtime = "nodejs";

let fontsPromise: ReturnType<typeof loadFonts> | null = null;
let logoPromise: ReturnType<typeof loadLogo> | null = null;

async function loadFonts() {
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
  const data = await readFile(join(process.cwd(), "public/images/logo-red.png"));
  return `data:image/png;base64,${data.toString("base64")}`;
}

const CARD_WIDTH = 1080;
const MARGIN_X = 56;
const CONTENT_WIDTH = CARD_WIDTH - MARGIN_X * 2;
const COLOR = {
  primary: "#1565c0",
  primaryTint: "#e9f2fc",
  navy: "#0b1f3a",
  ink: "#0f1b2d",
  bodyText: "#4b5768",
  line: "#e5e9f0",
  bgTint: "#f3f7fc",
  accent: "#dc3530",
};

/**
 * Khối "Tiện ích nổi bật tại chi nhánh này" — CHỈ cho các gói có tính năng
 * THÊM so với gói chuẩn cùng tên ở chi nhánh khác (superset; xem
 * SUPERSET_EXTRA_FEATURES ở planFinder.ts), để khách thấy ngay điểm khác
 * biệt. Khoá `${slug}__${planKey}`; gói/chi nhánh khác không có khối này.
 */
const HIGHLIGHTS: Record<string, { icon: "users" | "user-check"; title: string; desc: string }[]> = {
  "song-thao__lite": [
    { icon: "users", title: "Phòng họp", desc: "Có sẵn tại trụ sở chính" },
    { icon: "user-check", title: "Lễ tân", desc: "Tiếp đón & nhận thư, bưu phẩm" },
  ],
};

const ICON_PATHS = {
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "user-check":
    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/>',
} as const;

// SVG nhúng qua data URI trong <img> — Satori không xử lý ổn <svg> có Fragment/nhiều node con dạng JSX.
function HighlightIcon({ kind }: { kind: "users" | "user-check" }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${COLOR.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[kind]}</svg>`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} alt="" width={22} height={22} />;
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 9999,
          backgroundColor: COLOR.primaryTint,
          color: COLOR.primary,
          fontSize: 15,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div style={{ display: "flex", fontSize: 19, color: COLOR.ink, lineHeight: 1.35 }}>{text}</div>
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; plan: string }> }) {
  const { slug, plan: planKey } = await params;
  const plan = getOfferedPlan(slug, planKey);
  const location = LOCATIONS_DATA[slug];
  if (!plan || !location) {
    return new Response("Không tìm thấy gói/chi nhánh này.", { status: 404 });
  }

  if (!fontsPromise) fontsPromise = loadFonts();
  if (!logoPromise) logoPromise = loadLogo();

  const facadePath = join(process.cwd(), "public", "images", "quote", `dia-diem-${slug}.jpg`);
  const [fonts, logoSrc, facadeBuf] = await Promise.all([
    fontsPromise,
    logoPromise,
    readFile(facadePath).catch(() => null),
  ]);
  const facadeSrc = facadeBuf ? `data:image/jpeg;base64,${facadeBuf.toString("base64")}` : null;

  const benefits = (location.benefits ?? []).slice(0, 4).map((b) => b.title);
  const promotions = (resolveTimedPromotions(location.promotions) ?? []).slice(0, 4);
  const features = plan.features.slice(0, 9);
  const highlights = HIGHLIGHTS[`${slug}__${planKey}`] ?? [];
  // Cùng quy tắc chia cột với PlanQuoteCard.tsx (bản DOM cũ): từ 6 tính
  // năng trở lên chia 2 cột, cột trái lấp đầy trước — 9 -> 5/4.
  const useGrid = features.length >= 6;
  const featureRows = Math.ceil(features.length / (useGrid ? 2 : 1));
  const leftCol = useGrid ? features.slice(0, featureRows) : features;
  const rightCol = useGrid ? features.slice(featureRows) : [];

  // ---- Ước lượng chiều cao card ----
  // Satori/ImageResponse cần width/height CỐ ĐỊNH truyền vào trước khi
  // render — khác hẳn DOM thật (height: auto tự co theo nội dung). Tính
  // gần đúng theo nội dung thực tế (số tính năng, có/không benefits và
  // khuyến mãi) rồi cộng thêm biên độ dư để tránh cắt mất nội dung — dư
  // khoảng trắng cuối card chấp nhận được hơn nhiều so với bị cắt nội dung.
  const HEADER_H = 136;
  const infoColH =
    70 + // tên chi nhánh (có thể 2 dòng)
    56 + // địa chỉ (có thể 2 dòng)
    (benefits.length ? 16 + 40 : 0) +
    (promotions.length ? 16 + 26 + promotions.length * 24 : 0) +
    (highlights.length ? 20 + 26 + highlights.length * 52 : 0);
  const PHOTO_BLOCK_H = Math.max(360, infoColH) + 48 + 32;
  const PRICE_BLOCK_H = 40 + 104;
  const FEATURES_BLOCK_H = 36 + 44 + featureRows * 50;
  const FOOTER_H = 40 + 28 + 60 + 48;
  const height = HEADER_H + PHOTO_BLOCK_H + PRICE_BLOCK_H + FEATURES_BLOCK_H + FOOTER_H;

  return new ImageResponse(
    (
      <div
        style={{
          width: CARD_WIDTH,
          height,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `48px ${MARGIN_X}px 32px`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={283} height={56} />
          <div
            style={{
              display: "flex",
              borderRadius: 9999,
              backgroundColor: COLOR.navy,
              padding: "10px 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Báo giá
          </div>
        </div>

        {/* Ảnh mặt tiền + thông tin chi nhánh */}
        <div
          style={{
            display: "flex",
            margin: `0 ${MARGIN_X}px`,
            marginTop: 32,
            alignItems: "center",
            gap: 28,
            borderRadius: 24,
            backgroundColor: COLOR.bgTint,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 270,
              height: 360,
              flexShrink: 0,
              borderRadius: 16,
              backgroundColor: "#fff",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {facadeSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={facadeSrc} alt="" width={270} height={360} style={{ objectFit: "contain" }} />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: COLOR.navy, lineHeight: 1.2 }}>
              {plan.locationName}
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 18, color: COLOR.bodyText, lineHeight: 1.4 }}>
              {location.address}
            </div>
            {benefits.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {benefits.map((title) => (
                  <div
                    key={title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 9999,
                      backgroundColor: COLOR.primaryTint,
                      padding: "7px 14px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLOR.primary,
                    }}
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
            {promotions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
                <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: COLOR.accent, marginBottom: 6 }}>
                  🎁 Ưu đãi khi ký hợp đồng dài hạn
                </div>
                {promotions.map((p) => (
                  <div key={p} style={{ display: "flex", fontSize: 14, color: COLOR.ink, lineHeight: 1.4, marginBottom: 4 }}>
                    • {p}
                  </div>
                ))}
              </div>
            )}
            {highlights.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 20,
                  borderRadius: 16,
                  border: `1px solid ${COLOR.primary}`,
                  backgroundColor: "#ffffff",
                  padding: "14px 18px",
                }}
              >
                <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: COLOR.primary, marginBottom: 10 }}>
                  Tiện ích nổi bật tại chi nhánh này
                </div>
                {highlights.map((h) => (
                  <div key={h.title} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 9999,
                        backgroundColor: COLOR.primaryTint,
                        flexShrink: 0,
                      }}
                    >
                      <HighlightIcon kind={h.icon} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: COLOR.navy }}>{h.title}</div>
                      <div style={{ display: "flex", fontSize: 14, color: COLOR.bodyText }}>{h.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gói + giá */}
        <div
          style={{
            display: "flex",
            margin: `0 ${MARGIN_X}px`,
            marginTop: 40,
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 16,
            backgroundColor: COLOR.bgTint,
            padding: "28px 32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 1,
                color: COLOR.primary,
                textTransform: "uppercase",
              }}
            >
              Gói {plan.planName}
            </div>
            <div style={{ display: "flex", marginTop: 4, fontSize: 15, color: COLOR.bodyText }}>
              Văn phòng ảo · {plan.area.name}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: COLOR.accent }}>
              {formatVoPrice(plan.price)}
            </div>
            <div style={{ display: "flex", fontSize: 15, color: COLOR.bodyText }}>/tháng · chưa gồm VAT 10%</div>
          </div>
        </div>

        {/* Danh sách tính năng */}
        <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: COLOR.navy, marginBottom: 20 }}>
            Tính năng đi kèm
          </div>
          {useGrid ? (
            <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, width: (CONTENT_WIDTH - 32) / 2 }}>
                {leftCol.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, width: (CONTENT_WIDTH - 32) / 2 }}>
                {rightCol.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {leftCol.map((f) => (
                <FeatureRow key={f} text={f} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            margin: `0 ${MARGIN_X}px`,
            marginTop: 40,
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${COLOR.line}`,
            paddingTop: 28,
            paddingBottom: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: COLOR.navy }}>
              Hotline: 089 8082 188
            </div>
            <div style={{ display: "flex", marginTop: 4, fontSize: 16, color: COLOR.bodyText }}>maxoffice.vn</div>
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 9999,
              backgroundColor: COLOR.accent,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Liên hệ tư vấn ngay
          </div>
        </div>
      </div>
    ),
    {
      width: CARD_WIDTH,
      height,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
