import { cookies } from "next/headers";
import { PAYMENT_REQUEST_AUTH_COOKIE, paymentRequestSessionToken } from "./paymentRequestAuth";

/**
 * Kiểm tra xác thực dùng trong Server Component (page.tsx) và Route Handler
 * (api/payment-request-image) — TÁCH RIÊNG khỏi paymentRequestAuth.ts vì
 * dùng "next/headers" (chỉ chạy được ở Node.js server thật, không phải
 * src/proxy.ts — xem comment ở đó và ở paymentRequestAuth.ts).
 *
 * src/proxy.ts đã rewrite mọi request CHƯA xác thực sang trang khoá
 * (de-nghi-thanh-toan-mat-bang-locked, không import PaymentRequestTool) nên
 * về lý thuyết hàm này ở page.tsx luôn trả về true — vẫn giữ lại như lớp
 * phòng thủ thứ 2 (phòng trường hợp matcher của proxy cấu hình sai), và BẮT
 * BUỘC phải giữ ở route ảnh (api/payment-request-image) vì route đó KHÔNG
 * nằm trong phạm vi rewrite của proxy — gọi thẳng API này mà không qua
 * trang vẫn phải bị chặn ở đây.
 */
export async function isPaymentRequestAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(PAYMENT_REQUEST_AUTH_COOKIE)?.value === paymentRequestSessionToken();
}
