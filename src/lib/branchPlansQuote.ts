/**
 * Mô hình dữ liệu của ảnh "Báo giá tất cả các gói của chi nhánh" (route src/app/api/quote-image/[slug]/tat-ca/route.tsx) — TÁCH khỏi route để kiểm thử
 * tự động được. KHÔNG có giá/tên gói/ưu đãi nào viết cứng ở đây: mọi thứ lấy từ CÙNG nguồn với ảnh báo giá từng gói (getAllOfferedPlans -> OfferedPlan:
 * giá, features, oneTimeFee; LOCATIONS_DATA: tên/địa chỉ pháp lý/ưu đãi; getPromotionsForPlanPrice) nên chi nhánh thêm/đổi gói thì ảnh tự theo.
 *
 * Quyền lợi: HIỆN ĐỦ toàn bộ features của từng gói (không cắt bớt, không "+N quyền lợi khác") — giống ảnh báo giá từng gói; mục dạng "<tên>: Không có" vẫn hiện
 * nhưng đánh dấu riêng (isNegativeFeature) để ảnh vẽ dấu "–" thay vì ✓.
 */
import { getAllOfferedPlans, formatVoPrice, type OfferedPlan, type OneTimeFee } from "./planFinder";
import { LOCATIONS_DATA, resolveTimedPromotions, getPromotionsForPlanPrice } from "./locationsData";
import { oneTimeFeePlanLine } from "./quoteImageDictionary";

/** Số dòng ưu đãi tối đa mỗi nhóm — cùng giới hạn `.slice(0, 4)` của ảnh báo giá từng gói. */
export const PROMO_LINES_MAX = 4;
/** Cách ghi giá/VAT: GIỐNG ảnh báo giá từng gói ("<giá>" + "/tháng · chưa gồm VAT 10%"). */
export const PRICE_VAT_NOTE = "/tháng · chưa gồm VAT 10%";

export type BranchQuotePlan = {
  planKey: string;
  planName: string;
  price: number;
  priceText: string;
  /** Toàn bộ quyền lợi của gói, đúng thứ tự dữ liệu. */
  features: string[];
  /** Câu phụ phí thu một lần (cùng câu với ảnh từng gói) — chỉ gói có addOn trong dữ liệu. */
  oneTimeFeeLine?: string;
  oneTimeFee?: OneTimeFee;
};

export type PromoGroup = { planNames: string[]; lines: string[] };

export type BranchQuoteModel = {
  slug: string;
  locationName: string;
  /** Địa chỉ pháp lý — CÙNG trường (LOCATIONS_DATA[slug].address) mà ảnh báo giá từng gói dùng. */
  address: string;
  plans: BranchQuotePlan[];
  /** Ưu đãi hợp đồng dài hạn đã gộp theo danh sách giống hệt nhau (gói <499K và >=499K có danh sách khác nhau). */
  promoGroups: PromoGroup[];
};

/** Quyền lợi dạng "<mục>: Không có" (gói không có mục này) — ảnh vẽ dấu "–" thay vì ✓ để khách khỏi hiểu nhầm là có. */
export const isNegativeFeature = (f: string) => /(^|:\s*)không có$/i.test(f.trim());

/** Các gói của 1 chi nhánh theo giá tăng dần (cùng nguồn getAllOfferedPlans() với ảnh từng gói). */
export function getBranchPlans(slug: string): OfferedPlan[] {
  return getAllOfferedPlans()
    .filter((p) => p.locationSlug === slug)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => a.p.price - b.p.price || a.i - b.i)
    .map((x) => x.p);
}

/** null khi chi nhánh không tồn tại/không có gói; chi nhánh chỉ có 1 gói vẫn dựng được model (route tự quyết 404). */
export function buildBranchQuoteModel(slug: string): BranchQuoteModel | null {
  const plans = getBranchPlans(slug);
  const location = LOCATIONS_DATA[slug];
  if (plans.length === 0 || !location) return null;
  const resolvedPromotions = resolveTimedPromotions(location.promotions) ?? [];

  const quotePlans: BranchQuotePlan[] = plans.map((plan) => ({
    planKey: plan.planKey,
    planName: plan.planName,
    price: plan.price,
    priceText: formatVoPrice(plan.price),
    features: plan.features,
    oneTimeFee: plan.oneTimeFee,
    oneTimeFeeLine: plan.oneTimeFee ? oneTimeFeePlanLine(plan.oneTimeFee) : undefined,
  }));

  const groups = new Map<string, PromoGroup>();
  for (const plan of plans) {
    const lines = getPromotionsForPlanPrice(resolvedPromotions, plan.price).slice(0, PROMO_LINES_MAX);
    if (lines.length === 0) continue;
    const key = JSON.stringify(lines);
    const g = groups.get(key) ?? { planNames: [], lines };
    g.planNames.push(plan.planName);
    groups.set(key, g);
  }

  return { slug, locationName: plans[0].locationName, address: location.address, plans: quotePlans, promoGroups: [...groups.values()] };
}
