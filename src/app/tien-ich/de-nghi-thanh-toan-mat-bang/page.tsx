import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import PaymentRequestTool from "@/components/tools/PaymentRequestTool";
import { isPaymentRequestAuthed } from "@/lib/paymentRequestAuthServer";

const LOCKED_PATH = "/tien-ich/de-nghi-thanh-toan-mat-bang-locked";

/**
 * Trang công cụ NỘI BỘ "Đề nghị thanh toán" — KHÔNG dùng ToolPageTemplate
 * (khác mọi trang /tien-ich/* khác): ToolPageTemplate luôn kèm theo nội dung
 * marketing công khai (benefits/dịch vụ liên quan/FAQ) và 1 form "Nhận tư
 * vấn miễn phí" tạo LEAD thật — không phù hợp cho 1 công cụ nội bộ dùng để
 * lập phiếu cho khách thuê sàn/phòng đã ký hợp đồng (không phải khách tiềm
 * năng cần tư vấn). Vẫn dùng PageHero + Breadcrumb riêng lẻ (thay vì tự bịa
 * cách canh lề mới) để không phải tự kiểm chứng lại khoảng cách với header
 * cố định (fixed) — mọi trang khác trong site đều ghép 2 component này
 * cùng nhau, chưa trang nào dùng Breadcrumb đứng một mình.
 *
 * CỐ Ý KHÔNG đăng ký vào src/lib/toolsData.ts (TOOL_GROUPS) — xem comment
 * đầu src/lib/paymentRequestData.ts: dropdown công cụ này lộ MST/SĐT/số hợp
 * đồng của 5 công ty thuê THẬT, nhạy cảm hơn hẳn các công cụ /tien-ich/*
 * công khai khác (chỉ hiện giá/tài khoản của chính MAX OFFICE). Vì không có
 * trong TOOL_GROUPS, trang này KHÔNG xuất hiện ở menu desktop, trang
 * /tien-ich, hay sitemap.xml (TOOL_SLUGS trong sitemap.ts đọc từ
 * TOOL_GROUPS) — chỉ truy cập được qua đúng URL trực tiếp này.
 * `robots: noindex` thêm 1 lớp chắn nữa phòng trường hợp URL bị lộ/crawl
 * được qua đường khác (VD link nội bộ vô tình public).
 *
 * LỚP MẬT KHẨU — VIỆC GÁC CỔNG THẬT SỰ NẰM Ở src/proxy.ts (rewrite request
 * CHƯA xác thực sang trang khoá riêng, đọc comment ở đó để biết lý do: chỉ
 * if/else render trong CÙNG 1 file KHÔNG đủ, đã tự kiểm chứng bằng browser
 * thật). `redirect()` ở đây CHỈ là lớp phòng thủ thứ 2 (phòng trường hợp
 * matcher của proxy cấu hình sai/bị bỏ qua) — khi gọi, Next.js dừng render
 * ngay lập tức và trả về response redirect thuần, KHÔNG render tiếp phần
 * còn lại của component (bao gồm <PaymentRequestTool/>) nên vẫn an toàn dù
 * đứng chung file.
 */
export const metadata: Metadata = {
  title: "Đề nghị thanh toán (nội bộ) | MAX OFFICE",
  description: "Công cụ nội bộ lập phiếu đề nghị thanh toán cho khách thuê sàn/phòng tại MAX Office.",
  robots: { index: false, follow: false },
};

export default async function DeNghiThanhToanMatBangPage() {
  const authed = await isPaymentRequestAuthed();
  if (!authed) {
    redirect(LOCKED_PATH);
  }

  return (
    <main>
      <PageHero
        image="/images/hero-tao-ma-qr-thanh-toan.jpg"
        eyebrow="Công cụ nội bộ"
        title="Đề nghị thanh toán"
        description="Lập phiếu đề nghị thanh toán cho khách thuê sàn/phòng tại MAX Office — thay quy trình nhập tay trên Google Sheets."
      />
      <Breadcrumb items={[{ label: "Đề nghị thanh toán (nội bộ)" }]} />
      <PaymentRequestTool />
    </main>
  );
}
