/**
 * Lựa chọn "Dịch vụ bạn quan tâm" của popup ưu đãi (LeadCapturePopup) — dùng chung client
 * (hiển thị chip, chọn sẵn theo trang) và server (api/submit-lead chỉ nhận đúng 5 nhãn
 * này cho formType của popup; giá trị lạ thì bỏ riêng trường service, không từ chối lead).
 */
export const POPUP_FORM_TYPE = "Popup ưu đãi";

export const POPUP_SERVICE_OPTIONS = [
  "Văn phòng ảo",
  "Thành lập doanh nghiệp",
  "Kế toán & thuế",
  "Phòng họp / Chỗ ngồi",
  "Văn phòng trọn gói",
] as const;

export type PopupService = (typeof POPUP_SERVICE_OPTIONS)[number];

export function isPopupService(v: unknown): v is PopupService {
  return typeof v === "string" && (POPUP_SERVICE_OPTIONS as readonly string[]).includes(v);
}

/**
 * Dịch vụ CHỌN SẴN theo trang đang xem (route thực tế trong src/app):
 * - /services/thanh-lap-doanh-nghiep, /tien-ich/checklist-thanh-lap-doanh-nghiep -> Thành lập doanh nghiệp
 * - /services/ke-toan-thue -> Kế toán & thuế
 * - /locations/* và /dia-diem/* (trang từng chi nhánh / từng khu vực) -> Văn phòng ảo
 * - Mọi trang khác (trang chủ, bảng giá, các /services/* còn lại...) -> không chọn sẵn ("").
 */
export function defaultPopupService(pathname: string | null | undefined): PopupService | "" {
  const p = (pathname ?? "").replace(/\/+$/, "") || "/";
  if (p === "/services/thanh-lap-doanh-nghiep" || p === "/tien-ich/checklist-thanh-lap-doanh-nghiep") {
    return "Thành lập doanh nghiệp";
  }
  if (p === "/services/ke-toan-thue") return "Kế toán & thuế";
  if (p.startsWith("/locations/") || p.startsWith("/dia-diem/")) return "Văn phòng ảo";
  return "";
}
