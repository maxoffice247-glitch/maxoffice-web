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
import { ONE_TIME_SURCHARGE_VAT_PERCENT } from "./virtualOfficePlans";
import { SERVICES_DATA, CHU_KY_SO_TIERS, HOA_DON_DIEN_TU_TIERS } from "./servicesData";
import {
  qt,
  formatQuoteCurrency,
  amendmentComboNote,
  amendmentServiceCount,
  oneTimeFeeShortLabel,
  accountingText,
  accountingItemCount,
  ACCOUNTING_SURCHARGE_EN,
  ACCOUNTING_CUSTOMS_GROUP_A_VALUE_EN,
  translateAmendmentDuration,
  AMENDMENT_SERVICE_NAMES_EN,
  AMENDMENT_SCOPE_NOTE_EN,
  priceListVatNote,
  DEFAULT_BALANCE_CONDITION,
  BALANCE_CONDITION_MAX,
  balanceConditionText,
  paymentScheduleText,
  type QuoteLang,
  type QuoteDictKey,
} from "./quoteImageDictionary";
import {
  AMENDMENT_VAT_PERCENT,
  AMENDMENT_SERVICES,
  AMENDMENT_SCOPE_NOTE,
  amendmentPriceInclVat,
  AMENDMENT_COMBO_THRESHOLD,
  AMENDMENT_COMBO_HIGH_PRICE,
  AMENDMENT_COMBO_LOW_PRICE,
  calculateAmendmentCombo,
  validateAmendmentSelection,
} from "./setupFees";
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
  /** `includeSurcharge`: có thu phụ phí một lần của gói (addOn, VD "Bảng hiệu công ty" gói LITE) không. CHỈ boolean thật mới được đọc; thiếu/sai kiểu -> mặc
   * định theo dữ liệu gói (gói có phụ phí = true). Gói KHÔNG có phụ phí mà client gửi true -> lỗi. Số tiền/nhãn luôn lấy từ dữ liệu gói, không từ client. */
  | { type: "van-phong-ao"; locationSlug: string; planKey: string; months: MonthOption; includeSurcharge?: boolean }
  | { type: "thanh-lap-doanh-nghiep"; tier: "goi-1" | "goi-2" }
  /** "Dịch vụ pháp lý sửa đổi": client CHỈ gửi danh sách slug dịch vụ đã chọn (AMENDMENT_SERVICES trong setupFees.ts) và cờ
   * `applyCombo`. Giá gốc, giá combo, VAT đều do server tự tính (calculateAmendmentCombo) — mọi field "giá" client gửi kèm bị bỏ qua.
   * `applyCombo` CHỈ có hiệu lực khi === true (thiếu/sai kiểu/giá trị lạ -> false = mọi dịch vụ tính giá gốc). */
  | { type: "sua-doi"; serviceSlugs: string[]; applyCombo?: boolean }
  /** Ảnh "Bảng giá đầy đủ 13 dịch vụ" để gửi khách hỏi giá: không có field nào khác — server tự lấy cả 13 dịch vụ từ
   * AMENDMENT_SERVICES; không combo, không tổng, không QR. */
  | { type: "sua-doi-bang-gia" }
  /** `surcharges`: các khoản phụ phí chọn kèm (xem AccountingSurcharge trong servicesData.ts) — client CHỈ gửi (key, rowIndex, quantity); đơn giá/tên/nhóm
   * tổng/VAT do server tự tra và tính, mọi field "giá" gửi kèm bị bỏ qua. */
  | {
      type: "ke-toan-thue";
      group: "A" | "B" | "C";
      rangeIndex: number;
      surcharges?: { key: string; rowIndex: number; quantity?: number }[];
    }
  /** Ảnh "Bảng giá đầy đủ" Kế toán & thuế (ma trận 9 mức x 3 nhóm + 3 khoản phụ phí): không field nào khác, không tổng/QR. */
  | { type: "ke-toan-bang-gia" }
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
  /** Thanh toán theo đợt (đặt cọc) cho nhóm "Dịch vụ MAX OFFICE" — xem resolveInstallment(). Mặc định TẮT: chỉ BẬT khi `depositAmount` là số VÀ
   * `installmentStage` là "deposit"/"balance"; thiếu hoặc sai kiểu = tắt (ảnh y hệt trước). Server tự tính phần còn lại và số tiền QR, bỏ qua mọi số tiền khác client gửi. */
  depositAmount?: number;
  installmentStage?: "deposit" | "balance";
  /** Điều kiện thanh toán phần còn lại (chỉ hiện ở đợt 1). Thiếu/sai kiểu = câu mặc định; chuỗi rỗng = không ghi điều kiện. */
  balanceCondition?: string;
  items: CompositeQuoteItem[];
};

