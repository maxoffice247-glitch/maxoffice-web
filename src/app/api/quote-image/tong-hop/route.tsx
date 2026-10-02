import { ImageResponse } from "next/og";
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
import {
  resolveCompositeQuoteItem,
  type CompositeQuoteRequestBody,
  type CompositeQuoteItem,
  type ResolvedQuoteLine,
  type QuoteBucket,
} from "@/lib/compositeQuote";
import { amountToVietnameseWords } from "@/lib/numberToWords";
import {
  buildVietQrImageUrl,
  buildVietQrImageUrlForAccount,
  buildQrNote,
  vietQrAccountLabel,
  thuHoAccountLabel,
  THU_HO_ACCOUNT,
  detectImageMimeType,
  isVietQrAccountKey,
  DEFAULT_VIETQR_ACCOUNT_KEY,
} from "@/lib/vietQr";
import { qt, formatQuoteCurrency, vatLabel, type QuoteLang, type QuoteDictKey } from "@/lib/quoteImageDictionary";

/**
 * Ảnh "Báo giá tổng hợp" — 1 ảnh PNG gộp NHIỀU dịch vụ khác nhau (VD: gói
 * Văn phòng ảo tại 1 chi nhánh + gói Thành lập doanh nghiệp) do nhân viên
 * tự chọn ở /tien-ich/tao-bao-gia-tong-hop (CompositeQuoteTool.tsx), khác
 * với 2 route quote-image hiện có (báo giá 1 gói Văn phòng ảo tại 1 hoặc
 * nhiều chi nhánh CÙNG loại gói).
 *
 * POST thay vì GET như 2 route kia: input là tổ hợp TỰ DO nhiều dòng dịch
 * vụ + thông tin khách hàng, không thể nhét vừa vào URL path dạng
 * [slug]/[plan]. Không có bước lưu trữ nào — request vào, ảnh PNG ra, hết.
 *
 * AN TOÀN GIÁ: route này KHÔNG bao giờ tin giá do client gửi cho 3 loại dịch
 * vụ đã có cấu trúc (van-phong-ao/thanh-lap-doanh-nghiep/ke-toan-thue) — chỉ
 * nhận (chi nhánh, gói, số tháng)/(gói)/(nhóm, khoảng hoá đơn) rồi tự tra
 * giá thật ở server qua resolveCompositeQuoteItem() (xem compositeQuote.ts).
 * Chỉ loại "custom" (Văn phòng trọn gói/Chỗ ngồi linh động/Phòng họp — chưa
 * có bảng giá cấu trúc để tra — và "Dịch vụ khác" tự nhập tự do khi cần báo
 * giá 1 dịch vụ chưa có trên web) mới nhận giá tự do do nhân viên gõ tay.
 *
 * KHÔNG đọc ảnh mặt tiền chi nhánh (khác route [slug]/[plan]) — báo giá
 * tổng hợp tập trung vào liệt kê dịch vụ + giá, không giới thiệu 1 chi
 * nhánh cụ thể.
 */
export const runtime = "nodejs";

const ROW_PADDING_Y = 40; // "20px 22px" -> 40 tổng theo chiều dọc
// Dòng tiêu đề GỘP (tên gói + loại dịch vụ + địa chỉ/mô tả phụ, xem
// mergeTitleLine()) — 1 dòng nếu đủ ngắn, tự nhiên wrap 2 dòng nếu dài (VD
// tên chi nhánh dài). Ngưỡng ký tự hiệu chỉnh bằng pixel thật (xem báo cáo
// cuối phiên) — y hệt cách PROMO_BADGE_H đã ước lượng trước đó.
const MERGED_TITLE_LINE_H = 24;
// Ký tự, ở ~940px rộng (khung ItemRow) — đo thực tế bằng pixel (không đoán):
// 65/95/111 ký tự đều vừa đúng 1 dòng (tên chi nhánh dài nhất thực tế ghép
// VPA chỉ ~65 ký tự — không bao giờ wrap với dữ liệu thật), 160 ký tự
// (nhãn "Dịch vụ khác" tự nhập cực dài) wrap tới 3 dòng. Chọn ngưỡng AN
// TOÀN (thà ước lượng dư 1 dòng còn hơn thiếu — thiếu sẽ cắt nội dung).
const MERGED_TITLE_WRAP_THRESHOLD = 100;
const MERGED_TITLE_WRAP_THRESHOLD_3_LINES = 150; // nhãn tự nhập cực dài, hiếm khi xảy ra với dữ liệu có cấu trúc
const PROMO_BADGE_H = 44; // đủ cho 1 dòng text dài (~90 ký tự) ở 940px rộng
const BREAKDOWN_LINE_H = 24;
const BREAKDOWN_TOP_MARGIN = 10;
const TOTAL_ROW_H = 56; // khối "Thành tiền" viền trên
const FALLBACK_ROW_H = 78; // dòng "custom" không tách được số (giữ như thiết kế cũ)
const ROW_GAP = 14;

const SECTION_HEADER_H = 34;
const SECTION_TOP_MARGIN = 32;
const SECTION_TOTAL_BOX_H = 60;
const SECTION_WORDS_H = 26; // dòng "Bằng chữ" dưới khối tổng
const INLINE_WORDS_H = 22; // dòng "Bằng chữ" gắn ngay dưới 1 dòng đơn lẻ (không box)

