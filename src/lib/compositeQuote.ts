/**
 * Logic dữ liệu DÙNG CHUNG giữa API route tạo ảnh báo giá tổng hợp
 * (src/app/api/quote-image/tong-hop/route.tsx, chạy server) VÀ công cụ nhập
 * liệu phía client (src/components/tools/CompositeQuoteTool.tsx) — tách
 * riêng khỏi cả 2 nơi đó để CHỈ MỘT nơi tra giá theo key, tránh lệch giá
 * giữa bản xem trước ở form và ảnh PNG thật sự xuất ra.
 *
 * QUAN TRỌNG VỀ AN TOÀN GIÁ: `resolveCompositeQuoteItem()` là nơi DUY NHẤT
 * chuyển 1 lựa chọn (key) thành giá thật — với 3 loại có cấu trúc sẵn
 * (van-phong-ao/thanh-lap-doanh-nghiep/ke-toan-thue), hàm này LUÔN tự tra
 * giá từ servicesData.ts/planFinder.ts theo key nhận được, KHÔNG BAO GIỜ
 * nhận giá trực tiếp từ input. Route API gọi đúng hàm này ở phía server nên
 * dù client (hoặc ai đó gọi thẳng API bằng tay) có cố gửi kèm 1 field "giá"
 * giả cho 3 loại này, giá trị đó cũng bị bỏ qua hoàn toàn. Chỉ loại
 * "custom" (3 dịch vụ chưa có bảng giá cấu trúc + "Dịch vụ khác" tự nhập tự
 * do) mới nhận giá tự do từ client, vì bản chất không có gì trong hệ thống
 * để tra.
 *
 * VAT + SỐ THÁNG (bổ sung sau — xem lịch sử trò chuyện): mỗi dòng có 1
 * `breakdown` đầy đủ Giá gốc -> (Số tháng, chỉ VPA) -> Tạm tính -> VAT ->
 * Thành tiền. `breakdown` chỉ null khi giá tự nhập (loại "custom") không
 * tách được số cụ thể (VD nhân viên gõ "Liên hệ báo giá") — khi đó hiện
 * đúng text đã nhập, không tính VAT, không cộng vào tổng khối.
 */
import { getOfferedPlan } from "./planFinder";
import { SERVICES_DATA, CHU_KY_SO_TIERS, HOA_DON_DIEN_TU_TIERS } from "./servicesData";
import { qt, formatQuoteCurrency, type QuoteLang, type QuoteDictKey } from "./quoteImageDictionary";
import { slugifyForFilename } from "./slugify";

export type CustomServiceSlug = "van-phong-tron-goi" | "cho-ngoi-linh-dong" | "phong-hop" | "khac";

/** Đơn vị tính phí — quyết định dòng này rơi vào khối nào trên ảnh báo giá.
 * "thue-vpa" TÁCH RIÊNG khỏi "thang" (dù cả 2 đều là chi phí định kỳ) vì kể
 * từ khi thêm lựa chọn số tháng, "Thành tiền" của dòng VPA là 1 khoản TRẢ
 * MỘT LẦN cho trọn kỳ hạn đã chọn (6/12/24 tháng) — không còn cùng bản chất
 * "mỗi tháng trả 1 lần" như Kế toán & thuế/Trọn gói/Coworking (vẫn ở
 * "thang"), gộp chung sẽ gây hiểu nhầm đơn vị thời gian.
 *
 * "thu-ho" KHÁC HẲN 4 bucket còn lại — không phải phân biệt theo ĐƠN VỊ THỜI
 * GIAN mà theo TÀI KHOẢN NHẬN TIỀN: Chữ ký số/Hoá đơn điện tử là MAX OFFICE
 * thu hộ cho đơn vị cung cấp ngoài, tiền phải vào tài khoản CÁ NHÂN riêng
 * (THU_HO_ACCOUNT trong vietQr.ts), không được gộp chung với 4 bucket "Dịch
 * vụ MAX OFFICE" — route.tsx dựa vào field `bucket === "thu-ho"` để tách
 * nhóm tổng + QR riêng, xem comment ở route.tsx. */
