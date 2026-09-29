/** VietQR cho đơn đăng ký mới qua portal — dùng VA RIÊNG của portal (khác
    hẳn tài khoản VietQR của công cụ báo giá tổng hợp ở src/lib/vietQr.ts
    và khác VA của công cụ GPKD) — bắt buộc VA riêng vì SePay chỉ báo
    webhook theo đúng VA đã đăng ký webhook, không theo dõi được biến động
    số dư của số tài khoản chính (xem chú thích trong code GPKD đã xác
    nhận). Dùng chung 1 pattern URL đã XÁC NHẬN THẬT qua code GPKD:
    img.vietqr.io/image/{bin}-{va}-compact2.png?amount=...&addInfo=...
    &accountName=... — không cần gọi API SePay nào để tạo QR. */

function stripDiacritics(text: string): string {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Đọc trực tiếp từ env mỗi lần gọi (không cache) — cố ý, vì Phase 2 này
    VA/bank_bin/tên tài khoản đang là placeholder, giá trị thật sẽ được
    điền vào .env sau mà KHÔNG cần deploy lại code (đọc env luôn lấy giá
    trị mới nhất tại thời điểm request, phù hợp serverless — mỗi request
    là 1 lần khởi tạo module mới hoặc ít nhất đọc process.env mới). */
export function buildPortalVietQrUrl(orderCode: string, amount: number): string {
  const bankBin = process.env.SEPAY_PORTAL_BANK_BIN || "";
  const va = process.env.SEPAY_PORTAL_VA || "";
  const accountName = process.env.SEPAY_PORTAL_ACCOUNT_NAME || "";

  const base = `https://img.vietqr.io/image/${bankBin}-${va}-compact2.png`;
  const params = new URLSearchParams();
  params.set("amount", String(Math.round(amount)));
  params.set("addInfo", orderCode); // mã đơn LUÔN thuần chữ+số, không cần bỏ dấu
  if (accountName) params.set("accountName", stripDiacritics(accountName));
  return `${base}?${params.toString()}`;
}

/** Có đủ cấu hình SePay thật hay chưa — dùng để trang đăng ký hiện cảnh
    báo rõ ràng thay vì im lặng hiện QR hỏng nếu VA chưa được cấp. */
export function isPortalSepayConfigured(): boolean {
  return Boolean(process.env.SEPAY_PORTAL_BANK_BIN && process.env.SEPAY_PORTAL_VA);
}
