import { NextResponse, type NextRequest } from "next/server";
import { PAYMENT_REQUEST_AUTH_COOKIE, paymentRequestSessionToken } from "@/lib/paymentRequestAuth";

/**
 * Next.js 16 đổi tên "Middleware" thành "Proxy" (file `middleware.ts` không
 * còn tác dụng, phải là `proxy.ts` với hàm export tên `proxy` — xác nhận
 * qua node_modules/next/dist/docs/.../proxy.md, đúng cảnh báo "breaking
 * changes" ở AGENTS.md).
 *
 * LÝ DO THỰC SỰ CẦN FILE NÀY (không chỉ gác cổng UI): đã TỰ KIỂM CHỨNG bằng
 * browser thật (cả `next dev` lẫn `next build && next start`) rằng chỉ
 * render có điều kiện <PaymentRequestTool/> trong 1 Server Component
 * (`if (!authed) return <PasswordGate/>`) KHÔNG đủ để ẩn dữ liệu — Next.js
 * vẫn chèn `<script src=".../chunk-chứa-PaymentRequestTool.js">` vào HTML
 * của NHÁNH CHƯA XÁC THỰC (client reference manifest được build tĩnh theo
 * TOÀN BỘ route, không theo nhánh render thực tế của từng request), và
 * chunk đó CHỨA NGUYÊN dữ liệu PAYMENT_REQUEST_COMPANIES (tên công
 * ty/MST/SĐT/số hợp đồng thật) vì paymentRequestData.ts được import vào
 * PaymentRequestTool.tsx cho phần xem trước phía client. Giả thiết ban đầu
 * "RSC chỉ gửi tham chiếu component thực sự render" là SAI trong trường hợp
 * này — đã phát hiện qua fetch() trực tiếp từng <script src> trên trang
 * CHƯA đăng nhập và thấy chunk đó chứa chuỗi "KOOLOG INTERNATIONAL".
 *
 * CÁCH SỬA ĐÚNG: rewrite (giữ nguyên URL trên thanh địa chỉ) sang 1 TRANG
 * KHÁC hẳn trong filesystem (de-nghi-thanh-toan-mat-bang-locked/page.tsx)
 * — trang đó không hề import PaymentRequestTool nên client reference
 * manifest của NÓ không bao giờ chứa chunk đó, hoàn toàn tách bạch với
 * trang thật ngay từ lúc build.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(PAYMENT_REQUEST_AUTH_COOKIE)?.value;
  if (cookie !== paymentRequestSessionToken()) {
    const url = request.nextUrl.clone();
    url.pathname = "/tien-ich/de-nghi-thanh-toan-mat-bang-locked";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/tien-ich/de-nghi-thanh-toan-mat-bang"],
};
