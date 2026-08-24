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
  "song-thao": ["start", "base"],
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
  if (slug === "vuon-lai") {
    return VUON_LAI_VO_PLAN.price;
  }
  if (slug === "nguyen-thong") {
    return NGUYEN_THONG_VO_PLANS.reduce((min, p) => Math.min(min, p.price), Infinity);
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
    promoNote: "Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 24 tháng",
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
    promoNote: "Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 24 tháng",
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
    promoNote: "Tặng dịch vụ thành lập doanh nghiệp khi ký hợp đồng 12 tháng",
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
/* 314/6 Điện Biên Phủ, Quận 10 (cũ) — gói giá riêng, không thuộc hệ thống  */
/* LITE-RISE hay các gói M / W riêng khác. Chỉ khả dụng tại "vuon-lai".    */
/* ---------------------------------------------------------------------- */

export type VuonLaiPlan = {
  key: "v-start";
  name: string;
  price: number;
  duration: string;
  nameplateSize: string;
  meetingRoom: string;
  flexSeat: string;
  features: string[];
};

/** Gói văn phòng ảo duy nhất tại chi nhánh 314/6 Điện Biên Phủ — cấu trúc tương tự M-START. */
export const VUON_LAI_VO_PLAN: VuonLaiPlan = {
  key: "v-start",
  name: "V-START",
  price: 380000,
  duration: "/ tháng",
  nameplateSize: "Bảng tên 30x10cm",
  meetingRoom: "Không có",
  flexSeat: "Không có",
  features: ["Địa chỉ đăng ký kinh doanh (ĐKKD)", "Lễ tân", "Internet + nước uống", "Khu vực tiếp khách"],
};

export type VuonLaiPromo = {
  label: string;
  note: string;
};

/**
 * Khuyến mãi riêng chi nhánh 314/6 Điện Biên Phủ — 2 lựa chọn TÁCH BIỆT cho
 * hợp đồng 24 tháng tuỳ tình trạng pháp lý của khách (đã có GPKD hay chưa),
 * khách chỉ chọn 1 trong 2, không cộng dồn.
 */
export const VUON_LAI_VO_PROMOS: VuonLaiPromo[] = [
  {
    label: "Hợp đồng 24 tháng — khách CHƯA có GPKD",
    note: "Tặng 3 tháng sử dụng + tặng miễn phí dịch vụ thành lập doanh nghiệp (GPKD).",
  },
  {
    label: "Hợp đồng 24 tháng — khách ĐÃ CÓ SẴN GPKD",
    note: "Tặng 6 tháng sử dụng (thay cho lựa chọn tặng 3 tháng + GPKD ở trên).",
  },
  {
    label: "Hợp đồng 12 tháng",
    note: "Tặng 2 tháng sử dụng.",
  },
];

/* ---------------------------------------------------------------------- */
/* 60 Nguyễn Thông, Quận 3 (cũ) — gói giá riêng, không thuộc hệ thống      */
/* LITE-RISE hay các gói riêng khác. Chỉ khả dụng tại "nguyen-thong".      */
/* ---------------------------------------------------------------------- */

export type NguyenThongPlan = {
  key: "save" | "silver" | "gold" | "premium";
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

const NGUYEN_THONG_COMMON_FEATURES = [
  "Địa chỉ đăng ký kinh doanh (ĐKKD) + đăng ký thuế",
  "Bảng tên điện tử",
  "Tiếp tân hành chính văn phòng",
  "Tiếp nhận, chuyển tiếp thư từ, bưu phẩm",
  "Tư vấn miễn phí thành lập doanh nghiệp & kế toán",
];

/** 4 gói văn phòng ảo riêng tại chi nhánh 60 Nguyễn Thông — giá CHƯA bao gồm VAT 10%. */
export const NGUYEN_THONG_VO_PLANS: NguyenThongPlan[] = [
  {
    key: "save",
    name: "SAVE",
    price: 379000,
    duration: "/ tháng",
    nameplate: "Không có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 60 phút/tháng",
    guestLounge: "Miễn phí 30 phút/ngày",
    addressChangeSupport: false,
    legalDossier: false,
    features: NGUYEN_THONG_COMMON_FEATURES,
  },
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
    features: NGUYEN_THONG_COMMON_FEATURES,
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
    features: NGUYEN_THONG_COMMON_FEATURES,
  },
  {
    key: "premium",
    name: "PREMIUM",
    price: 990000,
    duration: "/ tháng",
    nameplate: "Có bảng tên vật lý (mica)",
    meetingRoom: "Miễn phí 120 phút/tháng",
    guestLounge: "Miễn phí 60 phút/ngày",
    addressChangeSupport: true,
    legalDossier: true,
    features: NGUYEN_THONG_COMMON_FEATURES,
  },
];

export const NGUYEN_THONG_VAT_NOTE = "Giá trên chưa bao gồm thuế VAT 10%.";

export type NguyenThongAddon = {
  label: string;
  price: number;
  note?: string;
};

/** Dịch vụ bổ sung phát sinh sau khi ký hợp đồng tại chi nhánh 60 Nguyễn Thông. */
export const NGUYEN_THONG_ADDONS: NguyenThongAddon[] = [
  { label: "Thay đổi địa chỉ đăng ký kinh doanh", price: 1296000, note: "Đã bao gồm VAT" },
  { label: "Khắc dấu tròn doanh nghiệp / dấu chi nhánh / VPĐD", price: 480000 },
];
