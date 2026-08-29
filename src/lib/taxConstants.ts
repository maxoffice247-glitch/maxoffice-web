/**
 * Hằng số thuế TNCN (biểu lũy tiến) và thuế hộ kinh doanh (khoán theo % doanh
 * thu) — dùng cho công cụ /tien-ich/so-sanh-thue.
 *
 * ⚠️ LUẬT THUẾ VIỆT NAM THAY ĐỔI THƯỜNG XUYÊN. File này gom toàn bộ số liệu
 * thuế vào một chỗ để dễ tìm, dễ sửa khi luật/nghị định/thông tư mới ban hành
 * — luôn đối chiếu nguồn chính thức (Cổng thông tin Bộ Tài chính, Tổng cục
 * Thuế, hoặc văn bản gốc) trước khi cập nhật.
 *
 * Nguồn đã đối chiếu (tra cứu 29/08/2026, chéo qua nhiều nguồn độc lập gồm
 * VnExpress, thuvienphapluat.vn, meinvoice.vn, luatvietnam.vn...):
 * - Biểu thuế TNCN 5 bậc + giảm trừ gia cảnh: Luật Thuế thu nhập cá nhân 2025
 *   (Luật số 109/2025/QH15, Quốc hội thông qua 10/12/2025), áp dụng cho kỳ
 *   tính thuế 2026.
 * - Tỷ lệ % thuế hộ kinh doanh theo nhóm ngành + ngưỡng miễn thuế 1 tỷ
 *   đồng/năm: Thông tư 69/2025/TT-BTC, Luật Thuế GTGT 2024, Nghị định
 *   68/2026/NĐ-CP.
 *
 * LƯU Ý PHẠM VI ÁP DỤNG: phương pháp tính thuế hộ kinh doanh theo % doanh thu
 * (khoán) bên dưới chỉ áp dụng khi doanh thu hộ kinh doanh ≤ 3 tỷ đồng/năm.
 * Trên mức này, hộ kinh doanh bắt buộc chuyển sang phương pháp tính trên lợi
 * nhuận (thuế suất khác, không thuộc phạm vi công cụ này).
 */

export type PitBracket = {
  /** Trần thu nhập tính thuế của bậc này, đơn vị đ/tháng. `null` = bậc cao nhất, không giới hạn trên. */
  upTo: number | null;
  /** Thuế suất của bậc, dạng thập phân (0.05 = 5%). */
  rate: number;
};

/** Biểu thuế TNCN luỹ tiến từng phần đối với thu nhập từ tiền lương/tiền công — 5 bậc, kỳ tính thuế 2026. */
export const PIT_BRACKETS_2026: PitBracket[] = [
  { upTo: 10_000_000, rate: 0.05 },
  { upTo: 30_000_000, rate: 0.1 },
  { upTo: 60_000_000, rate: 0.2 },
  { upTo: 100_000_000, rate: 0.3 },
  { upTo: null, rate: 0.35 },
];

/** Giảm trừ gia cảnh cho bản thân người nộp thuế — đ/tháng. */
export const PIT_PERSONAL_DEDUCTION = 15_500_000;

/** Giảm trừ gia cảnh cho mỗi người phụ thuộc — đ/tháng. */
export const PIT_DEPENDENT_DEDUCTION = 6_200_000;

/**
 * Tính thuế TNCN theo biểu luỹ tiến từng phần (mỗi phần thu nhập trong một
 * bậc chỉ chịu đúng thuế suất của bậc đó, không phải cả thu nhập chịu chung
 * 1 mức thuế suất cao nhất).
 *
 * @param taxableIncome Thu nhập tính thuế/tháng (đã trừ giảm trừ gia cảnh), đơn vị đồng.
 */
export function calculatePitProgressive(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let lowerBound = 0;
  for (const bracket of PIT_BRACKETS_2026) {
    const upperBound = bracket.upTo ?? Infinity;
    if (taxableIncome <= lowerBound) break;
    const amountInBracket = Math.min(taxableIncome, upperBound) - lowerBound;
    tax += amountInBracket * bracket.rate;
    lowerBound = upperBound;
  }
  return tax;
}

export type HouseholdIndustryKey = "thuong-mai" | "dich-vu" | "san-xuat";

export type HouseholdIndustryRate = {
  key: HouseholdIndustryKey;
  label: string;
  /** Thuế suất GTGT theo phương pháp khoán (% trên doanh thu). */
  vatRate: number;
  /** Thuế suất TNCN theo phương pháp khoán (% trên doanh thu). */
  pitRate: number;
};

/** Tỷ lệ % thuế GTGT + TNCN theo nhóm ngành cho hộ kinh doanh nộp thuế khoán (Thông tư 69/2025/TT-BTC). */
export const HOUSEHOLD_INDUSTRY_RATES: Record<HouseholdIndustryKey, HouseholdIndustryRate> = {
  "thuong-mai": {
    key: "thuong-mai",
    label: "Thương mại / Phân phối hàng hoá",
    vatRate: 0.01,
    pitRate: 0.005,
  },
  "dich-vu": {
    key: "dich-vu",
    label: "Dịch vụ",
    vatRate: 0.05,
    pitRate: 0.02,
  },
  "san-xuat": {
    key: "san-xuat",
    label: "Sản xuất / Vận tải / Xây dựng có bao vật tư",
    vatRate: 0.03,
    pitRate: 0.015,
  },
};

export const HOUSEHOLD_INDUSTRY_ORDER: HouseholdIndustryKey[] = ["thuong-mai", "dich-vu", "san-xuat"];

/** Ngưỡng miễn thuế GTGT + TNCN cho hộ kinh doanh — đ/năm. */
export const HOUSEHOLD_TAX_EXEMPT_REVENUE_YEARLY = 1_000_000_000;

/** Ngưỡng miễn thuế quy đổi ra đ/tháng, để so sánh trực tiếp với thu nhập người dùng nhập theo tháng. */
export const HOUSEHOLD_TAX_EXEMPT_REVENUE_MONTHLY = HOUSEHOLD_TAX_EXEMPT_REVENUE_YEARLY / 12;

/** Ngưỡng trên của phương pháp khoán (% doanh thu) — vượt mức này phải chuyển sang phương pháp tính trên lợi nhuận, ngoài phạm vi công cụ này. */
export const HOUSEHOLD_FLAT_METHOD_MAX_REVENUE_YEARLY = 3_000_000_000;