/** Hậu tố mặc định của nội dung chuyển khoản theo đợt (nhân viên vẫn sửa được ở form) — quy ước cố định, không theo nhãn DEPOSIT_LABEL. */
export const INSTALLMENT_QR_SUFFIX = { deposit: " dat coc", balance: " thanh toan con lai" } as const;
/** Hậu tố tên file ảnh theo đợt. */
export const INSTALLMENT_FILENAME_SUFFIX = { deposit: "-COC", balance: "-CON-LAI" } as const;

export type InstallmentStage = "deposit" | "balance";
export type InstallmentPlan = {
  stage: InstallmentStage;
  /** Tc: tổng nhóm MAX OFFICE (đã gồm VAT). */
  total: number;
  /** D: tiền đặt cọc — chỉ áp dụng nhóm MAX OFFICE (0 < D < Tc). */
  deposit: number;
  /** Tc - D: phần còn lại CỦA NHÓM MAX OFFICE (tài khoản công ty). */
  balance: number;
  /** Tt: tổng nhóm thu hộ (đã gồm VAT), 0 nếu báo giá không có nhóm này. Không bị đặt cọc, được thanh toán cùng đợt còn lại. */
  thuHo: number;
  /** G = Tc + Tt: tổng toàn bộ báo giá. */
  grand: number;
  /** G - D: còn lại TOÀN BỘ sau đặt cọc = (Tc - D) + Tt. */
  balanceAll: number;
  /** Điều kiện thanh toán phần còn lại ("" = không ghi). */
  condition: string;
  /** Số tiền QR của nhóm MAX OFFICE (tài khoản công ty): đợt 1 = D, đợt 2 = Tc - D. QR thu hộ (nếu có) do route xử lý riêng: không hiện ở đợt 1, số tiền Tt ở đợt 2 — nên ở đợt 2 tổng các QR = G - D. */
  qrAmount: number;
};

export type ScheduleRow = { label: string; amount: number; emphasis: boolean; /** Chú thích nhỏ dưới nhãn (chỉ khi có nhóm thu hộ). */ note?: string };

/**
 * Các hàng của khối "Lịch thanh toán" (ảnh) và phần tóm tắt ở form — DÙNG CHUNG để chữ/số không lệch nhau.
 * - Không có nhóm thu hộ (plan.thuHo = 0): 3 hàng Tổng / Đặt cọc / Còn lại (đợt 1) hoặc Tổng / Đã đặt cọc / Còn phải thanh toán (đợt 2), tính theo Tc.
 * - Có nhóm thu hộ: tính theo G; `withTotal` = false (ảnh: khối nằm ngay dưới ô tổng toàn bộ nên không lặp lại) thì bỏ hàng Tổng; hàng "còn lại" có chú thích tách
 *   tài khoản công ty (Tc - D) và tài khoản thu hộ (Tt).
 * `includeCondition`: ghi điều kiện thanh toán vào nhãn "Còn lại" (ảnh có, form không).
 */
export function installmentScheduleRows(
  plan: InstallmentPlan,
  lang: QuoteLang,
  opts: { withTotal: boolean; includeCondition: boolean }
): ScheduleRow[] {
  const t = paymentScheduleText(lang);
  const fmt = (n: number) => formatQuoteCurrency(n, lang);
  const hasThuHo = plan.thuHo > 0;
  const condition = opts.includeCondition ? balanceConditionText(plan.condition, lang) : "";
  const withCondition = (label: string) => (condition ? `${label} (${condition})` : label);
  const split = hasThuHo ? t.splitNote(fmt(plan.balance), fmt(plan.thuHo)) : undefined;
  const totalRow: ScheduleRow = {
    label: hasThuHo ? t.totalAll : t.total,
    amount: hasThuHo ? plan.grand : plan.total,
    emphasis: false,
  };
  const rows: ScheduleRow[] =
    plan.stage === "deposit"
      ? [
          { label: hasThuHo ? t.depositStage1Company : t.depositStage1, amount: plan.deposit, emphasis: true },
          {
            label: withCondition(hasThuHo ? t.remainingAfter : t.remaining),
            amount: hasThuHo ? plan.balanceAll : plan.balance,
            emphasis: false,
            note: split,
          },
        ]
      : [
          { label: t.depositPaid, amount: plan.deposit, emphasis: false },
          { label: t.balanceDue, amount: hasThuHo ? plan.balanceAll : plan.balance, emphasis: true, note: split },
        ];
  return opts.withTotal ? [totalRow, ...rows] : rows;
}

