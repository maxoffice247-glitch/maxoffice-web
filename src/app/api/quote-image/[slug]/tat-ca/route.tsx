import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildBranchQuoteModel, isNegativeFeature, PRICE_VAT_NOTE, type BranchQuoteModel, type BranchQuotePlan, type PromoGroup } from "@/lib/branchPlansQuote";
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
 * BỐ CỤC (từ trên xuống): header chung -> KHỐI GIỚI THIỆU: ảnh mặt tiền toà nhà bên trái (cùng file public/images/quote/dia-diem-{slug}.jpg với ảnh từng gói; khung theo ĐÚNG tỉ lệ
 * ảnh — ảnh dọc hẹp, ảnh ngang rộng — nên không viền trắng/không cắt) + bên phải tên chi nhánh, địa chỉ pháp lý và khung ưu đãi hợp đồng dài hạn (gộp theo nhóm gói) để khối cân với
 * ảnh -> các thẻ gói: 2-3 gói xếp CẠNH NHAU, từ 4 gói lưới 2 cột; thẻ cùng hàng cao bằng nhau; mỗi thẻ liệt kê ĐỦ toàn bộ quyền lợi (không ẩn) -> footer. Satori cần chiều cao cố
 * định nên chiều cao ước lượng theo số gói và độ dài chữ (hằng số hiệu chỉnh bằng pixel thật; ước lượng thiên về dư).
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

/**
 * Ước lượng bề rộng 1 ký tự (đơn vị em) của Inter theo nhóm ký tự — đủ chính xác để mô phỏng xuống dòng theo TỪ (chữ có dấu tính theo chữ cái gốc). Hằng số hiệu chỉnh
 * bằng chiều rộng chữ đo trên ảnh thật; phần dư an toàn nằm ở BOTTOM_SLACK (dư chỉ thành khoảng trắng trước footer, thiếu thì footer bị đẩy/cắt) — đo trên 32 chi nhánh: ước lượng thấp hơn thật tối đa ~0px, dư 9-37px trước khi cộng BOTTOM_SLACK.
 */
function charEm(ch: string): number {
  const c = ch.normalize("NFD")[0] ?? ch;
  if (c === " ") return 0.28;
  if ("iljI.,:;'!|()/[]".includes(c)) return 0.27;
  if ("tfrJ1-–".includes(c)) return 0.37;
  if ("mwMW@%".includes(c)) return 0.85;
  if (c >= "0" && c <= "9") return 0.62;
  if (c >= "A" && c <= "Z") return 0.66;
  if (c.charCodeAt(0) > 0x2000) return 0.75; // ký hiệu lạ (•, ✓, emoji...)
  return 0.55;
}

const SAFETY = 1;
const BOTTOM_SLACK = 20;

/** Số dòng sau khi xuống dòng theo từ trong bề rộng widthPx ở cỡ chữ fontPx (bold nở thêm ~7%). */
function lines(text: string, widthPx: number, fontPx: number, bold = false): number {
  const scale = fontPx * SAFETY * (bold ? 1.07 : 1);
  const spaceW = charEm(" ") * scale;
  let count = 1;
  let x = 0;
  for (const word of text.split(" ")) {
    const w = [...word].reduce((sum, ch) => sum + charEm(ch) * scale, 0);
    if (x === 0) x = w;
    else if (x + spaceW + w <= widthPx) x += spaceW + w;
    else {
      count++;
      x = w;
    }
  }
  return count;
}

function planCardHeight(plan: BranchQuotePlan, cardW: number): number {
  const inner = cardW - CARD_PAD * 2;
  const featureW = inner - 24 - 10; // trừ icon ✓ + khoảng cách
  let h = CARD_PAD * 2;
  h += 22 + 6; // tên gói
  h += 48; // giá
  h += 22; // ghi chú VAT
  h += 16 + 1 + 16; // đường kẻ
  h += plan.features.reduce((sum, f, i) => sum + lines(f, featureW, FONT) * FEATURE_LINE_H + (i > 0 ? FEATURE_GAP : 0), 0);
  if (plan.oneTimeFeeLine) h += 14 + 1 + 14 + lines(plan.oneTimeFeeLine, inner, 16, true) * 22;
  return h + 6; // dư an toàn: Satori cần chiều cao cố định, thà thừa vài px còn hơn ép/cắt chữ
}

