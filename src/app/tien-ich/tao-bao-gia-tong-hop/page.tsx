import type { Metadata } from "next";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import CompositeQuoteTool from "@/components/tools/CompositeQuoteTool";
import { ClockIcon, WalletIcon, ShieldCheckIcon, HeadsetIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/tien-ich/tao-bao-gia-tong-hop" },
  title: "Tạo Báo Giá Tổng Hợp Nhiều Dịch Vụ - Miễn Phí | MAX OFFICE",
  description:
    "Chọn nhiều dịch vụ MAX OFFICE cùng lúc (Văn phòng ảo, Thành lập doanh nghiệp, Kế toán & thuế...), xuất ra 1 ảnh báo giá tổng hợp duy nhất để gửi khách hàng.",
  // KHÔNG khai báo openGraph.images ở đây — dùng opengraph-image.tsx động
  // cùng thư mục (renderOgImage()), cùng quy ước với mọi trang /tien-ich/*
  // khác (xem giải thích tại src/app/tien-ich/page.tsx).
};

const BENEFITS = [
  { icon: ClockIcon, title: "Gộp nhiều dịch vụ trong 1 ảnh", desc: "Không cần chụp/ghép nhiều ảnh báo giá riêng lẻ khi khách quan tâm từ 2 dịch vụ trở lên." },
  { icon: ShieldCheckIcon, title: "Giá luôn khớp bảng giá mới nhất", desc: "Văn phòng ảo, Thành lập doanh nghiệp và Kế toán & thuế được hệ thống tự tra giá, không gõ tay nên không lo sai lệch." },
  { icon: WalletIcon, title: "Rõ ràng theo từng đơn vị tính phí", desc: "Ảnh xuất ra tách riêng chi phí hàng tháng, chi phí một lần và chi phí theo giờ — khách không hiểu nhầm thành 1 tổng gộp." },
  { icon: HeadsetIcon, title: "Không lưu trữ thông tin khách hàng", desc: "Tên, số điện thoại, tên công ty dự kiến chỉ dùng để in lên ảnh báo giá, không được gửi hay lưu vào bất kỳ hệ thống nào." },
];

const RELATED_SERVICES = [
  { slug: "van-phong-ao", name: "Văn phòng ảo", desc: "Từ 299.000đ/tháng" },
  { slug: "thanh-lap-doanh-nghiep", name: "Thành lập doanh nghiệp", desc: "Từ 1.299.000đ kèm Văn phòng ảo" },
  { slug: "ke-toan-thue", name: "Kế toán & thuế", desc: "Từ 500.000đ/tháng" },
  { slug: "van-phong-tron-goi", name: "Văn phòng trọn gói", desc: "Từ 4.500.000đ/tháng" },
];

const FAQS = [
  {
    q: "Công cụ này dùng để làm gì?",
    a: "Dùng khi khách hàng quan tâm từ 2 dịch vụ trở lên cùng lúc (VD: thuê Văn phòng ảo và cần luôn dịch vụ Thành lập doanh nghiệp) — thay vì tạo 2-3 ảnh báo giá riêng lẻ cho từng dịch vụ, công cụ gộp tất cả vào 1 ảnh duy nhất để gửi khách.",
  },
  {
    q: "Giá hiển thị trên ảnh báo giá có chính xác không?",
    a: "Với Văn phòng ảo, Thành lập doanh nghiệp và Kế toán & thuế, giá được hệ thống tự tra theo đúng bảng giá đang áp dụng — không thể chỉnh sửa tay. Với Văn phòng trọn gói, Chỗ ngồi linh động và Phòng họp theo giờ (chưa có bảng giá cố định theo gói), người tạo báo giá tự nhập giá đã thống nhất với khách.",
  },
  {
    q: "Vì sao ảnh không có 1 dòng tổng cộng duy nhất cho tất cả dịch vụ?",
    a: "Vì các dịch vụ có đơn vị tính phí khác nhau — có dịch vụ tính theo tháng, có dịch vụ tính một lần (như phí thành lập doanh nghiệp), có dịch vụ tính theo giờ (phòng họp). Cộng chung các đơn vị khác nhau thành 1 con số sẽ gây hiểu nhầm, nên ảnh chỉ tổng riêng trong khối \"Chi phí hàng tháng\" — nơi các khoản cùng đơn vị.",
  },
  {
    q: "Thông tin khách hàng nhập vào có được lưu lại không?",
    a: "Không. Tên, số điện thoại và tên công ty dự kiến chỉ được dùng để in trực tiếp lên ảnh báo giá xuất ra — không có bước gửi hay lưu trữ nào vào hệ thống, khác hoàn toàn với form \"Nhận tư vấn miễn phí\" ở cuối trang.",
  },
  {
    q: "Ai có thể dùng công cụ này?",
    a: "Bất kỳ ai cần soạn báo giá nhiều dịch vụ MAX OFFICE cùng lúc — nhân viên tư vấn hoặc khách hàng tự tìm hiểu đều dùng được, không yêu cầu đăng nhập.",
  },
];

export default function TaoBaoGiaTongHopPage() {
  return (
    <ToolPageTemplate
      heroImage="/images/hero-bang-gia.jpg"
      heroTitle="Tạo báo giá tổng hợp"
      heroDescription="Chọn nhiều dịch vụ khác nhau, xuất ra 1 ảnh báo giá duy nhất để gửi khách hàng — không cần ghép nhiều ảnh báo giá riêng lẻ."
      breadcrumbLabel="Tạo báo giá tổng hợp"
      benefitsTitle="Vì sao nên dùng công cụ này"
      benefits={BENEFITS}
      relatedServices={RELATED_SERVICES}
      faqTopic="tạo báo giá tổng hợp nhiều dịch vụ"
      faqs={FAQS}
      defaultService="Khác"
    >
      <CompositeQuoteTool />
    </ToolPageTemplate>
  );
}