export type QuoteBucket = "thue-vpa" | "thang" | "mot-lan" | "gio" | "thu-ho";

export const MONTH_OPTIONS = [6, 12, 24] as const;
export type MonthOption = (typeof MONTH_OPTIONS)[number];

export const CUSTOM_SERVICE_META: Record<
  CustomServiceSlug,
  { name: string; bucket: QuoteBucket; unitLabel: string; vatRatePercent: number }
> = {
  "van-phong-tron-goi": { name: "Văn phòng trọn gói", bucket: "thang", unitLabel: "/tháng", vatRatePercent: 10 },
  "cho-ngoi-linh-dong": { name: "Chỗ ngồi linh động", bucket: "thang", unitLabel: "/tháng", vatRatePercent: 10 },
  "phong-hop": { name: "Phòng họp theo giờ", bucket: "gio", unitLabel: "/giờ", vatRatePercent: 10 },
  // "Dịch vụ khác" — tự nhập HOÀN TOÀN (cả tên lẫn giá), dùng khi nhân viên
  // cần báo giá 1 dịch vụ chưa có trên web/chưa có bảng giá cấu trúc nào ở
  // trên (VD dịch vụ mới, dịch vụ gộp tạm thời theo yêu cầu riêng của khách).
  // Mặc định khối "Chi phí một lần" (mot-lan) — phù hợp đa số trường hợp phát
  // sinh lẻ; nếu là chi phí định kỳ, nhân viên tự ghi rõ trong mô tả.
  khac: { name: "Dịch vụ khác", bucket: "mot-lan", unitLabel: "", vatRatePercent: 10 },
};

/** Tra tên tiếng Anh cho 4 dịch vụ "custom" qua đúng dictionary dùng cho ảnh
 * báo giá (quoteImageDictionary.ts) — tránh khai báo trùng bản dịch ở 2 nơi.
 * Không gộp vào CUSTOM_SERVICE_META vì field `name` ở đó còn dùng cho thông
 * báo nội bộ (lỗi nhập liệu...) luôn ở tiếng Việt, không phụ thuộc `lang`. */
const CUSTOM_SERVICE_DICT_KEY: Record<CustomServiceSlug, QuoteDictKey> = {
  "van-phong-tron-goi": "customVanPhongTronGoi",
  "cho-ngoi-linh-dong": "customChoNgoiLinhDong",
  "phong-hop": "customPhongHop",
  khac: "customKhac",
};

