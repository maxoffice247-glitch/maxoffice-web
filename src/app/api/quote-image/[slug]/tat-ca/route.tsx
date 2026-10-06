import { ImageResponse } from "next/og";
import { buildBranchQuoteModel, PRICE_VAT_NOTE, type BranchQuoteModel, type BranchQuotePlan, type PromoGroup } from "@/lib/branchPlansQuote";
import {
  CARD_WIDTH,
  MARGIN_X,
  CONTENT_WIDTH,
  QUOTE_COLOR,
  loadQuoteImageFonts,
  loadQuoteImageLogo,
  QuoteHeaderRow,
  QuoteFooterRow,
} from "@/lib/quoteImageShared";

/**
 * Ảnh "Báo giá tất cả các gói của chi nhánh" (GET /api/quote-image/{slug}/tat-ca) — so sánh MỌI gói của 1 chi nhánh trong 1 ảnh để gửi khách mới tìm hiểu rồi chọn
 * (thay cho việc gửi 3 ảnh báo giá từng gói). Segment tĩnh "tat-ca" luôn thắng segment động [plan] của route ảnh từng gói nên route đó không bị ảnh hưởng.
 *
 * DỮ LIỆU: toàn bộ lấy qua buildBranchQuoteModel() (src/lib/branchPlansQuote.ts) — cùng nguồn với ảnh từng gói, không viết cứng giá/tên gói/ưu đãi. Không có tổng cộng,
 * không QR, không nhãn "bán chạy/khuyên dùng". Chi nhánh chỉ có 1 gói -> 404 (dùng ảnh báo giá gói). Font/logo dùng chung với route ảnh báo giá tổng hợp (quoteImageShared).
 *
 * BỐ CỤC: 2-3 gói xếp CẠNH NHAU (mỗi gói 1 cột); từ 4 gói xếp lưới 2 cột; các thẻ cùng hàng cao bằng nhau. Ưu đãi hợp đồng dài hạn gộp thành khối toàn bề ngang dưới các
 * thẻ. Satori cần chiều cao cố định nên chiều cao ước lượng theo số gói và độ dài chữ (hằng số bên dưới hiệu chỉnh bằng pixel thật; ước lượng thiên về dư).
 */
export const runtime = "nodejs";

const FONT = 17; // cỡ chữ quyền lợi — không nhỏ hơn mức các ảnh báo giá khác
const FEATURE_LINE_H = 23;
const FEATURE_GAP = 12;
const CARD_PAD = 24;
const GRID_GAP = 20;

function columnsFor(n: number): number {
  return n <= 3 ? n : 2;
}

function cardWidthFor(n: number): number {
  const cols = columnsFor(n);
  return Math.floor((CONTENT_WIDTH - GRID_GAP * (cols - 1)) / cols);
}

/** Số ký tự/dòng ước lượng theo bề rộng khả dụng và cỡ chữ (hệ số px/ký tự thiên về lớn để dư dòng hơn thiếu: xuống dòng theo từ làm mất 1 phần bề rộng mỗi dòng). */
function charsPerLine(widthPx: number, fontPx: number, wide = false): number {
  return Math.max(8, Math.floor(widthPx / (fontPx * (wide ? 0.62 : 0.56))));
}

function lines(text: string, widthPx: number, fontPx: number, wide = false): number {
  return Math.max(1, Math.ceil(text.length / charsPerLine(widthPx, fontPx, wide)));
}

function planCardHeight(plan: BranchQuotePlan, cardW: number): number {
  const inner = cardW - CARD_PAD * 2;
  const featureW = inner - 24 - 10; // trừ icon ✓ + khoảng cách
  let h = CARD_PAD * 2;
  h += 22 + 6; // tên gói
  h += 48; // giá
  h += 22; // ghi chú VAT
  h += 16 + 1 + 16; // đường kẻ
  if (plan.highlights.includesPlanName) h += lines(`Gồm tất cả quyền lợi gói ${plan.highlights.includesPlanName}, thêm:`, inner, 16, true) * 21 + 10;
  h += plan.highlights.items.reduce((sum, f, i) => sum + lines(f, featureW, FONT) * FEATURE_LINE_H + (i > 0 ? FEATURE_GAP : 0), 0);
  if (plan.highlights.more > 0) h += 10 + 21;
  if (plan.oneTimeFeeLine) h += 14 + 1 + 14 + lines(plan.oneTimeFeeLine, inner, 16, true) * 22;
  return h + 6; // dư an toàn: Satori cần chiều cao cố định, thà thừa vài px còn hơn ép/cắt chữ
}

function promoBlockHeight(groups: PromoGroup[]): number {
  if (groups.length === 0) return 0;
  const bodyW = CONTENT_WIDTH - 40;
  let h = 32 + 2 + 36 + 22; // lề trên + viền + padding + tiêu đề
  for (const g of groups) {
    if (groups.length > 1) h += 6 + 22; // nhãn nhóm
    for (const l of g.lines) h += 6 + lines(l, bodyW - 14, 16) * 22;
    h += 8;
  }
  return h;
}

function layoutHeights(model: BranchQuoteModel) {
  const n = model.plans.length;
  const cols = columnsFor(n);
  const cardW = cardWidthFor(n);
  const heights = model.plans.map((p) => planCardHeight(p, cardW));
  const rows: number[] = [];
  for (let i = 0; i < n; i += cols) rows.push(Math.max(...heights.slice(i, i + cols)));
  const gridH = rows.reduce((s, r) => s + r, 0) + GRID_GAP * (rows.length - 1);
  return { cols, cardW, rows, gridH };
}

