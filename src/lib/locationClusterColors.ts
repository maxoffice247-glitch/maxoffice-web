/**
 * Bảng màu xoay vòng dùng để phân biệt 2 khu vực bị ghép chung 1 hàng
 * hiển thị (xem MERGED_AREA_PAIRS/`subGroups` trong locationsData.ts) —
 * DÙNG CHUNG cho /dia-diem (LocationsAreaBrowser.tsx) và dropdown "Chi
 * nhánh" ở header (LocationsMegaMenu.tsx) để 2 nơi luôn đồng bộ, không
 * lệch màu khi 1 trong 2 chỗ được sửa mà quên chỗ còn lại.
 *
 * `border` và `text` CÙNG TRỎ VỀ 1 TÔNG MÀU (VD cả 2 đều "primary", cả 2
 * đều "amber-dark"...) thay vì khai 2 class riêng cho viền và chữ — đảm
 * bảo viền LUÔN khớp đúng màu chữ tiêu đề của khối đó, không thể lệch màu
 * do sửa tay 1 bên mà quên bên kia. Viền dùng độ dày mặc định (`border`,
 * 1px) bao quanh cả 4 cạnh — bằng đúng độ dày viền xám mặc định các khối
 * khác trên site đang dùng (chỉ đổi màu, không đổi độ dày).
 */
export const CLUSTER_COLORS = [
  { border: "border-primary", text: "text-primary", badge: "bg-primary/10 text-primary" },
  { border: "border-amber-dark", text: "text-amber-dark", badge: "bg-amber/12 text-amber-dark" },
  { border: "border-violet-700", text: "text-violet-700", badge: "bg-violet-500/10 text-violet-700" },
  { border: "border-emerald-700", text: "text-emerald-700", badge: "bg-emerald-600/10 text-emerald-700" },
] as const;