/**
 * Ưu đãi ký hợp đồng Văn phòng ảo dài hạn — CHỈ khai báo khi dữ liệu gốc
 * (virtualOfficePlans.ts) nêu RÕ SỐ THÁNG TẶNG THÊM CHÍNH XÁC cho ĐÚNG mốc
 * tháng đang hỗ trợ chọn ở đây (6/12/24). Đã rà soát toàn bộ hệ giá VPA và
 * CỐ Ý KHÔNG đưa vào các trường hợp sau vì dữ liệu không đủ chính xác để tự
 * động áp dụng (xem báo cáo đầy đủ ở cuối phiên làm việc):
 * - Hệ LITE-RISE dùng chung (VO_PROMO_NOTES, đa số chi nhánh): chỉ ghi
 *   KHOẢNG ("tặng thêm 1-2 tháng", "4-6 tháng"), không có 1 số cụ thể.
 * - Mọi hệ giá riêng khác (Bùi Thị Xuân, Quận 7, Trường Chinh,
 *   SILVER/GOLD/PREMIUM...) cũng không có constant ưu đãi dài hạn tương tự.
 *   (Hệ đối tác CORE/PLUS/PRO "LiteSpace" từng ở nhóm này — đã xoá cùng 4
 *   chi nhánh dùng hệ giá đó, xem lịch sử commit.)
 *
 * 2 hệ DUY NHẤT có số chính xác, khớp đúng field `VO_PROMO_.*` dạng
 * string[] mô tả nhưng số tháng nêu rõ ràng không mơ hồ:
 * - PHAM_VAN_DONG_VO_PROMOS: "Tặng 3 tháng khi ký 12 tháng", "Tặng 7 tháng
 *   khi ký 24 tháng" (không có mốc 6 tháng).
 * - NGUYEN_THE_TRUYEN_VO_PROMOS: "Tặng 2 tháng khi ký 12 tháng", "Tặng 6
 *   tháng khi ký 24 tháng" (còn "tặng 12 tháng khi ký 36 tháng" nhưng 36
 *   tháng không nằm trong 3 mốc 6/12/24 đang hỗ trợ chọn).
 *
 * 10 chi nhánh ưu đãi dài hạn theo mốc giá 499K (thêm sau, xem
 * `locationsData.ts` field `promotions` của từng chi nhánh để biết đầy đủ cả
 * 2 lựa chọn): quy tắc gốc là "12 tháng tặng 2 tháng HOẶC 1 tháng + miễn phí
 * đổi GPKD", "24 tháng tặng 4 tháng HOẶC 2 tháng + miễn phí đổi GPKD" — SỐ
 * THÁNG TẶNG Ở LỰA CHỌN (a) GIỐNG NHAU cho MỌI gói bất kể giá (LITE/START
 * dưới 499K chỉ có lựa chọn (a), gói từ 499K có thêm lựa chọn (b) đổi GPKD
 * nhưng không đổi số tháng tặng của (a)) — vì vậy khai báo được 1 mức chung
 * { 12: 2, 24: 4 } cho cả chi nhánh mà KHÔNG cần phân biệt theo `planKey`.
 *
 * Lựa chọn (b) (ít tháng hơn + đổi GPKD) KHÔNG biểu diễn được qua cơ chế
 * "số tháng tặng thêm" này (đây là 2 phương án loại trừ nhau, không phải 2
 * dòng phí cộng dồn) — CỐ Ý không xây thêm UI chọn 1/2 cho từng dòng báo giá
 * (thay đổi lớn, chưa cần thiết ở quy mô hiện tại). Thay vào đó, hàm dưới
 * đây tự thêm 1 dòng ghi chú ngắn vào `label` khi gói ĐANG CHỌN có giá ≥499K
 * tại 1 trong 10 chi nhánh này, để nhân viên biết còn lựa chọn (b) mà không
 * cần chọn gì thêm trên form — khách muốn dùng lựa chọn (b) thì liên hệ tư
 * vấn trực tiếp (không tính được số tiền cụ thể qua công cụ này vì phí đổi
 * GPKD không nằm trong `SERVICES_DATA`/`virtualOfficePlans.ts` dưới dạng có
 * thể tự động cộng vào báo giá).
 */
const VO_LONG_TERM_PROMOS: Record<string, Partial<Record<MonthOption, number>>> = {
  "pham-van-dong": { 12: 3, 24: 7 },
  "nguyen-the-truyen": { 12: 2, 24: 6 },
  "yen-the": { 12: 2, 24: 4 },
  "cong-hoa": { 12: 2, 24: 4 },
  "cuu-long": { 12: 2, 24: 4 },
  "hoang-viet": { 12: 2, 24: 4 },
  "bau-cat": { 12: 2, 24: 4 },
  "lam-son": { 12: 2, 24: 4 },
  "hoang-ke-viem": { 12: 2, 24: 4 },
  "tan-thang": { 12: 2, 24: 4 },
  cmt8: { 12: 2, 24: 4 },
  "nguyen-oanh": { 12: 2, 24: 4 },
};

/** Chỉ 10 chi nhánh này có lựa chọn (b) đổi GPKD ở mức giá ≥499K — Phạm Văn
 * Đồng/Nguyễn Thế Truyện KHÔNG có khái niệm lựa chọn (b) này nên không đưa
 * vào set, dù cũng nằm trong `VO_LONG_TERM_PROMOS` ở trên. */
const LOCATIONS_WITH_GPKD_CHOICE = new Set([
  "yen-the",
  "cong-hoa",
  "cuu-long",
  "hoang-viet",
  "bau-cat",
  "lam-son",
  "hoang-ke-viem",
  "tan-thang",
  "cmt8",
  "nguyen-oanh",
]);

