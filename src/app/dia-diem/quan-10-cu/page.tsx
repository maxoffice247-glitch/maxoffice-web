import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-10-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-10-cu" },
  title: "Văn Phòng Ảo Quận 10 (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận 10 (cũ): CMT8 (Phường Hoà Hưng) và 314/6 Điện Biên Phủ (Phường Vườn Lài). Văn phòng ảo từ 299.000đ/tháng, gần Ga Sài Gòn, kết nối nhanh Quận 1, Quận 3.",
};

const INTRO = [
  "Quận 10 (cũ) hiện có 2 chi nhánh MAX OFFICE: CMT8, toạ lạc mặt tiền trục Cách Mạng Tháng 8 — một trong những tuyến đường lớn và huyết mạch bậc nhất khu vực trung tâm thành phố; và 314/6 Điện Biên Phủ tại Phường Vườn Lài, chi nhánh mới nhất trong khu vực, cung cấp gói văn phòng ảo V-START riêng biệt. Lưu ý: chi nhánh 314/6 Điện Biên Phủ hoàn toàn khác với văn phòng \"Điện Biên Phủ, Quận 1\" ở khu vực Quận 1 (cũ) — hai địa chỉ chỉ trùng tên đường.",
  "Chi nhánh CMT8 nằm tại phường Hoà Hưng, gần Ga Sài Gòn — nhà ga đường sắt trung tâm của thành phố — cùng nhiều bệnh viện, trường đại học lớn như Bệnh viện Nhân dân 115, Đại học Bách Khoa. Mật độ dân cư và hoạt động kinh doanh tại khu vực này luôn sôi động suốt cả ngày, tạo môi trường thuận lợi cho nhiều loại hình doanh nghiệp, đặc biệt là các đơn vị cung cấp dịch vụ y tế, giáo dục và ngành phụ trợ liên quan.",
  "Chi nhánh 314/6 Điện Biên Phủ nằm trên đoạn đường Điện Biên Phủ nối dài thuộc Phường Vườn Lài, toà nhà mặt tiền hiện đại có tiệm bánh & cà phê ngay tầng trệt — một tiện ích nhỏ nhưng hữu ích cho khách hàng ghé giao dịch. Chi nhánh chỉ cung cấp duy nhất gói V-START (380.000đ/tháng), thiết kế gọn nhẹ cho doanh nghiệp mới thành lập cần tối ưu chi phí ban đầu.",
  "Cả 2 chi nhánh đều thuận tiện di chuyển đến khu vực trung tâm Quận 1, Quận 3 và không xa nhau trong cùng khu vực Quận 10 (cũ). Nếu doanh nghiệp bạn cần địa chỉ gần trung tâm với chi phí hợp lý hơn so với Quận 1, hãy chọn CMT8 nếu ưu tiên các gói LITE/START/BASE linh hoạt, hoặc 314/6 Điện Biên Phủ nếu chỉ cần gói cơ bản, tiết kiệm nhất.",
];

export default function Quan10CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 10 (cũ)"
      heroDescription="2 địa chỉ kinh tế gần trung tâm thành phố — CMT8 gần Ga Sài Gòn, 314/6 Điện Biên Phủ tại Phường Vườn Lài."
      intro={INTRO}
    />
  );
}
