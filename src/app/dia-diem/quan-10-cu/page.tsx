import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-10-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-10-cu" },
  title: "Văn Phòng Ảo Quận 10 (cũ) — Chi Nhánh CMT8 | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 10 (cũ): CMT8, Phường Hoà Hưng. Văn phòng ảo từ 299.000đ/tháng, gần Ga Sài Gòn, kết nối nhanh Quận 1, Quận 3.",
};

const INTRO = [
  "Quận 10 (cũ) là khu vực MAX OFFICE có chi nhánh duy nhất mang tên CMT8, toạ lạc mặt tiền trục Cách Mạng Tháng 8 — một trong những tuyến đường lớn và huyết mạch bậc nhất khu vực trung tâm thành phố, nối liền Quận 1, Quận 3 với Quận 10 và Tân Bình. Dù chỉ có một địa điểm, chi nhánh này vẫn giữ vai trò quan trọng nhờ vị trí mặt tiền dễ tìm, phù hợp cho doanh nghiệp muốn có địa chỉ gần trung tâm mà không phải trả mức giá cao như khu vực Quận 1.",
  "Chi nhánh nằm tại phường Hoà Hưng, gần Ga Sài Gòn — nhà ga đường sắt trung tâm của thành phố — cùng nhiều bệnh viện, trường đại học lớn như Bệnh viện Nhân dân 115, Đại học Bách Khoa. Mật độ dân cư và hoạt động kinh doanh tại khu vực này luôn sôi động suốt cả ngày, tạo môi trường thuận lợi cho nhiều loại hình doanh nghiệp. Sự hiện diện của nhiều bệnh viện và trường đại học lớn quanh khu vực cũng tạo ra nhu cầu văn phòng ổn định từ các đơn vị cung cấp dịch vụ y tế, giáo dục và các ngành phụ trợ liên quan.",
  "Chi nhánh CMT8 cung cấp các gói văn phòng ảo LITE, START và BASE (từ 299.000đ/tháng) — mức giá kinh tế hơn so với khu vực Quận 1 nhưng vẫn giữ được vị trí gần trung tâm, phù hợp cho doanh nghiệp muốn tối ưu chi phí mà không phải đánh đổi về khả năng kết nối.",
  "Nếu doanh nghiệp bạn cần địa chỉ Quận 10 gần trung tâm, thuận tiện di chuyển bằng đường sắt hoặc đơn giản là muốn tiết kiệm chi phí so với khu vực Quận 1, chi nhánh CMT8 là lựa chọn phù hợp nhất trong hệ thống MAX OFFICE tại khu vực này.",
];

export default function Quan10CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 10 (cũ)"
      heroDescription="Địa chỉ kinh tế gần trung tâm thành phố — chi nhánh CMT8, gần Ga Sài Gòn."
      intro={INTRO}
    />
  );
}