/** Tổng "Thành tiền" (đã gồm VAT) của nhóm MAX OFFICE — các dòng KHÔNG thuộc bucket thu hộ và tách được số; null nếu không có dòng nào. DÙNG CHUNG form + server. */
export function maxOfficeGroupTotal(lines: ResolvedQuoteLine[]): number | null {
  const total = lines
    .filter((l) => l.bucket !== "thu-ho" && !l.priceList)
    .reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0);
  return total > 0 ? total : null;
}

/** Tổng "Thành tiền" (đã gồm VAT) của nhóm thu hộ (Chữ ký số / Hoá đơn điện tử); 0 nếu không có dòng nào. */
export function thuHoGroupTotal(lines: ResolvedQuoteLine[]): number {
  return lines.filter((l) => l.bucket === "thu-ho").reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0);
}

/**
 * Đọc + kiểm tra cấu hình thanh toán theo đợt. Trả null = TẮT (thiếu/sai kiểu `depositAmount` hoặc `installmentStage`); `{ error }` = bật nhưng số
 * không hợp lệ (route trả 400); ngược lại là kế hoạch đã tính. Chỉ tin số do client gửi ở `depositAmount` — phần còn lại/QR luôn tự tính.
 */
export function resolveInstallment(
  input: { depositAmount?: unknown; installmentStage?: unknown; balanceCondition?: unknown },
  maxOfficeTotal: number | null,
  thuHoTotal: number = 0
): InstallmentPlan | { error: string } | null {
  const { depositAmount, installmentStage, balanceCondition } = input;
  if (typeof depositAmount !== "number" || !Number.isFinite(depositAmount)) return null;
  if (installmentStage !== "deposit" && installmentStage !== "balance") return null;
  if (maxOfficeTotal == null) {
    return { error: "Thanh toán theo đợt chỉ áp dụng cho nhóm Dịch vụ MAX OFFICE — báo giá này không có dịch vụ nào thuộc nhóm đó." };
  }
  if (!Number.isInteger(depositAmount)) return { error: "Số tiền đặt cọc phải là số nguyên đồng." };
  if (depositAmount <= 0) return { error: "Số tiền đặt cọc phải lớn hơn 0." };
  if (depositAmount >= maxOfficeTotal) {
    return { error: "Số tiền đặt cọc phải nhỏ hơn tổng nhóm Dịch vụ MAX OFFICE (đã gồm VAT)." };
  }
  const balance = maxOfficeTotal - depositAmount;
  const condition =
    typeof balanceCondition === "string"
      ? balanceCondition.trim().slice(0, BALANCE_CONDITION_MAX)
      : DEFAULT_BALANCE_CONDITION.vi;
  return {
    stage: installmentStage,
    total: maxOfficeTotal,
    deposit: depositAmount,
    balance,
    thuHo: thuHoTotal,
    grand: maxOfficeTotal + thuHoTotal,
    balanceAll: balance + thuHoTotal,
    condition,
    qrAmount: installmentStage === "deposit" ? depositAmount : balance,
  };
}

export type QuoteBreakdown = {
  /** Giá gốc / đơn vị (mỗi tháng, mỗi giờ, hoặc giá gốc 1 lần) — SỐ NGUYÊN
   * VNĐ CHƯA gồm VAT, chưa nhân số tháng. */
  baseAmount: number;
  baseLabel: string;
  months?: number;
  promo?: { extraMonths: number; totalMonths: number; label: string };
  /** Phụ phí THU MỘT LẦN kèm theo (VD "Bảng hiệu công ty" gói LITE) — chỉ có khi dòng đang tính khoản này. KHÔNG nhân số tháng, KHÔNG dính ưu đãi
   * tặng tháng (chỉ áp cho tiền thuê); đã nằm trong `subtotal`/`vatAmount`/`total`. */
  surcharge?: { label: string; amount: number; vatRatePercent: number };
  /** Tiền thuê thuần = baseAmount * months — chỉ có khi có `surcharge` (khi đó `subtotal` = rentSubtotal + surcharge.amount). */
  rentSubtotal?: number;
  /** = baseAmount * (months ?? 1) [+ phụ phí một lần] — "Tạm tính", CHƯA gồm VAT. */
  subtotal: number;
  vatRatePercent: number;
  vatAmount: number;
  /** = subtotal + vatAmount — "Thành tiền", số dùng để cộng tổng khối. */
  total: number;
};

