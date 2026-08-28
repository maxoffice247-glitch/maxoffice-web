import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("phu-nhuan-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/phu-nhuan-cu" },
  title: "Văn Phòng Ảo Phú Nhuận (cũ) — Chi Nhánh 89 Phan Đình Phùng | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Phú Nhuận (cũ): 89 Phan Đình Phùng, Phường Phú Nhuận. Văn phòng ảo từ 379.000đ/tháng (gói SILVER, GOLD, PREMIUM), gần chợ Phú Nhuận.",
};

const INTRO = [
  "Phú Nhuận (cũ) là khu vực mới nhất trong hệ thống MAX OFFICE, đánh dấu bằng chi nhánh đầu tiên tại 89 Phan Đình Phùng, Phường Phú Nhuận — khu vực trung tâm giáp ranh Quận 1, Quận 3, Bình Thạnh và Tân Bình. Đây là lựa chọn phù hợp cho doanh nghiệp cần một địa chỉ đăng ký kinh doanh trung chuyển thuận tiện giữa nhiều khu vực trung tâm thành phố.",
  "Chi nhánh đặt tại một cao ốc văn phòng nhiều tầng với mặt tiền kính hiện đại, sảnh lễ tân ốp đá sang trọng, đã có nhiều doanh nghiệp thuộc các lĩnh vực khác nhau đặt trụ sở. Từ đây, việc di chuyển sang Quận 1, Quận 3, Bình Thạnh hay ra sân bay Tân Sơn Nhất đều khá thuận tiện nhờ vị trí gần chợ Phú Nhuận và Cầu Kiệu.",
  "Chi nhánh 89 Phan Đình Phùng áp dụng bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh và Thủ Đức, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh ở vị trí trung tâm, kết nối thuận tiện nhiều hướng mà không phải đặt văn phòng ngay khu lõi với chi phí cao hơn, chi nhánh 89 Phan Đình Phùng là lựa chọn phù hợp tại khu vực Phú Nhuận (cũ) trong hệ thống MAX OFFICE.",
];

export default function PhuNhuanCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Phú Nhuận (cũ)"
      heroDescription="Chi nhánh đầu tiên của khu vực — 89 Phan Đình Phùng, gần chợ Phú Nhuận và Cầu Kiệu."
      intro={INTRO}
    />
  );
}
