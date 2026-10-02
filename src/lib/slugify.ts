/**
 * Chuyển văn bản tiếng Việt (có dấu) thành chuỗi AN TOÀN dùng trong TÊN
 * FILE: bỏ dấu, viết hoa, mọi khoảng trắng/ký tự đặc biệt gộp thành 1 dấu
 * gạch ngang, cắt độ dài tối đa. Dùng chung cho tên file tải xuống của cả
 * PaymentRequestTool (DNTT-...) và CompositeQuoteTool (BG-...) — xem
 * buildPaymentRequestFilename()/buildCompositeQuoteFilename().
 *
 * TỰ ĐỘNG loại bỏ toàn bộ ký tự cấm trong tên file trên mọi hệ điều hành
 * (/ \ : * ? " < > |) vì bước cuối chỉ giữ lại [A-Z0-9-] — không cần liệt
 * kê riêng từng ký tự cấm để lọc.
 */
export function slugifyForFilename(text: string, maxLength = 30): string {
  const noDiacritics = text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const upper = noDiacritics.toUpperCase();
  const cleaned = upper.replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const truncated = cleaned.slice(0, maxLength).replace(/-+$/g, "");
  return truncated || "KHACH";
}
