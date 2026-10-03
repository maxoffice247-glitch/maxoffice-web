import {
  LOCATIONS_LIST,
  getGroupedLocations,
  getLocationBySlug,
  stripLocationNameCuSuffix,
} from "./locationsData";

/**
 * Địa chỉ chi nhánh MAX OFFICE dùng cho ô "Địa chỉ" của form Hồ sơ thành lập
 * doanh nghiệp. Luôn dựng từ nguồn chi nhánh hiện có (LOCATIONS_LIST /
 * getLocationBySlug) — thêm/ẩn chi nhánh thì danh sách tự cập nhật, không có
 * danh sách gõ cứng nào ở đây.
 *
 * `address` = trường `LocationData.address` NGUYÊN VĂN (địa chỉ đầy đủ đang
 * dùng trên site), không biên tập lại. Mức độ nhất quán của trường này giữa
 * các chi nhánh được rà soát riêng (xem báo cáo) — dữ liệu chi nhánh KHÔNG bị
 * sửa ở đây.
 *
 * File này import locationsData (rất lớn) nên CHỈ dùng ở phía server (page.tsx
 * truyền kết quả xuống client qua props; API route kiểm tra lại). Component
 * client chỉ `import type` từ đây.
 */
export type BranchAddressOption = {
  slug: string;
  /** Tên chi nhánh để hiển thị/ghi vào email (đã bỏ hậu tố "(cũ)"). */
  name: string;
  /** Địa chỉ đầy đủ — giá trị được điền vào form và server đối chiếu. */
  address: string;
  /** Dạng viết tắt "…, P. Tân Sơn Hoà" — chỉ dùng cho tìm kiếm. */
  shortAddress: string;
};

export type BranchAddressGroup = {
  areaSlug: string;
  areaName: string;
  options: BranchAddressOption[];
};

function toOption(slug: string, name: string, shortAddress: string): BranchAddressOption | null {
  const address = getLocationBySlug(slug)?.address?.trim();
  if (!address) return null;
  return { slug, name: stripLocationNameCuSuffix(name), address, shortAddress };
}

/** Toàn bộ chi nhánh ĐANG hiển thị công khai, nhóm theo khu vực. */
export function getBranchAddressGroups(): BranchAddressGroup[] {
  return getGroupedLocations()
    .areaGroups.map((g) => ({
      areaSlug: g.area.slug,
      areaName: g.area.name,
      options: g.locations
        .map((l) => toOption(l.slug, l.name, l.shortAddress))
        .filter((o): o is BranchAddressOption => o !== null),
    }))
    .filter((g) => g.options.length > 0);
}

/** Tra 1 chi nhánh đang hoạt động theo slug — null nếu không tồn tại/đang ẩn. */
export function findBranchAddress(slug: string): BranchAddressOption | null {
  const item = LOCATIONS_LIST.find((l) => l.slug === slug);
  return item ? toOption(item.slug, item.name, item.shortAddress) : null;
}
