import { createHash } from "node:crypto";

/**
 * Lớp mật khẩu BẢO VỆ CÔNG CỤ NỘI BỘ "Đề nghị thanh toán" — `noindex` chỉ
 * chặn Google lập chỉ mục, KHÔNG ẩn dữ liệu khỏi ai mở đúng URL. Trang này
 * hiện MST/SĐT/tên khách thuê THẬT của 5 công ty, cần chặn thật sự.
 *
 * File này KHÔNG import "next/headers" (khác paymentRequestAuthServer.ts) —
 * để dùng được cả trong src/proxy.ts (chạy TRƯỚC khi vào page/route, xem
 * comment ở đó). Next.js 16 đổi tên "Middleware" thành "Proxy"
 * (src/proxy.ts, hàm export tên `proxy`, không phải `middleware.ts`/
 * `middleware` như các bản Next.js cũ — xác nhận qua
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 * theo đúng cảnh báo ở AGENTS.md) và Proxy mặc định chạy Node.js runtime
 * (khác Middleware bản cũ mặc định Edge runtime) nên `node:crypto` dùng
 * được bình thường, không cần đổi sang Web Crypto API.
 *
 * Mẫu mật khẩu mặc định qua biến môi trường (có giá trị dự phòng khi chưa
 * cấu hình) THEO ĐÚNG pattern đã có ở
 * src/app/api/portal/search/route.ts (PORTAL_MOC_GIA_SHARED_PASSWORD) —
 * không hardcode trực tiếp trong logic so khớp, đổi được qua biến môi
 * trường (Vercel/.env.local) mà không cần sửa code.
 */

const PAYMENT_REQUEST_TOOL_PASSWORD = process.env.PAYMENT_REQUEST_TOOL_PASSWORD || "MaxOffice@2026";

export const PAYMENT_REQUEST_AUTH_COOKIE = "prt_session";
/** 60 NGÀY (đổi từ 8 giờ ban đầu theo yêu cầu) — nhập đúng mật khẩu 1 lần
 * trên 1 thiết bị/trình duyệt là dùng được lâu dài, không phải nhập lại mỗi
 * lần mở trang, kể cả sau khi đóng hẳn trình duyệt (cookie thường, không
 * phải cookie phiên — khác sessionStorage, vốn mất ngay khi đóng tab/trình
 * duyệt nên KHÔNG dùng được cho yêu cầu "nhớ lâu dài" này). Mỗi thiết bị
 * vẫn phải tự nhập riêng 1 lần (cookie không chia sẻ giữa các trình duyệt/
 * thiết bị) — đúng bản chất, không phải thiếu sót. Hết hạn hoặc bị xoá
 * cookie thủ công thì phải nhập lại. */
export const PAYMENT_REQUEST_SESSION_MAX_AGE = 60 * 60 * 24 * 60;

/** Giá trị lưu trong cookie là HASH 1 chiều của mật khẩu (không phải mật
 * khẩu gốc) — phòng trường hợp cookie vô tình lộ qua log/devtools vẫn không
 * suy ngược lại được mật khẩu thật. */
export function paymentRequestSessionToken(): string {
  return createHash("sha256").update(PAYMENT_REQUEST_TOOL_PASSWORD).digest("hex");
}

export function isPaymentRequestPasswordCorrect(password: string): boolean {
  return password === PAYMENT_REQUEST_TOOL_PASSWORD;
}
