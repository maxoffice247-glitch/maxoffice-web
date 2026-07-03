import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import LicenseFeeTool from "@/components/tools/LicenseFeeTool";
import { ClockIcon, BadgePercentIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Công Cụ Tính Lệ Phí Môn Bài Miễn Phí | MAX OFFICE",
  description:
    "Tính chính xác lệ phí môn bài phải đóng theo loại hình doanh nghiệp và vốn điều lệ. Kiểm tra điều kiện miễn lệ phí năm đầu tiên — miễn phí, có kết quả ngay.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Kết quả chính xác ngay", desc: "Nhập vốn điều lệ và ngày thành lập, nhận số tiền chính xác cần đóng." },
  { icon: BadgePercentIcon, title: "Kiểm tra điều kiện miễn phí", desc: "Tự động kiểm tra điều kiện miễn lệ phí môn bài năm đầu tiên." },
  { icon: ShieldCheckIcon, title: "Đúng quy định hiện hành", desc: "Áp dụng đúng mức lệ phí theo từng loại hình doanh nghiệp." },
  { icon: HeadsetIcon, title: "Hỗ trợ kê khai đúng hạn", desc: "MAX OFFICE hỗ trợ kê khai và nộp lệ phí đúng thời hạn quy định." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 800.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 800.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  { q: "Lệ phí môn bài là gì?", a: "Lệ phí môn bài là khoản lệ phí doanh nghiệp, hộ kinh doanh phải đóng hàng năm cho cơ quan thuế, mức đóng tuỳ theo vốn điều lệ hoặc loại hình hoạt động." },
  { q: "Doanh nghiệp mới thành lập có được miễn lệ phí môn bài không?", a: "Có. Doanh nghiệp thành lập trong khoảng thời gian từ 1/1 đến 30/6 được miễn 100% lệ phí môn bài trong năm đầu tiên." },
  { q: "Nếu thành lập từ tháng 7 đến tháng 12 thì sao?", a: "Trường hợp này không thuộc diện miễn lệ phí môn bài năm đầu tiên theo quy tắc đang áp dụng — bạn vẫn cần đóng mức lệ phí tương ứng." },
  { q: "Hộ kinh doanh có mức lệ phí môn bài cố định không?", a: "Có, hộ kinh doanh áp dụng mức lệ phí môn bài cố định 300.000đ/năm theo công cụ này." },
  { q: "Vốn điều lệ trên 10 tỷ đồng có mức lệ phí khác không?", a: "Có. Công ty có vốn điều lệ trên 10 tỷ đồng áp dụng mức lệ phí 1.000.000đ/năm, cao hơn mức 500.000đ/năm áp dụng cho vốn từ 10 tỷ trở xuống." },
  { q: "Tôi cần làm gì nếu chưa chắc chắn về mức lệ phí của mình?", a: "Hãy để lại thông tin trong form bên dưới để chuyên viên MAX OFFICE tư vấn chính xác theo tình huống cụ thể của doanh nghiệp bạn." },
];

export default function TinhLePhiMonBaiPage() {
  return (
    <ToolPageTemplate
      heroTitle="Công cụ tính lệ phí môn bài"
      heroDescription="Nhập loại hình doanh nghiệp và vốn điều lệ để biết chính xác mức lệ phí môn bài cần đóng, kèm kiểm tra điều kiện miễn phí năm đầu."
      breadcrumbLabel="Tính lệ phí môn bài"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="lệ phí môn bài"
      faqs={FAQS}
      defaultService="Kế toán & thuế"
    >
      <LicenseFeeTool />
    </ToolPageTemplate>
  );
}