/** Chiều cao khung ưu đãi (đặt ở cột phải cạnh ảnh mặt tiền) với bề rộng chữ bodyW. */
function promoBlockHeight(groups: PromoGroup[], bodyW: number): number {
  if (groups.length === 0) return 0;
  let h = 2 + 36 + 22; // viền + padding + tiêu đề
  for (const g of groups) {
    if (groups.length > 1) h += 6 + lines(`Áp dụng cho gói ${g.planNames.join(", ")}`, bodyW, 16, true) * 22;
    for (const l of g.lines) h += 6 + lines(l, bodyW - 14, 16) * 22;
    h += 8;
  }
  return h + 6;
}

const PHOTO_MIN_W = 210;
const PHOTO_MAX_W = 400;
const INTRO_GAP = 28;
const INTRO_MIN_H = 330;
const INTRO_MAX_H = 470;

/** Chiều cao cột phải (tên + địa chỉ + khung ưu đãi) khi cột rộng rightW; đã gồm khoảng dư an toàn. */
function rightColHeight(model: BranchQuoteModel, rightW: number): number {
  return (
    lines(model.locationName, rightW, 32, true) * 38 +
    6 +
    lines(model.address, rightW, 18) * 26 +
    (model.promoGroups.length > 0 ? 20 + promoBlockHeight(model.promoGroups, rightW - 42) + 24 : 0)
  );
}

/**
 * Bố cục khối giới thiệu: ảnh mặt tiền theo ĐÚNG tỉ lệ thật (aspect = w/h) và cao bằng cả cột phải, nên ảnh và cột chữ cùng mép trên/dưới. Cột phải càng hẹp (ảnh càng rộng)
 * càng cao, nên lặp vài vòng cho hội tụ; ảnh dọc hẹp -> cột chữ rộng và thấp, ảnh ngang -> ảnh rộng tối đa 400 (nếu chiều cao còn dư thì đệm nền nhạt 2 bên trên/dưới).
 */
function introLayout(model: BranchQuoteModel, aspect: number): { photoW: number; introH: number } {
  let h = INTRO_MIN_H;
  let photoW = PHOTO_MIN_W;
  for (let i = 0; i < 4; i++) {
    photoW = Math.min(PHOTO_MAX_W, Math.max(PHOTO_MIN_W, Math.round(h * aspect)));
    const need = Math.min(INTRO_MAX_H, Math.max(INTRO_MIN_H, rightColHeight(model, CONTENT_WIDTH - photoW - INTRO_GAP)));
    if (need <= h) break;
    h = need;
  }
  const introH = Math.max(h, rightColHeight(model, CONTENT_WIDTH - photoW - INTRO_GAP));
  return { photoW, introH };
}

