import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import LicenseFeeTool from "@/components/tools/LicenseFeeTool";
import { CheckCircleIcon, BadgePercentIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Lệ Phí Môn Bài Đã Bãi Bỏ Từ 2026 - Cập Nhật Mới Nhất | MAX OFFICE",
  description:
    "Từ 01/01/2026, lệ phí môn bài đã chính thức bãi bỏ theo Nghị quyết 198/2025/QH15, áp dụng cho mọi loại hình doanh nghiệp, hộ kinh doanh. Cập nhật quy định mới nhất từ MAX OFFICE.",
};

const BENEFITS = [
  { icon: CheckCircleIcon, title: "Cập nhật đúng luật hiện hành", desc: "Thông tin theo Nghị quyết 198/2025/QH15, có hiệu lực từ 01/01/2026." },
  { icon: BadgePercentIcon, title: "Áp dụng cho mọi loại hình", desc: "Doanh nghiệp, hợp tác xã, hộ kinh doanh và cá nhân kinh doanh đều được miễn." },
  { icon: ShieldCheckIcon, title: "Không cần nộp tờ khai", desc: "Từ 2026, doanh nghiệp không còn phải kê khai hay nộp lệ phí môn bài." },
  { icon: HeadsetIcon, title: "Hỗ trợ tư vấn thuế khác", desc: "MAX OFFICE hỗ trợ tư vấn các nghĩa vụ thuế, phí khác doanh nghiệp cần lưu ý." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  { q: "Lệ phí môn bài đã bị bãi bỏ chưa?", a: "Đã bãi bỏ. Từ ngày 01/01/2026, lệ phí môn bài chính thức bãi bỏ theo Nghị quyết 198/2025/QH15 (Điều 10, Khoản 7)." },
  { q: "Quy định này áp dụng cho những loại hình nào?", a: "Áp dụng cho tất cả loại hình: doanh nghiệp (TNHH, Cổ phần, tư nhân), hợp tác xã, hộ kinh doanh và cá nhân kinh doanh." },
  { q: "Doanh nghiệp có cần nộp tờ khai lệ phí môn bài nữa không?", a: "Không. Từ 01/01/2026, doanh nghiệp và hộ kinh doanh không còn phải nộp tờ khai lệ phí môn bài." },
  { q: "Doanh nghiệp thành lập trước 2026 thì sao?", a: "Quy định bãi bỏ áp dụng từ 01/01/2026 cho tất cả doanh nghiệp, hộ kinh doanh đang hoạt động, không phân biệt thời điểm thành lập." },
  { q: "Vậy các khoản thuế, phí nào doanh nghiệp vẫn cần nộp?", a: "Doanh nghiệp vẫn cần thực hiện đầy đủ các nghĩa vụ thuế khác như thuế GTGT, thuế TNDN, thuế TNCN... Hãy liên hệ MAX OFFICE để được tư vấn chi tiết theo tình huống cụ thể." },
  { q: "Tôi cần tư vấn thêm về thuế thì làm gì?", a: "Hãy để lại thông tin trong form bên dưới để chuyên viên MAX OFFICE tư vấn miễn phí về các nghĩa vụ thuế hiện hành của doanh nghiệp bạn." },
];

export default function TinhLePhiMonBaiPage() {
  return (
    <ToolPageTemplate
      heroTitle="Lệ phí môn bài đã bãi bỏ từ 2026"
      heroDescription="Cập nhật quy định mới nhất theo Nghị quyết 198/2025/QH15 — doanh nghiệp, hộ kinh doanh không còn phải nộp lệ phí môn bài."
      breadcrumbLabel="Lệ phí môn bài"
      benefitsTitle="Những điều cần biết về quy định mới"
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
