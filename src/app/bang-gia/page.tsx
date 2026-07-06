import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import BookingFormSection from "@/components/BookingFormSection";

export const metadata: Metadata = {
  title: "Bảng Giá Dịch Vụ MAX OFFICE - Minh Bạch, Không Phát Sinh",
  description:
    "Bảng giá chi tiết toàn bộ dịch vụ MAX OFFICE: văn phòng ảo, văn phòng trọn gói, coworking, phòng họp, thành lập doanh nghiệp, kế toán & thuế. Giá minh bạch, không phát sinh chi phí ẩn.",
};

const PRICING_FAQS = [
  {
    q: "Bảng giá niêm yết đã bao gồm VAT chưa?",
    a: "Bảng giá trên là giá dịch vụ. Đội ngũ tư vấn sẽ gửi báo giá chi tiết, đầy đủ các khoản trước khi bạn ký hợp đồng, đảm bảo không có bất ngờ về sau.",
  },
  {
    q: "Có phát sinh chi phí ẩn nào ngoài bảng giá không?",
    a: "Không. Mọi chi phí được nêu rõ trong hợp đồng trước khi bắt đầu sử dụng dịch vụ, không phát sinh thêm phí ẩn trong quá trình hợp tác.",
  },
  {
    q: "Giá ưu đãi thành lập doanh nghiệp kèm Văn phòng ảo áp dụng thế nào?",
    a: "Khi bạn đăng ký dịch vụ thành lập doanh nghiệp cùng lúc với Văn phòng ảo tại MAX OFFICE, thủ tục thành lập sẽ được áp dụng mức giá ưu đãi thấp hơn so với đăng ký riêng lẻ, theo đúng bảng giá ở trên.",
  },
  {
    q: "Tôi có thể thanh toán theo tháng hay theo năm?",
    a: "Bạn có thể chọn thanh toán theo tháng hoặc theo năm tuỳ nhu cầu. Đội ngũ tư vấn sẽ trao đổi cụ thể phương án phù hợp nhất khi bạn liên hệ.",
  },
  {
    q: "Tôi có thể đổi gói dịch vụ trong quá trình sử dụng không?",
    a: "Có. Bạn có thể nâng cấp hoặc thay đổi gói dịch vụ bất kỳ lúc nào để phù hợp với quy mô phát triển của doanh nghiệp.",
  },
  {
    q: "MAX OFFICE có xuất hoá đơn giá trị gia tăng không?",
    a: "Có. MAX OFFICE xuất hoá đơn đầy đủ cho tất cả dịch vụ đã sử dụng, thuận tiện cho việc hạch toán chi phí của doanh nghiệp bạn.",
  },
];

export default function PricingPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-bang-gia.png"
        eyebrow="Bảng giá"
        title="Mức giá minh bạch cho mọi giai đoạn phát triển"
        description="Không phát sinh chi phí ẩn. Xem đầy đủ bảng giá văn phòng, thành lập doanh nghiệp và kế toán thuế — chọn đúng gói cho nhu cầu hiện tại của bạn."
      />
      <Breadcrumb items={[{ label: "Bảng giá" }]} />
      <Pricing />
      <Faq
        id="bang-gia-faq"
        eyebrow="Câu hỏi về giá"
        title="Giải đáp thắc mắc về bảng giá"
        items={PRICING_FAQS}
      />
      <BookingFormSection
        sectionTitle="Nhận báo giá chi tiết cho nhu cầu của bạn"
        sectionDescription="Để lại thông tin, đội ngũ MAX OFFICE sẽ tư vấn gói dịch vụ phù hợp và sắp xếp lịch tham quan miễn phí."
        formType="Bảng giá"
      />
    </main>
  );
}