/** Đọc tỉ lệ w/h từ header JPEG (đoạn SOFn). null nếu không đọc được. */
function jpegAspect(buf: Buffer): number | null {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      const h = buf.readUInt16BE(i + 5);
      const w = buf.readUInt16BE(i + 7);
      return h > 0 ? w / h : null;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
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

function PlanCard({ plan, width }: { plan: BranchQuotePlan; width: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
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
        {plan.features.map((f, i) => {
          const no = isNegativeFeature(f);
          return (
            <div key={f} style={{ display: "flex", flexShrink: 0, alignItems: "flex-start", gap: 10, marginTop: i > 0 ? FEATURE_GAP : 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  borderRadius: 9999,
                  backgroundColor: no ? "#e8ecf2" : QUOTE_COLOR.primaryTint,
                  color: no ? QUOTE_COLOR.bodyText : QUOTE_COLOR.primary,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {no ? "–" : "✓"}
              </div>
              <div style={{ display: "flex", flex: 1, fontSize: FONT, color: no ? QUOTE_COLOR.bodyText : QUOTE_COLOR.ink, lineHeight: `${FEATURE_LINE_H}px` }}>{f}</div>
            </div>
          );
        })}
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
        flexShrink: 0,
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

  const facadePath = join(process.cwd(), "public", "images", "quote", `dia-diem-${slug}.jpg`);
  const [fonts, logoSrc, facadeBuf] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo(), readFile(facadePath).catch(() => null)]);
  const facadeSrc = facadeBuf ? `data:image/jpeg;base64,${facadeBuf.toString("base64")}` : null;
  const dateLabel = `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`;

  // Khối giới thiệu: ảnh mặt tiền (trái) + tên/địa chỉ/ưu đãi (phải).
  const aspect = (facadeBuf && jpegAspect(facadeBuf)) || 0.75;
  const { photoW, introH } = introLayout(model, aspect);
  // ảnh vừa khít khung theo tỉ lệ thật (contain): chiều cao ảnh = min(introH, photoW / aspect)
  const photoImgH = Math.min(introH, Math.round(photoW / aspect));
  const photoImgW = Math.round(photoImgH * aspect);

  const { cols, cardW, gridH } = layoutHeights(model);
  const HEADER_H = 148;
  const FOOTER_H = 140;
  const height = HEADER_H + 8 + introH + 28 + gridH + 32 + BOTTOM_SLACK + FOOTER_H;

  // Thẻ xếp theo hàng; mỗi hàng có chiều cao = thẻ cao nhất trong hàng (các thẻ cùng hàng cao bằng nhau).
  const rowsOfPlans: BranchQuotePlan[][] = [];
  for (let i = 0; i < model.plans.length; i += cols) rowsOfPlans.push(model.plans.slice(i, i + cols));

  return new ImageResponse(
    (
      <div style={{ width: CARD_WIDTH, height, display: "flex", flexDirection: "column", backgroundColor: "#ffffff", fontFamily: "Inter" }}>
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel="Bảng giá văn phòng ảo" dateLabel={dateLabel} />

        <div style={{ display: "flex", flexDirection: "row", gap: INTRO_GAP, margin: `0 ${MARGIN_X}px`, marginTop: 8, height: introH }}>
          {facadeSrc && (
            <div
              style={{
                display: "flex",
                width: photoW,
                height: introH,
                flexShrink: 0,
                borderRadius: 16,
                backgroundColor: QUOTE_COLOR.bgTint,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={facadeSrc} alt="" width={photoImgW} height={photoImgH} style={{ objectFit: "contain" }} />
            </div>
          )}
          {/* Tên + địa chỉ ở trên, khung ưu đãi ở dưới: hai mép khớp mép trên/dưới của ảnh mặt tiền. */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: QUOTE_COLOR.navy, lineHeight: "38px" }}>{model.locationName}</div>
              <div style={{ display: "flex", marginTop: 6, fontSize: 18, color: QUOTE_COLOR.bodyText, lineHeight: "26px" }}>{model.address}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
              <PromoBlock groups={model.promoGroups} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: GRID_GAP, margin: `0 ${MARGIN_X}px`, marginTop: 28 }}>
          {rowsOfPlans.map((row, ri) => (
            // alignItems stretch (mặc định): thẻ cùng hàng cao bằng nhau theo nội dung THẬT; phần ước lượng dư dồn vào khoảng trắng trước footer.
            <div key={ri} style={{ display: "flex", flexDirection: "row", gap: GRID_GAP }}>
              {row.map((plan) => (
                <PlanCard key={plan.planKey} plan={plan} width={cardW} />
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flex: 1 }} />
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
