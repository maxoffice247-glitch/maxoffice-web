import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPlanGroup, formatVoPrice, type PlanGroup } from "@/lib/planFinder";

/**
 * Bản báo giá TỔNG HỢP (1 gói áp dụng ở NHIỀU chi nhánh) render ở server —
 * xem chú thích đầy đủ ở route anh em cùng thư mục cha
 * (src/app/api/quote-image/[slug]/[plan]/route.tsx, báo giá 1 chi nhánh):
 * cùng lý do (hạn chế đã biết của html-to-image trên Safari khi rasterize
 * ảnh raster bên trong SVG <foreignObject> dùng làm nguồn ảnh) và cùng cách
 * giải quyết (render PNG sẵn ở server, trình duyệt khách chỉ tải về).
 *
 * Nội dung tái tạo lại từ PlanGroupQuoteCard.tsx (bản DOM cũ), với 1 khác
 * biệt bắt buộc: Satori (next/og) chỉ hỗ trợ Flexbox, KHÔNG hỗ trợ CSS
 * Grid — bản cũ dùng `display:grid` + `col-span-2` cho khối khuyến mãi
 * chung full-width xen giữa các thẻ chi nhánh 2 cột. Ở đây thay bằng cách
 * gói các khối thành TỪNG HÀNG (`groupIntoRows`) rồi render mỗi hàng là 1
 * flex row — 1 khối full-width chiếm nguyên 1 hàng, khối thường ghép cặp
 * 2/hàng — tương đương về mặt thị giác, không cần "ô đệm" như bản CSS Grid
 * (withGridFillers) vì hàng chỉ chứa đúng số khối cần render.
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
const GAP = 16;
const COL_WIDTH = (CONTENT_WIDTH - GAP) / 2;
const COLOR = {
  primary: "#1565c0",
  primaryTint: "#e9f2fc",
  navy: "#0b1f3a",
  ink: "#0f1b2d",
  bodyText: "#4b5768",
  line: "#e5e9f0",
  bgTint: "#f3f7fc",
  accent: "#dc3530",
  amberDark: "#b45309",
};

type PlanGroupLocation = PlanGroup["locations"][number];
type LocationGroup = { locations: PlanGroupLocation[]; promotions: string[] | null };

// Giữ nguyên logic gộp từ PlanGroupQuoteCard.tsx (bản DOM cũ).
function buildLocationGroups(locations: PlanGroupLocation[]): LocationGroup[] {
  const groups: LocationGroup[] = [];
  const keyToGroupIndex = new Map<string, number>();
  for (const loc of locations) {
    if (!loc.promotions || loc.promotions.length === 0) {
      groups.push({ locations: [loc], promotions: null });
      continue;
    }
    const key = JSON.stringify(loc.promotions);
    const existingIndex = keyToGroupIndex.get(key);
    if (existingIndex !== undefined) {
      groups[existingIndex].locations.push(loc);
    } else {
      keyToGroupIndex.set(key, groups.length);
      groups.push({ locations: [loc], promotions: loc.promotions });
    }
  }
  return groups;
}

type Block = { key: string; fullWidth: boolean; heightEstimate: number; render: () => React.ReactNode };

/** Gói các khối thành từng hàng — 1 khối full-width luôn chiếm riêng 1
    hàng; khối thường ghép cặp 2/hàng theo đúng thứ tự xuất hiện. */
function groupIntoRows(blocks: Block[], useGrid: boolean): Block[][] {
  if (!useGrid) return blocks.map((b) => [b]);
  const rows: Block[][] = [];
  let current: Block[] = [];
  for (const b of blocks) {
    if (b.fullWidth) {
      if (current.length) rows.push(current);
      rows.push([b]);
      current = [];
    } else {
      current.push(b);
      if (current.length === 2) {
        rows.push(current);
        current = [];
      }
    }
  }
  if (current.length) rows.push(current);
  return rows;
}

function FeatureRow({ text, width }: { text: string; width?: number }) {
  // KHÔNG truyền `width: undefined` tường minh vào style (dù chỉ để "không
  // set gì") — Satori xử lý style object bằng cách duyệt qua MỌI key có
  // mặt, kể cả khi giá trị là undefined, và crash ("Cannot read properties
  // of undefined (reading 'trim')") thay vì bỏ qua như style DOM bình
  // thường. Dùng spread có điều kiện để hẳn KHÔNG có key `width` khi không
  // truyền vào (nhánh 1 cột, không cần ép chiều rộng từng dòng).
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, ...(width !== undefined ? { width } : {}) }}>
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

