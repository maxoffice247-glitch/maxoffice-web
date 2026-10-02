import type { Metadata } from "next";
import PasswordGate from "@/components/PasswordGate";

/**
 * Trang "KHOÁ" của công cụ "Đề nghị thanh toán" — src/proxy.ts rewrite MỌI
 * request CHƯA xác thực tới /tien-ich/de-nghi-thanh-toan-mat-bang sang
 * ĐÚNG trang này (giữ nguyên URL hiển thị trên thanh địa chỉ, chỉ đổi nội
 * dung thật sự được serve). CỐ Ý KHÔNG import PaymentRequestTool hay bất kỳ
 * gì từ paymentRequestData.ts ở đây — xem comment đầy đủ ở src/proxy.ts về
 * lý do: chỉ cách tách hẳn 2 trang filesystem riêng mới đảm bảo chunk JS
 * chứa dữ liệu công ty thật không bao giờ được tham chiếu/gửi xuống trình
 * duyệt khi chưa đăng nhập.
 *
 * Không tự redirect/kiểm tra cookie ở đây — route này không có gì nhạy cảm
 * để bảo vệ thêm (chỉ có form nhập mật khẩu), nếu ai đó đã đăng nhập mà lỡ
 * vào thẳng URL này cũng không sao, không phải lỗi.
 */
export const metadata: Metadata = {
  title: "Đề nghị thanh toán (nội bộ) | MAX OFFICE",
  description: "Công cụ nội bộ lập phiếu đề nghị thanh toán cho khách thuê sàn/phòng tại MAX Office.",
  robots: { index: false, follow: false },
};

export default function DeNghiThanhToanMatBangLockedPage() {
  return (
    <main>
      <PasswordGate
        authEndpoint="/api/payment-request-auth"
        title="Công cụ nội bộ — cần mật khẩu"
        description="Trang chứa thông tin khách thuê thật (MST, SĐT, số hợp đồng), chỉ dành cho nhân viên MAX OFFICE."
      />
    </main>
  );
}
