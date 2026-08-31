/**
 * Gộp toàn bộ 5 hệ thống giá văn phòng ảo (LITE–RISE dùng chung 12 chi
 * nhánh; M-START/M-BASE/M-ORIGIN riêng Phạm Văn Đồng; W-BASE/W-PRO riêng
 * Bùi Văn Ba; SAVE/SILVER/GOLD/PREMIUM riêng Quận 3 (cũ); SILVER/GOLD/
 * PREMIUM dùng chung Bình Thạnh/Phú Nhuận/Quận 4/Thủ Đức) thành MỘT danh
 * sách phẳng — dùng cho công cụ /tien-ich/tim-goi-phu-hop.
 *
 * Nguồn dữ liệu: LOCATIONS_LIST (đã tự lọc `isActive !== false`) +
 * virtualOfficePlans.ts. Vì hàm này lặp qua LOCATIONS_LIST (không phải
 * danh sách chi nhánh hardcode), chi nhánh đang tạm ẩn (vd. "vuon-lai")
 * tự động bị loại — và khi được bật lại (`isActive: true`), nhánh xử lý
 * "vuon-lai" bên dưới (đã viết sẵn, giữ tương thích với
 * getCheapestPriceForLocation) sẽ tự động nhận diện lại mà KHÔNG cần sửa
 * code.
 */
import { LOCATIONS_LIST } from "./locationsData";
import {
  getPlansForLocation,
  PHAM_VAN_DONG_VO_PLANS,
  QUAN_7_VO_PLANS,
  VUON_LAI_VO_PLAN,
  QUAN_3_CU_VO_PLANS,
  SILVER_GOLD_PREMIUM_VO_PLANS,
  SILVER_GOLD_PREMIUM_LOCATIONS,
  type PhamVanDongPlan,
  type VuonLaiPlan,
  type Quan3CuPlan,
  type SilverGoldPremiumPlan,
} from "./virtualOfficePlans";

export type OfferedPlan = {
  locationSlug: string;
  locationName: string;
  area: { slug: string; name: string };
  /** Key riêng của gói trong hệ giá của nó (vd. "base", "m-start", "sgp-silver") — kết hợp với locationSlug là duy nhất toàn hệ thống. */
  planKey: string;
  planName: string;
  price: number;
  duration: string;
  /** Danh sách tính năng đầy đủ, đã gộp cả các trường cấu trúc riêng (bảng tên, phòng họp...) của từng hệ giá thành 1 danh sách thống nhất. */
  features: string[];
  /** Ghi chú phụ phí tuỳ chọn (vd. bảng hiệu công ty của gói LITE) — không phải tính năng đi kèm sẵn. */
  addonNote?: string;
};

function withPhamVanDongStyleFeatures(p: {
  features: string[];
  nameplateSize: string;
  meetingRoom: string;
  flexSeat: string;
}): string[] {
  return [
    ...p.features,
    `Bảng tên: ${p.nameplateSize}`,
    `Phòng họp: ${p.meetingRoom}`,
    `Chỗ ngồi làm việc: ${p.flexSeat}`,
  ];
}

function withQuan3StyleFeatures(p: {
  features: string[];
  nameplate: string;
  meetingRoom: string;
  guestLounge: string;
  addressChangeSupport: boolean;
  legalDossier: boolean;
}): string[] {
  const list = [
    ...p.features,
    `Bảng tên: ${p.nameplate}`,
    `Phòng họp: ${p.meetingRoom}`,
    `Guest Lounge: ${p.guestLounge}`,
  ];
  if (p.addressChangeSupport) list.push("Hỗ trợ đổi địa chỉ đăng ký kinh doanh");
  if (p.legalDossier) list.push("Hồ sơ pháp lý toà nhà đầy đủ");
  return list;
}

