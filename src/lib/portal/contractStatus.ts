import { normalizeStatusText } from "./normalize";
import type { ContractStatus } from "./types";

/** So ngày kết thúc (ISO yyyy-MM-dd) với "hôm nay" — so sánh theo NGÀY,
    không theo giờ/phút, để tránh 1 hợp đồng hết hạn đúng hôm nay bị coi là
    "còn hạn" hay "hết hạn" tuỳ giờ chạy code. `today` truyền vào (không tự
    gọi `new Date()` bên trong) để test được xác định, không phụ thuộc
    ngày giờ thật lúc chạy test. */
function isPastEndDate(endDateIso: string | null, today: Date): boolean {
  if (!endDateIso) return false; // không đọc được ngày -> không dám coi là hết hạn
  const end = new Date(endDateIso + "T23:59:59");
  return today.getTime() > end.getTime();
}

/** Nguồn Mộc Gia (DU_LIEU): hiệu lực CHỈ KHI cột T = "đã thanh toán" VÀ
    chưa qua ngày kết thúc (cột I). Xem Mục B đã chốt với người dùng. */
export function statusFromMocGia(paymentStatusRaw: string, endDateIso: string | null, today: Date): ContractStatus {
  const paid = normalizeStatusText(paymentStatusRaw).includes("đã thanh toán");
  if (!paid) return "pending_payment";
  return isPastEndDate(endDateIso, today) ? "expired" : "active";
}

/** Nguồn trụ sở chính (DANH SÁCH KHÁCH HÀNG, cột P) — không có nhánh "chờ
    thanh toán" (có tên trong sheet = đã xử lý xong, theo quy tắc nghiệp vụ
    đã xác nhận). "Đã thanh lý" (không phân biệt hoa/thường) luôn thắng dù
    ngày chưa hết hạn (khách có thể bị thanh lý sớm). Ngoài ra dùng NGÀY
    THẬT làm trọng tài khi cột P ("hoạt động"/"gia hạn") có thể chưa được
    nhân viên cập nhật kịp. */
export function statusFromTruSoChinh(statusRaw: string, endDateIso: string | null, today: Date): ContractStatus {
  const normalized = normalizeStatusText(statusRaw);
  if (normalized.includes("thanh lý")) return "expired";
  return isPastEndDate(endDateIso, today) ? "expired" : "active";
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  active: "Đang có hiệu lực",
  expired: "Đã hết hạn",
  pending_payment: "Chờ thanh toán, chưa có hiệu lực",
};

/** Số ngày còn lại từ HÔM NAY (không tính giờ/phút) đến hết ngày kết thúc
    (bao gồm cả chính ngày kết thúc, vd. còn 0 ngày = hết hạn đúng hôm nay)
    — chỉ có ý nghĩa khi hiển thị cùng status "active", dùng cho dòng "Đang
    có hiệu lực — còn N ngày" ở Mức 1. Trả về null nếu không có endDate để
    tính, KHÔNG đoán bừa 1 con số. `today` truyền vào để test được xác định,
    giống quy ước của isPastEndDate() ở trên. */
export function daysRemaining(endDateIso: string | null, today: Date): number | null {
  if (!endDateIso) return null;
  const end = new Date(endDateIso + "T23:59:59");
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const diffMs = end.getTime() - startOfToday.getTime();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}
