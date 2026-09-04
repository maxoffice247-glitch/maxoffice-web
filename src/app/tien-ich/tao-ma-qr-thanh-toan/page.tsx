import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import QrEmbedTool from "@/components/tools/QrEmbedTool";
import { ClockIcon, WalletIcon, ScaleIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/tao-ma-qr-thanh-toan" },
  title: "Tạo Mã QR Thanh Toán Tự Động (VietQR) - Miễn Phí | MAX OFFICE",
  description:
    "Tạo mã QR VietQR để nhận thanh toán nhanh chóng, miễn phí — công cụ tự động từ MAX OFFICE, dùng được cho bất kỳ mục đích thanh toán nào, không giới hạn khách hàng của MAX OFFICE.",
  // KHÔNG khai báo openGraph.images ở đây — trang này dùng opengraph-image.tsx
  // động (renderOgImage(), logo+overlay) cùng thư mục, xem giải thích tại
  // src/app/tien-ich/page.tsx. qr.maxoffice.vn hoàn toàn không có sẵn
  // meta-description/OG image riêng (khác GPKD đã có og-gpkd.jpg) nên
  // metadata + OG image của trang này đều tự soạn mới hoàn toàn.
};

const BENEFITS = [
  { icon: ClockIcon, title: "Tạo mã QR trong vài giây", desc: "Nhập số tiền và nội dung chuyển khoản, nhận ngay mã QR để gửi cho người thanh toán." },
  { icon: WalletIcon, title: "Chuẩn VietQR liên ngân hàng", desc: "Mã QR tạo ra tương thích với hầu hết app ngân hàng và ví điện tử tại Việt Nam." },
  { icon: ScaleIcon, title: "Dùng cho mọi mục đích", desc: "Không giới hạn khách hàng MAX OFFICE — ai cũng dùng được để nhận thanh toán, thu tiền dịch vụ, quyên góp..." },
  { icon: HeadsetIcon, title: "Tư vấn thêm miễn phí", desc: "Cần hỗ trợ về thanh toán, đối soát cho doanh nghiệp? Liên hệ đội ngũ MAX OFFICE." },
];

const RELATED_SERVICES = [
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Ai có thể sử dụng công cụ tạo mã QR thanh toán này?",
    a: "Bất kỳ ai, không giới hạn khách hàng đang sử dụng dịch vụ của MAX OFFICE. Bạn có thể dùng để nhận thanh toán cho bất kỳ mục đích nào — thu tiền dịch vụ, bán hàng, quyên góp...",
  },
  {
    q: "Mã QR tạo ra có tương thích với app ngân hàng nào?",
    a: "Mã QR theo chuẩn VietQR (Napas 247), tương thích với hầu hết ứng dụng ngân hàng và ví điện tử phổ biến tại Việt Nam — người thanh toán chỉ cần mở app ngân hàng, quét mã và xác nhận.",
  },
  {
    q: "Sử dụng công cụ này có mất phí không?",
    a: "Miễn phí hoàn toàn. Đây là công cụ tiện ích do MAX OFFICE cung cấp, không thu phí tạo mã QR hay phí giao dịch.",
  },
  {
    q: "Tiền thanh toán qua mã QR này có đi vào tài khoản của MAX OFFICE không?",
    a: "Không. Mã QR được tạo theo thông tin tài khoản ngân hàng do chính bạn nhập vào công cụ — tiền thanh toán đi thẳng vào tài khoản bạn chỉ định, MAX OFFICE không thu giữ hay trung gian dòng tiền này.",
  },
  {
    q: "Vì sao công cụ hiển thị trong một khung nhúng thay vì mở trang mới?",
    a: "Để bạn không mất ngữ cảnh đang xem trên maxoffice.vn khi tạo mã QR. Toàn bộ thao tác diễn ra ngay trong khung nhúng, dữ liệu được xử lý trực tiếp bởi hệ thống của MAX OFFICE.",
  },
];

export default function TaoMaQrThanhToanPage() {
  return (
    <ToolPageTemplate
      // Ảnh riêng cho trang này (tay quét mã QR bằng điện thoại) — khớp
      // chủ đề trực tiếp hơn hẳn ảnh dùng tạm ban đầu (hero-bang-gia.jpg,
      // chỉ liên quan gián tiếp qua chủ đề "giá/thanh toán"). Không dùng
      // ảnh này cho opengraph-image.tsx: cùng lý do đã áp dụng cho trang
      // Soạn hồ sơ doanh nghiệp — tỉ lệ ảnh gốc rộng hơn chuẩn OG 1.91:1
      // nên sẽ bị crop 2 bên trên mạng xã hội; giữ nguyên OG tự sinh qua
      // renderOgImage() (logo + tiêu đề + overlay) đã đúng chuẩn OG.
      heroImage="/images/hero-tao-ma-qr-thanh-toan.png"
      heroTitle="Tạo mã QR thanh toán tự động"
      heroDescription="Tạo mã QR VietQR để nhận thanh toán nhanh chóng, miễn phí — dùng được cho bất kỳ mục đích thanh toán nào, không giới hạn khách hàng của MAX OFFICE."
      breadcrumbLabel="Tạo mã QR thanh toán"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="tạo mã QR thanh toán tự động"
      faqs={FAQS}
      defaultService="Kế toán & thuế"
    >
      <QrEmbedTool />
    </ToolPageTemplate>
  );
}