/**
 * `label` SONG NGỮ (khác "Bằng chữ"/khuyến mãi cố định dạng key-tra-sẵn — câu
 * này GHÉP ĐỘNG nhiều biến số tháng/loại ưu đãi nên không đưa vào
 * quoteImageDictionary.ts được, phải tự dựng cả 2 ngôn ngữ ngay tại đây).
 * TRƯỚC ĐÂY bản tiếng Anh OMIT hẳn khối này — ĐỔI LẠI theo yêu cầu: đây là
 * ưu đãi có giá trị tiền thật (tặng tháng/miễn phí đổi GPKD), khác "Bằng
 * chữ" (chỉ là cách trình bày, bỏ không mất thông tin) nên PHẢI dịch, không
 * được bỏ. Bản tiếng Anh là Claude tự đề xuất — CẦN RÀ SOÁT trước khi dùng
 * với khách thật (xem báo cáo cuối phiên).
 */
function monthPromo(
  locationSlug: string,
  months: MonthOption,
  planPrice: number,
  lang: QuoteLang
): { extraMonths: number; totalMonths: number; label: string } | undefined {
  const extraMonths = VO_LONG_TERM_PROMOS[locationSlug]?.[months];
  if (!extraMonths) return undefined;
  const totalMonths = months + extraMonths;
  const hasGpkdChoice = planPrice >= 499_000 && LOCATIONS_WITH_GPKD_CHOICE.has(locationSlug);
  const label =
    lang === "en"
      ? hasGpkdChoice
        ? `Sign a ${months}-month contract — get ${extraMonths} extra months free (pay for ${months} months, use for ${totalMonths} months), or swap for a free business-license-change service — contact us for details`
        : `Sign a ${months}-month contract — get ${extraMonths} extra months free (pay for ${months} months, use for ${totalMonths} months)`
      : hasGpkdChoice
        ? `Ký hợp đồng ${months} tháng — tặng thêm ${extraMonths} tháng sử dụng (thanh toán ${months} tháng, sử dụng ${totalMonths} tháng), hoặc đổi sang miễn phí dịch vụ đổi GPKD — liên hệ tư vấn`
        : `Ký hợp đồng ${months} tháng — tặng thêm ${extraMonths} tháng sử dụng (thanh toán ${months} tháng, sử dụng ${totalMonths} tháng)`;
  return { extraMonths, totalMonths, label };
}

/** Giá tham khảo hiện có (mode "single" trong servicesData.ts) — dùng làm
 * giá trị PREFILL gợi ý cho nhân viên khi chọn 1 trong 3 dịch vụ chưa có
 * bảng giá cấu trúc (không áp dụng cho "Dịch vụ khác" tự nhập tự do), không
 * phải giá cố định (nhân viên sửa lại tự do).
 * "khac" (Dịch vụ khác) KHÔNG có trang riêng trong servicesData.ts — luôn trả
 * về rỗng, không có gợi ý giá nào để prefill (đúng bản chất tự nhập hoàn toàn). */
export function getCustomServiceReferencePrice(slug: CustomServiceSlug): string {
  const pricing = SERVICES_DATA[slug]?.pricing;
  return pricing?.mode === "single" ? pricing.price : "";
}

export type CompositeQuoteCustomer = {
  name?: string;
  phone?: string;
  companyName?: string;
};

export type CompositeQuoteItem =
  | { type: "van-phong-ao"; locationSlug: string; planKey: string; months: MonthOption }
  | { type: "thanh-lap-doanh-nghiep"; tier: "goi-1" | "goi-2" }
  | { type: "ke-toan-thue"; group: "A" | "B" | "C"; rangeIndex: number }
  | {
      type: "custom";
      serviceSlug: CustomServiceSlug;
      label: string;
      price: string;
      /** % VAT nhân viên TỰ CHỌN cho dòng tự nhập này — khác 3 loại có cấu
       * trúc sẵn (VPA/GPKD/Kế toán, VAT luôn cố định theo dữ liệu hệ thống,
       * client không can thiệp được), vì "custom" vốn đã không có bảng giá
       * nào để tra, mức VAT cũng cần nhân viên tự xác nhận theo đúng thực tế
       * dịch vụ đang báo giá. undefined -> rơi về CUSTOM_SERVICE_META[serviceSlug].vatRatePercent
       * (hành vi y hệt trước khi có lựa chọn này). route.tsx tự validate số
       * trong khoảng 0-100 trước khi dùng. */
      vatRatePercent?: number;
    }
  | { type: "chu-ky-so"; tierKey: string }
  | { type: "hoa-don-dien-tu"; tierKey: string };

