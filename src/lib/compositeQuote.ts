/**
 * Logic dữ liệu DÙNG CHUNG giữa API route tạo ảnh báo giá tổng hợp
 * (src/app/api/quote-image/tong-hop/route.tsx, chạy server) VÀ công cụ nhập
 * liệu phía client (src/components/tools/CompositeQuoteTool.tsx) — tách
 * riêng khỏi cả 2 nơi đó để CHỈ MỘT nơi tra giá theo key, tránh lệch giá
 * giữa bản xem trước ở form và ảnh PNG thật sự xuất ra.
 *
 * QUAN TRỌNG VỀ AN TOÀN GIÁ: `resolveCompositeQuoteItem()` là nơi DUY NHẤT
 * chuyển 1 lựa chọn (key) thành giá thật — với 3 loại có cấu trúc sẵn
 * (van-phong-ao/thanh-lap-doanh-nghiep/ke-toan-thue), hàm này LUÔN tự tra
 * giá từ servicesData.ts/planFinder.ts theo key nhận được, KHÔNG BAO GIỜ
 * nhận giá trực tiếp từ input. Route API gọi đúng hàm này ở phía server nên
 * dù client (hoặc ai đó gọi thẳng API bằng tay) có cố gửi kèm 1 field "giá"
 * giả cho 3 loại này, giá trị đó cũng bị bỏ qua hoàn toàn. Chỉ loại
 * "custom" (3 dịch vụ chưa có bảng giá cấu trúc) mới nhận giá tự do từ
 * client, vì bản chất không có gì trong hệ thống để tra.
 */
import { getOfferedPlan, formatVoPrice } from "./planFinder";
import { SERVICES_DATA } from "./servicesData";

export type CustomServiceSlug = "van-phong-tron-goi" | "cho-ngoi-linh-dong" | "phong-hop";

/** Đơn vị tính phí — quyết định dòng này rơi vào khối nào trên ảnh báo giá
 * (Hàng tháng / Một lần / Theo giờ). Cố định theo BẢN CHẤT của từng dịch vụ
 * (vd. phòng họp luôn tính theo giờ), không cho client tự chọn — tránh 1
 * dòng "phòng họp" bị gắn nhầm đơn vị "/tháng" rồi lọt vào tổng hàng tháng. */
export type QuoteBucket = "thang" | "mot-lan" | "gio";

export const CUSTOM_SERVICE_META: Record<
  CustomServiceSlug,
  { name: string; bucket: QuoteBucket; unitLabel: string }
> = {
  "van-phong-tron-goi": { name: "Văn phòng trọn gói", bucket: "thang", unitLabel: "/tháng" },
  "cho-ngoi-linh-dong": { name: "Chỗ ngồi linh động", bucket: "thang", unitLabel: "/tháng" },
  "phong-hop": { name: "Phòng họp theo giờ", bucket: "gio", unitLabel: "/giờ" },
};

/** Giá tham khảo hiện có (mode "single" trong servicesData.ts) — dùng làm
 * giá trị PREFILL gợi ý cho nhân viên khi chọn 1 trong 3 dịch vụ chưa có
 * bảng giá cấu trúc, không phải giá cố định (nhân viên sửa lại tự do). */
export function getCustomServiceReferencePrice(slug: CustomServiceSlug): string {
  const pricing = SERVICES_DATA[slug].pricing;
  return pricing.mode === "single" ? pricing.price : "";
}

export type CompositeQuoteCustomer = {
  name?: string;
  phone?: string;
  companyName?: string;
};

export type CompositeQuoteItem =
  | { type: "van-phong-ao"; locationSlug: string; planKey: string }
  | { type: "thanh-lap-doanh-nghiep"; tier: "goi-1" | "goi-2" }
  | { type: "ke-toan-thue"; group: "A" | "B" | "C"; rangeIndex: number }
  | { type: "custom"; serviceSlug: CustomServiceSlug; label: string; price: string };

export type CompositeQuoteRequestBody = {
  customer?: CompositeQuoteCustomer;
  items: CompositeQuoteItem[];
};

export type ResolvedQuoteLine = {
  category: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  /** Giá trị số để cộng tổng khối "Hàng tháng" — null nếu không tách được
   * số cụ thể (vd. dòng "custom" nhân viên gõ tay chữ không phải số), khi
   * đó dòng này vẫn hiển thị bình thường nhưng KHÔNG được tính vào tổng. */
  rawAmount: number | null;
  bucket: QuoteBucket;
};

export type ResolveItemError = { error: string };

/** Tách phần số đứng đầu chuỗi giá (bỏ qua "đ", dấu chấm/phẩy ngăn cách
 * nghìn) — dùng để cộng tổng. Trả null nếu chuỗi không bắt đầu bằng số (vd.
 * "Liên hệ báo giá", hoặc rỗng) thay vì đoán bừa, để tổng hàng tháng không
 * bao giờ âm thầm sai. */
