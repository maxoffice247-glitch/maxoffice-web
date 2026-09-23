export type VirtualOfficePlanKey =
  | "lite"
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
  "lite": {
    key: "lite",
    name: "LITE",
    price: 299000,
    duration: "/ tháng",
    features: ["Địa chỉ đăng ký kinh doanh (ĐKKD)", "Lễ tân", "Wifi", "Tham gia Workshop"],
    addOn: {
      label: "Bảng hiệu công ty",
      price: 500000,
      note: "Thu duy nhất 1 lần khi làm bảng hiệu ban đầu, không thu lại khi gia hạn hợp đồng các kỳ sau",
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
  "lite",
  "start",
  "base",
  "origin",
  "origin-plus",
  "rise",
];

/** Canonical feature rows for the 6-plan comparison matrix, in cumulative build-up order. */
export const VO_FEATURE_MATRIX: { label: string; values: Record<VirtualOfficePlanKey, boolean | "addon"> }[] = [
  { label: "Địa chỉ đăng ký kinh doanh (ĐKKD)", values: { "lite": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Bảng tên Mica tại toà nhà", values: { "lite": false, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Lễ tân", values: { "lite": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Wifi", values: { "lite": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Tham gia Workshop", values: { "lite": true, start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Bảng hiệu công ty", values: { "lite": "addon", start: true, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "In-photo 100 tờ/năm", values: { "lite": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Không gian tiếp khách (Guest Lounge)", values: { "lite": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Tư vấn Pháp lý & Thuế", values: { "lite": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Đánh giá sức khỏe DN (AI Biz Health)", values: { "lite": false, start: false, base: true, origin: true, "origin-plus": true, rise: true } },
  { label: "Miễn phí tư vấn tự động hoá AI", values: { "lite": false, start: false, base: false, origin: true, "origin-plus": true, rise: true } },
  { label: "Ưu tiên hỗ trợ 24/7", values: { "lite": false, start: false, base: false, origin: true, "origin-plus": true, rise: true } },
  { label: "Phòng họp nhỏ 24h/năm", values: { "lite": false, start: false, base: false, origin: false, "origin-plus": true, rise: true } },
  { label: "Phòng họp lớn 4h/năm", values: { "lite": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
  { label: "Chỗ ngồi linh hoạt (Flex Desk) 4h/tháng", values: { "lite": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
  { label: "Giảm 50% phí phòng họp VIP", values: { "lite": false, start: false, base: false, origin: false, "origin-plus": false, rise: true } },
];

/** Which Văn phòng ảo plans each branch on the shared LITE–RISE system offers, per the official rollout table. */
export const LOCATION_VO_PLANS: Record<string, VirtualOfficePlanKey[]> = {
  "song-thao": ["lite", "start", "base"],
  "dien-bien-phu": ["start", "base"],
  "nguyen-oanh": ["origin", "origin-plus", "rise"],
  "yen-the": ["base", "origin", "origin-plus", "rise"],
  "cong-hoa": ["base", "origin", "origin-plus"],
  "tan-thang": ["base", "origin", "origin-plus"],
  "cuu-long": ["base"],
  "hoang-viet": ["lite", "start", "base"],
  "bau-cat": ["lite", "start", "base"],
  "lam-son": ["lite", "start", "base"],
  "hoang-ke-viem": ["lite", "start", "base"],
  cmt8: ["lite", "start", "base"],
  "tran-hung-dao": ["origin", "origin-plus", "rise"],
};

/**
 * Ghi đè giá riêng theo chi nhánh cho 1-2 gói cụ thể trong hệ LITE–RISE dùng
 * chung — dùng khi MỘT chi nhánh áp dụng mức giá khuyến mãi/riêng khác với
 * giá chung của cả hệ (vd. Nguyễn Oanh giảm giá gói ORIGIN), mà KHÔNG ảnh
 * hưởng đến các chi nhánh khác đang dùng chung gói đó ở mức giá gốc. Không
 * dùng cho trường hợp một chi nhánh có TOÀN BỘ bảng giá khác biệt — trường
 * hợp đó nên tạo hệ giá riêng như Phạm Văn Đồng/Bùi Văn Ba thay vì override.
 */
export const LOCATION_VO_PRICE_OVERRIDES: Record<string, Partial<Record<VirtualOfficePlanKey, number>>> = {
  // Khuyến mãi riêng chi nhánh — ORIGIN giảm từ 595.000đ còn 499.000đ/tháng,
  // áp dụng tại Nguyễn Oanh và 380 Trần Hưng Đạo. Yên Thế/Cộng Hoà/Tân Thắng
  // vẫn giữ 595.000đ.
  "nguyen-oanh": { origin: 499_000 },
  "tran-hung-dao": { origin: 499_000 },
};

/**
 * Ghi đè CHECKLIST TÍNH NĂNG riêng theo chi nhánh cho 1-2 gói cụ thể trong hệ
 * LITE–RISE dùng chung — dùng khi MỘT chi nhánh áp dụng đúng gói/giá của hệ
 * chung (vd. vẫn tên "ORIGIN", vẫn 499.000đ) nhưng danh sách tính năng thực
 * tế bàn giao KHÁC với checklist mặc định của gói đó (vd. toà nhà chưa có
 * phòng họp cho gói ORIGIN dù các chi nhánh ORIGIN khác có), mà KHÔNG ảnh
 * hưởng đến các chi nhánh khác đang dùng chung gói đó ở checklist gốc. Cùng
 * cơ chế và lý do tồn tại như LOCATION_VO_PRICE_OVERRIDES ở trên — thêm mới
 * 2026-09 khi 380 Trần Hưng Đạo cần checklist ORIGIN/ORIGIN+/RISE ngắn hơn
 * bản dùng chung (thiếu phòng họp/flex desk/ưu tiên 24/7 ở các bậc thấp).
 * Không dùng cho trường hợp một chi nhánh có TOÀN BỘ bảng giá khác biệt —
 * trường hợp đó nên tạo hệ giá riêng như Phạm Văn Đồng/Bùi Văn Ba thay vì
 * override.
 */
export const LOCATION_VO_FEATURE_OVERRIDES: Record<string, Partial<Record<VirtualOfficePlanKey, string[]>>> = {
  // Sông Thao (trụ sở chính): gói BASE tại đây có thêm phòng họp miễn phí
  // giới hạn 6 giờ/tháng — tiện ích chuẩn BASE ở các chi nhánh khác KHÔNG
  // có (chỉ ORIGIN-PLUS/RISE trở lên mới có phòng họp riêng, xem
  // FEATURE_COMPARISON_TABLE phía trên). Spread từ VIRTUAL_OFFICE_PLANS.base
  // để tự theo nếu checklist chuẩn đổi; các chi nhánh BASE khác không bị
  // ảnh hưởng. Vì tính năng thêm này đủ đáng kể để khách cân nhắc riêng
  // (khác trường hợp merge-cưỡng-chế đã bỏ trước đây), getGroupedPlans()
  // (planFinder.ts) KHÔNG cần xử lý gì thêm — checklist khác các chi nhánh
  // BASE khác nên tự động tách thành PlanGroup riêng ở "Xem theo gói".
  //
  // TRƯỚC ĐÂY (đến 2026-09): override này từng gán nhầm "Phòng họp" cho gói
  // LITE (299.000đ) tại Sông Thao — gói LITE ở đây KHÔNG có phòng họp miễn
  // phí, phòng họp miễn phí thuộc về gói BASE. Đã sửa lại đúng gói + xoá
  // luôn cơ chế SUPERSET_EXTRA_FEATURES ở planFinder.ts (từng dùng để ép
  // gộp nhóm LITE dù có thêm "Phòng họp") vì lý do gộp cưỡng chế đó không
  // còn áp dụng.
  "song-thao": {
    base: [...VIRTUAL_OFFICE_PLANS.base.features, "Phòng họp 6 giờ/tháng"],
  },
  "tran-hung-dao": {
    origin: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
    ],
    "origin-plus": [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Phòng họp nhỏ 24h/năm",
    ],
    rise: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Lễ tân",
      "Wifi",
      "Tham gia Workshop",
      "Bảng hiệu công ty",
      "In-photo 100 tờ/năm",
      "Không gian tiếp khách (Guest Lounge)",
      "Phòng họp nhỏ 24h/năm",
      "Phòng họp lớn 4h/năm",
      "Chỗ ngồi linh hoạt (Flex Desk) 4h/tháng",
      "Ưu tiên hỗ trợ 24/7",
      "Giảm 50% phí phòng họp VIP",
    ],
  },
};

export function getPlansForLocation(slug: string): VirtualOfficePlan[] {
  const keys = LOCATION_VO_PLANS[slug] ?? [];
  const priceOverrides = LOCATION_VO_PRICE_OVERRIDES[slug];
  const featureOverrides = LOCATION_VO_FEATURE_OVERRIDES[slug];
  return keys.map((k) => {
    const plan = VIRTUAL_OFFICE_PLANS[k];
    const overridePrice = priceOverrides?.[k];
    const overrideFeatures = featureOverrides?.[k];
    return {
      ...plan,
      ...(overridePrice !== undefined ? { price: overridePrice } : null),
      ...(overrideFeatures !== undefined ? { features: overrideFeatures } : null),
    };
  });
}

export function getCheapestPlanForLocation(slug: string): VirtualOfficePlan | undefined {
  const plans = getPlansForLocation(slug);
  if (plans.length === 0) return undefined;
  return plans.reduce((cheapest, p) => (p.price < cheapest.price ? p : cheapest), plans[0]);
}

/**
 * Giá văn phòng ảo thấp nhất đang khả dụng tại một chi nhánh, bất kể chi
 * nhánh đó dùng hệ thống giá nào (LITE–RISE chung, hay bảng giá riêng của
 * Phạm Văn Đồng/Bùi Văn Ba) — dùng cho các thẻ chi nhánh trên /dia-diem.
 */
export function getCheapestPriceForLocation(slug: string): number | undefined {
  if (slug === "pham-van-dong") {
    return PHAM_VAN_DONG_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (slug === "quan-7") {
    return QUAN_7_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (slug === "bui-thi-xuan") {
    return BUI_THI_XUAN_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (slug === "nguyen-the-truyen") {
    return NGUYEN_THE_TRUYEN_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (slug === "truong-chinh") {
    return TRUONG_CHINH_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (SILVER_GOLD_PREMIUM_Q1Q3_LOCATIONS.includes(slug)) {
    return SILVER_GOLD_PREMIUM_Q1Q3_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  if (SILVER_GOLD_PREMIUM_LOCATIONS.includes(slug)) {
    return SILVER_GOLD_PREMIUM_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
  }
  return getCheapestPlanForLocation(slug)?.price;
}

/** Định dạng giá dạng rút gọn "350K", "1.199K" — dùng Số nghìn theo chuẩn Việt Nam. */
export function formatVoPriceShort(price: number): string {
  return `${(price / 1000).toLocaleString("vi-VN")}K`;
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

/**
 * Tên gọi chính thức cho khuyến mãi "tặng dịch vụ thành lập doanh nghiệp khi
 * ký hợp đồng văn phòng ảo dài hạn" — dùng thống nhất trên toàn site để dễ
 * nhận diện và nhắc đến trong marketing/tư vấn. Điều kiện cụ thể (thời hạn
 * hợp đồng, gói áp dụng...) vẫn khác nhau theo từng gói/chi nhánh, không đổi.
 */
export const VO_LONG_TERM_COMBO_NAME = "Gói Vững Bước Khởi Nghiệp";
export const VO_LONG_TERM_COMBO_DESC =
  "Bắt đầu hành trình kinh doanh vững vàng ngay từ bước đầu tiên — Gói Vững Bước Khởi Nghiệp giúp bạn có cả địa chỉ kinh doanh hợp pháp lẫn giấy phép thành lập doanh nghiệp, tiết kiệm thời gian và chi phí khi khởi sự.";

/* ---------------------------------------------------------------------- */
/* Phạm Văn Đồng — bảng giá riêng, không thuộc hệ thống LITE–RISE chung.   */
/* Chỉ khả dụng tại chi nhánh "pham-van-dong".                             */
/* ---------------------------------------------------------------------- */

export type PhamVanDongPlan = {
  key: "m-start" | "m-base" | "m-origin";
  name: string;
  price: number;
  duration: string;
  nameplateSize: string;
  meetingRoom: string;
  flexSeat: string;
  features: string[];
  promoNote: string;
};

export const PHAM_VAN_DONG_VO_PLANS: PhamVanDongPlan[] = [
  {
    key: "m-start",
    name: "M-START",
    price: 370000,
    duration: "/ tháng",
    nameplateSize: "Bảng tên 28x8cm",
    meetingRoom: "Không có",
    flexSeat: "Không có",
    features: ["Địa chỉ đăng ký kinh doanh (ĐKKD)", "Lễ tân", "Internet + nước uống", "Khu vực tiếp khách sang trọng"],
    promoNote: "🚀 Gói Vững Bước Khởi Nghiệp — Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 24 tháng",
  },
  {
    key: "m-base",
    name: "M-BASE",
    price: 500000,
    duration: "/ tháng",
    nameplateSize: "Bảng tên 28x8cm",
    meetingRoom: "Free 6 giờ/tháng",
    flexSeat: "Free 3 ngày/tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Lễ tân",
      "Internet + nước uống",
      "Khu vực tiếp khách sang trọng",
      "In ấn / photocopy / scan",
    ],
    promoNote: "🚀 Gói Vững Bước Khởi Nghiệp — Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 24 tháng",
  },
  {
    key: "m-origin",
    name: "M-ORIGIN",
    price: 800000,
    duration: "/ tháng",
    nameplateSize: "Bảng tên 40x15cm",
    meetingRoom: "Free không giới hạn",
    flexSeat: "Free 7 ngày/tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Lễ tân",
      "Internet + nước uống",
      "Khu vực tiếp khách sang trọng",
      "In ấn / photocopy / scan",
    ],
    promoNote: "🚀 Gói Vững Bước Khởi Nghiệp — Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 12 tháng",
  },
];

/** Khuyến mãi riêng chi nhánh Phạm Văn Đồng — áp dụng cho cả 3 gói M-START/M-BASE/M-ORIGIN. */
export const PHAM_VAN_DONG_VO_PROMOS: string[] = [
  "Tặng 3 tháng sử dụng khi thanh toán hợp đồng 12 tháng",
  "Tặng 7 tháng sử dụng khi thanh toán hợp đồng 24 tháng",
];

/* ---------------------------------------------------------------------- */
/* Bùi Văn Ba, Quận 7 — bảng giá riêng, không thuộc hệ thống LITE–RISE hay */
/* M-START/M-BASE/M-ORIGIN. Chỉ khả dụng tại chi nhánh "quan-7".           */
/* ---------------------------------------------------------------------- */

export type QuanBaPlan = {
  key: "w-base" | "w-pro";
  name: string;
  price: number;
  duration: string;
  vatNote: string;
  nameplate: string;
  locationVerification: string;
  reception: string;
  /** Điểm khác biệt RIÊNG của gói này so với gói còn lại — rút gọn từ đúng
      số liệu đã có ở QUAN_7_ADDONS bên dưới (không thêm thông tin mới),
      nối thêm vào cuối checklist 4 dòng gốc ở MỌI nơi hiển thị (thẻ gói ở
      trang chi nhánh, VPA finder, trang chi tiết gói, ảnh báo giá PNG —
      xem getAllOfferedPlans() ở planFinder.ts và QuanBaServices.tsx) để
      khách thấy rõ lý do chọn gói giá cao hơn. W-BASE không có field này
      (giữ nguyên checklist 4 dòng như cũ). */
  extraHighlights?: string[];
};

export const QUAN_7_VO_PLANS: QuanBaPlan[] = [
  {
    key: "w-base",
    name: "W-BASE",
    price: 450000,
    duration: "/ tháng",
    vatNote: "Giá chưa bao gồm VAT 10%",
    nameplate: "Có (LCD tại tầng thuê)",
    locationVerification: "Có",
    reception: "Có (đón khách, nhận thư, chuyển tiếp email)",
  },
  {
    key: "w-pro",
    name: "W-PRO",
    price: 750000,
    duration: "/ tháng",
    vatNote: "Giá chưa bao gồm VAT 10%",
    nameplate: "Có (LCD tại tầng thuê)",
    locationVerification: "Có",
    reception: "Có (đón khách, nhận thư, chuyển tiếp email)",
    extraHighlights: ["Phòng họp nhỏ miễn phí 10 giờ/tháng", "Chỗ ngồi linh động 48 giờ/năm"],
  },
];

/* ---------------------------------------------------------------------- */
/* 36 Bùi Thị Xuân, Quận 1 (cũ) — bảng giá riêng, ĐÚNG 1 gói duy nhất, KHÔNG */
/* thuộc hệ thống LITE–RISE hay bất kỳ hệ giá đối tác nào khác. Checklist   */
/* đã đối chiếu với mọi gói 500.000đ hiện có (BASE hệ LITE-RISE, M-BASE Phạm */
/* Văn Đồng) — không trùng khớp hoàn toàn (thiếu Workshop/Bảng hiệu/In-photo */
/* so với BASE; thiếu bảng tên so với M-BASE) nên tạo gói mới thay vì tái sử */
/* dụng. Đặt tên "STANDARD" (không dùng lại tên "BASE" của hệ LITE-RISE) để */
/* tránh 2 PlanGroup khác nhau cùng hiển thị "Gói BASE — 500.000đ/tháng" ở   */
/* "Xem theo gói" (planFinder.ts groupSignature() chỉ gộp khi TÊN + giá +   */
/* tính năng khớp hệt nhau — tên trùng nhưng tính năng khác sẽ tạo 2 card   */
/* riêng cùng tiêu đề, gây nhầm lẫn cho khách). Chỉ khả dụng tại chi nhánh  */
/* "bui-thi-xuan". */
/* ---------------------------------------------------------------------- */

export type BuiThiXuanPlan = {
  key: "standard";
  name: string;
  price: number;
  duration: string;
  vatNote: string;
  features: string[];
};

export const BUI_THI_XUAN_VO_PLANS: BuiThiXuanPlan[] = [
  {
    key: "standard",
    name: "STANDARD",
    price: 500000,
    duration: "/ tháng",
    vatNote: "Giá chưa bao gồm VAT 10%",
    features: [
      "Địa chỉ đăng ký kinh doanh (ĐKKD)",
      "Wifi",
      "Khu vực tiếp khách",
      "Lễ tân nhận thư, bưu phẩm",
      "Bảng tên công ty",
    ],
  },
];

export type QuanBaAddonRow = {
  service: string;
  wBase: string;
  wPro: string;
};

export const QUAN_7_ADDONS: QuanBaAddonRow[] = [
  { service: "Phòng họp lớn (6-8 người)", wBase: "120.000đ/giờ", wPro: "24 giờ miễn phí/năm" },
  { service: "Phòng họp nhỏ (4-5 người)", wBase: "90.000đ/giờ", wPro: "10 giờ miễn phí/tháng" },
  { service: "Chỗ ngồi làm việc linh động", wBase: "—", wPro: "48 giờ/năm" },
  { service: "In ấn / photocopy", wBase: "1.000đ/bản", wPro: "1.000đ/bản" },
  { service: "Tổng đài thông tin 24/7", wBase: "100.000đ/tháng", wPro: "Miễn phí" },
  { service: "Máy fax thông minh", wBase: "100.000đ/tháng", wPro: "Miễn phí" },
  { service: "Domain (quốc tế)", wBase: "1 domain", wPro: "1 domain" },
  { service: "Hosting", wBase: "650.000đ/năm", wPro: "2GB" },
  { service: "Dịch vụ pháp lý trọn gói (GPKD, con dấu, hồ sơ thuế ban đầu)", wBase: "900.000đ", wPro: "900.000đ" },
];

/* ---------------------------------------------------------------------- */
/* 79 Nguyễn Thế Truyện, Tân Phú (cũ) — bảng giá đối tác riêng LEAN/       */
/* GROWING/SCALE-UP, không thuộc hệ thống LITE–RISE hay các gói riêng     */
/* khác. Chỉ khả dụng tại chi nhánh "nguyen-the-truyen". Đây là hệ giá    */
/* đối tác — KHÔNG hiển thị bất kỳ thông tin gì về tên đối tác gốc ở bất  */
/* cứ đâu trên site, chỉ hiện tên gói + tính năng như 1 chi nhánh MAX     */
/* bình thường (yêu cầu tường minh khi tạo hệ giá này — xem thêm ghi chú  */
/* tương tự ở Bùi Văn Ba/Quận 7 phía trên, cùng nguyên tắc).              */
/* ---------------------------------------------------------------------- */

export type NguyenTheTruyenPlanKey = "lean" | "growing" | "scale-up";

export type NguyenTheTruyenPlan = {
  key: NguyenTheTruyenPlanKey;
  name: string;
  price: number;
  duration: string;
  /** Mỗi gói tự liệt kê ĐẦY ĐỦ tính năng của mình (kể cả dòng "Toàn bộ
      tính năng <gói thấp hơn>" kế thừa) — khác QuanBaPlan (Bùi Văn Ba) vốn
      tách từng field riêng rồi planFinder.ts mới ráp thành features[]; ở
      đây feature list đã đủ phong phú (6-11 dòng/gói) nên lưu thẳng
      features[] để planFinder.ts dùng nguyên, không cần bước ráp thêm. */
  features: string[];
};

export const NGUYEN_THE_TRUYEN_VO_PLANS: NguyenTheTruyenPlan[] = [
  {
    key: "lean",
    name: "LEAN",
    price: 199000,
    duration: "/ tháng",
    features: [
      "Địa chỉ kinh doanh chuyên nghiệp",
      "Nhận thư/bưu phẩm",
      "Bảng tên Mica 13x23",
      "Tư vấn thành lập doanh nghiệp",
      "Tiếp khách chung/lễ tân",
      "Internet/Wifi/nước lọc/cafe",
      "Bộ hồ sơ Nhân sự - Lao động",
      "Bộ hồ sơ Kế toán - Thuế",
      "Kế toán định kỳ & ưu đãi",
      "Báo cáo/chữ ký số/hóa đơn",
      "Hỗ trợ vận hành & phát triển",
    ],
  },
  {
    key: "growing",
    name: "GROWING",
    price: 449000,
    duration: "/ tháng",
    features: [
      "Toàn bộ tính năng LEAN",
      "Mở tài khoản ngân hàng",
      "Phòng họp miễn phí 2 giờ/tháng",
      "Kế toán định kỳ: giảm 20%",
      "Chữ ký số: giảm 30%",
      "Báo cáo thị trường: giảm 25-30%",
    ],
  },
  {
    key: "scale-up",
    name: "SCALE-UP",
    price: 499000,
    duration: "/ tháng",
    features: [
      "Toàn bộ tính năng GROWING",
      "Tặng dấu mộc",
      "Bảng tên nâng cấp: Inox 13x23 (thay vì Mica)",
      "Tủ hồ sơ",
      "Phòng họp miễn phí 2 giờ/tháng",
      "Kế toán định kỳ: giảm 20%",
      "Chữ ký số: giảm 35%",
      "Báo cáo thị trường: giảm 30-35%",
      "Tư vấn hiệu quả kinh doanh (hàng quý)",
    ],
  },
];

/** Ưu đãi ký hợp đồng dài hạn riêng của hệ LEAN/GROWING/SCALE-UP — áp dụng
    chung cho cả 3 gói, hiển thị trong khối "Khuyến mãi & ưu đãi" của trang
    chi nhánh (KHÔNG lặp lại trong checklist từng gói — đúng cơ chế 1 nơi
    hiển thị duy nhất đã áp dụng cho mọi chi nhánh khác). */
export const NGUYEN_THE_TRUYEN_VO_PROMOS: string[] = [
  "Ký hợp đồng 12 tháng: tặng thêm 2 tháng + miễn phí thành lập doanh nghiệp + tặng bộ hồ sơ Lao động",
  "Ký hợp đồng 24 tháng: tặng thêm 6 tháng + miễn phí thành lập doanh nghiệp + tặng bộ hồ sơ Lao động",
  "Ký hợp đồng 36 tháng: tặng thêm 12 tháng + miễn phí thành lập doanh nghiệp + tặng bộ hồ sơ Kế toán/Thuế + tặng bộ hồ sơ Lao động + khai thuế ban đầu",
];

/* ---------------------------------------------------------------------- */
/* 254 Trường Chinh, Quận 12 (cũ) — bảng giá riêng CƠ BẢN/NÂNG CAO/CAO CẤP, */
/* không thuộc hệ thống LITE–RISE hay bất kỳ hệ giá riêng nào khác. Chỉ    */
/* khả dụng tại chi nhánh "truong-chinh" — chi nhánh đầu tiên (và duy      */
/* nhất tính đến nay) tại khu vực Quận 12 (cũ).                            */
/*                                                                          */
/* KHÁC với NguyenTheTruyenPlan (LEAN/GROWING/SCALE-UP ở trên) — nơi mỗi   */
/* gói cao hơn chỉ ghi 1 dòng tóm tắt "Toàn bộ tính năng <gói thấp hơn>"   */
/* rồi mới liệt kê phần thêm — hệ giá này liệt kê ĐẦY ĐỦ TỪNG MỤC riêng lẻ */
/* ở CẢ 3 gói (kể cả các mục đã có ở gói thấp hơn), theo đúng yêu cầu rõ   */
/* ràng khi tạo hệ giá này: mỗi gói tự đứng độc lập, đọc đủ không cần suy  */
/* ra từ gói khác — giống cách trình bày của mọi hệ giá LITE-RISE/SGP/Q1Q3 */
/* (liệt kê phẳng, không dòng tóm tắt kế thừa). */
/* ---------------------------------------------------------------------- */

export type TruongChinhPlanKey = "co-ban" | "nang-cao" | "cao-cap";

export type TruongChinhPlan = {
  key: TruongChinhPlanKey;
  name: string;
  price: number;
  duration: string;
  /** Liệt kê ĐẦY ĐỦ từng mục — kể cả mục đã có ở gói thấp hơn — không dùng
      câu tóm tắt kiểu "Bao gồm toàn bộ gói CƠ BẢN". Xem doc comment phía
      trên khối này để biết lý do khác NguyenTheTruyenPlan. */
  features: string[];
};

export const TRUONG_CHINH_VO_PLANS: TruongChinhPlan[] = [
  {
    key: "co-ban",
    name: "CƠ BẢN",
    price: 299000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh",
      "Tiếp nhận thư từ và bưu phẩm",
      "Sử dụng khu vực tiếp khách",
      "Tiếp tân hỗ trợ",
      "Cơ sở vật chất cơ bản",
      "Đặt bảng tên công ty",
      "Chỗ ngồi khách vãng lai",
      "Khu vực tiếp khách chung",
      "Sử dụng phòng họp",
    ],
  },
  {
    key: "nang-cao",
    name: "NÂNG CAO",
    price: 479000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh",
      "Tiếp nhận thư từ và bưu phẩm",
      "Sử dụng khu vực tiếp khách",
      "Tiếp tân hỗ trợ",
      "Cơ sở vật chất cơ bản",
      "Đặt bảng tên công ty",
      "Chỗ ngồi khách vãng lai",
      "Khu vực tiếp khách chung",
      "Sử dụng phòng họp",
      "Thiết bị phòng, máy in, scan, photo",
      "Sử dụng phòng khánh tiết",
      "Trưng bày tài liệu khu vực lễ tân",
    ],
  },
  {
    key: "cao-cap",
    name: "CAO CẤP",
    price: 779000,
    duration: "/ tháng",
    features: [
      "Địa chỉ đăng ký kinh doanh",
      "Tiếp nhận thư từ và bưu phẩm",
      "Sử dụng khu vực tiếp khách",
      "Tiếp tân hỗ trợ",
      "Cơ sở vật chất cơ bản",
      "Đặt bảng tên công ty",
      "Chỗ ngồi khách vãng lai",
      "Khu vực tiếp khách chung",
      "Sử dụng phòng họp",
      "Thiết bị phòng, máy in, scan, photo",
      "Sử dụng phòng khánh tiết",
      "Trưng bày tài liệu khu vực lễ tân",
      "Tư vấn miễn phí thành lập doanh nghiệp",
      "Hỗ trợ thủ tục thuế ban đầu",
      "Hỗ trợ thủ tục cấp giấy chứng nhận doanh nghiệp",
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Gói SILVER/GOLD/PREMIUM — bảng giá riêng dùng CHUNG cho mọi chi nhánh   */
/* có slug trong SILVER_GOLD_PREMIUM_Q1Q3_LOCATIONS (Quận 1 (cũ) + Quận 3 */
/* (cũ)), không thuộc hệ thống LITE-RISE hay các gói riêng khác của chi   */
/* nhánh khác. Trước đây có thêm 1 gói SAVE (379.000đ) rẻ hơn SILVER —    */
/* đã XÁC NHẬN gói này không tồn tại thực tế tại các chi nhánh này (chỉ   */
/* có ở hệ SILVER/GOLD/PREMIUM "các Quận còn lại" dưới dạng SILVER 379K,  */
/* KHÁC hệ này) nên đã bỏ hẳn (2026-09) — hệ này giờ bắt đầu từ SILVER     */
/* 479.000đ, còn 3 gói SILVER/GOLD/PREMIUM. Tên hằng số vẫn theo TÊN GÓI  */
/* (không phải "QUAN_3_CU" như ban đầu) vì hệ giá này ban đầu chỉ dùng    */
/* cho 2 chi nhánh Quận 3 (cũ) nhưng nay đã dùng chung cho cả chi nhánh   */
/* Quận 1 (cũ) — xem SILVER_GOLD_PREMIUM_Q1Q3_LOCATIONS bên dưới để biết  */
/* đầy đủ danh sách, giống cách đặt tên của hệ SILVER/GOLD/PREMIUM (3     */
/* gói) dùng chung cho Bình Thạnh/Phú Nhuận/Quận 4/Thủ Đức.               */
/* ---------------------------------------------------------------------- */

/**
 * Tính năng đi kèm dùng CHUNG cho MỌI gói của cả 2 hệ giá "3 gói SILVER/
 * GOLD/PREMIUM (Quận 1/3 cũ)" (bên dưới) và "3 gói SILVER/GOLD/PREMIUM
 * (các Quận còn lại)" (phía sau file) — trước đây khai báo thành 2 hằng
 * số riêng biệt, từng bị LỆCH NHAU: bản của hệ "các Quận còn lại" có
 * thêm dòng "Bảng tên vật lý (mica)" — trùng ý với field `nameplate`
 * (đã hiển thị riêng ngay phía trên trong UI, xem Quan3CuVOServices.tsx/
 * SilverGoldPremiumServices.tsx) nên hiện lặp lại 2 lần trên mỗi thẻ giá
 * SILVER/GOLD/PREMIUM của 8 chi nhánh dùng hệ "3 gói". Đã gộp về 1 nguồn
 * duy nhất để tránh lệch lại trong tương lai — sửa 1 chỗ, áp dụng cho cả
 * 2 hệ ngay lập tức.
 */
const TIER_FAMILY_COMMON_FEATURES = [
  "Địa chỉ đăng ký kinh doanh (ĐKKD) + đăng ký thuế",
  "Bảng tên điện tử",
  "Tiếp tân hành chính văn phòng",
  "Tiếp nhận, chuyển tiếp thư từ, bưu phẩm",
  "Tư vấn miễn phí thành lập doanh nghiệp & kế toán",
];

export type SilverGoldPremiumQ1Q3Plan = {
  key: "silver" | "gold" | "premium";
  name: string;
  price: number;
  duration: string;
  nameplate: string;
  meetingRoom: string;
  guestLounge: string;
  addressChangeSupport: boolean;
  legalDossier: boolean;
  features: string[];
};

/** 3 gói văn phòng ảo dùng chung cho các chi nhánh áp dụng bảng giá SILVER/GOLD/PREMIUM (Quận 1/3 cũ) — giá CHƯA bao gồm VAT 10%. Không có gói SAVE (xem chú thích khối trên). */
export const SILVER_GOLD_PREMIUM_Q1Q3_PLANS: SilverGoldPremiumQ1Q3Plan[] = [
  {
    key: "silver",
    name: "SILVER",
    price: 479000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 60 phút/tháng",
    guestLounge: "Miễn phí 30 phút/ngày",
    addressChangeSupport: false,
    legalDossier: false,
    features: TIER_FAMILY_COMMON_FEATURES,
  },
  {
    key: "gold",
    name: "GOLD",
    price: 639000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 90 phút/tháng",
    guestLounge: "Miễn phí 60 phút/ngày",
    addressChangeSupport: true,
    legalDossier: false,
    features: TIER_FAMILY_COMMON_FEATURES,
  },
  {
    key: "premium",
    name: "PREMIUM",
    price: 990000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    // "(≤ 7 người)" thêm vào để khớp ĐÚNG với hệ "3 gói SILVER/GOLD/
    // PREMIUM" (SILVER_GOLD_PREMIUM_VO_PLANS bên dưới) — trước đây thiếu
    // ghi chú này (lệch dữ liệu khi 2 hệ được tạo ở 2 thời điểm khác
    // nhau) khiến PREMIUM 990K của hệ này và hệ kia bị coi là 2 gói khác
    // nhau trên /tien-ich/tim-goi-phu-hop dù thực chất là 1 gói giống hệt
    // nhau — nay đã xác nhận giống nhau thật, gộp cho khớp.
    meetingRoom: "Miễn phí 120 phút/tháng (≤ 7 người)",
    guestLounge: "Miễn phí 60 phút/ngày",
    addressChangeSupport: true,
    legalDossier: true,
    features: TIER_FAMILY_COMMON_FEATURES,
  },
];

export const SILVER_GOLD_PREMIUM_Q1Q3_VAT_NOTE = "Giá trên chưa bao gồm thuế VAT 10%.";

export type SilverGoldPremiumQ1Q3Addon = {
  label: string;
  price: number;
  note?: string;
};

/** Dịch vụ bổ sung phát sinh sau khi ký hợp đồng, áp dụng chung cho các chi nhánh dùng bảng giá SILVER/GOLD/PREMIUM (Quận 1/3 cũ). */
export const SILVER_GOLD_PREMIUM_Q1Q3_ADDONS: SilverGoldPremiumQ1Q3Addon[] = [
  { label: "Thay đổi địa chỉ đăng ký kinh doanh", price: 1296000, note: "Đã bao gồm VAT" },
  { label: "Khắc dấu tròn doanh nghiệp / dấu chi nhánh / VPĐD", price: 480000 },
];

/**
 * Chi nhánh áp dụng bảng giá SILVER/GOLD/PREMIUM (Quận 1/3 cũ) chung ở
 * trên — có thể thuộc nhiều khu vực (area) khác nhau (hiện dùng cho cả
 * Quận 3 (cũ) và Quận 1 (cũ)). Thêm slug vào đây khi mở chi nhánh mới
 * dùng bảng giá này, KHÔNG tạo lại bộ gói mới.
 */
export const SILVER_GOLD_PREMIUM_Q1Q3_LOCATIONS: string[] = [
  "nguyen-thong",
  "cach-mang-thang-8",
  "mac-dinh-chi",
  "pasteur",
  "de-tham",
  "nguyen-van-thu",
];

/* ---------------------------------------------------------------------- */
/* Gói SILVER/GOLD/PREMIUM — bảng giá "các Quận còn lại" dùng CHUNG cho    */
/* mọi chi nhánh có slug trong SILVER_GOLD_PREMIUM_LOCATIONS, bất kể chi   */
/* nhánh đó thuộc khu vực (area) nào — hiện dùng cho cả Bình Thạnh (cũ)    */
/* và Thủ Đức (cũ). Không thuộc hệ thống LITE-RISE hay các gói riêng khác. */
/* ---------------------------------------------------------------------- */

export type SilverGoldPremiumPlan = {
  key: "sgp-silver" | "sgp-gold" | "sgp-premium";
  name: string;
  price: number;
  duration: string;
  nameplate: string;
  meetingRoom: string;
  guestLounge: string;
  addressChangeSupport: boolean;
  legalDossier: boolean;
  features: string[];
};

/** 3 gói văn phòng ảo dùng chung cho các chi nhánh áp dụng bảng giá "các Quận còn lại" — giá CHƯA bao gồm VAT 10%. */
export const SILVER_GOLD_PREMIUM_VO_PLANS: SilverGoldPremiumPlan[] = [
  {
    key: "sgp-silver",
    name: "SILVER",
    price: 379000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 60 phút/tháng (≤ 7 người)",
    guestLounge: "Miễn phí 30 phút/ngày",
    addressChangeSupport: false,
    legalDossier: false,
    // features KHÔNG lặp lại "Bảng tên vật lý (mica)" — thông tin đó đã
    // hiển thị riêng qua field `nameplate` ngay phía trên trong UI (dòng
    // "Bảng tên: ..."), thêm lại vào đây từng khiến 1 ý hiện lặp 2 lần
    // trên mỗi thẻ giá (đã sửa — xem TIER_FAMILY_COMMON_FEATURES).
    features: TIER_FAMILY_COMMON_FEATURES,
  },
  {
    key: "sgp-gold",
    name: "GOLD",
    price: 490000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 90 phút/tháng (≤ 7 người)",
    guestLounge: "Miễn phí 60 phút/ngày",
    addressChangeSupport: true,
    legalDossier: false,
    features: TIER_FAMILY_COMMON_FEATURES,
  },
  {
    key: "sgp-premium",
    name: "PREMIUM",
    price: 990000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 120 phút/tháng (≤ 7 người)",
    guestLounge: "Miễn phí 60 phút/ngày",
    addressChangeSupport: true,
    legalDossier: true,
    // Giống HỆT định nghĩa "premium" trong SILVER_GOLD_PREMIUM_Q1Q3_PLANS
    // ở trên (cùng giá 990.000đ, cùng mọi field) sau khi đã chuẩn hoá —
    // getGroupedPlans() (planFinder.ts) tự động gộp 2 nhóm chi nhánh thành
    // 1 PlanGroup duy nhất (13 chi nhánh — 4 hệ Q1Q3-tier + 9 hệ SGP-tier,
    // xem SILVER_GOLD_PREMIUM_Q1Q3_LOCATIONS/SILVER_GOLD_PREMIUM_LOCATIONS)
    // nhờ groupSignature() so khớp planName+price+features, KHÔNG cần sửa
    // gì thêm ở planFinder.ts hay UI khi số chi nhánh trong 1 trong 2 nhóm
    // thay đổi. Vẫn giữ 2 entry PREMIUM riêng (ở đây và ở mảng kia) vì mỗi
    // bên còn phục vụ bảng giá riêng của trang chi nhánh thuộc hệ đó
    // (Quan3CuVOServices.tsx / SilverGoldPremiumServices.tsx) — xoá hẳn 1
    // bên sẽ làm mất PREMIUM khỏi bảng giá của nhóm chi nhánh còn lại.
    features: TIER_FAMILY_COMMON_FEATURES,
  },
];

export const SILVER_GOLD_PREMIUM_VAT_NOTE = "Giá trên chưa bao gồm thuế VAT 10%.";

export type SilverGoldPremiumAddon = {
  label: string;
  price: number;
  note?: string;
};

/** Dịch vụ bổ sung phát sinh sau khi ký hợp đồng, áp dụng chung cho các chi nhánh dùng bảng giá SILVER/GOLD/PREMIUM. */
export const SILVER_GOLD_PREMIUM_ADDONS: SilverGoldPremiumAddon[] = [
  { label: "Thay đổi địa chỉ đăng ký kinh doanh", price: 1296000, note: "Đã bao gồm VAT" },
  { label: "Khắc dấu tròn doanh nghiệp / dấu chi nhánh / VPĐD", price: 480000 },
];

/**
 * Chi nhánh áp dụng bảng giá SILVER/GOLD/PREMIUM chung ở trên — có thể
 * thuộc nhiều khu vực (area) khác nhau. Thêm slug vào đây khi mở chi
 * nhánh mới dùng bảng giá này, KHÔNG tạo lại bộ gói mới.
 */
export const SILVER_GOLD_PREMIUM_LOCATIONS: string[] = [
  "ung-van-khiem",
  "tan-cang",
  "n1-dien-bien-phu",
  "quoc-huong",
  "phan-dinh-phung",
  "nguyen-truong-to",
  "le-quoc-hung",
  "ba-thang-hai",
  // Chi nhánh SGP đầu tiên tại khu vực Tân Bình (cũ) — 8 chi nhánh Tân Bình
  // còn lại dùng hệ LITE-RISE, KHÔNG cùng bảng giá này.
  "ut-tich",
];