const HEADER_H = 148;
const FOOTER_H = 140; // Hotline/Web/Email/CTA gộp 1 hàng ngang (xem QuoteFooterRow) — hiệu chỉnh bằng pixel thật
const CUSTOMER_ROW_H = 26;
const QR_BLOCK_H = 232; // khối QR NGANG đầy đủ (ảnh trái, chữ phải) — dùng khi CHỈ 1 trong 2 QR hiện
const THU_HO_QR_NOTE_H = 20; // dòng cảnh báo "chuyển vào TK đơn vị cung cấp..." dưới QR thu hộ (fontSize 12, 1 dòng)
// Hàng 2 QR xếp NGANG cạnh nhau (QrPaymentRow, khi CẢ 2 cùng hiện) — đo thực
// tế bằng pixel (không đoán, xem báo cáo cuối phiên): tiêu đề chung "Quét
// mã..." + 2 cột cao bằng nhau theo cột cao nhất (cột thu hộ có thêm dòng
// cảnh báo đỏ, thường xuống 2 dòng).
const QR_ROW_H = 365;

const GRAND_TOTAL_TOP_MARGIN = 32; // giống SECTION_TOP_MARGIN, cùng nhịp cách giữa các khối
const GRAND_TOTAL_BOX_H = 60; // thu gọn vừa nội dung (alignSelf:"flex-start") — padding "14px 20px" (28) + nội dung (font 24)
const GRAND_TOTAL_WORDS_H = 20; // "Bằng chữ" 1 dòng, fontSize 13 — đo thực tế thấp hơn mốc 26 dùng cho SECTION_WORDS_H
const GRAND_TOTAL_NOTE_H = 18;

// Dòng "TỔNG CỘNG TOÀN BỘ BÁO GIÁ" gộp CẢ 2 nhóm — chỉ hiện khi có đủ cả 2
// (xem showOverallTotal trong POST()). Cùng cỡ box với GRAND_TOTAL_BOX_H
// nhưng nền accent (đỏ) thay vì navy để phân biệt rõ với khối "Tổng cộng
// DỊCH VỤ MAX OFFICE" đứng ngay phía trên (navy) — tránh 2 khối liền kề giống
// hệt nhau gây rối mắt.
const OVERALL_TOTAL_TOP_MARGIN = 32;
const OVERALL_TOTAL_BOX_H = 60; // thu gọn vừa nội dung, cùng cỡ với GRAND_TOTAL_BOX_H
const OVERALL_TOTAL_SPLIT_NOTE_H = 18;
const OVERALL_TOTAL_WORDS_H = 20;

const BUCKET_META: Record<QuoteBucket, { titleKey: QuoteDictKey; icon: string; totalKey: QuoteDictKey }> = {
  "thue-vpa": { titleKey: "bucketVpaTitle", icon: "🏢", totalKey: "bucketVpaTotal" },
  thang: { titleKey: "bucketThangTitle", icon: "📅", totalKey: "bucketThangTotal" },
  "mot-lan": { titleKey: "bucketMotLanTitle", icon: "📄", totalKey: "bucketMotLanTotal" },
  gio: { titleKey: "bucketGioTitle", icon: "🕐", totalKey: "bucketGioTotal" },
  // Luôn xếp CUỐI CÙNG — xem comment QuoteBucket trong compositeQuote.ts:
  // đây là nhóm tách theo TÀI KHOẢN NHẬN TIỀN (thu hộ bên thứ ba), không
  // phải theo đơn vị thời gian như 4 khối trên.
  "thu-ho": { titleKey: "bucketThuHoTitle", icon: "🧾", totalKey: "bucketThuHoTotal" },
};
const BUCKET_ORDER: QuoteBucket[] = ["thue-vpa", "thang", "mot-lan", "gio", "thu-ho"];

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Kiểm tra hình dạng cơ bản của 1 item trước khi đưa vào
 * resolveCompositeQuoteItem() — chặn sớm request rác/thiếu field thay vì
 * để lỗi runtime khó hiểu ở bước tra giá. */
function isValidItemShape(item: unknown): item is CompositeQuoteItem {
  if (!item || typeof item !== "object") return false;
  const it = item as Record<string, unknown>;
  switch (it.type) {
    case "van-phong-ao":
      return (
        isNonEmptyString(it.locationSlug) &&
        isNonEmptyString(it.planKey) &&
        (it.months === 6 || it.months === 12 || it.months === 24)
      );
    case "thanh-lap-doanh-nghiep":
      return it.tier === "goi-1" || it.tier === "goi-2";
    case "ke-toan-thue":
      return (
        (it.group === "A" || it.group === "B" || it.group === "C") &&
        typeof it.rangeIndex === "number"
      );
    case "custom":
      return (
        (it.serviceSlug === "van-phong-tron-goi" ||
          it.serviceSlug === "cho-ngoi-linh-dong" ||
          it.serviceSlug === "phong-hop" ||
          it.serviceSlug === "khac") &&
        typeof it.label === "string" &&
        isNonEmptyString(it.price) &&
        (it.vatRatePercent === undefined ||
          (typeof it.vatRatePercent === "number" && it.vatRatePercent >= 0 && it.vatRatePercent <= 100))
      );
    case "chu-ky-so":
      return isNonEmptyString(it.tierKey);
    case "hoa-don-dien-tu":
      return isNonEmptyString(it.tierKey);
    default:
      return false;
  }
}

/** "Loại dịch vụ · địa chỉ/mô tả phụ" — DÙNG CHUNG giữa ItemRow() (render)
 * và estimateRowHeight() (ước lượng chiều cao), tránh lệch 2 nơi. `show`
 * false khi dòng phụ trùng y hệt title (VD "custom" bỏ trống mô tả) — ẩn
 * hẳn thay vì lặp lại. */
