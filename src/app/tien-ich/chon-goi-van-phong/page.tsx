import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import OfficePackageTool from "@/components/tools/OfficePackageTool";
import { ClockIcon, BadgePercentIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Công Cụ Chọn Gói Văn Phòng Phù Hợp Miễn Phí | MAX OFFICE",
  description:
    "Trả lời 5 câu hỏi để nhận gợi ý gói văn phòng phù hợp nhất — văn phòng ảo, chỗ ngồi linh động, văn phòng trọn gói hoặc phòng họp. Miễn phí, có kết quả ngay.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Chỉ mất 1 phút", desc: "Trả lời 5 câu hỏi ngắn, nhận kết quả gợi ý ngay lập tức." },
  { icon: BadgePercentIcon, title: "Tối ưu chi phí", desc: "Tránh chọn gói dịch vụ thừa hoặc thiếu so với nhu cầu thực tế." },
  { icon: ShieldCheckIcon, title: "Dựa trên dữ liệu thực tế", desc: "Gợi ý dựa trên hơn 500 doanh nghiệp đã sử dụng dịch vụ MAX OFFICE." },
  { icon: HeadsetIcon, title: "Tư vấn miễn phí sau đó", desc: "Nhận thêm tư vấn chi tiết từ chuyên viên nếu cần." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "cho-ngoi-linh-dong", name: "Chỗ ngồi linh động", desc: "Từ 2.000.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
  { slug: "phong-hop", name: "Phòng họp theo giờ", desc: "Từ 150.000đ/giờ" },
];

const FAQS = [
  { q: "Công cụ này có tính phí không?", a: "Không. Đây là công cụ tư vấn miễn phí giúp bạn định hướng gói dịch vụ phù hợp trước khi liên hệ với MAX OFFICE." },
  { q: "Kết quả gợi ý có chính xác 100% không?", a: "Kết quả chỉ mang tính chất tham khảo dựa trên câu trả lời của bạn. Để có phương án chính xác nhất, hãy để lại thông tin để được tư vấn trực tiếp." },
  { q: "Tôi có thể làm lại bài kiểm tra nếu chưa hài lòng với kết quả không?", a: "Có. Bạn có thể nhấn \"Làm lại câu hỏi\" để thử lại với các câu trả lời khác bất kỳ lúc nào." },
  { q: "Nếu nhu cầu của tôi thay đổi sau này thì sao?", a: "Bạn có thể nâng cấp hoặc thay đổi gói dịch vụ bất kỳ lúc nào trong quá trình sử dụng tại MAX OFFICE." },
  { q: "Công cụ này có gợi ý dịch vụ thành lập doanh nghiệp không?", a: "Công cụ này tập trung vào gói không gian làm việc. Nếu bạn cần thành lập doanh nghiệp, hãy dùng công cụ \"Tính chi phí thành lập công ty\" của MAX OFFICE." },
  { q: "Sau khi có kết quả, tôi cần làm gì tiếp theo?", a: "Bạn có thể để lại thông tin trong form bên dưới hoặc gọi hotline để được tư vấn và đặt lịch tham quan miễn phí." },
];

export default function ChonGoiVanPhongPage() {
  return (
    <ToolPageTemplate
      heroTitle="Công cụ chọn gói văn phòng phù hợp"
      heroDescription="Trả lời 5 câu hỏi ngắn để nhận gợi ý gói văn phòng tối ưu nhất cho nhu cầu và ngân sách của bạn — hoàn toàn miễn phí."
      breadcrumbLabel="Chọn gói văn phòng"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="công cụ chọn gói văn phòng"
      faqs={FAQS}
      defaultService="Tư vấn chung"
    >
      <OfficePackageTool />
    </ToolPageTemplate>
  );
}
