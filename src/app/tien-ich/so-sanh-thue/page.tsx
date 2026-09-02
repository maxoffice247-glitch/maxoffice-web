import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import TaxComparisonTool from "@/components/tools/TaxComparisonTool";
import { ClockIcon, ScaleIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/so-sanh-thue" },
  title: "Công Cụ So Sánh Thuế TNCN vs Hộ Kinh Doanh 2026 | MAX OFFICE",
  description:
    "So sánh nhanh số thuế phải nộp giữa đóng thuế TNCN theo lương/tiền công và đăng ký hộ kinh doanh nộp thuế khoán theo % doanh thu — theo biểu thuế 5 bậc và tỷ lệ ngành nghề 2026.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Kết quả tức thì", desc: "Nhập thu nhập theo tháng, nhận ngay số thuế ước tính của cả 2 phương án." },
  { icon: ScaleIcon, title: "So sánh song song", desc: "Đối chiếu trực quan thuế TNCN và thuế hộ kinh doanh, kèm kết luận phương án lợi hơn." },
  { icon: ShieldCheckIcon, title: "Cập nhật biểu thuế 2026", desc: "Áp dụng đúng biểu thuế TNCN 5 bậc và tỷ lệ % thuế hộ kinh doanh mới nhất." },
  { icon: HeadsetIcon, title: "Tư vấn thêm miễn phí", desc: "Cần số liệu chính xác cho trường hợp cụ thể? Liên hệ đội ngũ MAX OFFICE." },
];

const RELATED_SERVICES = [
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Công cụ này dựa trên quy định thuế nào?",
    a: "Phương án TNCN áp dụng biểu thuế luỹ tiến 5 bậc theo Luật Thuế thu nhập cá nhân 2025 (Luật số 109/2025/QH15), hiệu lực kỳ tính thuế 2026. Phương án Hộ kinh doanh áp dụng tỷ lệ % thuế GTGT và TNCN theo nhóm ngành nghề theo Thông tư 69/2025/TT-BTC.",
  },
  {
    q: "Kết quả tính toán có chính xác 100% không?",
    a: "Không. Đây là công cụ ước tính tham khảo theo phương pháp tính đơn giản, chưa tính đến các trường hợp đặc biệt như nhiều nguồn thu nhập, chi phí được trừ hay ưu đãi thuế riêng. Vui lòng liên hệ đội ngũ tư vấn MAX OFFICE hoặc kế toán/luật sư để có số liệu chính xác cho trường hợp cụ thể của bạn.",
  },
  {
    q: "Doanh thu bao nhiêu thì hộ kinh doanh được miễn thuế?",
    a: "Hộ kinh doanh có doanh thu từ 1 tỷ đồng/năm trở xuống (khoảng 83.333.333đ/tháng) thuộc diện miễn thuế GTGT và thuế TNCN.",
  },
  {
    q: "Phương pháp tính theo % doanh thu áp dụng cho mọi mức doanh thu hộ kinh doanh?",
    a: "Không. Phương pháp khoán theo % doanh thu chỉ áp dụng khi doanh thu hộ kinh doanh từ 1 đến 3 tỷ đồng/năm. Trên 3 tỷ đồng/năm, hộ kinh doanh phải chuyển sang phương pháp tính thuế trên lợi nhuận (thuế suất khác) — công cụ sẽ hiển thị cảnh báo riêng nếu doanh thu bạn nhập vượt ngưỡng này.",
  },
  {
    q: "Số người phụ thuộc ảnh hưởng thế nào đến kết quả?",
    a: "Mỗi người phụ thuộc được giảm trừ gia cảnh 6.200.000đ/tháng khi tính thuế TNCN theo lương/tiền công, giúp giảm thu nhập tính thuế và số thuế phải nộp ở phương án 1. Phương án Hộ kinh doanh không áp dụng giảm trừ này.",
  },
];

export default function SoSanhThuePage() {
  return (
    <ToolPageTemplate
      heroImage="/images/hero-so-sanh-thue.png"
      heroTitle="So sánh thuế: TNCN vs Hộ kinh doanh"
      heroDescription="Nhập thu nhập hoặc doanh thu dự kiến theo tháng để so sánh nhanh số thuế phải nộp giữa 2 phương án — theo biểu thuế TNCN 5 bậc và tỷ lệ thuế hộ kinh doanh 2026."
      breadcrumbLabel="So sánh thuế"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="so sánh thuế TNCN và thuế hộ kinh doanh"
      faqs={FAQS}
      defaultService="Thành lập doanh nghiệp"
    >
      <TaxComparisonTool />
    </ToolPageTemplate>
  );
}