function computeSecondLine(line: ResolvedQuoteLine): { secondLine: string; show: boolean } {
  const secondLine = line.subtitle ? `${line.category} · ${line.subtitle}` : line.category;
  return { secondLine, show: secondLine !== line.title };
}

/** Gộp TÊN GÓI + LOẠI DỊCH VỤ + ĐỊA CHỈ/MÔ TẢ PHỤ thành 1 dòng tiêu đề DUY
 * NHẤT (VD "Gói SILVER — Văn phòng ảo · 159C Đề Thám, Quận 1 (cũ)") thay vì
 * 2 dòng riêng như trước — áp dụng ĐỒNG NHẤT cho mọi loại dịch vụ. Tự nhiên
 * wrap xuống dòng 2 khi quá dài (không ép cứng 1 dòng), xem
 * estimateMergedTitleLines() để biết cách ước lượng số dòng thực tế. */
function mergedTitleText(line: ResolvedQuoteLine): { text: string; secondPart: string | null } {
  const { secondLine, show } = computeSecondLine(line);
  return show ? { text: `${line.title} — ${secondLine}`, secondPart: secondLine } : { text: line.title, secondPart: null };
}

/** Ước lượng 1 hay 2 dòng cho tiêu đề gộp — dựa theo TỔNG số ký tự (kể cả
 * " — " nối) so với MERGED_TITLE_WRAP_THRESHOLD, hiệu chỉnh bằng pixel thật
 * (xem báo cáo cuối phiên, test cả tên chi nhánh ngắn lẫn dài). */
function estimateMergedTitleLines(line: ResolvedQuoteLine): 1 | 2 | 3 {
  const { text } = mergedTitleText(line);
  if (text.length > MERGED_TITLE_WRAP_THRESHOLD_3_LINES) return 3;
  return text.length > MERGED_TITLE_WRAP_THRESHOLD ? 2 : 1;
}

/** Ước lượng chiều cao 1 dòng dịch vụ — PHẢI khớp đúng với JSX của
 * ItemRow() bên dưới (từng khối cộng thêm ở đây cũng phải tồn tại tương
 * ứng trong render), theo đúng nguyên tắc đã áp dụng ở 2 route quote-image
 * hiện có: tính trước bằng công thức vì Satori cần height cố định.
 *
 * breakdownLineCount LUÔN = 2 cho mọi loại dịch vụ (khác trước đây 2 hoặc
 * 3 tuỳ có "Tạm tính" hay không) — Đơn giá+Tạm tính (nếu có) nay gộp CHUNG
 * 1 dòng (DualBreakdownLine), nên dù có Tạm tính hay không, luôn còn đúng
 * 2 dòng breakdown: [Đơn giá (+Tạm tính)] + [VAT]. */
function estimateRowHeight(line: ResolvedQuoteLine): number {
  if (!line.breakdown) return FALLBACK_ROW_H;
  return (
    ROW_PADDING_Y +
    estimateMergedTitleLines(line) * MERGED_TITLE_LINE_H +
    (line.breakdown.promo ? PROMO_BADGE_H : 0) +
    BREAKDOWN_TOP_MARGIN +
    2 * BREAKDOWN_LINE_H +
    TOTAL_ROW_H
  );
}

function BreakdownLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <div style={{ display: "flex", color: QUOTE_COLOR.bodyText }}>{label}</div>
      <div style={{ display: "flex", fontWeight: strong ? 700 : 400, color: strong ? QUOTE_COLOR.ink : QUOTE_COLOR.bodyText }}>
        {value}
      </div>
    </div>
  );
}

/** "Đơn giá" + "Tạm tính" GỘP CHUNG 1 dòng ngang (trái/phải) thay vì 2 dòng
 * riêng như trước — CHỈ dùng khi dòng dịch vụ có cả 2 giá trị tách biệt
 * (VPA có chọn số tháng, breakdown.months != null). Các loại dịch vụ khác
 * (GPKD/Kế toán/custom/thu hộ) không có "Tạm tính" riêng nên vẫn chỉ hiện
 * 1 giá trị Đơn giá — xem ItemRow(). */
function DualBreakdownLine({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <div style={{ display: "flex", color: QUOTE_COLOR.bodyText }}>
        {leftLabel}:<span style={{ marginLeft: 4, color: QUOTE_COLOR.ink }}>{leftValue}</span>
      </div>
      <div style={{ display: "flex", color: QUOTE_COLOR.bodyText }}>
        {rightLabel}:<span style={{ marginLeft: 4, color: QUOTE_COLOR.ink }}>{rightValue}</span>
      </div>
    </div>
  );
}