/** Chi tiết riêng của dòng "Dịch vụ pháp lý sửa đổi" (loại "sua-doi") — 1 dòng gộp nhiều dịch vụ, mỗi dịch vụ là 1 hàng gọn. */
export type AmendmentLineDetail = {
  rows: {
    name: string;
    duration: string;
    baseAmount: number;
    /** Giá sau combo (= baseAmount khi không giảm). */
    finalAmount: number;
    discounted: boolean;
  }[];
  /** Tổng giá gốc các dịch vụ đã chọn (chưa combo, chưa VAT). */
  originalTotal: number;
  /** Tổng sau combo (chưa VAT) = breakdown.subtotal. */
  comboTotal: number;
  /** Số tiền được giảm nhờ combo = originalTotal - comboTotal (0 khi tắt combo). */
  discountAmount: number;
  /** Nhân viên có bật combo VÀ đủ điều kiện (từ 2 dịch vụ trở lên) — quyết định ảnh có gạch ngang giá/chú thích/dòng "Tổng giá gốc". */
  comboApplied: boolean;
  /** Chú thích ưu đãi combo — chỉ có khi comboApplied. */
  comboNote?: string;
};

/** Chi tiết dòng "Bảng giá đầy đủ" (loại "sua-doi-bang-gia") — chỉ liệt kê giá, không tính tổng. */
export type AmendmentPriceListDetail = {
  rows: { name: string; duration: string; priceExclVat: number; priceInclVat: number }[];
  vatPercent: number;
  scopeNote: string;
  vatNote: string;
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
  /** Chỉ có ở dòng loại "sua-doi" — route ảnh dựa vào field này để vẽ dạng gọn nhiều hàng. */
  amendment?: AmendmentLineDetail;
  /** Chỉ có ở dòng loại "sua-doi-bang-gia" — route ảnh vẽ khối bảng giá riêng, KHÔNG đưa vào khối chi phí/tổng/QR. */
  priceList?: AmendmentPriceListDetail;
  /** Chỉ có ở dòng loại "ke-toan-bang-gia" — cùng cách xử lý như `priceList` (khối riêng, không vào tổng/QR). */
  accountingPriceList?: AccountingPriceListDetail;
  /** Dòng đi kèm sinh ra từ cùng 1 lựa chọn (VD phụ phí Kế toán & thuế thu một lần -> thẻ riêng ở "Chi phí một lần") — route trải phẳng vào danh sách dòng. */
  extraLines?: ResolvedQuoteLine[];
};

/** Chi tiết dòng "Bảng giá đầy đủ" Kế toán & thuế. Giá giữ ở dạng chuỗi hiển thị (đúng chữ trên web ở bản tiếng Việt). */
export type AccountingPriceListDetail = {
  title: string;
  note: string;
  colRange: string;
  groups: { key: string; label: string }[];
  tiers: { range: string; prices: string[] }[];
  surchargeHeading: string;
  surcharges: { title: string; note?: string; rows: { label: string; value: string }[] }[];
  vatNote: string;
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
  /** Phụ phí thu một lần (đã tra từ dữ liệu gói) — VAT tính RIÊNG theo `vatRatePercent` của nó rồi cộng vào VAT chung. */
  surcharge?: { label: string; amount: number; vatRatePercent: number };
}): QuoteBreakdown {
  const { baseAmount, baseLabel, months, promo, vatRatePercent, surcharge } = params;
  const rentSubtotal = baseAmount * (months ?? 1);
  const surchargeAmount = surcharge?.amount ?? 0;
  const subtotal = rentSubtotal + surchargeAmount;
  const vatAmount =
    Math.round((rentSubtotal * vatRatePercent) / 100) +
    (surcharge ? Math.round((surchargeAmount * surcharge.vatRatePercent) / 100) : 0);
  return {
    baseAmount,
    baseLabel,
    months,
    promo,
    ...(surcharge ? { surcharge, rentSubtotal } : null),
    subtotal,
    vatRatePercent,
    vatAmount,
    total: subtotal + vatAmount,
  };
}

