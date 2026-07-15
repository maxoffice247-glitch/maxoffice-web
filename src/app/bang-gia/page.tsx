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
    a: "Bảng giá trên CHƯA bao gồm thuế VAT 10%. Đội ngũ tư vấn sẽ gửi báo giá chi tiết, đầy đủ các khoản (bao gồm VAT) trước khi bạn ký hợp đồng, đảm bảo không có bất ngờ về sau.",
  },
  {
    q: "Có phát sinh chi phí ẩn nào ngoài bảng giá không?",
    a: "Không. Mọi chi phí được nêu rõ trong hợp đồng trước khi bắt đầu sử dụng dịch vụ, không phát sinh thêm phí ẩn trong quá trình hợp tác.",
  },
  {
    q: "Giá ưu đãi thành lập doanh nghiệp kèm Văn phòng ảo áp dụng thế nào?",
    a: "Ưu đãi áp dụng cụ thể theo từng chi nhánh:\n- Tại Sông Thao: khách ký hợp đồng Văn phòng ảo từ gói START (350.000đ/tháng) trở lên, thời hạn 2 năm, được TẶNG 100% phí dịch vụ thành lập doanh nghiệp, hoặc tặng 100% phí đổi địa chỉ trụ sở về Sông Thao (áp dụng 1 trong 2, tuỳ nhu cầu khách hàng).\n- Tại các chi nhánh còn lại: khách ký hợp đồng Văn phòng ảo từ gói BASE (500.000đ/tháng) trở lên, thời hạn 1 năm, được TẶNG 100% phí dịch vụ thành lập doanh nghiệp, hoặc tặng 100% phí đổi địa chỉ trụ sở về đúng chi nhánh đang thuê (áp dụng 1 trong 2, tuỳ nhu cầu khách hàng).\n\nLiên hệ đội ngũ tư vấn để được hướng dẫn cụ thể theo đúng chi nhánh và gói dịch vụ bạn quan tâm.",
  },
  {
    q: "Tôi có thể thanh toán theo tháng hay theo năm?",
    a: "Phương thức thanh toán tuỳ theo từng dịch vụ:\n- Văn phòng ảo: hợp đồng tối thiểu 6 tháng, thanh toán theo chu kỳ 6 tháng/lần. Ký hợp đồng 1 năm hoặc 2 năm sẽ có thêm ưu đãi (xem chi tiết tại mục Khuyến mãi trong trang Văn phòng ảo).\n- Văn phòng trọn gói: linh hoạt thanh toán theo tháng, quý hoặc năm, tuỳ lựa chọn của khách hàng.\n- Thành lập doanh nghiệp: thanh toán theo gói dịch vụ đã chọn (thanh toán 1 lần khi ký).\n- Kế toán & thuế: thanh toán theo quý.",
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
        image="/images/hero-bang-gia.jpg"
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