export async function GET(_req: Request, { params }: { params: Promise<{ groupKey: string }> }) {
  const { groupKey } = await params;
  const group = getPlanGroup(groupKey);
  if (!group) return new Response("Không tìm thấy nhóm gói này.", { status: 404 });

  if (!fontsPromise) fontsPromise = loadFonts();
  if (!logoPromise) logoPromise = loadLogo();

  const facadeBufs = await Promise.all(
    group.locations.map((loc) =>
      readFile(join(process.cwd(), "public", "images", "quote", `dia-diem-${loc.slug}.jpg`)).catch(() => null)
    )
  );
  const [fonts, logoSrc] = await Promise.all([fontsPromise, logoPromise]);
  const facadeBySlug = new Map(
    group.locations.map((loc, i) => {
      const buf = facadeBufs[i];
      return [loc.slug, buf ? `data:image/jpeg;base64,${buf.toString("base64")}` : null] as const;
    })
  );

  const features = group.features.slice(0, 9);
  const useFeatureGrid = features.length >= 6;
  const featureRows = Math.ceil(features.length / (useFeatureGrid ? 2 : 1));
  const leftFeatures = useFeatureGrid ? features.slice(0, featureRows) : features;
  const rightFeatures = useFeatureGrid ? features.slice(featureRows) : [];

  const useLocationGrid = group.locations.length >= 6;
  const locationGroups = buildLocationGroups(group.locations);

  const blocks: Block[] = locationGroups.flatMap((grp, grpIndex): Block[] => {
    const isSharedGroup = grp.promotions !== null && grp.locations.length >= 2;
    const hasPrivatePromo = grp.promotions !== null && grp.locations.length === 1;
    const cardWidth = useLocationGrid ? COL_WIDTH : CONTENT_WIDTH;
    const locationCards: Block[] = grp.locations.map((loc) => {
      const facadeSrc = facadeBySlug.get(loc.slug) ?? null;
      const privateLine = hasPrivatePromo ? grp.promotions!.slice(0, 3).join(" · ") : null;
      return {
        key: loc.slug,
        fullWidth: hasPrivatePromo,
        heightEstimate: Math.max(85, 44) + 24 + (privateLine ? 26 : 0),
        render: () => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: hasPrivatePromo ? CONTENT_WIDTH : cardWidth,
              borderRadius: 16,
              backgroundColor: COLOR.bgTint,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 64,
                height: 85,
                flexShrink: 0,
                borderRadius: 12,
                backgroundColor: "#fff",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {facadeSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={facadeSrc} alt="" width={64} height={85} style={{ objectFit: "contain" }} />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", fontSize: 19, fontWeight: 700, color: COLOR.navy }}>{loc.name}</div>
              <div style={{ display: "flex", marginTop: 2, fontSize: 15, color: COLOR.bodyText }}>
                {loc.shortAddress}
              </div>
              {privateLine && (
                <div style={{ display: "flex", marginTop: 4, fontSize: 13, color: COLOR.accent, lineHeight: 1.4 }}>
                  🎁 {privateLine}
                </div>
              )}
            </div>
          </div>
        ),
      };
    });
    if (!isSharedGroup) return locationCards;
    const promoLines = grp.promotions!.slice(0, 4);
    return [
      ...locationCards,
      {
        key: `shared-promo-${grpIndex}`,
        fullWidth: true,
        heightEstimate: 20 + promoLines.length * 22 + 28,
        render: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: CONTENT_WIDTH,
              borderRadius: 12,
              border: `1px solid rgba(220,53,48,0.25)`,
              backgroundColor: "rgba(220,53,48,0.08)",
              padding: "14px 20px",
            }}
          >
            <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: COLOR.accent, marginBottom: 4 }}>
              🎁 Ưu đãi chung cho các chi nhánh trên
            </div>
            {promoLines.map((p) => (
              <div key={p} style={{ display: "flex", fontSize: 14, color: COLOR.ink, lineHeight: 1.4, marginTop: 4 }}>
                • {p}
              </div>
            ))}
          </div>
        ),
      },
    ];
  });

  const rows = groupIntoRows(blocks, useLocationGrid);

  // ---- Ước lượng chiều cao ----
  const HEADER_H = 136;
  const priceBlockContentH = 48 + (group.addonNote ? 20 + 40 : 0);
  const PRICE_BLOCK_H = 56 + priceBlockContentH;
  const FEATURES_BLOCK_H = 36 + 44 + featureRows * 50;
  const rowsHeight = rows.reduce((sum, row) => sum + Math.max(...row.map((b) => b.heightEstimate)), 0);
  const rowsGap = Math.max(0, rows.length - 1) * 16;
  const LOCATIONS_BLOCK_H = 36 + 44 + rowsHeight + rowsGap;
  const FOOTER_H = 36 + 28 + 60 + 48;
  const height = HEADER_H + PRICE_BLOCK_H + FEATURES_BLOCK_H + LOCATIONS_BLOCK_H + FOOTER_H;

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
            Báo giá tổng hợp
          </div>
        </div>

        {/* Gói + giá */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: `0 ${MARGIN_X}px`,
            borderRadius: 16,
            backgroundColor: COLOR.bgTint,
            padding: "28px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                Gói {group.planName}
              </div>
              <div style={{ display: "flex", marginTop: 4, fontSize: 15, color: COLOR.bodyText }}>
                Văn phòng ảo · Áp dụng tại {group.locations.length} chi nhánh
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: COLOR.accent }}>
                {formatVoPrice(group.price)}
              </div>
              <div style={{ display: "flex", fontSize: 15, color: COLOR.bodyText }}>/tháng · chưa gồm VAT 10%</div>
            </div>
          </div>
          {group.addonNote && (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                paddingTop: 16,
                borderTop: `1px solid ${COLOR.line}`,
                fontSize: 14,
                color: COLOR.amberDark,
                lineHeight: 1.5,
              }}
            >
              * {group.addonNote}
            </div>
          )}
        </div>

        {/* Danh sách tính năng */}
        <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: COLOR.navy, marginBottom: 20 }}>
            Tính năng đi kèm
          </div>
          {useFeatureGrid ? (
            <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {leftFeatures.map((f) => (
                  <FeatureRow key={f} text={f} width={COL_WIDTH - 16} />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {rightFeatures.map((f) => (
                  <FeatureRow key={f} text={f} width={COL_WIDTH - 16} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {leftFeatures.map((f) => (
                <FeatureRow key={f} text={f} />
              ))}
            </div>
          )}
        </div>

        {/* Danh sách chi nhánh áp dụng */}
        <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: COLOR.navy, marginBottom: 20 }}>
            Áp dụng tại {group.locations.length} chi nhánh
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "row", gap: 16 }}>
                {row.map((b) => (
                  <div key={b.key} style={{ display: "flex" }}>
                    {b.render()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            margin: `0 ${MARGIN_X}px`,
            marginTop: 36,
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
