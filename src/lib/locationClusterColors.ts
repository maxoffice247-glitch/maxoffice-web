/**
 * Bảng màu xoay vòng dùng để phân biệt các khu vực ≤2 chi nhánh khi bị
 * ghép chung 1 hàng (xem `LocationRow` trong locationsData.ts) — DÙNG
 * CHUNG cho /dia-diem (LocationsAreaBrowser.tsx) và dropdown "Chi nhánh"
 * ở header (LocationsMegaMenu.tsx) để 2 nơi luôn đồng bộ, không lệch màu
 * khi 1 trong 2 chỗ được sửa mà quên chỗ còn lại.
 *
 * `border` và `text` CÙNG TRỎ VỀ 1 TÔNG MÀU (VD cả 2 đều "primary", cả 2
 * đều "amber-dark"...) thay vì khai 2 class riêng cho viền và chữ — đảm
 * bảo viền LUÔN khớp đúng màu chữ tiêu đề của khối đó, không thể lệch màu
 * do sửa tay 1 bên mà quên bên kia. Viền dùng độ dày mặc định (`border`,
 * 1px) bao quanh cả 4 cạnh — bằng đúng độ dày viền xám mặc định các khối
 * khác trên site đang dùng (chỉ đổi màu, không đổi độ dày), KHÔNG dùng
 * dải màu dày 1 bên (border-l-4) như bản trước.
 */
export const CLUSTER_COLORS = [
  { border: "border-primary", text: "text-primary", badge: "bg-primary/10 text-primary" },
  { border: "border-amber-dark", text: "text-amber-dark", badge: "bg-amber/12 text-amber-dark" },
  { border: "border-violet-700", text: "text-violet-700", badge: "bg-violet-500/10 text-violet-700" },
  { border: "border-emerald-700", text: "text-emerald-700", badge: "bg-emerald-600/10 text-emerald-700" },
] as const;

export type ClusterWidthShare = "1/2" | "1/3" | "2/3" | "full";

/**
 * Tỉ lệ bề ngang cho từng khu vực trong 1 hàng ghép, theo số chi nhánh
 * tương đối giữa các khu vực trong CÙNG hàng đó — khu vực nhiều chi nhánh
 * hơn được rộng hơn. Chỉ nhận tối đa 2 khu vực/hàng (đúng giới hạn
 * `CLUSTER_AREAS_PER_ROW` ở locationsData.ts) nên chỉ có 3 trường hợp: bằng
 * nhau (chia đều), hoặc lệch 2 chiều.
 */
export function getClusterWidthShares(locationCounts: number[]): ClusterWidthShare[] {
  if (locationCounts.length <= 1) return ["full"];
  const [a, b] = locationCounts;
  if (a === b) return ["1/2", "1/2"];
  return a > b ? ["2/3", "1/3"] : ["1/3", "2/3"];
}
