import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import PlanFinderTool from "@/components/tools/PlanFinderTool";
import { ClockIcon, ScaleIcon, TagIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/tim-goi-phu-hop" },
  title: "Tìm VPA Theo Nhu Cầu - Công Cụ Chọn Văn Phòng Ảo Phù Hợp | MAX OFFICE",
  description:
    "Chọn khu vực và ngân sách mong muốn, nhận ngay danh sách gói văn phòng ảo phù hợp trong 23 chi nhánh MAX OFFICE — kèm giá, tính năng, ảnh mặt tiền và báo giá tải về.",
};

const BENEFITS = [
  { icon: ClockIcon, title: "Kết quả tức thì", desc: "Chọn khu vực và ngân sách, nhận ngay danh sách gói phù hợp không cần chờ tư vấn." },
  { icon: ScaleIcon, title: "So sánh toàn hệ thống", desc: "Đối chiếu cùng lúc 23 chi nhánh, dữ liệu giá đúng bảng giá hiện hành của từng chi nhánh." },
  { icon: TagIcon, title: "Gợi ý khi không khớp ngân sách", desc: "Không tìm được gói đúng ngân sách? Công cụ tự gợi ý lựa chọn gần nhất." },
  { icon: HeadsetIcon, title: "Tải báo giá ngay", desc: "Xuất ảnh báo giá đầy đủ thông tin để lưu hoặc gửi cho đối tác, không cần chờ nhân viên soạn." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Công cụ này lấy dữ liệu giá từ đâu?",
    a: "Toàn bộ giá và tính năng lấy trực tiếp từ bảng giá chính thức đang áp dụng tại từng chi nhánh MAX OFFICE, cập nhật đồng bộ với trang chi tiết từng chi nhánh — không phải giá ước tính.",
  },
  {
    q: "Nếu không có gói nào khớp đúng ngân sách tôi chọn thì sao?",
    a: "Công cụ sẽ hiển thị rõ thông báo không có gói khớp chính xác, đồng thời gợi ý gói/chi nhánh có mức giá gần ngân sách bạn chọn nhất — kể cả ở khu vực khác nếu có lựa chọn tốt hơn.",
  },
  {
    q: "Giá hiển thị đã bao gồm VAT chưa?",
    a: "Chưa. Toàn bộ giá hiển thị trên công cụ là giá chưa bao gồm thuế VAT 10%, đúng theo quy ước niêm yết chung của MAX OFFICE.",
  },
  {
    q: "Ảnh báo giá tải về dùng để làm gì?",
    a: "Ảnh báo giá tổng hợp đầy đủ tên chi nhánh, địa chỉ, tên gói, giá và tính năng đi kèm ở định dạng phù hợp xem trên điện thoại — tiện lưu lại hoặc gửi cho đối tác, người ra quyết định tham khảo nhanh.",
  },
  {
    q: "Tôi có thể liên hệ tư vấn trực tiếp từ trang chi tiết gói không?",
    a: "Có. Mỗi trang chi tiết gói đều có nút \"Liên hệ tư vấn ngay\" dẫn thẳng đến form tư vấn với chi nhánh đã được chọn sẵn.",
  },
];

export default function TimGoiPhuHopPage() {
  return (
    <ToolPageTemplate
      heroTitle="Tìm VPA theo nhu cầu"
      heroDescription="Chọn khu vực và ngân sách mong muốn — công cụ gợi ý ngay các gói phù hợp trong toàn bộ 23 chi nhánh MAX OFFICE, kèm giá, tính năng và ảnh mặt tiền thực tế."
      breadcrumbLabel="Tìm VPA theo nhu cầu"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="tìm gói văn phòng ảo phù hợp"
      faqs={FAQS}
      defaultService="Văn phòng ảo"
    >
      <PlanFinderTool />
    </ToolPageTemplate>
  );
}