export type CompositeQuoteRequestBody = {
  customer?: CompositeQuoteCustomer;
  /** Khách có yêu cầu hiện mã QR chuyển khoản trên ảnh không — mặc định
   * false ở phía client; server đọc lại đúng field này (không đoán). Khi
   * true VÀ báo giá có dịch vụ thu hộ (Chữ ký số/Hoá đơn điện tử), route.tsx
   * tự thêm QR THỨ 2 (tài khoản cố định THU_HO_ACCOUNT) — field này vẫn chỉ
   * có 1 công tắc chung, không cần 2 field bật/tắt riêng cho 2 QR. */
  showQr?: boolean;
  /** Key tài khoản nhận trong VIETQR_ACCOUNTS (xem vietQr.ts) — kiểu string
   * lỏng ở đây (không import VietQrAccountKey) để compositeQuote.ts không
   * phụ thuộc vietQr.ts; route.tsx tự validate qua isVietQrAccountKey()
   * trước khi dùng, không tin trực tiếp giá trị client gửi. CHỈ áp dụng cho
   * QR "Dịch vụ MAX OFFICE" — QR thu hộ luôn dùng THU_HO_ACCOUNT cố định,
   * không đọc field này. */
  qrAccountKey?: string;
  /** Nội dung chuyển khoản (`addInfo`) do nhân viên TỰ SỬA — khi có giá trị
   * (chuỗi không rỗng), route.tsx dùng ĐÚNG giá trị này thay vì tự sinh qua
   * buildQrNote() (vietQr.ts). CHỈ áp dụng cho QR "Dịch vụ MAX OFFICE" — QR
   * thu hộ KHÔNG đọc field này, luôn tự sinh (xem buildQrNote() để biết lý
   * do). undefined/rỗng -> giữ hành vi tự sinh cũ (client cũ không gửi field
   * này vẫn hoạt động y hệt trước). */
  qrNote?: string;
  /** Ngôn ngữ của ẢNH XUẤT RA — mặc định "vi" khi không gửi (client cũ/thiếu
   * field vẫn hoạt động đúng như trước). Form nhập liệu LUÔN tiếng Việt,
   * field này chỉ quyết định nhãn/tên hiển thị trên ảnh PNG cuối cùng. */
  lang?: QuoteLang;
  items: CompositeQuoteItem[];
};

export type QuoteBreakdown = {
  /** Giá gốc / đơn vị (mỗi tháng, mỗi giờ, hoặc giá gốc 1 lần) — SỐ NGUYÊN
   * VNĐ CHƯA gồm VAT, chưa nhân số tháng. */
  baseAmount: number;
  baseLabel: string;
  months?: number;
  promo?: { extraMonths: number; totalMonths: number; label: string };
  /** = baseAmount * (months ?? 1) — "Tạm tính", CHƯA gồm VAT. */
  subtotal: number;
  vatRatePercent: number;
  vatAmount: number;
  /** = subtotal + vatAmount — "Thành tiền", số dùng để cộng tổng khối. */
  total: number;
};

export type ResolvedQuoteLine = {
  category: string;
  title: string;
  subtitle?: string;
  bucket: QuoteBucket;
  /** null CHỈ khi loại "custom" có giá tự nhập không tách được số cụ thể
   * (VD "Liên hệ báo giá") — khi đó không tính được VAT/tổng, hiện đúng
   * `fallbackLabel` thay thế toàn bộ khối chi tiết. */
  breakdown: QuoteBreakdown | null;
  fallbackLabel?: string;
};

export type ResolveItemError = { error: string };

/** Tách phần số đứng đầu chuỗi giá (bỏ qua "đ", dấu chấm/phẩy ngăn cách
 * nghìn) — dùng để cộng tổng. Trả null nếu chuỗi không bắt đầu bằng số (vd.
 * "Liên hệ báo giá", hoặc rỗng) thay vì đoán bừa. */
