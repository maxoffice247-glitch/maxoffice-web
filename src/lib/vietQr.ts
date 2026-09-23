/**
 * Mã QR chuyển khoản VietQR nhúng vào ảnh báo giá tổng hợp — TÙY CHỌN, tắt
 * mặc định (xem CompositeQuoteTool.tsx). Dùng API ảnh công khai
 * img.vietqr.io (không cần khoá API, được nhiều app ngân hàng/ví điện tử
 * Việt Nam hỗ trợ) — KHÔNG có SDK/thư viện VietQR nào trong repo này để tái
 * sử dụng, đây là lần đầu tích hợp.
 *
 * Tài khoản nhận CỐ ĐỊNH của công ty — nhân viên/khách chỉ được CHỌN 1
 * trong các tài khoản khai báo sẵn ở đây, KHÔNG được tự gõ số tài khoản
 * bất kỳ trên form, tránh rủi ro chuyển QR nhận tiền sai tài khoản. Thêm
 * tài khoản mới: chỉ thêm 1 entry vào VIETQR_ACCOUNTS, không cần sửa gì
 * thêm ở route.tsx/CompositeQuoteTool.tsx (cả 2 đều đọc động từ đây).
 */
export type VietQrAccountKey = "1117777888" | "16868889";

export const VIETQR_ACCOUNTS: Record<
  VietQrAccountKey,
  { bankCode: string; accountNumber: string; accountName: string }
> = {
  "1117777888": { bankCode: "TCB", accountNumber: "1117777888", accountName: "CTY MAX OFFICE" },
  "16868889": { bankCode: "TCB", accountNumber: "16868889", accountName: "CTY MAX OFFICE" },
};

/** Tài khoản mặc định khi bật QR mà không đổi lựa chọn — GIỮ NGUYÊN tài
 * khoản đã dùng trước khi có tính năng chọn nhiều tài khoản này, để không
 * đổi hành vi mặc định đã có. */
export const DEFAULT_VIETQR_ACCOUNT_KEY: VietQrAccountKey = "1117777888";

/** Thứ tự hiển thị trên form — liệt kê TƯỜNG MINH thay vì
 * `Object.keys(VIETQR_ACCOUNTS)`: cả 2 key hiện tại đều là chuỗi toàn chữ
 * số ("1117777888"/"16868889"), mà JS tự sắp xếp key kiểu này theo thứ tự
 * SỐ TĂNG DẦN bất kể thứ tự khai báo trong object literal (đã xác nhận:
 * Object.keys({"1117777888":1,"16868889":2}) -> ["16868889",
 * "1117777888"]) — dựa vào Object.keys() sẽ vô tình đẩy tài khoản mặc định
 * xuống vị trí 2, gây hiểu nhầm khi hiển thị. */
export const VIETQR_ACCOUNT_KEYS: VietQrAccountKey[] = ["1117777888", "16868889"];

export function isVietQrAccountKey(value: unknown): value is VietQrAccountKey {
  return typeof value === "string" && Object.hasOwn(VIETQR_ACCOUNTS, value);
}

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
 * `accountKey`: 1 trong các key khai báo ở VIETQR_ACCOUNTS — hàm LUÔN tự
 * tra cứu tài khoản thật từ đây theo key, KHÔNG BAO GIỜ nhận trực tiếp số
 * tài khoản/ngân hàng từ client (giữ đúng nguyên tắc an toàn đã áp dụng
 * cho các trường có cấu trúc khác trong compositeQuote.ts).
 * `amount`: số tiền gợi ý điền sẵn trên QR — null nếu không có tổng nào đủ
 * rõ ràng để điền (xem route.tsx: chọn khối tổng LỚN NHẤT trong các khối
 * đang có trên báo giá; null thì QR vẫn quét được, chỉ không tự điền số
 * tiền, người chuyển tự nhập tay).
 * `note`: nội dung chuyển khoản — bỏ dấu, giới hạn độ dài để tương thích
 * rộng với các app ngân hàng.
 */
export function buildVietQrImageUrl(accountKey: VietQrAccountKey, amount: number | null, note: string): string {
  const account = VIETQR_ACCOUNTS[accountKey];
  const base = `https://img.vietqr.io/image/${account.bankCode}-${account.accountNumber}-qr_only.png`;
  const params = new URLSearchParams();
  if (amount != null && Number.isFinite(amount) && amount > 0) {
    params.set("amount", String(Math.round(amount)));
  }
  params.set("addInfo", stripDiacritics(note).slice(0, 50));
  params.set("accountName", account.accountName);
  return `${base}?${params.toString()}`;
}

export function vietQrAccountLabel(accountKey: VietQrAccountKey): string {
  const account = VIETQR_ACCOUNTS[accountKey];
  return `${account.bankCode} — ${account.accountNumber} — ${account.accountName}`;
}

/**
 * Nội dung chuyển khoản (`addInfo`) — xác nhận với chủ site trước khi làm:
 * "{tên khách hoặc SĐT hoặc 'Khach hang MAX OFFICE'} thanh toan phi dich vu"
 * (KHÔNG kèm tên dịch vụ cụ thể — quyết định rõ ràng, không phải thiếu sót).
 * Ưu tiên tên khách > SĐT > nhãn chung, để bên nhận tiền còn cách đối chiếu
 * đúng giao dịch của đúng khách khi có nhiều đơn chuyển cùng lúc, ngay cả
 * khi nhân viên không nhập tên khách hàng trên form.
 */
export function buildQrNote(customer?: { name?: string; phone?: string }): string {
  const identifier = customer?.name?.trim() || customer?.phone?.trim() || "Khach hang MAX OFFICE";
  return `${identifier} thanh toan phi dich vu`;
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
