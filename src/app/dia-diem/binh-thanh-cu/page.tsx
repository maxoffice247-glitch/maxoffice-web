import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("binh-thanh-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/binh-thanh-cu" },
  title: "Văn Phòng Ảo Bình Thạnh (cũ) — Chi Nhánh Ung Văn Khiêm | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Bình Thạnh (cũ): 161 Ung Văn Khiêm, Phường Thạnh Mỹ Tây. Văn phòng ảo từ 379.000đ/tháng (gói SILVER, GOLD, PREMIUM), gần giao lộ Hàng Xanh.",
};

const INTRO = [
  "Bình Thạnh (cũ) là khu vực mới nhất trong hệ thống MAX OFFICE, đánh dấu bằng chi nhánh đầu tiên tại 161 Ung Văn Khiêm, Phường Thạnh Mỹ Tây — khu vực cửa ngõ Đông Bắc trung tâm thành phố, không xa giao lộ Hàng Xanh và kênh Nhiêu Lộc - Thị Nghè. Đây là lựa chọn phù hợp cho doanh nghiệp cần một địa chỉ đăng ký kinh doanh trung chuyển giữa trung tâm Quận 1 và khu vực phía Đông thành phố.",
  "Chi nhánh đặt tại một cao ốc văn phòng nhiều tầng với mặt tiền kính hiện đại, đã có nhiều doanh nghiệp thuộc các lĩnh vực khác nhau đặt trụ sở. Từ đây, việc di chuyển về trung tâm Quận 1 hoặc qua cầu Sài Gòn sang khu vực phía Đông thành phố đều khá thuận tiện nhờ vị trí gần trục Điện Biên Phủ nối dài.",
  "Chi nhánh 161 Ung Văn Khiêm áp dụng bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — được thiết kế để dùng chung cho các chi nhánh MAX OFFICE mở thêm sau này tại khu vực Bình Thạnh, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh kết nối thuận tiện nhiều hướng mà không phải đặt văn phòng ngay khu trung tâm với chi phí cao hơn, chi nhánh 161 Ung Văn Khiêm là lựa chọn phù hợp tại khu vực Bình Thạnh (cũ) trong hệ thống MAX OFFICE.",
];

export default function BinhThanhCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Bình Thạnh (cũ)"
      heroDescription="Chi nhánh đầu tiên của khu vực — 161 Ung Văn Khiêm, gần giao lộ Hàng Xanh và kênh Nhiêu Lộc - Thị Nghè."
      intro={INTRO}
    />
  );
}