export function parseVndAmount(text: string): number | null {
  const match = text.trim().match(/^([\d.,]+)/);
  if (!match) return null;
  const digits = match[1].replace(/[.,]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function buildBreakdown(params: {
  baseAmount: number;
  baseLabel: string;
  months?: number;
  promo?: { extraMonths: number; totalMonths: number; label: string };
  vatRatePercent: number;
}): QuoteBreakdown {
  const { baseAmount, baseLabel, months, promo, vatRatePercent } = params;
  const subtotal = baseAmount * (months ?? 1);
  const vatAmount = Math.round((subtotal * vatRatePercent) / 100);
  return {
    baseAmount,
    baseLabel,
    months,
    promo,
    subtotal,
    vatRatePercent,
    vatAmount,
    total: subtotal + vatAmount,
  };
}

export function resolveCompositeQuoteItem(
  item: CompositeQuoteItem,
  lang: QuoteLang = "vi"
): ResolvedQuoteLine | ResolveItemError {
  switch (item.type) {
    case "van-phong-ao": {
      const plan = getOfferedPlan(item.locationSlug, item.planKey);
      if (!plan) {
        return {
          error: `Không tìm thấy gói Văn phòng ảo "${item.planKey}" tại chi nhánh "${item.locationSlug}". Có thể chi nhánh/gói này đã thay đổi — vui lòng chọn lại.`,
        };
      }
      if (!MONTH_OPTIONS.includes(item.months)) {
        return { error: `Số tháng "${item.months}" không hợp lệ — chỉ hỗ trợ 6, 12 hoặc 24 tháng.` };
      }
      // "Gói X" (vi) vs "X Package" (en) — thứ tự từ khác nhau giữa 2 ngôn
      // ngữ nên ghép trực tiếp ở đây thay vì 1 khoá dict chung (xem comment
      // đầu quoteImageDictionary.ts).
      const planDisplayName = lang === "en" ? plan.planNameEn ?? plan.planName : plan.planName;
      return {
        category: qt("categoryVanPhongAo", lang),
        title: lang === "en" ? `${planDisplayName} Package` : `Gói ${planDisplayName}`,
        subtitle: plan.locationName,
        bucket: "thue-vpa",
        breakdown: buildBreakdown({
          baseAmount: plan.price,
          baseLabel: `${formatQuoteCurrency(plan.price, lang)}${qt("perMonthSuffix", lang)}`,
          months: item.months,
          promo: monthPromo(item.locationSlug, item.months, plan.price, lang),
          vatRatePercent: 10,
        }),
      };
    }

    case "thanh-lap-doanh-nghiep": {
      const pricing = SERVICES_DATA["thanh-lap-doanh-nghiep"].pricing;
      if (pricing.mode !== "tiers") {
        return { error: "Dữ liệu giá Thành lập doanh nghiệp không đúng định dạng." };
      }
      const tierIndex = item.tier === "goi-1" ? 0 : 1;
      const tier = pricing.tiers[tierIndex];
      if (!tier) {
        return { error: `Không tìm thấy gói "${item.tier}" của Thành lập doanh nghiệp.` };
      }
      const baseAmount = parseVndAmount(tier.price);
      if (baseAmount == null) {
        return { error: "Không đọc được giá Thành lập doanh nghiệp từ dữ liệu hệ thống." };
      }
      return {
        category: qt("categoryThanhLapDoanhNghiep", lang),
        title: lang === "en" ? tier.nameEn ?? tier.name : tier.name,
        subtitle: lang === "en" ? tier.unitEn ?? tier.unit : tier.unit,
        bucket: "mot-lan",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: lang === "en" ? formatQuoteCurrency(baseAmount, "en") : tier.price,
          vatRatePercent: 8,
        }),
      };
    }

    case "ke-toan-thue": {
      const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
      if (pricing.mode !== "accounting") {
        return { error: "Dữ liệu giá Kế toán & thuế không đúng định dạng." };
      }
      const row = pricing.tiers[item.rangeIndex];
      const group = pricing.groups.find((g) => g.key === item.group);
      const price = row?.prices[item.group];
      if (!row || !group || !price) {
        return { error: "Không tìm thấy mức giá Kế toán & thuế theo lựa chọn đã gửi." };
      }
      const baseAmount = parseVndAmount(price);
      if (baseAmount == null) {
        return { error: "Không đọc được giá Kế toán & thuế từ dữ liệu hệ thống." };
      }
      return {
        category: qt("categoryKeToanThue", lang),
        title: lang === "en" ? group.labelEn ?? group.label : group.label,
        // row.range đã tự chứa "hoá đơn" (VD: "1-30 hoá đơn", ngoại lệ
        // "Không phát sinh") — chỉ nối thêm "/quý", KHÔNG lặp lại "hoá đơn".
        subtitle: `${lang === "en" ? row.rangeEn ?? row.range : row.range}${qt("perQuarterSuffix", lang)}`,
        bucket: "thang",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: `${lang === "en" ? formatQuoteCurrency(baseAmount, "en") : price}${qt("perMonthSuffix", lang)}`,
          // Tạm áp 10% (nhóm dịch vụ văn phòng/dịch vụ chung) — CHƯA có xác
          // nhận cuối cùng từ chủ site, xem báo cáo cuối phiên làm việc.
          vatRatePercent: 10,
        }),
      };
    }

    case "custom": {
      const meta = CUSTOM_SERVICE_META[item.serviceSlug];
      if (!meta) return { error: "Loại dịch vụ tuỳ chỉnh không hợp lệ." };
      const priceText = item.price.trim();
      if (!priceText) return { error: `Vui lòng nhập giá cho dòng "${meta.name}".` };
      const categoryName = qt(CUSTOM_SERVICE_DICT_KEY[item.serviceSlug], lang);
      const title = item.label.trim() || categoryName;
      const baseAmount = parseVndAmount(priceText);
      // % VAT nhân viên tự chọn (xem comment ở CompositeQuoteItem) — rơi về
      // mức mặc định của loại dịch vụ nếu không gửi kèm.
      const vatRatePercent = item.vatRatePercent ?? meta.vatRatePercent;
      // Hậu tố đơn vị tiếng Anh suy ra TRỰC TIẾP từ unitLabel tiếng Việt
      // (không suy từ bucket) — "khac" có bucket "mot-lan" nhưng unitLabel
      // rỗng (chi phí 1 lần, không có hậu tố nào), nếu suy theo bucket như 3
      // dịch vụ custom cũ (chỉ có "thang"/"gio") sẽ SAI thành "/month" cho cả
      // dòng một lần — đã xác nhận lỗi này qua ảnh test tiếng Anh thật.
      const unitSuffix =
        meta.unitLabel === "/giờ" ? qt("perHourSuffix", lang) : meta.unitLabel === "/tháng" ? qt("perMonthSuffix", lang) : "";
      if (baseAmount == null) {
        // Giá gõ tay không tách được số cụ thể (VD "Liên hệ báo giá") —
        // vẫn cho tạo báo giá, chỉ không tính được VAT/tổng cho dòng này.
        // Lưu ý: text gõ tay này KHÔNG được dịch tự động (nhân viên tự gõ
        // tiếng Anh nếu cần khi chọn xuất bản tiếng Anh).
        return {
          category: categoryName,
          title,
          subtitle: undefined,
          bucket: meta.bucket,
          breakdown: null,
          fallbackLabel: priceText,
        };
      }
      return {
        category: categoryName,
        title,
        subtitle: undefined,
        bucket: meta.bucket,
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: lang === "en" ? `${formatQuoteCurrency(baseAmount, "en")}${unitSuffix}` : `${priceText}${meta.unitLabel}`,
          vatRatePercent,
        }),
      };
    }

    case "chu-ky-so": {
      const tier = CHU_KY_SO_TIERS.find((t) => t.key === item.tierKey);
      if (!tier) return { error: `Không tìm thấy mốc thời hạn "${item.tierKey}" của Chữ ký số.` };
      const baseAmount = parseVndAmount(tier.price);
      if (baseAmount == null) return { error: "Không đọc được giá Chữ ký số từ dữ liệu hệ thống." };
      return {
        category: qt("categoryChuKySo", lang),
        title: lang === "en" ? tier.durationEn : tier.duration,
        subtitle: undefined,
        bucket: "thu-ho",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: lang === "en" ? formatQuoteCurrency(baseAmount, "en") : tier.price,
          vatRatePercent: tier.vatRatePercent,
        }),
      };
    }

    case "hoa-don-dien-tu": {
      const tier = HOA_DON_DIEN_TU_TIERS.find((t) => t.key === item.tierKey);
      if (!tier) return { error: `Không tìm thấy mốc số lượng "${item.tierKey}" của Hoá đơn điện tử.` };
      const baseAmount = parseVndAmount(tier.price);
      if (baseAmount == null) return { error: "Không đọc được giá Hoá đơn điện tử từ dữ liệu hệ thống." };
      return {
        category: qt("categoryHoaDonDienTu", lang),
        title: lang === "en" ? tier.quantityEn : tier.quantity,
        subtitle: undefined,
        bucket: "thu-ho",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: lang === "en" ? formatQuoteCurrency(baseAmount, "en") : tier.price,
          vatRatePercent: tier.vatRatePercent,
        }),
      };
    }
  }
}