/** % VAT của phí Kế toán & thuế — TẠM 10% (chưa có xác nhận cuối cùng). */
export const ACCOUNTING_VAT_PERCENT = 10;
/** % VAT của phụ phí Kế toán & thuế — hiện dùng đúng mức của phí Kế toán & thuế; tách hằng số để đổi riêng khi cần. */
export const ACCOUNTING_SURCHARGE_VAT_PERCENT = ACCOUNTING_VAT_PERCENT;
export const ACCOUNTING_SURCHARGE_QUANTITY_MAX = 99;

type AccountingExtraRow = { name: string; duration: string; baseAmount: number; finalAmount: number; discounted: boolean };

/**
 * Kiểm tra + tính các phụ phí Kế toán & thuế khách chọn kèm. Trả `{ error }` nếu có khoản không hợp lệ (route -> 400); ngược lại tách 2 nhóm theo cách thu:
 * `monthly` (billing "month") nằm CHUNG thẻ phí hàng tháng; `oneOff` (billing "year"/"each") sang thẻ "Chi phí một lần". Thứ tự dòng theo dữ liệu, không theo thứ tự client gửi.
 */
function resolveAccountingSurcharges(
  group: "A" | "B" | "C",
  raw: unknown,
  lang: QuoteLang
): { error: string } | { monthly: AccountingExtraRow[]; oneOff: AccountingExtraRow[] } {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  if (pricing.mode !== "accounting") return { error: "Dữ liệu giá Kế toán & thuế không đúng định dạng." };
  if (raw === undefined) return { monthly: [], oneOff: [] };
  if (!Array.isArray(raw)) return { error: "Danh sách phụ phí Kế toán & thuế không hợp lệ." };

  const chosen = new Map<string, { rowIndex: number; quantity: number }>();
  for (const entry of raw) {
    const e = (entry ?? {}) as { key?: unknown; rowIndex?: unknown; quantity?: unknown };
    const surcharge = pricing.surcharges.find((x) => x.key === e.key);
    if (typeof e.key !== "string" || !surcharge) return { error: `Phụ phí "${String(e.key)}" không tồn tại.` };
    if (chosen.has(e.key)) return { error: `Phụ phí "${surcharge.title}" bị chọn trùng.` };
    if (typeof e.rowIndex !== "number" || !Number.isInteger(e.rowIndex) || !surcharge.rows[e.rowIndex]) {
      return { error: `Mức phụ phí của "${surcharge.title}" không tồn tại.` };
    }
    const row = surcharge.rows[e.rowIndex];
    if (row.amount === undefined) {
      return { error: `Mức "${row.label}" của "${surcharge.title}" chưa có đơn giá cố định — không tính được trong báo giá.` };
    }
    if (row.groups && !row.groups.includes(group)) {
      return { error: `Mức "${row.label}" của "${surcharge.title}" không áp dụng cho Nhóm ${group}.` };
    }
    let quantity = 1;
    if (e.quantity !== undefined) {
      if (typeof e.quantity !== "number" || !Number.isInteger(e.quantity) || e.quantity < 1 || e.quantity > ACCOUNTING_SURCHARGE_QUANTITY_MAX) {
        return { error: `Số lượng của "${surcharge.title}" phải là số nguyên từ 1 đến ${ACCOUNTING_SURCHARGE_QUANTITY_MAX}.` };
      }
      if (surcharge.billing === "month" && e.quantity !== 1) {
        return { error: `"${surcharge.title}" tính theo tháng, không có số lượng.` };
      }
      quantity = e.quantity;
    }
    chosen.set(e.key, { rowIndex: e.rowIndex, quantity });
  }

  const monthly: AccountingExtraRow[] = [];
  const oneOff: AccountingExtraRow[] = [];
  for (const surcharge of pricing.surcharges) {
    const pick = chosen.get(surcharge.key);
    if (!pick) continue;
    const row = surcharge.rows[pick.rowIndex];
    const unitPrice = row.amount as number;
    const en = ACCOUNTING_SURCHARGE_EN[surcharge.key];
    const title = lang === "en" ? en.title : surcharge.title;
    const rowLabel = lang === "en" ? en.rows[pick.rowIndex] : row.label;
    const name = `${title} — ${rowLabel}`;
    if (surcharge.billing === "month") {
      monthly.push({ name, duration: accountingText(lang, ACCOUNTING_VAT_PERCENT).perMonth, baseAmount: unitPrice, finalAmount: unitPrice, discounted: false });
      continue;
    }
    const unit =
      lang === "en" ? (pick.quantity === 1 ? en.unitOne : en.unitMany) : (surcharge.quantityUnit ?? "");
    const duration =
      pick.quantity === 1
        ? `1 ${unit}`
        : `${pick.quantity} ${unit} × ${formatQuoteCurrency(unitPrice, lang)}`;
    oneOff.push({ name, duration, baseAmount: unitPrice, finalAmount: unitPrice * pick.quantity, discounted: false });
  }
  return { monthly, oneOff };
}

