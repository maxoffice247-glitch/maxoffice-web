import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-12-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-12-cu" },
  title: "Văn Phòng Ảo Quận 12 (cũ) — Chi Nhánh Trường Chinh | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 12 (cũ): 254 Trường Chinh, Phường Tân Hưng Thuận. Văn phòng ảo từ 299.000đ/tháng (gói CƠ BẢN, NÂNG CAO, CAO CẤP), mặt tiền đại lộ Trường Chinh 10 làn xe.",
};

const INTRO = [
  "Quận 12 (cũ) là khu vực MỚI NHẤT trong hệ thống MAX OFFICE, nơi công ty vừa đặt chi nhánh đầu tiên — 254 Trường Chinh, thuộc Phường Tân Hưng Thuận. Đây là khu vực cửa ngõ Tây Bắc TP.HCM, giáp Hóc Môn, với đại lộ Trường Chinh 10 làn xe chạy qua — trục giao thông lớn và sầm uất nhất khu vực.",
  "Chi nhánh 254 Trường Chinh toạ lạc ngay mặt tiền đại lộ, tại toà nhà văn phòng cao tầng mặt kính của Tập đoàn VSET Group, dễ nhận diện nhờ biển hiệu lớn ngay mặt tiền. Toà nhà có sảnh lễ tân ốp đá marble, phòng họp trang bị bàn dài cho các buổi họp đông người, cùng nhiều phòng làm việc riêng view cửa sổ thoáng đãng.",
  "Đây cũng là nơi MAX OFFICE lần đầu triển khai hệ giá 3 gói hoàn toàn mới — CƠ BẢN (299.000đ/tháng), NÂNG CAO (479.000đ/tháng) và CAO CẤP (779.000đ/tháng, giá chưa bao gồm VAT 10%) — khác với hệ LITE-RISE hay các hệ giá riêng khác đang áp dụng ở những khu vực còn lại của hệ thống.",
  "Với vị trí ngay cửa ngõ Tây Bắc thành phố, chi nhánh này phù hợp cho doanh nghiệp hoạt động ở khu vực Hóc Môn, Củ Chi hoặc phía Bắc Quận 12 cần một địa chỉ đăng ký kinh doanh thuận tiện mà không phải di chuyển vào tận trung tâm thành phố.",
];

export default function Quan12CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 12 (cũ)"
      heroDescription="Chi nhánh đầu tiên tại Quận 12 — 254 Trường Chinh, mặt tiền đại lộ 10 làn xe, cửa ngõ Tây Bắc TP.HCM."
      intro={INTRO}
    />
  );
}
