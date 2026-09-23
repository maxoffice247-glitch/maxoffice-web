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
 * "custom" (3 dịch vụ chưa có bảng giá cấu trúc) mới nhận giá tự do từ
 * client, vì bản chất không có gì trong hệ thống để tra.
 *
 * VAT + SỐ THÁNG (bổ sung sau — xem lịch sử trò chuyện): mỗi dòng có 1
 * `breakdown` đầy đủ Giá gốc -> (Số tháng, chỉ VPA) -> Tạm tính -> VAT ->
 * Thành tiền. `breakdown` chỉ null khi giá tự nhập (loại "custom") không
 * tách được số cụ thể (VD nhân viên gõ "Liên hệ báo giá") — khi đó hiện
 * đúng text đã nhập, không tính VAT, không cộng vào tổng khối.
 */
import { getOfferedPlan, formatVoPrice } from "./planFinder";
import { SERVICES_DATA } from "./servicesData";

export type CustomServiceSlug = "van-phong-tron-goi" | "cho-ngoi-linh-dong" | "phong-hop";

/** Đơn vị tính phí — quyết định dòng này rơi vào khối nào trên ảnh báo giá.
 * "thue-vpa" TÁCH RIÊNG khỏi "thang" (dù cả 2 đều là chi phí định kỳ) vì kể
 * từ khi thêm lựa chọn số tháng, "Thành tiền" của dòng VPA là 1 khoản TRẢ
 * MỘT LẦN cho trọn kỳ hạn đã chọn (6/12/24 tháng) — không còn cùng bản chất
 * "mỗi tháng trả 1 lần" như Kế toán & thuế/Trọn gói/Coworking (vẫn ở
 * "thang"), gộp chung sẽ gây hiểu nhầm đơn vị thời gian. */
export type QuoteBucket = "thue-vpa" | "thang" | "mot-lan" | "gio";

export const MONTH_OPTIONS = [6, 12, 24] as const;
export type MonthOption = (typeof MONTH_OPTIONS)[number];

export const CUSTOM_SERVICE_META: Record<
  CustomServiceSlug,
  { name: string; bucket: QuoteBucket; unitLabel: string; vatRatePercent: number }
> = {
  "van-phong-tron-goi": { name: "Văn phòng trọn gói", bucket: "thang", unitLabel: "/tháng", vatRatePercent: 10 },
  "cho-ngoi-linh-dong": { name: "Chỗ ngồi linh động", bucket: "thang", unitLabel: "/tháng", vatRatePercent: 10 },
  "phong-hop": { name: "Phòng họp theo giờ", bucket: "gio", unitLabel: "/giờ", vatRatePercent: 10 },
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
 * QUAN TRỌNG: ưu đãi này CHỈ ảnh hưởng số THÁNG SỬ DỤNG được tặng thêm
 * (thông tin hiển thị), KHÔNG làm giảm số tiền phải trả — khách vẫn thanh
 * toán đúng giá x số tháng đã chọn, chỉ được dùng lâu hơn miễn phí.
 */
const VO_LONG_TERM_PROMOS: Record<string, Partial<Record<MonthOption, number>>> = {
  "pham-van-dong": { 12: 3, 24: 7 },
  "nguyen-the-truyen": { 12: 2, 24: 6 },
};

function vietnameseMonthPromo(
  locationSlug: string,
  months: MonthOption
): { extraMonths: number; totalMonths: number; label: string } | undefined {
  const extraMonths = VO_LONG_TERM_PROMOS[locationSlug]?.[months];
  if (!extraMonths) return undefined;
  const totalMonths = months + extraMonths;
  return {
    extraMonths,
    totalMonths,
    label: `Ký hợp đồng ${months} tháng — tặng thêm ${extraMonths} tháng sử dụng (thanh toán ${months} tháng, sử dụng ${totalMonths} tháng)`,
  };
}

/** Giá tham khảo hiện có (mode "single" trong servicesData.ts) — dùng làm
 * giá trị PREFILL gợi ý cho nhân viên khi chọn 1 trong 3 dịch vụ chưa có
 * bảng giá cấu trúc, không phải giá cố định (nhân viên sửa lại tự do). */
export function getCustomServiceReferencePrice(slug: CustomServiceSlug): string {
  const pricing = SERVICES_DATA[slug].pricing;
  return pricing.mode === "single" ? pricing.price : "";
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
  | { type: "custom"; serviceSlug: CustomServiceSlug; label: string; price: string };

export type CompositeQuoteRequestBody = {
  customer?: CompositeQuoteCustomer;
  /** Khách có yêu cầu hiện mã QR chuyển khoản trên ảnh không — mặc định
   * false ở phía client; server đọc lại đúng field này (không đoán). */
  showQr?: boolean;
  /** Key tài khoản nhận trong VIETQR_ACCOUNTS (xem vietQr.ts) — kiểu string
   * lỏng ở đây (không import VietQrAccountKey) để compositeQuote.ts không
   * phụ thuộc vietQr.ts; route.tsx tự validate qua isVietQrAccountKey()
   * trước khi dùng, không tin trực tiếp giá trị client gửi. */
  qrAccountKey?: string;
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
  item: CompositeQuoteItem
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
      return {
        category: "Văn phòng ảo",
        title: `Gói ${plan.planName}`,
        subtitle: plan.locationName,
        bucket: "thue-vpa",
        breakdown: buildBreakdown({
          baseAmount: plan.price,
          baseLabel: `${formatVoPrice(plan.price)}/tháng`,
          months: item.months,
          promo: vietnameseMonthPromo(item.locationSlug, item.months),
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
        category: "Thành lập doanh nghiệp",
        title: tier.name,
        subtitle: tier.unit,
        bucket: "mot-lan",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: tier.price,
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
        category: "Kế toán & thuế",
        title: group.label,
        // row.range đã tự chứa "hoá đơn" (VD: "1-30 hoá đơn", ngoại lệ
        // "Không phát sinh") — chỉ nối thêm "/quý", KHÔNG lặp lại "hoá đơn".
        subtitle: `${row.range}/quý`,
        bucket: "thang",
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: `${price}/tháng`,
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
      const title = item.label.trim() || meta.name;
      const baseAmount = parseVndAmount(priceText);
      if (baseAmount == null) {
        // Giá gõ tay không tách được số cụ thể (VD "Liên hệ báo giá") —
        // vẫn cho tạo báo giá, chỉ không tính được VAT/tổng cho dòng này.
        return {
          category: meta.name,
          title,
          subtitle: undefined,
          bucket: meta.bucket,
          breakdown: null,
          fallbackLabel: priceText,
        };
      }
      return {
        category: meta.name,
        title,
        subtitle: undefined,
        bucket: meta.bucket,
        breakdown: buildBreakdown({
          baseAmount,
          baseLabel: `${priceText}${meta.unitLabel}`,
          vatRatePercent: meta.vatRatePercent,
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
