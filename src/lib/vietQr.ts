/**
 * Mã QR chuyển khoản VietQR nhúng vào ảnh báo giá tổng hợp — TÙY CHỌN, tắt
 * mặc định (xem CompositeQuoteTool.tsx). Dùng API ảnh công khai
 * img.vietqr.io (không cần khoá API, được nhiều app ngân hàng/ví điện tử
 * Việt Nam hỗ trợ) — KHÔNG có SDK/thư viện VietQR nào trong repo này để tái
 * sử dụng, đây là lần đầu tích hợp.
 *
 * Tài khoản nhận cố định của công ty (theo yêu cầu khi triển khai tính
 * năng này) — không cho nhân viên/khách đổi tài khoản nhận trên form, tránh
 * rủi ro chuyển QR nhận tiền sai tài khoản.
 */
const MAX_OFFICE_BANK = {
  bankCode: "TCB",
  accountNumber: "1117777888",
  accountName: "CTY MAX OFFICE",
};

/** Bỏ dấu tiếng Việt cho nội dung chuyển khoản (`addInfo`) — 1 số app ngân
 * hàng hiển thị lỗi font hoặc cắt bớt nội dung có dấu trong QR chuyển
 * khoản, bỏ dấu để đảm bảo hiển thị đúng trên mọi app. */
function stripDiacritics(text: string): string {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * `amount`: số tiền gợi ý điền sẵn trên QR — null nếu không có tổng nào đủ
 * rõ ràng để điền (xem route.tsx: chọn khối tổng LỚN NHẤT trong các khối
 * đang có trên báo giá; null thì QR vẫn quét được, chỉ không tự điền số
 * tiền, người chuyển tự nhập tay).
 * `note`: nội dung chuyển khoản — bỏ dấu, giới hạn độ dài để tương thích
 * rộng với các app ngân hàng.
 */
export function buildVietQrImageUrl(amount: number | null, note: string): string {
  const base = `https://img.vietqr.io/image/${MAX_OFFICE_BANK.bankCode}-${MAX_OFFICE_BANK.accountNumber}-qr_only.png`;
  const params = new URLSearchParams();
  if (amount != null && Number.isFinite(amount) && amount > 0) {
    params.set("amount", String(Math.round(amount)));
  }
  params.set("addInfo", stripDiacritics(note).slice(0, 50));
  params.set("accountName", MAX_OFFICE_BANK.accountName);
  return `${base}?${params.toString()}`;
}

export function vietQrAccountLabel(): string {
  return `${MAX_OFFICE_BANK.bankCode} — ${MAX_OFFICE_BANK.accountNumber} — ${MAX_OFFICE_BANK.accountName}`;
}

/**
 * Tự nhận diện định dạng ảnh thật qua magic bytes — KHÔNG tin đuôi URL
 * (".png") lẫn header `Content-Type` của response. Đã xác nhận bằng byte
 * thật: img.vietqr.io trả về `content-type: image/png` nhưng dữ liệu THẬT
 * SỰ là JPEG (magic bytes `FF D8 FF`) — tin theo đuôi URL hoặc header sẽ
 * gán sai MIME vào data URI, khiến Satori render ra ảnh trắng trơn (im
 * lặng, không throw lỗi gì để phát hiện). Rơi về "image/jpeg" nếu không
 * khớp chữ ký nào đã biết, đúng với thực tế endpoint này đang trả về.
 */
export function detectImageMimeType(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return "image/jpeg";
}
