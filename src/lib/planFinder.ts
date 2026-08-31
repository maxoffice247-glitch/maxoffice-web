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