function PlanCard({ plan, width, minHeight }: { plan: BranchQuotePlan; width: number; minHeight: number }) {
  const hl = plan.highlights;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        height: minHeight,
        borderRadius: 20,
        backgroundColor: QUOTE_COLOR.bgTint,
        padding: CARD_PAD,
      }}
    >
      <div style={{ display: "flex", flexShrink: 0, fontSize: 17, fontWeight: 700, letterSpacing: 1, color: QUOTE_COLOR.primary, textTransform: "uppercase", marginBottom: 6 }}>
        Gói {plan.planName}
      </div>
      <div style={{ display: "flex", flexShrink: 0, fontSize: 40, fontWeight: 800, color: QUOTE_COLOR.accent, lineHeight: "48px" }}>{plan.priceText}</div>
      <div style={{ display: "flex", flexShrink: 0, fontSize: 16, color: QUOTE_COLOR.bodyText, lineHeight: "22px" }}>{PRICE_VAT_NOTE}</div>
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${QUOTE_COLOR.line}` }}>
        {hl.includesPlanName && (
          <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy, lineHeight: "21px", marginBottom: 10 }}>
            Gồm tất cả quyền lợi gói {hl.includesPlanName}, thêm:
          </div>
        )}
        {hl.items.map((f, i) => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: i > 0 ? FEATURE_GAP : 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                flexShrink: 0,
                borderRadius: 9999,
                backgroundColor: QUOTE_COLOR.primaryTint,
                color: QUOTE_COLOR.primary,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ✓
            </div>
            <div style={{ display: "flex", flex: 1, fontSize: FONT, color: QUOTE_COLOR.ink, lineHeight: `${FEATURE_LINE_H}px` }}>{f}</div>
          </div>
        ))}
        {hl.more > 0 && (
          <div style={{ display: "flex", marginTop: 10, fontSize: 16, fontStyle: "italic", color: QUOTE_COLOR.bodyText, lineHeight: "21px" }}>
            + {hl.more} quyền lợi khác
          </div>
        )}
      </div>
      {plan.oneTimeFeeLine && (
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${QUOTE_COLOR.line}`,
            fontSize: 16,
            fontWeight: 600,
            color: "#b45309",
            lineHeight: "22px",
          }}
        >
          {plan.oneTimeFeeLine}
        </div>
      )}
    </div>
  );
}

function PromoBlock({ groups }: { groups: PromoGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: `0 ${MARGIN_X}px`,
        marginTop: 32,
        borderRadius: 16,
        border: "1px solid rgba(220,53,48,0.25)",
        backgroundColor: "rgba(220,53,48,0.08)",
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.accent, lineHeight: "22px" }}>🎁 Ưu đãi khi ký hợp đồng dài hạn</div>
      {groups.map((g, gi) => (
        <div key={gi} style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
          {groups.length > 1 && (
            <div style={{ display: "flex", marginTop: 6, fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy, lineHeight: "22px" }}>
              Áp dụng cho gói {g.planNames.join(", ")}
            </div>
          )}
          {g.lines.map((l) => (
            <div key={l} style={{ display: "flex", marginTop: 6, fontSize: 16, color: QUOTE_COLOR.ink, lineHeight: "22px" }}>
              <div style={{ display: "flex", width: 14, flexShrink: 0 }}>•</div>
              <div style={{ display: "flex", flex: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = buildBranchQuoteModel(slug);
  if (!model) return new Response("Không tìm thấy chi nhánh này.", { status: 404 });
  if (model.plans.length < 2) {
    return new Response("Chi nhánh này chỉ có 1 gói — dùng ảnh báo giá của gói đó (/api/quote-image/{slug}/{plan}).", { status: 404 });
  }

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);
  const dateLabel = `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`;

  const { cols, cardW, rows, gridH } = layoutHeights(model);
  const HEADER_H = 148;
  const BRANCH_BLOCK_H = 36 + 6 + lines(model.address, CONTENT_WIDTH, 18) * 26 + 28;
  const FOOTER_H = 140;
  const height = HEADER_H + BRANCH_BLOCK_H + gridH + promoBlockHeight(model.promoGroups) + FOOTER_H;

  // Thẻ xếp theo hàng; mỗi hàng có chiều cao = thẻ cao nhất trong hàng (các thẻ cùng hàng cao bằng nhau).
  const rowsOfPlans: BranchQuotePlan[][] = [];
  for (let i = 0; i < model.plans.length; i += cols) rowsOfPlans.push(model.plans.slice(i, i + cols));

  return new ImageResponse(
    (
      <div style={{ width: CARD_WIDTH, height, display: "flex", flexDirection: "column", backgroundColor: "#ffffff", fontFamily: "Inter" }}>
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel="Bảng giá văn phòng ảo" dateLabel={dateLabel} />

        <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px` }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: QUOTE_COLOR.navy, lineHeight: "36px" }}>{model.locationName}</div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 18, color: QUOTE_COLOR.bodyText, lineHeight: "26px" }}>{model.address}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: GRID_GAP, margin: `0 ${MARGIN_X}px`, marginTop: 28 }}>
          {rowsOfPlans.map((row, ri) => (
            <div key={ri} style={{ display: "flex", flexDirection: "row", gap: GRID_GAP }}>
              {row.map((plan) => (
                <PlanCard key={plan.planKey} plan={plan} width={cardW} minHeight={rows[ri]} />
              ))}
            </div>
          ))}
        </div>

        <PromoBlock groups={model.promoGroups} />

        <QuoteFooterRow hotlineIcon />
      </div>
    ),
    {
      width: CARD_WIDTH,
      height,
      fonts,
      headers: { "Cache-Control": "public, max-age=3600" },
    }
  );
}