/** Tách dòng nhiều hàng (dùng chung kiểu hiển thị với "Dịch vụ pháp lý sửa đổi"): mỗi hàng 1 khoản, rồi Tạm tính / VAT / Thành tiền. */
function multiRowLine(params: {
  category: string;
  title: string;
  subtitle: string;
  bucket: QuoteBucket;
  rows: AccountingExtraRow[];
  /** Phần VAT: danh sách [số tiền, % VAT] — VAT làm tròn riêng từng phần rồi cộng. */
  vatParts: [number, number][];
  lang: QuoteLang;
}): ResolvedQuoteLine {
  const subtotal = params.rows.reduce((sum, r) => sum + r.finalAmount, 0);
  const vatAmount = params.vatParts.reduce((sum, [amount, pct]) => sum + Math.round((amount * pct) / 100), 0);
  return {
    category: params.category,
    title: params.title,
    subtitle: params.subtitle,
    bucket: params.bucket,
    breakdown: {
      baseAmount: subtotal,
      baseLabel: formatQuoteCurrency(subtotal, params.lang),
      subtotal,
      vatRatePercent: params.vatParts[0][1],
      vatAmount,
      total: subtotal + vatAmount,
    },
    amendment: {
      rows: params.rows,
      originalTotal: subtotal,
      comboTotal: subtotal,
      discountAmount: 0,
      comboApplied: false,
    },
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
      // Phụ phí thu một lần: chỉ khi GÓI THẬT SỰ có (plan.oneTimeFee, từ addOn trong dữ liệu gói). Chỉ boolean thật mới được đọc; thiếu/sai kiểu ->
      // mặc định theo dữ liệu gói (có phụ phí = thu). Gói không có phụ phí mà client yêu cầu thu -> từ chối thay vì bỏ qua âm thầm.
      const fee = plan.oneTimeFee;
      const rawInclude = (item as { includeSurcharge?: unknown }).includeSurcharge;
      if (!fee && rawInclude === true) {
        return { error: `Gói "${plan.planName}" tại "${plan.locationName}" không có phụ phí thu một lần — bỏ chọn khoản phí này.` };
      }
      const chargeFee = fee ? (typeof rawInclude === "boolean" ? rawInclude : true) : false;
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
          surcharge:
            fee && chargeFee
              ? { label: oneTimeFeeShortLabel(lang, fee), amount: fee.price, vatRatePercent: ONE_TIME_SURCHARGE_VAT_PERCENT }
              : undefined,
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

    case "sua-doi": {
      // Server luôn tự kiểm tra + tự tính: chỉ đọc item.serviceSlugs và cờ applyCombo, bỏ qua mọi field khác (kể cả "giá" client gửi kèm).
      const selection = validateAmendmentSelection(item.serviceSlugs);
      if (!selection.ok) return { error: selection.error };
      // Chỉ đúng boolean true mới bật combo; mọi giá trị khác (thiếu, "true", 1, null...) coi là TẮT.
      const applyCombo = (item as { applyCombo?: unknown }).applyCombo === true;
      const combo = calculateAmendmentCombo(selection.slugs, applyCombo);
      const comboApplied = applyCombo && combo.items.length >= 2;
      const originalTotal = combo.items.reduce((sum, it) => sum + it.price, 0);
      const comboTotal = combo.total;
      const vatAmount = Math.round((comboTotal * AMENDMENT_VAT_PERCENT) / 100);
      const n = combo.items.length;
      const categoryName = qt("categoryPhapLySuaDoi", lang);
      return {
        category: categoryName,
        title: categoryName,
        subtitle: amendmentServiceCount(n, lang),
        bucket: "mot-lan",
        breakdown: {
          baseAmount: originalTotal,
          baseLabel: formatQuoteCurrency(originalTotal, lang),
          subtotal: comboTotal,
          vatRatePercent: AMENDMENT_VAT_PERCENT,
          vatAmount,
          total: comboTotal + vatAmount,
        },
        amendment: {
          rows: combo.items.map((it) => ({
            name: lang === "en" ? (AMENDMENT_SERVICE_NAMES_EN[it.slug] ?? it.name) : it.name,
            duration: translateAmendmentDuration(it.duration, lang),
            baseAmount: it.price,
            finalAmount: it.finalPrice,
            discounted: it.discounted,
          })),
          originalTotal,
          comboTotal,
          discountAmount: originalTotal - comboTotal,
          comboApplied,
          comboNote: comboApplied
              ? amendmentComboNote(lang, {
                  threshold: AMENDMENT_COMBO_THRESHOLD,
                  high: AMENDMENT_COMBO_HIGH_PRICE,
                  low: AMENDMENT_COMBO_LOW_PRICE,
                })
              : undefined,
        },
      };
    }

    case "sua-doi-bang-gia": {
      // Không nhận bất kỳ dữ liệu nào từ client: luôn in đủ AMENDMENT_SERVICES theo thứ tự trong bảng.
      const categoryName = qt("categoryPhapLySuaDoi", lang);
      return {
        category: categoryName,
        title: qt("priceListTitle", lang),
        subtitle: amendmentServiceCount(AMENDMENT_SERVICES.length, lang),
        bucket: "mot-lan", // không dùng: route tách dòng này ra khỏi các khối chi phí
        breakdown: null,
        fallbackLabel: amendmentServiceCount(AMENDMENT_SERVICES.length, lang),
        priceList: {
          rows: AMENDMENT_SERVICES.map((svc) => ({
            name: lang === "en" ? (AMENDMENT_SERVICE_NAMES_EN[svc.slug] ?? svc.name) : svc.name,
            duration: translateAmendmentDuration(svc.duration, lang),
            priceExclVat: svc.price,
            priceInclVat: amendmentPriceInclVat(svc.price),
          })),
          vatPercent: AMENDMENT_VAT_PERCENT,
          scopeNote: lang === "en" ? AMENDMENT_SCOPE_NOTE_EN : AMENDMENT_SCOPE_NOTE,
          vatNote: priceListVatNote(lang, AMENDMENT_VAT_PERCENT),
        },
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
      const groupTitle = lang === "en" ? group.labelEn ?? group.label : group.label;
      // row.range đã tự chứa "hoá đơn" (VD: "1-30 hoá đơn", ngoại lệ "Không phát sinh") — chỉ nối thêm "/quý", KHÔNG lặp lại "hoá đơn".
      const subtitle = `${lang === "en" ? row.rangeEn ?? row.range : row.range}${qt("perQuarterSuffix", lang)}`;
      const baseLabel = `${lang === "en" ? formatQuoteCurrency(baseAmount, "en") : price}${qt("perMonthSuffix", lang)}`;

      const extras = resolveAccountingSurcharges(item.group, item.surcharges, lang);
      if ("error" in extras) return { error: extras.error };

      // Không chọn phụ phí nào: giữ NGUYÊN thẻ cũ (ảnh y hệt trước khi có phụ phí).
      if (extras.monthly.length === 0 && extras.oneOff.length === 0) {
        return {
          category: qt("categoryKeToanThue", lang),
          title: groupTitle,
          subtitle,
          bucket: "thang",
          breakdown: buildBreakdown({ baseAmount, baseLabel, vatRatePercent: ACCOUNTING_VAT_PERCENT }),
        };
      }

      const text = accountingText(lang, ACCOUNTING_VAT_PERCENT);
      const mainRow: AccountingExtraRow = {
        name: text.mainFeeRow,
        duration: text.perMonth,
        baseAmount,
        finalAmount: baseAmount,
        discounted: false,
      };
      // Phí hàng tháng (phí chính + phụ phí tính theo tháng) ở CHUNG 1 thẻ nhóm "hàng tháng"; phụ phí theo năm/theo lần là thẻ thứ hai ở "Chi phí một lần".
      const monthlyExtraTotal = extras.monthly.reduce((sum, r) => sum + r.finalAmount, 0);
      const monthlyLine: ResolvedQuoteLine =
        extras.monthly.length === 0
          ? {
              category: qt("categoryKeToanThue", lang),
              title: groupTitle,
              subtitle,
              bucket: "thang",
              breakdown: buildBreakdown({ baseAmount, baseLabel, vatRatePercent: ACCOUNTING_VAT_PERCENT }),
            }
          : multiRowLine({
              category: qt("categoryKeToanThue", lang),
              title: groupTitle,
              subtitle,
              bucket: "thang",
              rows: [mainRow, ...extras.monthly],
              vatParts: [
                [baseAmount, ACCOUNTING_VAT_PERCENT],
                [monthlyExtraTotal, ACCOUNTING_SURCHARGE_VAT_PERCENT],
              ],
              lang,
            });
      if (extras.oneOff.length > 0) {
        const oneOffTotal = extras.oneOff.reduce((sum, r) => sum + r.finalAmount, 0);
        monthlyLine.extraLines = [
          multiRowLine({
            category: qt("categoryKeToanThue", lang),
            title: text.surchargeCardTitle,
            subtitle: accountingItemCount(extras.oneOff.length, lang),
            bucket: "mot-lan",
            rows: extras.oneOff,
            vatParts: [[oneOffTotal, ACCOUNTING_SURCHARGE_VAT_PERCENT]],
            lang,
          }),
        ];
      }
      return monthlyLine;
    }

    case "ke-toan-bang-gia": {
      // Không nhận dữ liệu nào từ client: in đủ ma trận 9 mức x 3 nhóm + 3 khoản phụ phí đang hiển thị trên web.
      const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
      if (pricing.mode !== "accounting") return { error: "Dữ liệu giá Kế toán & thuế không đúng định dạng." };
      const text = accountingText(lang, ACCOUNTING_VAT_PERCENT);
      const money = (display: string) => {
        if (lang === "vi") return display;
        const n = parseVndAmount(display);
        return n == null ? display : formatQuoteCurrency(n, "en");
      };
      return {
        category: text.category,
        title: text.priceListTitle,
        subtitle: "",
        bucket: "mot-lan", // không dùng: route tách dòng này ra khỏi các khối chi phí
        breakdown: null,
        fallbackLabel: text.priceListTitle,
        accountingPriceList: {
          title: text.priceListTitle,
          note: text.priceListNote,
          colRange: text.colRange,
          groups: pricing.groups.map((g) => ({ key: g.key, label: lang === "en" ? g.labelEn ?? g.label : g.label })),
          tiers: pricing.tiers.map((t) => ({
            range: lang === "en" ? t.rangeEn ?? t.range : t.range,
            prices: pricing.groups.map((g) => money(t.prices[g.key])),
          })),
          surchargeHeading: text.surchargeHeading,
          surcharges: pricing.surcharges.map((sc) => {
            const en = ACCOUNTING_SURCHARGE_EN[sc.key];
            return {
              title: lang === "en" ? en.title : sc.title,
              note: lang === "en" ? en.note : sc.note,
              rows: sc.rows.map((r, i) => ({
                label: lang === "en" ? en.rows[i] : r.label,
                value:
                  lang === "vi"
                    ? r.value
                    : r.amount === undefined
                      ? ACCOUNTING_CUSTOMS_GROUP_A_VALUE_EN
                      : `${formatQuoteCurrency(r.amount, "en")}${en.valueSuffix}`,
              })),
            };
          }),
          vatNote: text.vatNote,
        },
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

/** Các nhóm phụ phí Kế toán & thuế (đọc thẳng từ servicesData.ts — cùng nguồn với trang web) cho form chọn. */
export function getAccountingSurchargeOptions() {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  return pricing.mode === "accounting" ? pricing.surcharges : [];
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
export function buildCompositeQuoteFilename(
  customer: CompositeQuoteCustomer,
  now: Date = new Date(),
  kind?: "bang-gia-sua-doi" | "bang-gia-ke-toan",
  installmentStage?: InstallmentStage
): string {
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  // Ảnh "Bảng giá đầy đủ" là tài liệu chung (không gắn với 1 khách) nên dùng tên cố định thay vì tên khách/công ty.
  if (kind === "bang-gia-sua-doi") return `BG-BANG-GIA-SUA-DOI-${dd}${mm}${yy}.png`;
  if (kind === "bang-gia-ke-toan") return `BG-BANG-GIA-KE-TOAN-${dd}${mm}${yy}.png`;
  const source = customer.companyName?.trim() || customer.name?.trim();
  const slug = source ? slugifyForFilename(source, 25) : "KHACH-LE";
  const stageSuffix = installmentStage ? INSTALLMENT_FILENAME_SUFFIX[installmentStage] : "";
  return `BG-${slug}-${dd}${mm}${yy}${stageSuffix}.png`;
}
