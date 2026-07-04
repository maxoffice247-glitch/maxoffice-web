import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SetupCostTool from "@/components/tools/SetupCostTool";
import { ClockIcon, BadgePercentIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Công Cụ Tính Chi Phí Thành Lập Công Ty Miễn Phí | MAX OFFICE",
  description:
    "Tính nhanh chi phí thành lập công ty theo Gói 1, Gói 2 và các dịch vụ pháp lý sửa đổi — từ 1.299.000đ khi đăng ký kèm Văn phòng ảo, áp dụng chung mọi loại hình.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Kết quả tức thì", desc: "Nhận ước tính chi phí thành lập chỉ sau vài giây điền thông tin." },
  { icon: BadgePercentIcon, title: "Giá cập nhật mới nhất", desc: "Áp dụng đúng bảng giá Gói 1/Gói 2 hiện hành, bao gồm ưu đãi khi kèm Văn phòng ảo." },
  { icon: ShieldCheckIcon, title: "Minh bạch, không phí ẩn", desc: "Chi phí hiển thị rõ ràng từng khoản mục, không phát sinh bất ngờ." },
  { icon: HeadsetIcon, title: "Tính cả dịch vụ sửa đổi", desc: "Cộng thêm dịch vụ pháp lý sửa đổi nếu cần, áp dụng đúng quy tắc ưu đãi combo." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  { q: "Gói 1 và Gói 2 khác nhau thế nào?", a: "Gói 1 gồm giấy chứng nhận đăng ký doanh nghiệp, con dấu, đăng bố cáo và mở tài khoản ngân hàng. Gói 2 bổ sung thêm hồ sơ khai thuế ban đầu, chữ ký số, hoá đơn điện tử và thông báo phát hành hoá đơn." },
  { q: "Chi phí có khác nhau giữa Hộ kinh doanh, TNHH và Cổ phần không?", a: "Không. Chi phí chỉ phụ thuộc vào gói dịch vụ bạn chọn (Gói 1 hoặc Gói 2), áp dụng chung cho mọi loại hình doanh nghiệp." },
  { q: "Đăng ký kèm Văn phòng ảo giúp tiết kiệm bao nhiêu?", a: "Gói 1 kèm Văn phòng ảo chỉ 1.299.000đ, thay vì 1.500.000đ nếu đăng ký riêng lẻ." },
  { q: "Dịch vụ pháp lý sửa đổi được tính thêm như thế nào?", a: "Nếu bạn chọn từ 2 dịch vụ sửa đổi trở lên, dịch vụ có giá trị lớn nhất tính giá đầy đủ, các dịch vụ còn lại được giảm giá — công cụ sẽ tự động áp dụng đúng quy tắc này." },
  { q: "Chi phí trên đã bao gồm lệ phí môn bài chưa?", a: "Từ 01/01/2026, lệ phí môn bài đã được bãi bỏ theo Nghị quyết 198/2025/QH15 nên công cụ không còn tính khoản này." },
  { q: "Kế toán thuế trọn gói có bắt buộc phải đăng ký không?", a: "Không bắt buộc. Đây là dịch vụ tuỳ chọn thêm — bạn có thể chọn \"Có\" trong công cụ để xem chi phí ước tính." },
  { q: "Kết quả tính toán có phải báo giá chính thức không?", a: "Đây là ước tính tham khảo. Đội ngũ MAX OFFICE sẽ gửi báo giá chính xác sau khi tư vấn chi tiết theo nhu cầu cụ thể." },
];

export default function TinhChiPhiThanhLapPage() {
  return (
    <ToolPageTemplate
      heroTitle="Công cụ tính chi phí thành lập công ty"
      heroDescription="Chọn gói dịch vụ và các dịch vụ pháp lý sửa đổi (nếu có) để nhận ước tính chi phí theo bảng giá mới nhất — nhanh chóng, minh bạch."
      breadcrumbLabel="Tính chi phí thành lập"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="chi phí thành lập công ty"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <SetupCostTool />
    </ToolPageTemplate>
  );
}