function ItemRow({ line, lang }: { line: ResolvedQuoteLine; lang: QuoteLang }) {
  const { secondLine, show: showSecondLine } = computeSecondLine(line);

  if (!line.breakdown) {
    // Giá tự nhập không tách được số cụ thể — giữ nguyên bố cục đơn giản
    // cũ (1 dòng title/category bên trái, giá nguyên văn bên phải).
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 14,
          border: `1px solid ${QUOTE_COLOR.line}`,
          backgroundColor: "#ffffff",
          padding: "16px 22px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: QUOTE_COLOR.navy }}>{line.title}</div>
          {showSecondLine && (
            <div style={{ display: "flex", marginTop: 4, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{secondLine}</div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.accent, flexShrink: 0 }}>
          {line.fallbackLabel}
        </div>
      </div>
    );
  }

  const { breakdown } = line;
  const showSubtotalLine = breakdown.months != null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        border: `1px solid ${QUOTE_COLOR.line}`,
        backgroundColor: "#ffffff",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
        <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: QUOTE_COLOR.navy }}>{line.title}</div>
        {showSecondLine && (
          <div style={{ display: "flex", marginLeft: 8, fontSize: 14, fontWeight: 400, color: QUOTE_COLOR.bodyText }}>
            {`— ${secondLine}`}
          </div>
        )}
      </div>

      {breakdown.promo && (
        <div
          style={{
            display: "flex",
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: "#fff7e6",
            border: "1px solid #f5cd7e",
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: "#b45309",
          }}
        >
          🎁 {breakdown.promo.label}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", marginTop: BREAKDOWN_TOP_MARGIN, gap: 4 }}>
        {showSubtotalLine ? (
          <DualBreakdownLine
            leftLabel={qt("unitPriceLabel", lang)}
            leftValue={`${breakdown.baseLabel} × ${breakdown.months} ${qt("monthsUnit", lang)}`}
            rightLabel={qt("subtotalLabel", lang)}
            rightValue={formatQuoteCurrency(breakdown.subtotal, lang)}
          />
        ) : (
          <BreakdownLine label={qt("unitPriceLabel", lang)} value={breakdown.baseLabel} />
        )}
        <BreakdownLine label={vatLabel(breakdown.vatRatePercent)} value={formatQuoteCurrency(breakdown.vatAmount, lang)} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          borderTop: `1px solid ${QUOTE_COLOR.line}`,
          paddingTop: 12,
        }}
      >
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: QUOTE_COLOR.navy }}>{qt("totalLabel", lang)}</div>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.accent }}>
          {formatQuoteCurrency(breakdown.total, lang)}
        </div>
      </div>
    </div>
  );
}

/** "Bằng chữ" — CHỈ render ở bản tiếng Việt (gọi component này) — bản tiếng
 * Anh KHÔNG có dòng này (xem comment đầu quoteImageDictionary.ts), nên nơi
 * gọi (Section) đã tự bỏ qua hoàn toàn khi lang === "en", không truyền
 * `lang` xuống đây. */
function AmountInWords({ amount }: { amount: number }) {
  const words = amountToVietnameseWords(amount);
  if (!words) return null;
  return (
    <div style={{ display: "flex", fontSize: 13, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
      Bằng chữ: {words}
    </div>
  );
}

function Section({ bucket, lines, lang }: { bucket: QuoteBucket; lines: ResolvedQuoteLine[]; lang: QuoteLang }) {
  if (lines.length === 0) return null;
  const meta = BUCKET_META[bucket];
  const summable = lines.filter((l) => l.breakdown != null);
  const allSummable = summable.length === lines.length && summable.length > 0;
  const total = allSummable ? summable.reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0) : null;
  const showBoxedTotal = allSummable && lines.length >= 2 && total != null;
  const showInlineWords = lang === "vi" && allSummable && lines.length === 1 && total != null;
  const showWordsInBox = lang === "vi" && showBoxedTotal;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: `0 ${MARGIN_X}px`,
        marginTop: SECTION_TOP_MARGIN,
      }}
    >
      <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: QUOTE_COLOR.navy, marginBottom: 16 }}>
        {meta.icon} {qt(meta.titleKey, lang)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP }}>
        {lines.map((line, i) => (
          <ItemRow key={i} line={line} lang={lang} />
        ))}
      </div>
      {showInlineWords && total != null && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <AmountInWords amount={total} />
        </div>
      )}
      {showBoxedTotal && total != null && (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 14,
              backgroundColor: QUOTE_COLOR.bgTint,
              padding: "16px 22px",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy }}>
              {qt(meta.totalKey, lang)}
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: QUOTE_COLOR.primary }}>
              {formatQuoteCurrency(total, lang)}
            </div>
          </div>
          {showWordsInBox && (
            <div style={{ display: "flex", marginTop: 8, paddingLeft: 4 }}>
              <AmountInWords amount={total} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function sectionHeight(lines: ResolvedQuoteLine[], lang: QuoteLang): number {
  if (lines.length === 0) return 0;
  const rowsHeight = lines.reduce((sum, l) => sum + estimateRowHeight(l), 0) + (lines.length - 1) * ROW_GAP;
  const summable = lines.filter((l) => l.breakdown != null);
  const allSummable = summable.length === lines.length && summable.length > 0;
  // Dòng "Bằng chữ" CHỈ tồn tại ở bản tiếng Việt (xem Section()) — bản tiếng
  // Anh không cộng thêm SECTION_WORDS_H/INLINE_WORDS_H vào chiều cao.
  const extra =
    allSummable && lines.length >= 2
      ? 16 + SECTION_TOTAL_BOX_H + (lang === "en" ? 0 : 8 + SECTION_WORDS_H)
      : allSummable && lines.length === 1
        ? lang === "en"
          ? 0
          : 8 + INLINE_WORDS_H
        : 0;
  return SECTION_TOP_MARGIN + SECTION_HEADER_H + 16 + rowsHeight + extra;
}

/** Chỉ tính ra số khi có TỪ 2 DÒNG TRA ĐƯỢC GIÁ TRỞ LÊN trong danh sách
 * truyền vào — nếu chỉ có 1 dòng duy nhất, số này trùng y hệt "Thành tiền"
 * của chính dòng đó nên không hiện lại cho đỡ thừa. Dòng "custom" gõ tay
 * không tách được số cụ thể (breakdown null) bị loại khỏi tổng này — không
 * có con số để cộng — và được ghi chú rõ bên dưới tổng để không gây hiểu
 * lầm là đã tính đủ.
 *
 * NHẬN 1 DANH SÁCH DÒNG TUỲ Ý (không mặc định toàn bộ resolvedLines) — khối
 * "Tổng cộng" hiện trên ảnh CHỈ tính các dòng "Dịch vụ MAX OFFICE" (loại trừ
 * bucket "thu-ho"), vì tiền thu hộ KHÔNG vào tài khoản MAX OFFICE, gộp vào
 * đây sẽ gây hiểu lầm nghiêm trọng về số tiền công ty thực nhận — xem
 * splitByPaymentGroup() và nơi gọi ở POST(). */
function computeGrandTotal(lines: ResolvedQuoteLine[]) {
  const summableLines = lines.filter((l) => l.breakdown != null);
  const total = summableLines.reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0);
  const show = summableLines.length >= 2;
  const hasExcluded = show && summableLines.length < lines.length;
  return { total, show, hasExcluded };
}

function grandTotalHeight(maxOfficeLines: ResolvedQuoteLine[], lang: QuoteLang): number {
  const { show, hasExcluded } = computeGrandTotal(maxOfficeLines);
  if (!show) return 0;
  return (
    GRAND_TOTAL_TOP_MARGIN +
    GRAND_TOTAL_BOX_H +
    (lang === "vi" ? 8 + GRAND_TOTAL_WORDS_H : 0) +
    (hasExcluded ? 6 + GRAND_TOTAL_NOTE_H : 0)
  );
}

/** `hasThuHo`: báo giá có đang CÙNG LÚC chứa dịch vụ thu hộ không — CHỈ đổi
 * nhãn hiển thị (để không gây hiểu lầm là tổng này đã gồm cả tiền thu hộ),
 * không đổi cách tính (luôn chỉ tính `maxOfficeLines` truyền vào). */
function GrandTotal({
  maxOfficeLines,
  lang,
  hasThuHo,
}: {
  maxOfficeLines: ResolvedQuoteLine[];
  lang: QuoteLang;
  hasThuHo: boolean;
}) {
  const { total, show, hasExcluded } = computeGrandTotal(maxOfficeLines);
  if (!show) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: GRAND_TOTAL_TOP_MARGIN }}>
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 20,
          borderRadius: 14,
          backgroundColor: QUOTE_COLOR.navy,
          padding: "14px 20px",
        }}
      >
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#fff" }}>
          {qt(hasThuHo ? "grandTotalMaxOfficeLabel" : "grandTotalLabel", lang)}
        </div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 800, color: "#fff" }}>{formatQuoteCurrency(total, lang)}</div>
      </div>
      {lang === "vi" && (
        <div style={{ display: "flex", marginTop: 8, paddingLeft: 4 }}>
          <AmountInWords amount={total} />
        </div>
      )}
      {hasExcluded && (
        <div style={{ display: "flex", marginTop: 6, paddingLeft: 4, fontSize: 12, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
          {qt("grandTotalExcludedNote", lang)}
        </div>
      )}
    </div>
  );
}

