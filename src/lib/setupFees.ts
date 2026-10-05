// Business-registration pricing — package-based, applies uniformly to every
// entity type (Hộ kinh doanh, Công ty TNHH, Công ty Cổ phần). Replaces the
// old per-entity-type fee schedule.

export type SetupPackageKey = "goi-1" | "goi-2";

export type SetupPackage = {
  key: SetupPackageKey;
  name: string;
  includes: string[];
  priceStandalone: number;
  priceWithVirtualOffice?: number;
  duration: string;
};

export const SETUP_PACKAGES: Record<SetupPackageKey, SetupPackage> = {
  "goi-1": {
    key: "goi-1",
    name: "Gói 1 — Cơ bản",
    includes: [
      "Giấy chứng nhận đăng ký doanh nghiệp",
      "Con dấu công ty",
      "Đăng bố cáo",
      "Mở tài khoản ngân hàng",
    ],
    priceStandalone: 1500000,
    priceWithVirtualOffice: 1299000,
    duration: "5-7 ngày",
  },
  "goi-2": {
    key: "goi-2",
    name: "Gói 2 — Đầy đủ",
    includes: [
      "Tất cả hạng mục trong Gói 1",
      "Hồ sơ khai thuế ban đầu",
      "Chữ ký số 1 năm",
      "Hoá đơn điện tử 100 số",
      "Thông báo phát hành hoá đơn",
    ],
    priceStandalone: 2800000,
    duration: "5-7 ngày",
  },
};

export type AmendmentService = {
  slug: string;
  name: string;
  price: number;
  duration: string;
};

// "Dịch vụ pháp lý sửa đổi" — post-registration amendments (đổi tên, địa chỉ,
// đại diện pháp luật, vốn điều lệ, ngành nghề...).
export const AMENDMENT_SERVICES: AmendmentService[] = [
  { slug: "doi-ten-cong-ty", name: "Thay đổi tên công ty", price: 700000, duration: "5-7 ngày" },
  { slug: "doi-dia-chi-cung-co-so", name: "Thay đổi địa chỉ cùng cơ sở", price: 700000, duration: "5-7 ngày" },
  { slug: "doi-dia-chi-khac-co-so", name: "Thay đổi địa chỉ khác cơ sở", price: 850000, duration: "5-7 ngày" },
  { slug: "doi-dai-dien-phap-luat", name: "Thay đổi đại diện pháp luật", price: 700000, duration: "5-7 ngày" },
  {
    slug: "doi-dai-dien-va-chu-so-huu",
    name: "Thay đổi đại diện pháp luật + chủ sở hữu",
    price: 1000000,
    duration: "5-7 ngày",
  },
  { slug: "tang-von-1-thanh-vien", name: "Tăng vốn điều lệ công ty 1 thành viên", price: 700000, duration: "5-7 ngày" },
  { slug: "tang-von-2-thanh-vien", name: "Tăng vốn điều lệ công ty 2 thành viên + Cổ phần", price: 1000000, duration: "5-7 ngày" },
  { slug: "bo-sung-nganh-nghe", name: "Bổ sung ngành nghề (1-15 ngành)", price: 700000, duration: "5-7 ngày" },
  { slug: "doi-so-dien-thoai", name: "Bổ sung/thay đổi số điện thoại", price: 500000, duration: "3-5 ngày" },
  { slug: "cap-nhat-cccd", name: "Cập nhật CCCD", price: 500000, duration: "3-5 ngày" },
  { slug: "them-ten-viet-tat", name: "Thêm tên viết tắt/tên nước ngoài", price: 700000, duration: "5-7 ngày" },
  { slug: "chuyen-doi-loai-hinh", name: "Chuyển đổi loại hình doanh nghiệp", price: 1500000, duration: "5-7 ngày" },
  {
    slug: "cap-nhat-dia-gioi-hanh-chinh",
    name: "Cập nhật địa giới hành chính - xác định chủ sở hữu hưởng lợi",
    price: 800000,
    duration: "5-7 ngày",
  },
];

/**
 * VAT cho nhóm "Dịch vụ pháp lý sửa đổi" khi xuất ảnh Báo giá tổng hợp. TẠM dùng 8% giống Thành lập doanh nghiệp
 * (CHƯA có xác nhận cuối cùng của chủ site) — đổi MỘT chỗ này là cả công cụ báo giá đổi theo.
 */
export const AMENDMENT_VAT_PERCENT = 8;

/** Combo: giá gốc TRÊN ngưỡng này thì dịch vụ "còn lại" tính AMENDMENT_COMBO_HIGH_PRICE; từ ngưỡng TRỞ XUỐNG (kể cả
 * đúng bằng ngưỡng) thì tính AMENDMENT_COMBO_LOW_PRICE. */