/** Tuỳ chọn Gói 1/Gói 2 Thành lập DN cho dropdown — đọc thẳng từ
 * servicesData.ts nên không lệch với trang /services/thanh-lap-doanh-nghiep
 * nếu tên/giá gói thay đổi sau này. */
export function getGpkdTierOptions(): { tier: "goi-1" | "goi-2"; name: string; price: string; unit: string }[] {
  const pricing = SERVICES_DATA["thanh-lap-doanh-nghiep"].pricing;
  if (pricing.mode !== "tiers") return [];
  return pricing.tiers.map((t, i) => ({
    tier: i === 0 ? "goi-1" : "goi-2",
    name: t.name,
    price: t.price,
    unit: t.unit,
  }));
}

export function getAccountingGroupOptions() {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  return pricing.mode === "accounting" ? pricing.groups : [];
}

export function getAccountingRangeOptions() {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  return pricing.mode === "accounting" ? pricing.tiers : [];
}

/** Tuỳ chọn mốc thời hạn Chữ ký số cho dropdown/pill — đọc thẳng từ
 * CHU_KY_SO_TIERS (servicesData.ts) nên không lệch giá nếu sửa sau này. */
export function getChuKySoTierOptions(): { key: string; duration: string; price: string }[] {
  return CHU_KY_SO_TIERS.map((t) => ({ key: t.key, duration: t.duration, price: t.price }));
}

