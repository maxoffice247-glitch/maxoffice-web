import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import GpkdEmbedTool from "@/components/tools/GpkdEmbedTool";
import { ClockIcon, DocumentCheckIcon, ScaleIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/soan-ho-so-doanh-nghiep" },
  title: "Soạn Hồ Sơ Doanh Nghiệp Tự Động - Công Cụ Miễn Phí | MAX OFFICE",
  description:
    "Điền thông tin, nhận ngay bộ hồ sơ soạn sẵn cho thành lập doanh nghiệp mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD và Mẫu số 12 — công cụ miễn phí từ MAX OFFICE, không cần chờ soạn thủ công.",
  // KHÔNG khai báo openGraph.images ở đây — trang này dùng opengraph-image.jpg
  // tĩnh (file convention của Next.js) cùng thư mục, xem giải thích tại
  // src/app/tien-ich/page.tsx.
};

const BENEFITS = [
  { icon: ClockIcon, title: "Tạo hồ sơ trong vài phút", desc: "Điền thông tin theo hướng dẫn, nhận ngay bộ hồ sơ soạn sẵn — không cần chờ nhân viên soạn thủ công." },
  { icon: ScaleIcon, title: "Áp dụng nhiều loại hồ sơ", desc: "Thành lập mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD, Mẫu số 12 — một công cụ cho nhiều nhu cầu." },
  { icon: DocumentCheckIcon, title: "Đủ 3 loại hình doanh nghiệp", desc: "Hỗ trợ Công ty TNHH 1 thành viên, TNHH 2 thành viên trở lên và Công ty cổ phần." },
  { icon: HeadsetIcon, title: "Tư vấn thêm miễn phí", desc: "Cần rà soát hồ sơ trước khi nộp cơ quan đăng ký kinh doanh? Liên hệ đội ngũ MAX OFFICE." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Công cụ này hỗ trợ soạn những loại hồ sơ nào?",
    a: "5 loại hồ sơ: thành lập doanh nghiệp mới, mở chi nhánh, chuyển nhượng vốn góp/cổ phần, thay đổi địa chỉ đăng ký kinh doanh (GPKD) và kê khai Mẫu số 12 — áp dụng cho Công ty TNHH 1 thành viên, TNHH 2 thành viên trở lên và Công ty cổ phần.",
  },
  {
    q: "Hồ sơ soạn ra có thể dùng để nộp trực tiếp cho cơ quan đăng ký kinh doanh không?",
    a: "Hồ sơ được soạn theo đúng biểu mẫu quy định hiện hành và có thể dùng để nộp. Với các trường hợp phức tạp (nhiều cổ đông, vốn góp bằng tài sản, ngành nghề có điều kiện...), MAX OFFICE khuyến nghị liên hệ đội ngũ tư vấn để rà soát trước khi nộp, tránh phải sửa đổi nhiều lần.",
  },
  {
    q: "Tôi có thể tìm lại hồ sơ đã soạn trước đó không?",
    a: "Có. Công cụ có mục \"Tìm lại hồ sơ đã soạn theo tên công ty\" ngay khi mở trang, giúp bạn tiếp tục chỉnh sửa hồ sơ đã lưu trước đó thay vì soạn lại từ đầu.",
  },
  {
    q: "Sử dụng công cụ này có mất phí không?",
    a: "Miễn phí hoàn toàn. Đây là công cụ hỗ trợ do MAX OFFICE cung cấp cho khách hàng tự soạn hồ sơ; nếu cần MAX OFFICE thực hiện trọn gói thủ tục (nộp hồ sơ, theo dõi kết quả), vui lòng liên hệ dịch vụ Thành lập doanh nghiệp.",
  },
  {
    q: "Vì sao công cụ hiển thị trong một khung nhúng thay vì mở trang mới?",
    a: "Để bạn không mất ngữ cảnh đang xem trên maxoffice.vn khi soạn hồ sơ. Toàn bộ thao tác (điền form, tải file) diễn ra ngay trong khung nhúng, dữ liệu được xử lý trực tiếp bởi hệ thống của MAX OFFICE.",
  },
];

export default function SoanHoSoDoanhNghiepPage() {
  return (
    <ToolPageTemplate
      heroImage="/images/ho-so-thanh-lap-cong-ty-tnhh.jpg"
      heroTitle="Soạn hồ sơ doanh nghiệp tự động"
      heroDescription="Điền thông tin theo hướng dẫn, nhận ngay bộ hồ sơ soạn sẵn cho thành lập mới, mở chi nhánh, chuyển nhượng vốn, đổi địa chỉ GPKD và Mẫu số 12 — miễn phí, không cần chờ soạn thủ công."
      breadcrumbLabel="Soạn hồ sơ doanh nghiệp"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="soạn hồ sơ doanh nghiệp tự động"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <GpkdEmbedTool />
    </ToolPageTemplate>
  );
}