export const AMENDMENT_COMBO_THRESHOLD = 500000;
export const AMENDMENT_COMBO_HIGH_PRICE = 500000;
export const AMENDMENT_COMBO_LOW_PRICE = 300000;
export const AMENDMENT_MAX_SELECTION = AMENDMENT_SERVICES.length;

/** "500000" -> "500.000đ" (không dùng toLocaleString để kết quả không phụ thuộc ICU của môi trường chạy). */
export function formatAmendmentVnd(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

// Câu quy tắc hiển thị trên web (bảng giá + công cụ tính chi phí) — dựng TỪ các hằng số trên để sửa số ở 1 chỗ là đúng
// mọi nơi; nội dung giữ nguyên từng chữ so với bản viết cứng trước đây (có test đối chiếu).
export const COMBO_DISCOUNT_RULE = `Khi đặt từ 2 dịch vụ sửa đổi trở lên cùng lúc: dịch vụ có giá trị lớn nhất tính giá đầy đủ; các dịch vụ còn lại — giá gốc trên ${formatAmendmentVnd(AMENDMENT_COMBO_THRESHOLD)} giảm còn ${formatAmendmentVnd(AMENDMENT_COMBO_HIGH_PRICE)}, giá gốc từ ${formatAmendmentVnd(AMENDMENT_COMBO_THRESHOLD)} trở xuống giảm còn ${formatAmendmentVnd(AMENDMENT_COMBO_LOW_PRICE)}.`;

export type AmendmentComboItem = AmendmentService & { finalPrice: number; discounted: boolean };

/**
 * HÀM THUẦN tính combo — nguồn DUY NHẤT cho cả công cụ "Tính chi phí thành lập" lẫn "Báo giá tổng hợp" (server).
 * Quy tắc: từ 2 dịch vụ trở lên thì dịch vụ có giá gốc lớn nhất tính đủ; mỗi dịch vụ còn lại tính
 * AMENDMENT_COMBO_HIGH_PRICE (giá gốc > ngưỡng) hoặc AMENDMENT_COMBO_LOW_PRICE (giá gốc <= ngưỡng). Chọn 1 dịch vụ thì
 * tính giá gốc. Nhiều dịch vụ cùng giá lớn nhất: chỉ MỘT dịch vụ tính đủ — dịch vụ đứng trước trong bảng (sắp xếp ổn
 * định). Slug lạ bị bỏ qua và slug trùng chỉ tính một lần (muốn từ chối đầu vào sai thì dùng
 * validateAmendmentSelection() trước). Kết quả xếp theo giá gốc giảm dần.
 */
export function calculateAmendmentCombo(
  selectedSlugs: string[]
): { items: AmendmentComboItem[]; total: number } {
  const selected = AMENDMENT_SERVICES.filter((s) => selectedSlugs.includes(s.slug));
  if (selected.length === 0) return { items: [], total: 0 };

  const sorted = [...selected].sort((a, b) => b.price - a.price);
  const items: AmendmentComboItem[] = sorted.map((s, i) => {
    const discounted = selected.length >= 2 && i > 0;
    const finalPrice = !discounted
      ? s.price
      : s.price > AMENDMENT_COMBO_THRESHOLD
        ? AMENDMENT_COMBO_HIGH_PRICE
        : AMENDMENT_COMBO_LOW_PRICE;
    return { ...s, finalPrice, discounted };
  });
  const total = items.reduce((sum, it) => sum + it.finalPrice, 0);
  return { items, total };
}

/** Kiểm tra danh sách slug do client gửi lên (server dùng trước khi tính giá): phải là mảng 1..N chuỗi, mỗi slug
 * tồn tại trong AMENDMENT_SERVICES, không trùng. Trả danh sách đã chuẩn hoá hoặc thông báo lỗi tiếng Việt. */
export function validateAmendmentSelection(
  raw: unknown
): { ok: true; slugs: string[] } | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "Cần chọn ít nhất 1 dịch vụ pháp lý sửa đổi." };
  }
  if (raw.length > AMENDMENT_MAX_SELECTION) {
    return { ok: false, error: `Chỉ có ${AMENDMENT_MAX_SELECTION} dịch vụ pháp lý sửa đổi — danh sách gửi lên có quá nhiều mục.` };
  }
  const known = new Set(AMENDMENT_SERVICES.map((s) => s.slug));
  const seen = new Set<string>();
  for (const v of raw) {
    if (typeof v !== "string" || !known.has(v)) {
      return { ok: false, error: `Dịch vụ pháp lý sửa đổi không tồn tại: "${typeof v === "string" ? v.slice(0, 60) : String(v)}".` };
    }
    if (seen.has(v)) return { ok: false, error: `Dịch vụ pháp lý sửa đổi bị chọn trùng: "${v}".` };
    seen.add(v);
  }
  return { ok: true, slugs: Array.from(seen) };
}
