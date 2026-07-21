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
  { slug: "tang-von-2-thanh-vien", name: "Tăng vốn điều lệ công ty 2 thành viên", price: 1000000, duration: "5-7 ngày" },
  {
    slug: "tang-von-2-thanh-vien-co-phan",
    name: "Tăng vốn điều lệ công ty 2 thành viên + Cổ phần",
    price: 1000000,
    duration: "5-7 ngày",
  },
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

export const COMBO_DISCOUNT_RULE =
  "Khi đặt từ 2 dịch vụ sửa đổi trở lên cùng lúc: dịch vụ có giá trị lớn nhất tính giá đầy đủ; các dịch vụ còn lại — giá gốc trên 500.000đ giảm còn 500.000đ, giá gốc từ 500.000đ trở xuống giảm còn 300.000đ.";

export type AmendmentComboItem = AmendmentService & { finalPrice: number; discounted: boolean };

export function calculateAmendmentCombo(
  selectedSlugs: string[]
): { items: AmendmentComboItem[]; total: number } {
  const selected = AMENDMENT_SERVICES.filter((s) => selectedSlugs.includes(s.slug));
  if (selected.length === 0) return { items: [], total: 0 };

  const sorted = [...selected].sort((a, b) => b.price - a.price);
  const items: AmendmentComboItem[] = sorted.map((s, i) => {
    const discounted = selected.length >= 2 && i > 0;
    const finalPrice = !discounted ? s.price : s.price > 500000 ? 500000 : 300000;
    return { ...s, finalPrice, discounted };
  });
  const total = items.reduce((sum, it) => sum + it.finalPrice, 0);
  return { items, total };
}
