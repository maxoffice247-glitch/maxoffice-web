import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-10-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-10-cu" },
  title: "Văn Phòng Ảo Quận 10 (cũ) — Chi Nhánh CMT8 | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 10 (cũ): CMT8, Phường Hoà Hưng. Văn phòng ảo từ 299.000đ/tháng (gói LITE, START, BASE), gần Ga Sài Gòn, kết nối nhanh Quận 1, Quận 3.",
};

const INTRO = [
  "Quận 10 (cũ) là nơi MAX OFFICE đặt chi nhánh CMT8, toạ lạc mặt tiền trục Cách Mạng Tháng 8 — một trong những tuyến đường lớn và huyết mạch bậc nhất khu vực trung tâm thành phố. Đây là chi nhánh duy nhất của hệ thống hiện đang hoạt động tại khu vực này.",
  "Chi nhánh nằm tại phường Hoà Hưng, gần Ga Sài Gòn — nhà ga đường sắt trung tâm của thành phố — cùng nhiều bệnh viện, trường đại học lớn như Bệnh viện Nhân dân 115, Đại học Bách Khoa. Mật độ dân cư và hoạt động kinh doanh tại khu vực này luôn sôi động suốt cả ngày, tạo môi trường thuận lợi cho nhiều loại hình doanh nghiệp, đặc biệt là các đơn vị cung cấp dịch vụ y tế, giáo dục và ngành phụ trợ liên quan.",
  "Chi nhánh cung cấp linh hoạt các gói văn phòng ảo LITE, START và BASE, từ 299.000đ/tháng — phù hợp cho nhiều quy mô doanh nghiệp, từ hộ kinh doanh cá thể mới thành lập đến công ty cần đầy đủ tiện ích hơn như phòng họp và không gian tiếp khách.",
  "Nếu doanh nghiệp bạn cần địa chỉ gần trung tâm với chi phí hợp lý hơn so với Quận 1, gần Ga Sài Gòn và các trường đại học, bệnh viện lớn, chi nhánh CMT8 là lựa chọn phù hợp tại khu vực Quận 10 (cũ) trong hệ thống MAX OFFICE.",
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