function overallTotalHeight(show: boolean, lang: QuoteLang): number {
  if (!show) return 0;
  return (
    OVERALL_TOTAL_TOP_MARGIN +
    OVERALL_TOTAL_BOX_H +
    6 +
    OVERALL_TOTAL_SPLIT_NOTE_H +
    (lang === "vi" ? 4 + OVERALL_TOTAL_WORDS_H : 0)
  );
}

/** Dòng tổng GỘP CẢ 2 nhóm — CHỈ hiện khi báo giá có ĐỦ CẢ "Dịch vụ MAX
 * OFFICE" lẫn "Dịch vụ thu hộ" (nếu chỉ có 1 nhóm, khối tổng của nhóm đó
 * — GrandTotal hoặc box tổng trong Section bucket "thu-ho" — đã đủ, hiện
 * thêm dòng này là trùng lặp không cần thiết, xem showOverallTotal ở
 * POST()). Dùng chung nhãn "grandTotalLabel" (TỔNG CỘNG TOÀN BỘ BÁO GIÁ) vì
 * cùng ý nghĩa — đây MỚI thật sự là tổng của TOÀN BỘ báo giá, khác
 * GrandTotal ở trên chỉ tính riêng phần MAX OFFICE. */
function OverallTotal({ amount, lang }: { amount: number; lang: QuoteLang }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: OVERALL_TOTAL_TOP_MARGIN }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 20,
          borderRadius: 14,
          backgroundColor: QUOTE_COLOR.accent,
          padding: "14px 20px",
        }}
      >
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#fff" }}>{qt("grandTotalLabel", lang)}</div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 800, color: "#fff" }}>{formatQuoteCurrency(amount, lang)}</div>
      </div>
      <div style={{ display: "flex", marginTop: 6, paddingLeft: 4, fontSize: 12, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
        {qt("overallTotalSplitNote", lang)}
      </div>
      {lang === "vi" && (
        <div style={{ display: "flex", marginTop: 4, paddingLeft: 4 }}>
          <AmountInWords amount={amount} />
        </div>
      )}
    </div>
  );
}

/** Tách 2 nhóm tổng theo TÀI KHOẢN NHẬN TIỀN — "Dịch vụ MAX OFFICE" (4
 * bucket thường) vs "Dịch vụ thu hộ" (bucket "thu-ho", xem comment
 * QuoteBucket trong compositeQuote.ts). Dùng CHUNG ở cả khối "Tổng cộng"
 * hiện trên ảnh LẪN tính số tiền 2 mã QR, để không bao giờ lệch nhau. */
function splitByPaymentGroup(resolvedLines: ResolvedQuoteLine[]) {
  const maxOfficeLines = resolvedLines.filter((l) => l.bucket !== "thu-ho");
  const thuHoLines = resolvedLines.filter((l) => l.bucket === "thu-ho");
  return { maxOfficeLines, thuHoLines };
}

