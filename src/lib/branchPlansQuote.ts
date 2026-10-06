/**
 * Mô hình dữ liệu của ảnh "Báo giá tất cả các gói của chi nhánh" (route src/app/api/quote-image/[slug]/tat-ca/route.tsx) — TÁCH khỏi route để kiểm thử
 * tự động được. KHÔNG có giá/tên gói/ưu đãi nào viết cứng ở đây: mọi thứ lấy từ CÙNG nguồn với ảnh báo giá từng gói (getAllOfferedPlans -> OfferedPlan:
 * giá, features, oneTimeFee; LOCATIONS_DATA: tên/địa chỉ pháp lý/ưu đãi; getPromotionsForPlanPrice) nên chi nhánh thêm/đổi gói thì ảnh tự theo.
 *
 * Ảnh từng gói và ảnh nhóm gói liệt kê ĐẦY ĐỦ checklist (không chọn lọc) — còn ảnh so sánh nhiều gói phải gọn, nên mỗi gói chỉ hiện tối đa HIGHLIGHT_MAX quyền lợi
 * (xem selectPlanHighlights): gói đầu (rẻ nhất) hiện những quyền lợi đầu danh sách; các gói cao hơn, NẾU gồm trọn quyền lợi của gói liền trước, chỉ hiện phần
 * QUYỀN LỢI THÊM kèm dòng "Gồm tất cả quyền lợi gói <trước>"; nếu không (hệ giá không cộng dồn) thì hiện quyền lợi KHÁC BIỆT giữa các gói trước, rồi quyền lợi chung.
 */
import { getAllOfferedPlans, formatVoPrice, type OfferedPlan, type OneTimeFee } from "./planFinder";
import { LOCATIONS_DATA, resolveTimedPromotions, getPromotionsForPlanPrice } from "./locationsData";
import { oneTimeFeePlanLine } from "./quoteImageDictionary";

export const HIGHLIGHT_MAX = 5;
/** Số dòng ưu đãi tối đa mỗi nhóm — cùng giới hạn `.slice(0, 4)` của ảnh báo giá từng gói. */
export const PROMO_LINES_MAX = 4;
/** Cách ghi giá/VAT: GIỐNG ảnh báo giá từng gói ("<giá>" + "/tháng · chưa gồm VAT 10%"). */
export const PRICE_VAT_NOTE = "/tháng · chưa gồm VAT 10%";

export type PlanHighlights = {
  /** Tên gói liền trước nếu gói này gồm trọn quyền lợi của nó (chỉ hiện phần thêm), ngược lại undefined. */
  includesPlanName?: string;
  items: string[];
  /** Số quyền lợi còn lại không hiện (ghi "+N quyền lợi khác"). */
  more: number;
};

export type BranchQuotePlan = {
  planKey: string;
  planName: string;
  price: number;
  priceText: string;
  highlights: PlanHighlights;
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

/** Quyền lợi dạng "<mục>: Không có" — gói không có mục này; ảnh so sánh không hiện (kẻo hiện dấu ✓ cạnh chữ "Không có"). */
const isNegativeFeature = (f: string) => /(^|:\s*)không có$/i.test(f.trim());

/**
 * Chọn quyền lợi hiển thị cho 1 gói (xem comment đầu file). `prev` = gói liền trước theo giá tăng dần; `allFeatures` = features của MỌI gói chi nhánh (để biết
 * quyền lợi nào là chung): nếu gói không cộng dồn lên gói trước thì ưu tiên hiện quyền lợi KHÁC BIỆT (không có ở mọi gói) trước, rồi mới tới quyền lợi chung —
 * để các thẻ không giống hệt nhau ở 5 dòng đầu (ảnh để so sánh gói).
 */
export function selectPlanHighlights(
  plan: Pick<OfferedPlan, "features">,
  prev?: Pick<OfferedPlan, "features" | "planName">,
  allFeatures?: string[][],
): PlanHighlights {
  const all = plan.features.filter((f) => !isNegativeFeature(f));
  if (prev && prev.features.length > 0 && prev.features.every((f) => plan.features.includes(f))) {
    const added = all.filter((f) => !prev.features.includes(f));
    if (added.length > 0) {
      return { includesPlanName: prev.planName, items: added.slice(0, HIGHLIGHT_MAX), more: Math.max(0, added.length - HIGHLIGHT_MAX) };
    }
  }
  let ordered = all;
  if (allFeatures && allFeatures.length > 1) {
    const isCommon = (f: string) => allFeatures.every((fs) => fs.includes(f));
    ordered = [...all.filter((f) => !isCommon(f)), ...all.filter(isCommon)];
  }
  return { items: ordered.slice(0, HIGHLIGHT_MAX), more: Math.max(0, ordered.length - HIGHLIGHT_MAX) };
}

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

  const quotePlans: BranchQuotePlan[] = plans.map((plan, i) => ({
    planKey: plan.planKey,
    planName: plan.planName,
    price: plan.price,
    priceText: formatVoPrice(plan.price),
    highlights: selectPlanHighlights(plan, plans[i - 1], plans.map((x) => x.features)),
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