/** Toàn bộ gói văn phòng ảo đang khả dụng công khai, tại mọi chi nhánh đang active. */
export function getAllOfferedPlans(): OfferedPlan[] {
  const result: OfferedPlan[] = [];

  for (const loc of LOCATIONS_LIST) {
    const { slug, name, area } = loc;

    if (slug === "pham-van-dong") {
      for (const p of PHAM_VAN_DONG_VO_PLANS as PhamVanDongPlan[]) {
        result.push({
          locationSlug: slug,
          locationName: name,
          area,
          planKey: p.key,
          planName: p.name,
          price: p.price,
          duration: p.duration,
          features: withPhamVanDongStyleFeatures(p),
        });
      }
    } else if (slug === "quan-7") {
      for (const p of QUAN_7_VO_PLANS) {
        result.push({
          locationSlug: slug,
          locationName: name,
          area,
          planKey: p.key,
          planName: p.name,
          price: p.price,
          duration: p.duration,
          features: [
            "Địa chỉ đăng ký kinh doanh (ĐKKD)",
            `Bảng tên: ${p.nameplate}`,
            `Xác minh địa chỉ: ${p.locationVerification}`,
            `Lễ tân: ${p.reception}`,
          ],
        });
      }
    } else if (slug === "vuon-lai") {
      const p = VUON_LAI_VO_PLAN as VuonLaiPlan;
      result.push({
        locationSlug: slug,
        locationName: name,
        area,
        planKey: p.key,
        planName: p.name,
        price: p.price,
        duration: p.duration,
        features: withPhamVanDongStyleFeatures(p),
      });
    } else if (slug === "nguyen-thong" || slug === "cach-mang-thang-8") {
      for (const p of QUAN_3_CU_VO_PLANS as Quan3CuPlan[]) {
        result.push({
          locationSlug: slug,
          locationName: name,
          area,
          planKey: p.key,
          planName: p.name,
          price: p.price,
          duration: p.duration,
          features: withQuan3StyleFeatures(p),
        });
      }
    } else if (SILVER_GOLD_PREMIUM_LOCATIONS.includes(slug)) {
      for (const p of SILVER_GOLD_PREMIUM_VO_PLANS as SilverGoldPremiumPlan[]) {
        result.push({
          locationSlug: slug,
          locationName: name,
          area,
          planKey: p.key,
          planName: p.name,
          price: p.price,
          duration: p.duration,
          features: withQuan3StyleFeatures(p),
        });
      }
    } else {
      // getPlansForLocation() (không phải VIRTUAL_OFFICE_PLANS trực tiếp) —
      // để tự động áp dụng LOCATION_VO_PRICE_OVERRIDES khi 1 chi nhánh có
      // giá riêng cho 1 gói cụ thể (vd. Nguyễn Oanh/ORIGIN), không cần sửa
      // thêm gì ở đây khi override thay đổi.
      for (const p of getPlansForLocation(slug)) {
        result.push({
          locationSlug: slug,
          locationName: name,
          area,
          planKey: p.key,
          planName: p.name,
          price: p.price,
          duration: p.duration,
          features: p.features,
          addonNote: p.addOn
            ? `${p.addOn.label}: +${p.addOn.price.toLocaleString("vi-VN")}đ (${p.addOn.note})`
            : undefined,
        });
      }
    }
  }

  return result;
}

export function getOfferedPlan(locationSlug: string, planKey: string): OfferedPlan | undefined {
  return getAllOfferedPlans().find((p) => p.locationSlug === locationSlug && p.planKey === planKey);
}

export type BudgetBandKey = "under-400k" | "400k-600k" | "600k-900k" | "over-900k";

export const BUDGET_BANDS: { key: BudgetBandKey; label: string; min: number; max: number }[] = [
  { key: "under-400k", label: "Dưới 400K", min: 0, max: 400_000 },
  { key: "400k-600k", label: "400K - 600K", min: 400_000, max: 600_000 },
  { key: "600k-900k", label: "600K - 900K", min: 600_000, max: 900_000 },
  { key: "over-900k", label: "Trên 900K", min: 900_000, max: Infinity },
];

export function isPriceInBand(price: number, bandKey: BudgetBandKey): boolean {
  const band = BUDGET_BANDS.find((b) => b.key === bandKey);
  if (!band) return false;
  return price >= band.min && price < band.max;
}

/** Khoảng cách (đồng) từ 1 mức giá đến khoảng ngân sách — 0 nếu đã nằm trong khoảng. */
export function distanceToBand(price: number, bandKey: BudgetBandKey): number {
  const band = BUDGET_BANDS.find((b) => b.key === bandKey);
  if (!band) return Infinity;
  if (price < band.min) return band.min - price;
  if (band.max !== Infinity && price >= band.max) return price - band.max + 1;
  return 0;
}

