export type VirtualOfficePlanKey =
  | "goi-299k"
  | "start"
  | "base"
  | "origin"
  | "origin-plus"
  | "rise";

export type VirtualOfficePlan = {
  key: VirtualOfficePlanKey;
  name: string;
  price: number;
  duration: string;
  features: string[];
  addOn?: { label: string; price: number; note: string };
};

export const VIRTUAL_OFFICE_PLANS: Record<VirtualOfficePlanKey, VirtualOfficePlan> = {
  "goi-299k": {
    key: "goi-299k",
    name: "Gói 299k",
    price: 299000,
    duration: "/ tháng",
    features: ["Địa chỉ đăng ký kinh doanh (ĐKKD)", "Lễ tân", "Wifi", "Tham gia Workshop"],
    addOn: {
      label: "Bảng hiệu công ty",
      price: 500000,
      note: "Phụ phí thêm nếu cần bảng hiệu, tính riêng 1 lần",
    },
  },
  start: {
    key: "start",
    name: "START",
    price: 350000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Bảng tên Mica tại toà nhà",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
    ],
  },
  base: {
    key: "base",
    name: "BASE",
    price: 500000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Bảng tên Mica tại toà nhà",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Tư vấn Pháp lý & Thuế",
      "Đánh giá sức khỏe doanh nghiệp (AI Biz Health)",
    ],
  },
  origin: {
    key: "origin",
    name: "ORIGIN",
    price: 595000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Bảng tên Mica tại toà nhà",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Tư vấn Pháp lý & Thuế",
      "Đánh giá sức khỏe doanh nghiệp (AI Biz Health)",
      "Miễn phí tư vấn tự động hoá AI",
      "Ưu tiên hỗ trợ 24/7",
    ],
  },
  "origin-plus": {
    key: "origin-plus",
    name: "ORIGIN+",
    price: 699000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Bảng tên Mica tại toà nhà",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Tư vấn Pháp lý & Thuế",
      "Đánh giá sức khỏe doanh nghiệp (AI Biz Health)",
      "Miễn phí tư vấn tự động hoá AI",
      "Ưu tiên hỗ trợ 24/7",
      "Phòng họp nhỏ 24h/năm",
    ],
  },
  rise: {
    key: "rise",
    name: "RISE",
    price: 1199000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Bảng tên Mica tại toà nhà",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Tư vấn Pháp lý & Thuế",
      "Đánh giá sức khỏe doanh nghiệp (AI Biz Health)",
      "Miễn phí tư vấn tự động hoá AI",
      "Ưu tiên hỗ trợ 24/7",
      "Phòng họp nhỏ 24h/năm",
      "Phòng họp lớn 4h/năm",
      "Chỗ ngồi linh hoạt (Flex Desk) 4h/tháng",
      "Giảm 50% phí phòng họp VIP",
    ],
  },
};

export const VIRTUAL_OFFICE_PLAN_ORDER: VirtualOfficePlanKey[] = [
  "goi-299k",
  "start",
  "base",
  "origin",
  "origin-plus",
  "rise",
];

/** Canonical feature rows for the 6-plan comparison matrix, in cumulative build-up order. */
export const VO_FEATURE_MATRIX: { label: string; values: Record<VirtualOfficePlanKey, boolean | "addon"> }[] = [
  { label: "Địa chỉ đăng ký kinh doanh (ĐKKD)", values: { "goi-299k": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Bảng tên Mica tại toà nhà", values: { "goi-299k": false, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Lễ tân", values: { "goi-299k": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Wifi", values: { "goi-299k": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Tham gia Workshop", values: { "goi-299k": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Bảng hiệu công ty", values: { "goi-299k": "addon", start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "In-photo 100 tờ/năm", values: { "goi-299k": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Không gian tiếp khách (Guest Lounge)", values: { "goi-299k": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Tư vấn Pháp lý & Thuế", values: { "goi-299k": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Đánh giá sức khỏe DN (AI Biz Health)", values: { "goi-299k": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Miễn phí tư vấn tự động hoá AI", values: { "goi-299k": false, start: false, base: false, origin: true, "origin-plus": true, rise: true } },
  { label: "Ưu tiên hỗ trợ 24/7", values: { "goi-299k": false, start: false, base: false, origin: true, "origin-plus": true, rise: true } },
  { label: "Phòng họp nhỏ 24h/năm", values: { "goi-299k": false, start: false, base: false, origin: false, "origin-plus": true, rise: true } },
  { label: "Phòng họp lớn 4h/năm", values: { "goi-299k": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
  { label: "Chỗ ngồi linh hoạt (Flex Desk) 4h/tháng", values: { "goi-299k": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
  { label: "Giảm 50% phí phòng họp VIP", values: { "goi-299k": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
];

/** Which Văn phòng ảo plans each of the 12 branches offers, per the official rollout table. */
export const LOCATION_VO_PLANS: Record<string, VirtualOfficePlanKey[]> = {
  "song-thao": ["start", "base"],
  "dien-bien-phu": ["start", "base"],
  "nguyen-oanh": ["origin", "origin-plus", "rise"],
  "yen-the": ["base", "origin", "origin-plus"],
  "cong-hoa": ["base", "origin", "origin-plus"],
  "tan-thang": ["base", "origin", "origin-plus"],
  "cuu-long": ["base"],
  "hoang-viet": ["goi-299k", "start", "base"],
  "bau-cat": ["goi-299k", "start", "base"],
  "lam-son": ["goi-299k", "start", "base"],
  "hoang-ke-viem": ["goi-299k", "start", "base"],
  cmt8: ["goi-299k", "start", "base"],
};

export function getPlansForLocation(slug: string): VirtualOfficePlan[] {
  const keys = LOCATION_VO_PLANS[slug] ?? [];
  return keys.map((k) => VIRTUAL_OFFICE_PLANS[k]);
}

export function getCheapestPlanForLocation(slug: string): VirtualOfficePlan | undefined {
  const plans = getPlansForLocation(slug);
  if (plans.length === 0) return undefined;
  return plans.reduce((cheapest, p) => (p.price < cheapest.price ? p : cheapest), plans[0]);
}

export function getLocationsForPlan(planKey: VirtualOfficePlanKey): string[] {
  return Object.keys(LOCATION_VO_PLANS).filter((slug) => LOCATION_VO_PLANS[slug].includes(planKey));
}

export const VO_PROMO_NOTES: string[] = [
  "Ký hợp đồng 1 năm: tặng thêm 1-2 tháng sử dụng",
  "Ký hợp đồng 2 năm: tặng thêm 4-6 tháng sử dụng",
  "Tặng kèm dịch vụ thành lập doanh nghiệp",
  "Giá thuê chưa bao gồm VAT 10%",
];

export const VO_PROMO_EFFECTIVE_DATE = "01/06/2026";
