import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("binh-thanh-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/binh-thanh-cu" },
  title: "Văn Phòng Ảo Bình Thạnh (cũ) — 3 Chi Nhánh | MAX OFFICE",
  description:
    "3 chi nhánh MAX OFFICE tại khu vực Bình Thạnh (cũ): 161 Ung Văn Khiêm, 23 Tân Cảng và N1 Điện Biên Phủ, cùng Phường Thạnh Mỹ Tây. Văn phòng ảo từ 379.000đ/tháng (gói SILVER, GOLD, PREMIUM).",
};

const INTRO = [
  "Bình Thạnh (cũ) hiện có 3 chi nhánh MAX OFFICE, cùng thuộc Phường Thạnh Mỹ Tây: 161 Ung Văn Khiêm, 23 Tân Cảng và N1 Điện Biên Phủ — khu vực cửa ngõ Đông Bắc trung tâm thành phố, kết nối thuận tiện giữa trung tâm Quận 1 và khu vực phía Đông thành phố.",
  "161 Ung Văn Khiêm nằm gần giao lộ Hàng Xanh và kênh Nhiêu Lộc - Thị Nghè. 23 Tân Cảng toạ lạc tại DHT Building, gần ga Metro Tân Cảng thuộc tuyến Metro số 1 và không xa khu phức hợp Landmark 81, Vinhomes Central Park. Còn N1 Điện Biên Phủ có lợi thế mặt tiền trực tiếp trên trục đường Điện Biên Phủ — lưu ý đây là chi nhánh khác hoàn toàn với 2 chi nhánh cùng tên đường tại Quận 1 (cũ) và Quận 10 (cũ) của hệ thống MAX OFFICE.",
  "Cả 3 chi nhánh tại Bình Thạnh (cũ) đều dùng chung bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — được thiết kế để dùng chung cho các chi nhánh MAX OFFICE mở thêm sau này tại khu vực này, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh ở khu vực Bình Thạnh, hãy chọn 161 Ung Văn Khiêm nếu ưu tiên gần giao lộ Hàng Xanh, 23 Tân Cảng nếu ưu tiên gần ga Metro và khu vực Landmark 81, hoặc N1 Điện Biên Phủ nếu ưu tiên mặt tiền đường lớn dễ tìm — cả 3 đều là lựa chọn phù hợp tại khu vực Bình Thạnh (cũ) trong hệ thống MAX OFFICE.",
];

export default function BinhThanhCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Bình Thạnh (cũ)"
      heroDescription="3 địa chỉ cùng Phường Thạnh Mỹ Tây — 161 Ung Văn Khiêm, 23 Tân Cảng và N1 Điện Biên Phủ."
      intro={INTRO}
    />
  );
}
