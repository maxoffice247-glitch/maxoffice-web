import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import SetupCostTool from "@/components/tools/SetupCostTool";
import { ClockIcon, BadgePercentIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Công Cụ Tính Chi Phí Thành Lập Công Ty Miễn Phí | MAX OFFICE",
  description:
    "Tính nhanh chi phí thành lập Hộ kinh doanh, Công ty TNHH hoặc Công ty Cổ phần theo bảng giá mới nhất của MAX OFFICE — từ 800.000đ khi đăng ký kèm Văn phòng ảo.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Kết quả tức thì", desc: "Nhận ước tính chi phí thành lập chỉ sau vài giây điền thông tin." },
  { icon: BadgePercentIcon, title: "Giá cập nhật mới nhất", desc: "Áp dụng đúng bảng giá hiện hành, bao gồm ưu đãi khi kèm Văn phòng ảo." },
  { icon: ShieldCheckIcon, title: "Minh bạch, không phí ẩn", desc: "Chi phí hiển thị rõ ràng từng khoản mục, không phát sinh bất ngờ." },
  { icon: HeadsetIcon, title: "Tư vấn chọn đúng loại hình", desc: "Chuyên viên hỗ trợ tư vấn loại hình phù hợp với kế hoạch kinh doanh." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 800.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  { q: "Chi phí thành lập công ty có gì khác nhau giữa các loại hình?", a: "Hộ kinh doanh có chi phí thấp nhất, phù hợp mô hình nhỏ. Công ty TNHH và Cổ phần có chi phí cao hơn nhưng có tư cách pháp nhân, phù hợp mở rộng quy mô." },
  { q: "Đăng ký kèm Văn phòng ảo giúp tiết kiệm bao nhiêu?", a: "Mức giá kèm Văn phòng ảo thấp hơn đáng kể so với đăng ký thành lập riêng lẻ — ví dụ Hộ kinh doanh chỉ từ 800.000đ thay vì 1.000.000đ." },
  { q: "Lệ phí môn bài được tính như thế nào trong công cụ này?", a: "Công cụ áp dụng mức 300.000đ cho vốn điều lệ từ 10 tỷ đồng trở xuống, và 1.000.000đ/năm cho vốn trên 10 tỷ đồng." },
  { q: "Kế toán thuế trọn gói có bắt buộc phải đăng ký không?", a: "Không bắt buộc. Đây là dịch vụ tuỳ chọn thêm — bạn có thể chọn \"Có\" trong công cụ để xem chi phí ước tính." },
  { q: "Kết quả tính toán có phải báo giá chính thức không?", a: "Đây là ước tính tham khảo. Đội ngũ MAX OFFICE sẽ gửi báo giá chính xác sau khi tư vấn chi tiết theo ngành nghề và loại hình cụ thể." },
  { q: "Tôi chưa xác định vốn điều lệ thì phải làm sao?", a: "Bạn có thể nhập 0 hoặc một con số dự kiến — chuyên viên MAX OFFICE sẽ tư vấn mức vốn điều lệ phù hợp khi liên hệ tư vấn." },
];

export default function TinhChiPhiThanhLapPage() {
  return (
    <ToolPageTemplate
      heroTitle="Công cụ tính chi phí thành lập công ty"
      heroDescription="Chọn loại hình doanh nghiệp và điền thông tin để nhận ước tính chi phí thành lập theo bảng giá mới nhất — nhanh chóng, minh bạch."
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