/** Tuỳ chọn mốc số lượng Hoá đơn điện tử cho dropdown — đọc thẳng từ
 * HOA_DON_DIEN_TU_TIERS (servicesData.ts). */
export function getHoaDonDienTuTierOptions(): { key: string; quantity: string; price: string }[] {
  return HOA_DON_DIEN_TU_TIERS.map((t) => ({ key: t.key, quantity: t.quantity, price: t.price }));
}

/**
 * Tên file ảnh tải xuống — định dạng `BG-{TÊN-CÔNG-TY-VIẾT-TẮT}-{NGÀY}.png`:
 * ưu tiên tên công ty dự kiến (cắt tối đa 25 ký tự), không có thì dùng tên
 * khách hàng, không có cả 2 thì "KHACH-LE". Ngày = ngày TẠO báo giá (không
 * có trường ngày riêng nào trong công cụ này để dùng thay).
 *
 * CHỈ đổi đuôi .png (không phải .pdf) — công cụ này CHƯA có tính năng xuất
 * PDF (khác PaymentRequestTool), nên áp dụng quy ước tên file mới cho đúng
 * định dạng file THẬT SỰ đang tải về.
 */
export function buildCompositeQuoteFilename(customer: CompositeQuoteCustomer, now: Date = new Date()): string {
  const source = customer.companyName?.trim() || customer.name?.trim();
  const slug = source ? slugifyForFilename(source, 25) : "KHACH-LE";
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  return `BG-${slug}-${dd}${mm}${yy}.png`;
}