/** Sắp xếp các gói theo độ gần với khoảng ngân sách (gần nhất trước), rồi theo giá tăng dần khi bằng nhau. */
export function findNearestPlans(plans: OfferedPlan[], bandKey: BudgetBandKey, limit = 3): OfferedPlan[] {
  return [...plans]
    .sort((a, b) => {
      const da = distanceToBand(a.price, bandKey);
      const db = distanceToBand(b.price, bandKey);
      if (da !== db) return da - db;
      return a.price - b.price;
    })
    .slice(0, limit);
}

export function formatVoPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

/* ---------------------------------------------------------------------- */
/* Chế độ "Xem theo gói" — gộp các gói giống hệt nhau (cùng tên + cùng giá  */
/* + cùng tính năng) từ nhiều chi nhánh khác nhau thành 1 nhóm duy nhất.   */
/* ---------------------------------------------------------------------- */

export type PlanGroupLocation = {
  slug: string;
  name: string;
  shortAddress: string;
  area: { slug: string; name: string };
};

export type PlanGroup = {
  /** Slug ổn định dùng cho route /tien-ich/tim-goi-phu-hop/goi/[groupKey] — xem generatePlanGroupKeys() để biết cách tránh trùng. */
  groupKey: string;
  planName: string;
  price: number;
  duration: string;
  features: string[];
  addonNote?: string;
  locations: PlanGroupLocation[];
};

function slugifyVN(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Khoá gộp nhóm: CÙNG tên gói + CÙNG giá + CÙNG danh sách tính năng (nối
 * chuỗi để so sánh chính xác từng dòng). Chỉ trùng tên/giá KHÔNG đủ để gộp —
 * vd. "PREMIUM" 990.000đ tồn tại ở CẢ hệ Quận 3 (cũ) lẫn hệ SILVER/GOLD/
 * PREMIUM dùng chung, nhưng 2 hệ có nội dung tính năng khác nhau (phòng họp
 * ghi thêm "≤ 7 người", danh sách tính năng gốc khác nhau) nên đây LÀ 2
 * nhóm riêng biệt, không gộp nhầm dù tên và giá giống hệt.
 */
function groupSignature(p: OfferedPlan): string {
  return `${p.planName}__${p.price}__${p.features.join("|")}`;
}

/** Toàn bộ gói, gộp theo nhóm giống hệt nhau, sắp xếp theo giá tăng dần. */
export function getGroupedPlans(): PlanGroup[] {
  const locationBySlug = new Map(LOCATIONS_LIST.map((l) => [l.slug, l]));
  const bySignature = new Map<string, { plan: OfferedPlan; locations: PlanGroupLocation[] }>();

  for (const plan of getAllOfferedPlans()) {
    const sig = groupSignature(plan);
    const loc = locationBySlug.get(plan.locationSlug);
    const entry = bySignature.get(sig) ?? { plan, locations: [] };
    entry.locations.push({
      slug: plan.locationSlug,
      name: plan.locationName,
      shortAddress: loc?.shortAddress ?? "",
      area: plan.area,
    });
    bySignature.set(sig, entry);
  }

  // Sắp xếp ổn định trước khi gán slug — cùng thứ tự này ở mọi lần build nên
  // slug định danh (vd. hậu tố "-2" khi trùng tên+giá) không đổi qua các lần.
  const groups = [...bySignature.values()].sort((a, b) => {
    if (a.plan.price !== b.plan.price) return a.plan.price - b.plan.price;
    if (a.plan.planName !== b.plan.planName) return a.plan.planName.localeCompare(b.plan.planName);
    return a.locations[0].slug.localeCompare(b.locations[0].slug);
  });

  const baseSlugCounts = new Map<string, number>();
  return groups.map(({ plan, locations }) => {
    const base = `${slugifyVN(plan.planName)}-${Math.round(plan.price / 1000)}k`;
    const seen = baseSlugCounts.get(base) ?? 0;
    baseSlugCounts.set(base, seen + 1);
    const groupKey = seen === 0 ? base : `${base}-${seen + 1}`;
    return {
      groupKey,
      planName: plan.planName,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      addonNote: plan.addonNote,
      locations,
    };
  });
}

export function getPlanGroup(groupKey: string): PlanGroup | undefined {
  return getGroupedPlans().find((g) => g.groupKey === groupKey);
}