export function parseVndAmount(text: string): number | null {
  const match = text.trim().match(/^([\d.,]+)/);
  if (!match) return null;
  const digits = match[1].replace(/[.,]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function resolveCompositeQuoteItem(
  item: CompositeQuoteItem
): ResolvedQuoteLine | ResolveItemError {
  switch (item.type) {
    case "van-phong-ao": {
      const plan = getOfferedPlan(item.locationSlug, item.planKey);
      if (!plan) {
        return {
          error: `Không tìm thấy gói Văn phòng ảo "${item.planKey}" tại chi nhánh "${item.locationSlug}". Có thể chi nhánh/gói này đã thay đổi — vui lòng chọn lại.`,
        };
      }
      return {
        category: "Văn phòng ảo",
        title: `Gói ${plan.planName}`,
        subtitle: plan.locationName,
        priceLabel: `${formatVoPrice(plan.price)}/tháng`,
        rawAmount: plan.price,
        bucket: "thang",
      };
    }

    case "thanh-lap-doanh-nghiep": {
      const pricing = SERVICES_DATA["thanh-lap-doanh-nghiep"].pricing;
      if (pricing.mode !== "tiers") {
        return { error: "Dữ liệu giá Thành lập doanh nghiệp không đúng định dạng." };
      }
      const tierIndex = item.tier === "goi-1" ? 0 : 1;
      const tier = pricing.tiers[tierIndex];
      if (!tier) {
        return { error: `Không tìm thấy gói "${item.tier}" của Thành lập doanh nghiệp.` };
      }
      return {
        category: "Thành lập doanh nghiệp",
        title: tier.name,
        subtitle: tier.unit,
        priceLabel: tier.price,
        rawAmount: parseVndAmount(tier.price),
        bucket: "mot-lan",
      };
    }

    case "ke-toan-thue": {
      const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
      if (pricing.mode !== "accounting") {
        return { error: "Dữ liệu giá Kế toán & thuế không đúng định dạng." };
      }
      const row = pricing.tiers[item.rangeIndex];
      const group = pricing.groups.find((g) => g.key === item.group);
      const price = row?.prices[item.group];
      if (!row || !group || !price) {
        return { error: "Không tìm thấy mức giá Kế toán & thuế theo lựa chọn đã gửi." };
      }
      return {
        category: "Kế toán & thuế",
        title: group.label,
        // row.range đã tự chứa "hoá đơn" (VD: "1-30 hoá đơn", ngoại lệ
        // "Không phát sinh") — chỉ nối thêm "/quý", KHÔNG lặp lại "hoá đơn"
        // lần nữa (bug cũ: "1-30 hoá đơn hoá đơn/quý").
        subtitle: `${row.range}/quý`,
        priceLabel: `${price}/tháng`,
        rawAmount: parseVndAmount(price),
        bucket: "thang",
      };
    }

    case "custom": {
      const meta = CUSTOM_SERVICE_META[item.serviceSlug];
      if (!meta) return { error: "Loại dịch vụ tuỳ chỉnh không hợp lệ." };
      const priceText = item.price.trim();
      if (!priceText) return { error: `Vui lòng nhập giá cho dòng "${meta.name}".` };
      const title = item.label.trim() || meta.name;
      return {
        category: meta.name,
        title,
        // Không đặt subtitle = meta.name ở đây — category (dòng phụ mặc
        // định trong ItemRow) ĐÃ LÀ meta.name rồi, đặt thêm sẽ render ra
        // "Văn phòng trọn gói · Văn phòng trọn gói" (lặp) khi có label
        // riêng. undefined -> ItemRow tự hiện đúng 1 dòng category.
        subtitle: undefined,
        priceLabel: `${priceText}${meta.unitLabel}`,
        rawAmount: parseVndAmount(priceText),
        bucket: meta.bucket,
      };
    }
  }
}

/** Tuỳ chọn Gói 1/Gói 2 Thành lập DN cho dropdown — đọc thẳng từ
 * servicesData.ts nên không lệch với trang /services/thanh-lap-doanh-nghiep
 * nếu tên/giá gói thay đổi sau này. */
export function getGpkdTierOptions(): { tier: "goi-1" | "goi-2"; name: string; price: string; unit: string }[] {
  const pricing = SERVICES_DATA["thanh-lap-doanh-nghiep"].pricing;
  if (pricing.mode !== "tiers") return [];
  return pricing.tiers.map((t, i) => ({
    tier: i === 0 ? "goi-1" : "goi-2",
    name: t.name,
    price: t.price,
    unit: t.unit,
  }));
}

export function getAccountingGroupOptions() {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  return pricing.mode === "accounting" ? pricing.groups : [];
}

export function getAccountingRangeOptions() {
  const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
  return pricing.mode === "accounting" ? pricing.tiers : [];
}
