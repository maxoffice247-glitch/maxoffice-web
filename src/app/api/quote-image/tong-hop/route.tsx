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
  type InstallmentPlan,
  resolveInstallment,
  installmentScheduleRows,
  INSTALLMENT_QR_SUFFIX,
} from "@/lib/compositeQuote";
import { priceListColIncl, paymentScheduleText, overallBreakdownText } from "@/lib/quoteImageDictionary";
import { amountToVietnameseWords } from "@/lib/numberToWords";
import {
  buildVietQrImageUrl,
  buildVietQrImageUrlForAccount,
  buildQrNote,
  buildInstallmentQrNote,
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
// Thẻ Văn phòng ảo có phụ phí thu một lần: thêm 1 dòng breakdown (phụ phí + Tạm tính gộp chung 1 dòng, chữ 14px ~17px) + khoảng cách 4px giữa các dòng
// — đo thực tế mỗi thẻ cao thêm đúng 21px.
const SURCHARGE_LINE_H = 21;
const TOTAL_ROW_H = 56; // khối "Thành tiền" viền trên
const FALLBACK_ROW_H = 78; // dòng "custom" không tách được số (giữ như thiết kế cũ)
const ROW_GAP = 14;

// Dòng "Dịch vụ pháp lý sửa đổi" (loại "sua-doi"): 1 thẻ gộp, MỖI DỊCH VỤ là 1 hàng gọn (tên · thời gian bên trái, giá bên
// phải) thay vì mỗi dịch vụ một thẻ cao như các loại khác — báo giá nhiều dịch vụ sẽ quá dài nếu để mỗi thông tin một dòng.
// Các hằng số chiều cao hiệu chỉnh bằng pixel thật (xem estimateAmendmentRowHeight).
const AMEND_ROW_H = 36; // 1 hàng dịch vụ 1 dòng chữ: padding 8+8, chữ 15px (~19), viền trên 1 — đo bằng pixel thật
const AMEND_ROW_EXTRA_LINE_H = 18; // mỗi dòng chữ thêm khi tên dịch vụ dài phải xuống dòng
const AMEND_ROW_WRAP_THRESHOLD = 84; // ký tự (tên + " · " + thời gian) vượt ngưỡng này thì ước lượng 2 dòng (đo: dòng EN dài nhất 76 ký tự vẫn 1 dòng)
const AMEND_ROWS_TOP_MARGIN = 10;
const AMEND_NOTE_LINE_H = 16;
const AMEND_NOTE_PADDING_Y = 20; // padding 9+9 + viền 2
const AMEND_NOTE_CHARS_PER_LINE = 135; // ký tự/dòng của ghi chú combo (chữ 12px, khung ~866px; đo thực tế ~145) — chọn thấp hơn để KHÔNG BAO GIỜ ước lượng thiếu
const AMEND_NOTE_TOP_MARGIN = 10;

// Khối "Bảng giá đầy đủ" (loại "sua-doi-bang-gia"): bảng 13 dòng, mỗi dòng 1 hàng — tên · thời gian · giá chưa VAT · giá đã gồm VAT.
// Cỡ chữ lớn hơn thẻ báo giá để dễ đọc khi khách xem ảnh trên điện thoại. Hằng số hiệu chỉnh bằng pixel thật.
const PL_NOTE_PADDING_Y = 28; // padding 14+14 của dòng "Áp dụng chung..."
const PL_NOTE_LINE_H = 20;
const PL_NOTE_CHARS_PER_LINE = 130; // ký tự/dòng của câu phạm vi (chữ 14px, khung ~920px; đo: câu EN 125 ký tự vừa 1 dòng, sức chứa ~138)
const PL_HEADER_ROW_H = 41;
const PL_ROW_H = 44; // 1 dòng chữ 16px: padding 12+12, chữ ~19, viền trên 1 — đo thực tế 44px/hàng
const PL_ROW_EXTRA_LINE_H = 19; // mỗi dòng chữ thêm khi tên dịch vụ dài phải xuống dòng
const PL_NAME_WRAP_THRESHOLD = 62; // ký tự: tên dài hơn ngưỡng này ước lượng 2 dòng (đo: VI 60 ký tự và EN 60 ký tự vừa 1 dòng, EN 65 ký tự xuống 2 dòng)
const PL_TITLE_BLOCK_H = 40; // tiêu đề 20px (~24) + margin dưới 16 — đo thực tế
const PL_VAT_NOTE_H = 26; // margin 10 + 1 dòng chữ 12.5px (~16) — đo thực tế
const PL_CARD_BORDER = 2;

// Khối "Lịch thanh toán" (thanh toán theo đợt): thẻ nền nhạt, tiêu đề + 3 hàng [nhãn | số tiền]. Hằng số hiệu chỉnh bằng pixel thật (xem scheduleHeight).
const SCHEDULE_TOP_MARGIN = 32;
const SCHEDULE_PADDING_Y = 40; // padding 20+20
const SCHEDULE_TITLE_H = 27; // tiêu đề 14px (~17) + margin dưới 10
const SCHEDULE_ROW_H = 38; // 1 dòng chữ 16px: padding 7+7, lineHeight 24
const SCHEDULE_ROW_BORDER = 1; // viền trên mỗi hàng (trừ hàng đầu)
const SCHEDULE_ROW_EXTRA_LINE_H = 24;
const SCHEDULE_NOTE_H = 18; // chú thích nhỏ (chữ 13px, lineHeight 18) dưới nhãn hàng "còn lại" khi có nhóm thu hộ // mỗi dòng chữ thêm khi nhãn (điều kiện thanh toán dài) xuống dòng
const SCHEDULE_LABEL_CHARS_PER_LINE = 88; // ký tự/dòng của nhãn (chữ 16px, cột nhãn ~790px): đo thực tế nhãn tiếng Việt ~95-99 ký tự, tiếng Anh ~91-94 vẫn 1 dòng — chọn thấp hơn để KHÔNG BAO GIỜ thiếu chiều cao

// Khối "Bảng giá đầy đủ" Kế toán & thuế (loại "ke-toan-bang-gia"): ma trận 9 mức x 3 nhóm + 3 nhóm phụ phí. Hằng số hiệu chỉnh bằng pixel thật (xem accountingPriceListHeight).
const AP_CARD_BORDER = 2;
const AP_NOTE_PADDING_Y = 28; // padding 14+14 của dòng ghi chú đầu bảng
const AP_NOTE_LINE_H = 20;
const AP_NOTE_CHARS_PER_LINE = 125; // ký tự/dòng của ghi chú (chữ 14px, khung ~920px): đo thực tế câu EN 122 ký tự vẫn vừa 1 dòng (sức chứa ~135)
const AP_HEADER_PADDING_Y = 24; // header ma trận: padding 12+12 + số dòng x AP_HEADER_LINE_H
const AP_HEADER_LINE_H = 17;
const AP_GROUP_COL_W = 200;
const AP_GROUP_CHARS_PER_LINE = 24; // ký tự/dòng của tên nhóm ở header (chữ 13px đậm, cột 200px - padding)
const AP_ROW_H = 44; // 1 dòng ma trận chữ 16px: padding 12+12, chữ ~19, viền trên 1
const AP_SUR_HEADING_H = 52; // tiêu đề "Phí phát sinh thêm" 16px + margin
const AP_SUR_HEAD_ROW_H = 38; // dòng tên nhóm phụ phí
const AP_SUR_ROW_H = 40; // dòng phụ phí chữ 16px: padding 10+10, chữ ~19, viền trên 1
const AP_VAT_NOTE_H = 29; // margin 10 + 1 dòng chữ 12.5px (~16) + dư 3px an toàn

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
const OVERALL_TOTAL_SPLIT_NOTE_H = 37; // 2 dòng chú thích nhỏ (chữ 13px) tách số tiền theo tài khoản nhận, dưới ô tổng toàn bộ — hiệu chỉnh bằng pixel thật
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
    case "sua-doi-bang-gia":
      return true; // không có field nào cần kiểm tra — server tự lấy cả 13 dịch vụ từ AMENDMENT_SERVICES
    case "sua-doi":
      // Chỉ kiểm tra hình dạng (mảng chuỗi) — nội dung (slug có tồn tại, trùng, rỗng...) do
      // resolveCompositeQuoteItem() từ chối kèm thông báo rõ.
      return Array.isArray(it.serviceSlugs) && it.serviceSlugs.length <= 100 && it.serviceSlugs.every((v) => typeof v === "string");
    case "ke-toan-bang-gia":
      return true; // không có field nào cần kiểm tra — server tự lấy toàn bộ bảng giá từ dữ liệu Kế toán & thuế
    case "ke-toan-thue":
      return (
        (it.group === "A" || it.group === "B" || it.group === "C") &&
        typeof it.rangeIndex === "number" &&
        // Chỉ kiểm tra hình dạng (mảng object) — khoá/mức/số lượng hợp lệ hay không do resolveCompositeQuoteItem() từ chối kèm thông báo rõ.
        (it.surcharges === undefined ||
          (Array.isArray(it.surcharges) && it.surcharges.length <= 10 && it.surcharges.every((x) => x !== null && typeof x === "object")))
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
function amendmentRowLines(row: { name: string; duration: string }): number {
  return row.name.length + row.duration.length + 3 > AMEND_ROW_WRAP_THRESHOLD ? 2 : 1;
}

/** Ước lượng chiều cao thẻ "Dịch vụ pháp lý sửa đổi" — PHẢI khớp JSX của AmendmentRow() bên dưới. */
function estimateAmendmentRowHeight(line: ResolvedQuoteLine): number {
  const a = line.amendment!;
  const rowsH = a.rows.reduce((sum, r) => sum + AMEND_ROW_H + (amendmentRowLines(r) - 1) * AMEND_ROW_EXTRA_LINE_H, 0);
  const noteLines = a.comboNote ? Math.ceil(a.comboNote.length / AMEND_NOTE_CHARS_PER_LINE) : 0;
  const noteH = a.comboNote ? AMEND_NOTE_TOP_MARGIN + AMEND_NOTE_PADDING_Y + noteLines * AMEND_NOTE_LINE_H : 0;
  return ROW_PADDING_Y + MERGED_TITLE_LINE_H + AMEND_ROWS_TOP_MARGIN + rowsH + noteH + BREAKDOWN_TOP_MARGIN + 2 * BREAKDOWN_LINE_H + TOTAL_ROW_H;
}

function estimateRowHeight(line: ResolvedQuoteLine): number {
  if (line.amendment && line.breakdown) return estimateAmendmentRowHeight(line);
  if (!line.breakdown) return FALLBACK_ROW_H;
  return (
    ROW_PADDING_Y +
    estimateMergedTitleLines(line) * MERGED_TITLE_LINE_H +
    (line.breakdown.promo ? PROMO_BADGE_H : 0) +
    BREAKDOWN_TOP_MARGIN +
    2 * BREAKDOWN_LINE_H +
    (line.breakdown.surcharge ? SURCHARGE_LINE_H : 0) +
    TOTAL_ROW_H
  );
}

/** Nhãn VAT của 1 dòng: "VAT 10%"; khi phụ phí có mức VAT KHÁC tiền thuê (phí bảng hiệu 8% — ONE_TIME_SURCHARGE_VAT_PERCENT) ghi cả hai mức: "VAT 10% / 8%". Số tiền VAT hiển thị là tổng đã tính riêng từng khoản. */
function breakdownVatLabel(b: NonNullable<ResolvedQuoteLine["breakdown"]>): string {
  return b.surcharge && b.surcharge.vatRatePercent !== b.vatRatePercent
    ? `${vatLabel(b.vatRatePercent)} / ${b.surcharge.vatRatePercent}%`
    : vatLabel(b.vatRatePercent);
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

/** Thẻ "Dịch vụ pháp lý sửa đổi": mỗi dịch vụ đã chọn = 1 hàng gọn [tên · thời gian] ... [giá gốc gạch ngang (nếu được
 * giảm) + giá combo]; dưới cùng 1 ghi chú nhỏ về ưu đãi combo rồi Tạm tính/VAT/Thành tiền như các dịch vụ khác. */
function AmendmentRow({ line, lang }: { line: ResolvedQuoteLine; lang: QuoteLang }) {
  const a = line.amendment!;
  const breakdown = line.breakdown!;
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
        <div style={{ display: "flex", marginLeft: 8, fontSize: 14, fontWeight: 400, color: QUOTE_COLOR.bodyText }}>
          {`— ${line.subtitle}`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: AMEND_ROWS_TOP_MARGIN }}>
        {a.rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${QUOTE_COLOR.line}`,
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", flex: 1, flexWrap: "wrap", alignItems: "baseline", paddingRight: 16 }}>
              <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: QUOTE_COLOR.navy }}>{r.name}</div>
              <div style={{ display: "flex", marginLeft: 8, fontSize: 13, color: QUOTE_COLOR.bodyText }}>{`· ${r.duration}`}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", flexShrink: 0 }}>
              {r.discounted && (
                <div style={{ display: "flex", marginRight: 10, fontSize: 13, color: QUOTE_COLOR.bodyText, textDecoration: "line-through" }}>
                  {formatQuoteCurrency(r.baseAmount, lang)}
                </div>
              )}
              <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.ink }}>
                {formatQuoteCurrency(r.finalAmount, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {a.comboNote && (
        <div
          style={{
            display: "flex",
            marginTop: AMEND_NOTE_TOP_MARGIN,
            borderRadius: 10,
            backgroundColor: "#fff7e6",
            border: "1px solid #f5cd7e",
            padding: "9px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#b45309",
            lineHeight: `${AMEND_NOTE_LINE_H}px`,
          }}
        >
          {`🎁 ${a.comboNote}`}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", marginTop: BREAKDOWN_TOP_MARGIN, gap: 4 }}>
        {a.comboApplied ? (
          <DualBreakdownLine
            leftLabel={qt("amendmentOriginalTotalLabel", lang)}
            leftValue={formatQuoteCurrency(a.originalTotal, lang)}
            rightLabel={qt("amendmentComboSubtotalLabel", lang)}
            rightValue={formatQuoteCurrency(a.comboTotal, lang)}
          />
        ) : (
          <BreakdownLine label={qt("subtotalLabel", lang)} value={formatQuoteCurrency(a.comboTotal, lang)} />
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

function ItemRow({ line, lang }: { line: ResolvedQuoteLine; lang: QuoteLang }) {
  if (line.amendment && line.breakdown) return <AmendmentRow line={line} lang={lang} />;
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
            rightLabel={breakdown.surcharge ? qt("rentSubtotalLabel", lang) : qt("subtotalLabel", lang)}
            rightValue={formatQuoteCurrency(breakdown.rentSubtotal ?? breakdown.subtotal, lang)}
          />
        ) : (
          <BreakdownLine label={qt("unitPriceLabel", lang)} value={breakdown.baseLabel} />
        )}
        {breakdown.surcharge && (
          <DualBreakdownLine
            leftLabel={breakdown.surcharge.label}
            leftValue={formatQuoteCurrency(breakdown.surcharge.amount, lang)}
            rightLabel={qt("subtotalLabel", lang)}
            rightValue={formatQuoteCurrency(breakdown.subtotal, lang)}
          />
        )}
        <BreakdownLine label={breakdownVatLabel(breakdown)} value={formatQuoteCurrency(breakdown.vatAmount, lang)} />
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

function priceListRowLines(name: string): number {
  return name.length > PL_NAME_WRAP_THRESHOLD ? 2 : 1;
}

/** Chiều cao khối "Bảng giá đầy đủ" — PHẢI khớp JSX của PriceListBlock() bên dưới. */
function priceListHeight(line: ResolvedQuoteLine): number {
  const pl = line.priceList!;
  const noteLines = Math.ceil(pl.scopeNote.length / PL_NOTE_CHARS_PER_LINE);
  const rowsH = pl.rows.reduce((sum, r) => sum + PL_ROW_H + (priceListRowLines(r.name) - 1) * PL_ROW_EXTRA_LINE_H, 0);
  return (
    SECTION_TOP_MARGIN + PL_TITLE_BLOCK_H + PL_CARD_BORDER + PL_NOTE_PADDING_Y + noteLines * PL_NOTE_LINE_H + PL_HEADER_ROW_H + rowsH + PL_VAT_NOTE_H
  );
}

/** Ảnh "Bảng giá đầy đủ": liệt kê cả 13 dịch vụ (giá chưa VAT + giá đã gồm VAT), KHÔNG combo/tổng/QR/"Chi phí một lần". */
function PriceListBlock({ line, lang }: { line: ResolvedQuoteLine; lang: QuoteLang }) {
  const pl = line.priceList!;
  const colDuration = 96;
  const colExcl = 150;
  const colIncl = 170;
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: SECTION_TOP_MARGIN }}>
      <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: QUOTE_COLOR.navy, marginBottom: 16 }}>📋 {line.title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 14,
          border: `1px solid ${QUOTE_COLOR.line}`,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", padding: "14px 22px", fontSize: 14, color: QUOTE_COLOR.bodyText, lineHeight: `${PL_NOTE_LINE_H}px` }}>
          {pl.scopeNote}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: QUOTE_COLOR.bgTint,
            padding: "0 22px",
            height: PL_HEADER_ROW_H,
            fontSize: 13,
            fontWeight: 700,
            color: QUOTE_COLOR.navy,
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>{qt("priceListColService", lang)}</div>
          <div style={{ display: "flex", width: colDuration }}>{qt("priceListColDuration", lang)}</div>
          <div style={{ display: "flex", width: colExcl, justifyContent: "flex-end" }}>{qt("priceListColExcl", lang)}</div>
          <div style={{ display: "flex", width: colIncl, justifyContent: "flex-end" }}>{priceListColIncl(lang, pl.vatPercent)}</div>
        </div>
        {pl.rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderTop: `1px solid ${QUOTE_COLOR.line}`,
              backgroundColor: i % 2 === 1 ? "#f9fbfe" : "#ffffff",
            }}
          >
            <div style={{ display: "flex", flex: 1, paddingRight: 12, fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy }}>{r.name}</div>
            <div style={{ display: "flex", width: colDuration, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{r.duration}</div>
            <div style={{ display: "flex", width: colExcl, justifyContent: "flex-end", fontSize: 16, color: QUOTE_COLOR.ink }}>
              {formatQuoteCurrency(r.priceExclVat, lang)}
            </div>
            <div style={{ display: "flex", width: colIncl, justifyContent: "flex-end", fontSize: 16, fontWeight: 800, color: QUOTE_COLOR.accent }}>
              {formatQuoteCurrency(r.priceInclVat, lang)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 10, paddingLeft: 4, fontSize: 12.5, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
        {pl.vatNote}
      </div>
    </div>
  );
}

function accountingHeaderLines(line: ResolvedQuoteLine): number {
  const apl = line.accountingPriceList!;
  return Math.max(1, ...apl.groups.map((g) => Math.ceil(g.label.length / AP_GROUP_CHARS_PER_LINE)));
}

/** Chiều cao khối "Bảng giá đầy đủ" Kế toán & thuế — PHẢI khớp JSX của AccountingPriceListBlock() bên dưới. */
function accountingPriceListHeight(line: ResolvedQuoteLine): number {
  const apl = line.accountingPriceList!;
  const noteLines = Math.ceil(apl.note.length / AP_NOTE_CHARS_PER_LINE);
  const matrixH = AP_NOTE_PADDING_Y + noteLines * AP_NOTE_LINE_H + AP_HEADER_PADDING_Y + accountingHeaderLines(line) * AP_HEADER_LINE_H + apl.tiers.length * AP_ROW_H;
  const surRows = apl.surcharges.reduce((sum, sc) => sum + AP_SUR_HEAD_ROW_H + sc.rows.length * AP_SUR_ROW_H, 0);
  return (
    SECTION_TOP_MARGIN + PL_TITLE_BLOCK_H + AP_CARD_BORDER + matrixH + AP_SUR_HEADING_H + AP_CARD_BORDER + surRows + AP_VAT_NOTE_H
  );
}

/** Ảnh "Bảng giá đầy đủ" Kế toán & thuế: ma trận số hoá đơn/quý x 3 nhóm (giá chưa VAT) + danh sách phụ phí kèm đơn vị tính; KHÔNG tổng/QR/combo. */
function AccountingPriceListBlock({ line }: { line: ResolvedQuoteLine }) {
  const apl = line.accountingPriceList!;
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: SECTION_TOP_MARGIN }}>
      <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: QUOTE_COLOR.navy, marginBottom: 16 }}>📋 {apl.title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 14,
          border: `1px solid ${QUOTE_COLOR.line}`,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", padding: "14px 22px", fontSize: 14, color: QUOTE_COLOR.bodyText, lineHeight: `${AP_NOTE_LINE_H}px` }}>
          {apl.note}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: QUOTE_COLOR.bgTint,
            padding: "12px 22px",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: `${AP_HEADER_LINE_H}px`,
            color: QUOTE_COLOR.navy,
          }}
        >
          <div style={{ display: "flex", flex: 1, paddingRight: 8 }}>{apl.colRange}</div>
          {apl.groups.map((g) => (
            <div key={g.key} style={{ display: "flex", width: AP_GROUP_COL_W, justifyContent: "flex-end", textAlign: "right" }}>
              {g.label}
            </div>
          ))}
        </div>
        {apl.tiers.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderTop: `1px solid ${QUOTE_COLOR.line}`,
              backgroundColor: i % 2 === 1 ? "#f9fbfe" : "#ffffff",
            }}
          >
            <div style={{ display: "flex", flex: 1, paddingRight: 8, fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy }}>{t.range}</div>
            {t.prices.map((price, j) => (
              <div key={j} style={{ display: "flex", width: AP_GROUP_COL_W, justifyContent: "flex-end", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.ink }}>
                {price}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy, marginTop: 24, marginBottom: 12 }}>{apl.surchargeHeading}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 14,
          border: `1px solid ${QUOTE_COLOR.line}`,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {apl.surcharges.map((sc, si) => (
          <div key={si} style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                backgroundColor: QUOTE_COLOR.bgTint,
                padding: "10px 22px",
                borderTop: si > 0 ? `1px solid ${QUOTE_COLOR.line}` : "none",
                height: AP_SUR_HEAD_ROW_H,
              }}
            >
              <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: QUOTE_COLOR.navy }}>{sc.title}</div>
              {sc.note && <div style={{ display: "flex", fontSize: 12.5, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>{sc.note}</div>}
            </div>
            {sc.rows.map((r, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 22px",
                  borderTop: `1px solid ${QUOTE_COLOR.line}`,
                  backgroundColor: ri % 2 === 1 ? "#f9fbfe" : "#ffffff",
                }}
              >
                <div style={{ display: "flex", flex: 1, paddingRight: 12, fontSize: 16, color: QUOTE_COLOR.navy }}>{r.label}</div>
                <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.ink }}>{r.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 10, paddingLeft: 4, fontSize: 12.5, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
        {apl.vatNote}
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

/** Các hàng của khối "Lịch thanh toán" — DÙNG CHUNG giữa PaymentSchedule() (render) và scheduleHeight() (ước lượng chiều cao). Khối nằm ngay dưới ô tổng toàn
 * bộ khi có nhóm thu hộ nên khi đó bỏ hàng "Tổng cộng" (tránh hiện 2 lần cùng 1 con số). */
function scheduleRows(plan: InstallmentPlan, lang: QuoteLang) {
  return installmentScheduleRows(plan, lang, { withTotal: plan.thuHo === 0, includeCondition: true });
}

function scheduleHeight(plan: InstallmentPlan | null, lang: QuoteLang): number {
  if (!plan) return 0;
  const rowsH = scheduleRows(plan, lang).reduce(
    (sum, r, i) =>
      sum +
      SCHEDULE_ROW_H +
      (i > 0 ? SCHEDULE_ROW_BORDER : 0) +
      (Math.ceil(r.label.length / SCHEDULE_LABEL_CHARS_PER_LINE) - 1) * SCHEDULE_ROW_EXTRA_LINE_H +
      (r.note ? SCHEDULE_NOTE_H : 0),
    0
  );
  return SCHEDULE_TOP_MARGIN + SCHEDULE_PADDING_Y + SCHEDULE_TITLE_H + rowsH;
}

/** Khối "Lịch thanh toán" — chỉ tính trên TỔNG ĐÃ GỒM VAT, không có dòng VAT/hoá đơn riêng từng đợt. Dòng nhấn (màu đỏ, đậm) là số tiền đang nằm trong mã QR
 * của nhóm MAX OFFICE (đợt 1) hoặc toàn bộ số còn phải thanh toán (đợt 2). Có nhóm thu hộ: tính theo G (xem installmentScheduleRows). */
function PaymentSchedule({ plan, lang }: { plan: InstallmentPlan; lang: QuoteLang }) {
  const t = paymentScheduleText(lang);
  const rows = scheduleRows(plan, lang);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: `0 ${MARGIN_X}px`,
        marginTop: SCHEDULE_TOP_MARGIN,
        borderRadius: 16,
        backgroundColor: QUOTE_COLOR.bgTint,
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          marginBottom: 10,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
          color: QUOTE_COLOR.primary,
          textTransform: "uppercase",
        }}
      >
        {t.title}
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 0",
            borderTop: i > 0 ? `1px solid ${QUOTE_COLOR.line}` : "none",
          }}
        >
          <div style={{ display: "flex", flex: 1, flexDirection: "column", paddingRight: 16 }}>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: r.emphasis ? 700 : 400,
                color: r.emphasis ? QUOTE_COLOR.navy : QUOTE_COLOR.bodyText,
              }}
            >
              {r.label}
            </div>
            {r.note && (
              <div style={{ display: "flex", fontSize: 13, lineHeight: "18px", color: QUOTE_COLOR.bodyText }}>{r.note}</div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              fontSize: r.emphasis ? 20 : 16,
              lineHeight: "24px",
              fontWeight: r.emphasis ? 800 : 700,
              color: r.emphasis ? QUOTE_COLOR.accent : QUOTE_COLOR.ink,
            }}
          >
            {formatQuoteCurrency(r.amount, lang)}
          </div>
        </div>
      ))}
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
function OverallTotal({
  amount,
  maxOfficeAmount,
  thuHoAmount,
  lang,
}: {
  amount: number;
  maxOfficeAmount: number;
  thuHoAmount: number;
  lang: QuoteLang;
}) {
  const b = overallBreakdownText(lang);
  // 2 dòng chú thích nhỏ tách số tiền theo TÀI KHOẢN NHẬN (thay cho câu cũ "Thanh toán qua 2 kênh riêng biệt") — con số tổng lớn ở trên là DUY NHẤT.
  const noteRow = (label: string, value: number, marginTop: number) => (
    <div style={{ display: "flex", marginTop, paddingLeft: 4, fontSize: 13, color: QUOTE_COLOR.bodyText }}>
      <div style={{ display: "flex" }}>{label}:</div>
      <div style={{ display: "flex", marginLeft: 6, fontWeight: 700, color: QUOTE_COLOR.ink }}>{formatQuoteCurrency(value, lang)}</div>
    </div>
  );
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
      {noteRow(b.company, maxOfficeAmount, 6)}
      {noteRow(b.thuHo, thuHoAmount, 2)}
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

  // Combo chỉ có nghĩa trong MỘT danh sách chọn — 2 dòng "sửa đổi" riêng sẽ tự tính combo tách rời, gây hiểu nhầm giá. Dòng
  // "Bảng giá đầy đủ" cũng chỉ 1 (và không đi kèm dòng "sửa đổi" khác trong cùng báo giá).
  const amendmentTypes = new Set(["sua-doi", "sua-doi-bang-gia"]);
  if (body.items.filter((it) => amendmentTypes.has((it as { type?: string })?.type ?? "")).length > 1) {
    return new Response("Chỉ được 1 dòng Dịch vụ pháp lý sửa đổi trong 1 báo giá — hãy tích thêm dịch vụ vào cùng 1 dòng.", {
      status: 400,
    });
  }

  // Mỗi báo giá chỉ 1 ảnh "Bảng giá đầy đủ" (sửa đổi HOẶC kế toán & thuế) — 2 bảng lớn trong 1 ảnh sẽ quá dài.
  const priceListTypes = new Set(["sua-doi-bang-gia", "ke-toan-bang-gia"]);
  if (body.items.filter((it) => priceListTypes.has((it as { type?: string })?.type ?? "")).length > 1) {
    return new Response("Chỉ được 1 dòng \"Bảng giá đầy đủ\" trong 1 báo giá.", { status: 400 });
  }

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
    // Dòng đi kèm sinh ra từ cùng lựa chọn (VD phụ phí Kế toán & thuế thu một lần -> thẻ ở "Chi phí một lần").
    if (result.extraLines) resolvedLines.push(...result.extraLines);
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

  // Dòng "Bảng giá đầy đủ" (nếu có) tách khỏi mọi khối chi phí/tổng/QR — chỉ là bảng liệt kê giá.
  const priceListLine = resolvedLines.find((l) => l.priceList || l.accountingPriceList) ?? null;
  const costLines = resolvedLines.filter((l) => !l.priceList && !l.accountingPriceList);

  const byBucket = new Map<QuoteBucket, ResolvedQuoteLine[]>();
  for (const bucket of BUCKET_ORDER) byBucket.set(bucket, []);
  for (const line of costLines) byBucket.get(line.bucket)!.push(line);

  // Tách 2 nhóm tổng theo TÀI KHOẢN NHẬN TIỀN (xem comment splitByPaymentGroup
  // + QuoteBucket trong compositeQuote.ts) — "Dịch vụ MAX OFFICE" dùng khối
  // "Tổng cộng" + QR tài khoản công ty hiện có, "Dịch vụ thu hộ" (Chữ ký
  // số/Hoá đơn điện tử) có khối tổng + QR RIÊNG, tài khoản cố định
  // THU_HO_ACCOUNT, KHÔNG được gộp lẫn với tiền MAX OFFICE.
  const { maxOfficeLines, thuHoLines } = splitByPaymentGroup(costLines);
  const hasThuHo = thuHoLines.length > 0;
  const maxOfficeQrAmount = groupQrAmount(maxOfficeLines);
  const thuHoQrAmount = groupQrAmount(thuHoLines);

  // Thanh toán theo đợt (đặt cọc) — CHỈ nhóm MAX OFFICE; nhóm thu hộ giữ nguyên số tiền/QR. null = tắt: ảnh y hệt trước khi có tính năng.
  const installmentResult = resolveInstallment(body, maxOfficeQrAmount, thuHoQrAmount ?? 0);
  if (installmentResult && "error" in installmentResult) {
    return new Response(installmentResult.error, { status: 400 });
  }
  const installment = installmentResult;

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
  const maxOfficeQrNote = isNonEmptyString(body.qrNote)
    ? body.qrNote.trim()
    : installment
      ? buildInstallmentQrNote(customer, INSTALLMENT_QR_SUFFIX[installment.stage])
      : buildQrNote(customer);
  // Số tiền QR nhóm MAX OFFICE: tắt đợt = tổng nhóm; đợt 1 = tiền cọc; đợt 2 = phần còn lại (server tự tính).
  const maxOfficePayAmount = installment ? installment.qrAmount : maxOfficeQrAmount;

  const showMaxOfficeQr = Boolean(body.showQr) && maxOfficeQrAmount != null;
  // Đợt 1 (đặt cọc): CHỈ mã QR công ty (số tiền D); khoản thu hộ thanh toán cùng đợt còn lại nên QR thu hộ chỉ hiện ở đợt 2 (số tiền Tt) hoặc khi không đặt cọc.
  const showThuHoQr = Boolean(body.showQr) && thuHoQrAmount != null && installment?.stage !== "deposit";

  const [maxOfficeQrDataUri, thuHoQrDataUri] = await Promise.all([
    showMaxOfficeQr ? fetchQrDataUri(buildVietQrImageUrl(qrAccountKey, maxOfficePayAmount, maxOfficeQrNote)) : null,
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
    (priceListLine ? (priceListLine.accountingPriceList ? accountingPriceListHeight(priceListLine) : priceListHeight(priceListLine)) : 0) +
    BUCKET_ORDER.reduce((sum, bucket) => sum + sectionHeight(byBucket.get(bucket)!, lang), 0) +
    grandTotalHeight(maxOfficeLines, lang) +
    overallTotalHeight(showOverallTotal, lang) +
    scheduleHeight(installment, lang) +
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

        {priceListLine &&
          (priceListLine.accountingPriceList ? (
            <AccountingPriceListBlock line={priceListLine} />
          ) : (
            <PriceListBlock line={priceListLine} lang={lang} />
          ))}

        {BUCKET_ORDER.map((bucket) => (
          <Section key={bucket} bucket={bucket} lines={byBucket.get(bucket)!} lang={lang} />
        ))}

        <GrandTotal maxOfficeLines={maxOfficeLines} lang={lang} hasThuHo={hasThuHo} />

        {showOverallTotal && (
          <OverallTotal
            amount={overallTotalAmount}
            maxOfficeAmount={maxOfficeQrAmount ?? 0}
            thuHoAmount={thuHoQrAmount ?? 0}
            lang={lang}
          />
        )}

        {installment && <PaymentSchedule plan={installment} lang={lang} />}

        {maxOfficeQrDataUri && thuHoQrDataUri ? (
          <QrPaymentRow
            left={{
              dataUri: maxOfficeQrDataUri,
              groupLabel: qt("scanToPayMaxOfficeTitle", lang),
              accountLabel: vietQrAccountLabel(qrAccountKey),
              amount: maxOfficePayAmount,
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
                amount={maxOfficePayAmount}
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
