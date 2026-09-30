import { createHmac, timingSafeEqual } from "node:crypto";

/** Xác thực webhook SePay — hỗ trợ ĐỒNG THỜI 2 cơ chế, chấp nhận nếu MỘT
    trong hai đúng (không làm yếu cơ chế nào, chỉ là 2 lối vào độc lập):

    1. Query string `?key=...` (đã có từ đầu — theo đúng cách GPKD dùng).
    2. Header `X-SePay-Signature: sha256={hex}` + `X-SePay-Timestamp:
       {unix giây}` — CHỮ KÝ HMAC-SHA256 SePay hỗ trợ, MẠNH HƠN vì:
         - Ký trên chính NỘI DUNG request (chuỗi `{timestamp}.{rawBody}`)
           nên phát hiện được payload bị sửa trên đường truyền, không chỉ
           xác thực "ai gọi" như key tĩnh.
         - Secret KHÔNG BAO GIỜ xuất hiện trong URL/log truy cập (khác
           `?key=` — 1 static string dễ vô tình lộ qua log server/proxy/
           công cụ theo dõi lỗi ghi lại URL đầy đủ).
         - Có cửa sổ thời gian (±5 phút) chống phát lại (replay) — key
           tĩnh không tự chống được replay: nếu lỡ lộ, kẻ tấn công gọi lại
           y hệt request cũ mãi mãi vẫn được coi là hợp lệ.

    Đã XÁC NHẬN đúng đặc tả qua tài liệu chính thức
    developer.sepay.vn/vi/sepay-webhooks/xac-thuc, không phải đoán:
    header tên chính xác, công thức ghép chuỗi, thuật toán hex — xem chú
    thích từng hàm bên dưới. */

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

export function verifyUrlKey(keyParam: string, expectedKey: string | undefined): boolean {
  return Boolean(expectedKey) && keyParam === expectedKey;
}

/** So sánh 2 chuỗi hex bằng thời gian không đổi (timingSafeEqual) — tránh
    lộ thông tin qua "timing attack" (so sánh `===` thường dừng sớm ở ký
    tự đầu tiên khác nhau, có thể đo được qua thời gian phản hồi). Độ dài
    khác nhau -> chắc chắn sai, trả false ngay (timingSafeEqual tự ném lỗi
    nếu 2 buffer khác độ dài, phải tự kiểm tra trước). */
function safeCompareHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export type HmacVerifyResult = "ok" | "missing_headers" | "expired" | "invalid_signature";

/** `rawBody` PHẢI là bytes THÔ của request (chưa qua JSON.parse rồi
    stringify lại) — tài liệu SePay cảnh báo rõ: PHP/JS escape Unicode
    khác nhau, JSON.parse+JSON.stringify KHÔNG đảm bảo tái tạo đúng y hệt
    chuỗi gốc, sẽ làm sai lệch chữ ký dù nội dung "giống nhau" về mặt dữ
    liệu. `now` truyền vào để test được xác định. */
export function verifyHmacSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  secret: string | undefined,
  now: number = Date.now()
): HmacVerifyResult {
  if (!secret || !signatureHeader || !timestampHeader) return "missing_headers";

  const timestampSeconds = Number(timestampHeader);
  if (!Number.isFinite(timestampSeconds)) return "missing_headers";
  if (Math.abs(now - timestampSeconds * 1000) > REPLAY_WINDOW_MS) return "expired";

  const expectedHex = createHmac("sha256", secret).update(`${timestampHeader}.${rawBody}`).digest("hex");
  const expectedHeader = `sha256=${expectedHex}`;

  return safeCompareHex(signatureHeader, expectedHeader) ? "ok" : "invalid_signature";
}