/** Tổng "Thành tiền" cộng dồn của 1 nhóm — dùng làm số tiền gợi ý cho đúng
 * mã QR của nhóm đó. null khi không có dòng nào tính được số (QR vẫn hiện
 * được, chỉ không tự điền số tiền — xem buildVietQrImageUrl). */
function groupQrAmount(lines: ResolvedQuoteLine[]): number | null {
  const total = lines.reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0);
  return total > 0 ? total : null;
}

/** Tải ảnh QR + chuyển base64 — DÙNG CHUNG cho cả 2 mã QR (trước đây chỉ có
 * 1 khối try/catch inline, tách thành hàm để không lặp lại nguyên khối logic
 * dò magic bytes khi thêm QR thu hộ). */
async function fetchQrDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    // QUAN TRỌNG: KHÔNG tin đuôi URL (".png") lẫn header Content-Type của
    // response — đã xác nhận bằng byte thật rằng img.vietqr.io khai
    // "image/png" nhưng dữ liệu THẬT SỰ là JPEG (magic bytes FF D8 FF). Gán
    // sai MIME vào data URI khiến Satori render ra ảnh trắng trơn, im lặng
    // không báo lỗi gì — phải tự dò magic bytes (xem vietQr.ts).
    const contentType = detectImageMimeType(buf);
    return `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

/** Chiều cao phần QR — khớp ĐÚNG với số khối QR thực tế sẽ render (0/1/2),
 * tính theo DỮ LIỆU ĐÃ TẢI XONG (`maxOfficeQrDataUri`/`thuHoQrDataUri`), không
 * phải theo "có bật showQr không" — nếu 1 trong 2 lần fetch ảnh QR thất bại
 * (lỗi img.vietqr.io), khối đó không render thì cũng KHÔNG được cộng chiều
 * cao, tránh để dư khoảng trắng.
 *
 * CẢ 2 CÙNG CÓ (2 QR): xếp NGANG cạnh nhau (QrPaymentRow) — chỉ còn 1 hàng,
 * dùng QR_ROW_H (đo thực tế bằng pixel, xem báo cáo cuối phiên) thay vì cộng
 * 2 khối dọc như thiết kế cũ. CHỈ 1 TRONG 2: vẫn dùng khối ngang đầy đủ cũ
 * (QrPaymentBlock, QR_BLOCK_H) — không đổi bố cục/hành vi khi chỉ có 1 QR. */
function qrSectionHeight(maxOfficeQrDataUri: string | null, thuHoQrDataUri: string | null): number {
  if (maxOfficeQrDataUri && thuHoQrDataUri) return QR_ROW_H;
  if (maxOfficeQrDataUri) return QR_BLOCK_H;
  if (thuHoQrDataUri) return QR_BLOCK_H + THU_HO_QR_NOTE_H;
  return 0;
}

/** Khối QR NGANG đầy đủ (ảnh trái, chữ phải, full-width) — dùng khi CHỈ 1
 * trong 2 nhóm có QR (giữ NGUYÊN bố cục cũ, không đổi khi không có thu hộ,
 * xem yêu cầu "vẫn chỉ 1 QR như cũ"). Khi CẢ 2 cùng có, dùng QrPaymentRow
 * (2 cột) bên dưới thay vì 2 khối này xếp chồng. */
function QrPaymentBlock({
  dataUri,
  title,
  accountLabel,
  amount,
  lang,
  extraNote,
}: {
  dataUri: string;
  title: string;
  accountLabel: string;
  amount: number | null;
  lang: QuoteLang;
  extraNote?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        margin: `0 ${MARGIN_X}px`,
        marginTop: 32,
        borderRadius: 16,
        backgroundColor: QUOTE_COLOR.bgTint,
        padding: 24,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUri} alt="" width={160} height={160} style={{ borderRadius: 8, backgroundColor: "#fff" }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.navy }}>{title}</div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{accountLabel}</div>
        {amount != null && (
          <div style={{ display: "flex", marginTop: 2, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
            {qt("suggestedAmountLabel", lang)}: {formatQuoteCurrency(amount, lang)}
          </div>
        )}
        {extraNote && (
          <div style={{ display: "flex", marginTop: 6, fontSize: 12, fontWeight: 700, color: QUOTE_COLOR.accent }}>
            {extraNote}
          </div>
        )}
      </div>
    </div>
  );
}

/** 1 cột trong QrPaymentRow — QR ở trên, nhãn nhóm + tài khoản + số tiền +
 * ghi chú ở dưới, TẤT CẢ CĂN GIỮA trong phạm vi cột (khác QrPaymentBlock
 * căn trái/ngang). `flex: 1` để 2 cột chia đều chiều rộng còn lại. */
function QrPaymentColumn({
  dataUri,
  groupLabel,
  accountLabel,
  amount,
  lang,
  extraNote,
}: {
  dataUri: string;
  groupLabel: string;
  accountLabel: string;
  amount: number | null;
  lang: QuoteLang;
  extraNote?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: QUOTE_COLOR.bgTint,
        padding: "20px 16px",
      }}
    >
      <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: QUOTE_COLOR.navy, textAlign: "center" }}>
        {groupLabel}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUri}
        alt=""
        width={140}
        height={140}
        style={{ marginTop: 10, borderRadius: 8, backgroundColor: "#fff" }}
      />
      <div style={{ display: "flex", marginTop: 10, fontSize: 13, color: QUOTE_COLOR.bodyText, textAlign: "center" }}>
        {accountLabel}
      </div>
      {amount != null && (
        <div style={{ display: "flex", marginTop: 2, fontSize: 13, color: QUOTE_COLOR.bodyText, textAlign: "center" }}>
          {qt("suggestedAmountLabel", lang)}: {formatQuoteCurrency(amount, lang)}
        </div>
      )}
      {extraNote && (
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            color: QUOTE_COLOR.accent,
            textAlign: "center",
          }}
        >
          {extraNote}
        </div>
      )}
    </div>
  );
}

/** Hàng 2 QR xếp NGANG — 1 tiêu đề CHUNG "Quét mã để chuyển khoản" phía
 * trên (không lặp lại trong từng cột), rồi 2 QrPaymentColumn cạnh nhau.
 * CHỈ render khi CẢ 2 nhóm cùng có QR (xem nơi gọi ở POST()). */
function QrPaymentRow({
  left,
  right,
  lang,
}: {
  left: { dataUri: string; groupLabel: string; accountLabel: string; amount: number | null };
  right: { dataUri: string; groupLabel: string; accountLabel: string; amount: number | null; extraNote: string };
  lang: QuoteLang;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: 32 }}>
      <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.navy, marginBottom: 16 }}>
        {qt("scanToPayTitle", lang)}
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <QrPaymentColumn {...left} lang={lang} />
        <QrPaymentColumn {...right} lang={lang} />
      </div>
    </div>
  );
}

export async function POST(req: Request) {
  let body: CompositeQuoteRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Nội dung request không phải JSON hợp lệ.", { status: 400 });
  }

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return new Response("Cần chọn ít nhất 1 dịch vụ để tạo báo giá.", { status: 400 });
  }
  if (body.items.length > 12) {
    return new Response("Chỉ hỗ trợ tối đa 12 dòng dịch vụ trong 1 báo giá.", { status: 400 });
  }

  // Ngôn ngữ ảnh xuất ra — mặc định "vi" khi thiếu/giá trị lạ (client
  // cũ/lỗi gửi field này vẫn ra đúng ảnh tiếng Việt như trước khi có tính
  // năng song ngữ). Form nhập liệu luôn tiếng Việt, field này KHÔNG ảnh
  // hưởng gì đến việc tra giá — chỉ đổi nhãn hiển thị trên ảnh.
  const lang: QuoteLang = body.lang === "en" ? "en" : "vi";

  const resolvedLines: ResolvedQuoteLine[] = [];
  for (const item of body.items) {
    if (!isValidItemShape(item)) {
      return new Response("Có dòng dịch vụ với dữ liệu không hợp lệ trong request.", { status: 400 });
    }
    const result = resolveCompositeQuoteItem(item, lang);
    if ("error" in result) {
      return new Response(result.error, { status: 400 });
    }
    resolvedLines.push(result);
  }

  // "Họ và tên" + "SĐT" GỘP CHUNG 1 DÒNG (cả 2 đều ngắn, không cần tách
  // dòng riêng) — "Tên công ty" vẫn GIỮ dòng riêng (có thể dài, cần đủ chỗ
  // tự xuống dòng). `nameAndPhoneParts` rỗng khi khách không điền cả 2;
  // chỉ 1 phần tử khi điền đúng 1 trong 2 (vẫn hiện bình thường, không có
  // gì để "gộp" trong trường hợp đó).
  const customer = body.customer;
  const nameAndPhoneParts: { label: string; value: string }[] = [];
  if (isNonEmptyString(customer?.name))
    nameAndPhoneParts.push({ label: qt("customerNameLabel", lang), value: customer.name.trim() });
  if (isNonEmptyString(customer?.phone))
    nameAndPhoneParts.push({ label: qt("customerPhoneLabel", lang), value: customer.phone.trim() });
  const companyRow = isNonEmptyString(customer?.companyName)
    ? { label: qt("customerCompanyLabel", lang), value: customer.companyName.trim() }
    : null;
  const customerLineCount = (nameAndPhoneParts.length > 0 ? 1 : 0) + (companyRow ? 1 : 0);

  const byBucket = new Map<QuoteBucket, ResolvedQuoteLine[]>();
  for (const bucket of BUCKET_ORDER) byBucket.set(bucket, []);
  for (const line of resolvedLines) byBucket.get(line.bucket)!.push(line);

  // Tách 2 nhóm tổng theo TÀI KHOẢN NHẬN TIỀN (xem comment splitByPaymentGroup
  // + QuoteBucket trong compositeQuote.ts) — "Dịch vụ MAX OFFICE" dùng khối
  // "Tổng cộng" + QR tài khoản công ty hiện có, "Dịch vụ thu hộ" (Chữ ký
  // số/Hoá đơn điện tử) có khối tổng + QR RIÊNG, tài khoản cố định
  // THU_HO_ACCOUNT, KHÔNG được gộp lẫn với tiền MAX OFFICE.
  const { maxOfficeLines, thuHoLines } = splitByPaymentGroup(resolvedLines);
  const hasThuHo = thuHoLines.length > 0;
  const maxOfficeQrAmount = groupQrAmount(maxOfficeLines);
  const thuHoQrAmount = groupQrAmount(thuHoLines);

  // Dòng tổng GỘP CẢ 2 nhóm — CHỈ hiện khi CẢ 2 nhóm đều có số tiền (nếu chỉ
  // 1 nhóm, khối tổng của nhóm đó đã đủ, xem OverallTotal()).
  const showOverallTotal = maxOfficeQrAmount != null && thuHoQrAmount != null;
  const overallTotalAmount = (maxOfficeQrAmount ?? 0) + (thuHoQrAmount ?? 0);

  // KHÔNG tin thẳng body.qrAccountKey — chỉ chấp nhận khi khớp đúng 1 trong
  // các key đã khai báo sẵn ở VIETQR_ACCOUNTS, rơi về tài khoản mặc định
  // (đúng hành vi trước khi có nhiều tài khoản) nếu thiếu hoặc sai key. CHỈ
  // áp dụng cho QR "Dịch vụ MAX OFFICE" — QR thu hộ luôn dùng THU_HO_ACCOUNT
  // cố định, không đọc field này.
  const qrAccountKey = isVietQrAccountKey(body.qrAccountKey) ? body.qrAccountKey : DEFAULT_VIETQR_ACCOUNT_KEY;

  // Nội dung chuyển khoản do nhân viên tự sửa (nếu có) — CHỈ áp dụng QR "Dịch
  // vụ MAX OFFICE"; QR thu hộ luôn tự sinh, không đọc field này (xem
  // buildQrNote() trong vietQr.ts để biết lý do).
  const maxOfficeQrNote = isNonEmptyString(body.qrNote) ? body.qrNote.trim() : buildQrNote(customer);

  const showMaxOfficeQr = Boolean(body.showQr) && maxOfficeQrAmount != null;
  const showThuHoQr = Boolean(body.showQr) && thuHoQrAmount != null;

  const [maxOfficeQrDataUri, thuHoQrDataUri] = await Promise.all([
    showMaxOfficeQr ? fetchQrDataUri(buildVietQrImageUrl(qrAccountKey, maxOfficeQrAmount, maxOfficeQrNote)) : null,
    showThuHoQr
      ? fetchQrDataUri(
          buildVietQrImageUrlForAccount(
            THU_HO_ACCOUNT,
            thuHoQrAmount,
            buildQrNote(customer, "thanh toan ho chu ky so/hoa don dien tu")
          )
        )
      : null,
  ]);

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);

  const dateLabel = `${qt("dateLabelPrefix", lang)}: ${new Date().toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")}`;

  const customerBlockH = customerLineCount > 0 ? 24 + 40 + 30 + customerLineCount * CUSTOMER_ROW_H : 0;

  const height =
    HEADER_H +
    customerBlockH +
    BUCKET_ORDER.reduce((sum, bucket) => sum + sectionHeight(byBucket.get(bucket)!, lang), 0) +
    grandTotalHeight(maxOfficeLines, lang) +
    overallTotalHeight(showOverallTotal, lang) +
    qrSectionHeight(maxOfficeQrDataUri, thuHoQrDataUri) +
    FOOTER_H;

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
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel={qt("badgeLabel", lang)} dateLabel={dateLabel} />

        {customerLineCount > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: `0 ${MARGIN_X}px`,
              marginTop: 24,
              borderRadius: 16,
              backgroundColor: QUOTE_COLOR.bgTint,
              padding: "20px 28px",
              width: CONTENT_WIDTH - 56,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                color: QUOTE_COLOR.primary,
                textTransform: "uppercase",
              }}
            >
              {qt("customerInfoTitle", lang)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 10, gap: 6 }}>
              {nameAndPhoneParts.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, fontSize: 16, color: QUOTE_COLOR.ink }}>
                  {nameAndPhoneParts.map((part) => (
                    <div key={part.label} style={{ display: "flex" }}>
                      <span style={{ display: "flex", fontWeight: 700, marginRight: 6 }}>{part.label}:</span>
                      {part.value}
                    </div>
                  ))}
                </div>
              )}
              {companyRow && (
                <div style={{ display: "flex", fontSize: 16, color: QUOTE_COLOR.ink }}>
                  <span style={{ display: "flex", fontWeight: 700, marginRight: 6 }}>{companyRow.label}:</span>
                  {companyRow.value}
                </div>
              )}
            </div>
          </div>
        )}

        {BUCKET_ORDER.map((bucket) => (
          <Section key={bucket} bucket={bucket} lines={byBucket.get(bucket)!} lang={lang} />
        ))}

        <GrandTotal maxOfficeLines={maxOfficeLines} lang={lang} hasThuHo={hasThuHo} />

        {showOverallTotal && <OverallTotal amount={overallTotalAmount} lang={lang} />}

        {maxOfficeQrDataUri && thuHoQrDataUri ? (
          <QrPaymentRow
            left={{
              dataUri: maxOfficeQrDataUri,
              groupLabel: qt("scanToPayMaxOfficeTitle", lang),
              accountLabel: vietQrAccountLabel(qrAccountKey),
              amount: maxOfficeQrAmount,
            }}
            right={{
              dataUri: thuHoQrDataUri,
              groupLabel: qt("scanToPayThuHoTitle", lang),
              accountLabel: thuHoAccountLabel(),
              amount: thuHoQrAmount,
              extraNote: qt("thuHoQrNote", lang),
            }}
            lang={lang}
          />
        ) : (
          <>
            {maxOfficeQrDataUri && (
              <QrPaymentBlock
                dataUri={maxOfficeQrDataUri}
                title={qt("scanToPayTitle", lang)}
                accountLabel={vietQrAccountLabel(qrAccountKey)}
                amount={maxOfficeQrAmount}
                lang={lang}
              />
            )}
            {thuHoQrDataUri && (
              <QrPaymentBlock
                dataUri={thuHoQrDataUri}
                title={qt("scanToPayTitle", lang)}
                accountLabel={thuHoAccountLabel()}
                amount={thuHoQrAmount}
                lang={lang}
                extraNote={qt("thuHoQrNote", lang)}
              />
            )}
          </>
        )}

        <QuoteFooterRow lang={lang} />
      </div>
    ),
    {
      width: CARD_WIDTH,
      height,
      fonts,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
