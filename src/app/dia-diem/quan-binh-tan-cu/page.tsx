import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-binh-tan-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-binh-tan-cu" },
  title: "Văn Phòng Ảo Quận Bình Tân (cũ) — Chi Nhánh Vành Đai Trong | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận Bình Tân (cũ): 345 Vành Đai Trong, Phường An Lạc. Văn phòng ảo từ 600.000đ/tháng (gói BASIC, STANDARD, PRIME), toà nhà Phúc Thịnh Building mặt tiền Vành Đai Trong.",
};

const INTRO = [
  "Quận Bình Tân (cũ) là khu vực MỚI NHẤT trong hệ thống MAX OFFICE, nơi công ty vừa đặt chi nhánh đầu tiên — 345 Vành Đai Trong, thuộc Phường An Lạc. Đây là khu vực cửa ngõ Tây Nam TP.HCM, với đường Vành Đai Trong (thuộc tuyến Vành đai 2) chạy qua — trục giao thông kết nối thuận tiện sang Quận 1, Quận 6, Quận 8 và Bình Chánh.",
  "Chi nhánh 345 Vành Đai Trong toạ lạc ngay mặt tiền đường, tại toà nhà Phúc Thịnh Building, dễ nhận diện nhờ biển hiệu lớn ngay mặt tiền. Không gian có khu vực lễ tân và sảnh tiếp khách chung, phòng họp riêng cho các buổi trao đổi với đối tác, cùng khu vực chỗ ngồi làm việc thoáng đãng.",
  "Đây cũng là chi nhánh đầu tiên MAX OFFICE triển khai hệ giá 3 gói hoàn toàn mới — BASIC (600.000đ/tháng), STANDARD (800.000đ/tháng) và PRIME (1.000.000đ/tháng, giá chưa bao gồm VAT 10%) — khác với hệ LITE-RISE hay các hệ giá riêng khác đang áp dụng ở những khu vực còn lại của hệ thống. Gói STANDARD và PRIME có thêm hot desk miễn phí và quầy pantry phục vụ cafe, trà, nước.",
  "Với vị trí cửa ngõ Tây Nam thành phố, chi nhánh này phù hợp cho doanh nghiệp hoạt động ở khu vực Bình Tân, Bình Chánh hoặc cần một địa chỉ đăng ký kinh doanh thuận tiện di chuyển sang Quận 6, Quận 8 mà không phải di chuyển vào tận trung tâm thành phố.",
];

export default function QuanBinhTanCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Bình Tân (cũ)"
      heroDescription="Chi nhánh đầu tiên tại Bình Tân — 345 Vành Đai Trong, toà nhà Phúc Thịnh Building, mặt tiền Vành Đai Trong (Vành đai 2)."
      intro={INTRO}
    />
  );
}
