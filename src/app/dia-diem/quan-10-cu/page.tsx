import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-10-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-10-cu" },
  title: "Văn Phòng Ảo Quận 10 (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận 10 (cũ): CMT8 (Phường Hoà Hưng) và 618 Ba Tháng Hai (Phường Diên Hồng). Văn phòng ảo từ 299.000đ/tháng, gần Ga Sài Gòn và vòng xoay Ngã Bảy.",
};

const INTRO = [
  "Quận 10 (cũ) hiện có 2 chi nhánh MAX OFFICE, thuộc 2 phường khác nhau: CMT8 tại Phường Hoà Hưng và 618 Ba Tháng Hai tại Phường Diên Hồng — nằm trên 2 trục đường lớn khác nhau của khu vực. Đây là lựa chọn phù hợp cho doanh nghiệp muốn đặt trụ sở gần trung tâm thành phố với chi phí hợp lý hơn khu lõi Quận 1.",
  "Chi nhánh CMT8 toạ lạc mặt tiền trục Cách Mạng Tháng 8, gần Ga Sài Gòn — nhà ga đường sắt trung tâm của thành phố. Trong khi đó, chi nhánh 618 Ba Tháng Hai đặt tại một cao ốc văn phòng mặt tiền kính hiện đại trên trục Ba Tháng Hai, gần vòng xoay Ngã Bảy và Đại học Bách Khoa TP.HCM — thuận tiện hơn cho doanh nghiệp cần kết nối sang Quận 5, Quận 11.",
  "2 chi nhánh dùng 2 bảng giá văn phòng ảo khác nhau: CMT8 áp dụng hệ LITE, START, BASE từ 299.000đ/tháng; còn 618 Ba Tháng Hai áp dụng hệ 3 gói riêng biệt SILVER, GOLD, PREMIUM từ 379.000đ/tháng (chưa VAT) — cùng bảng giá đang dùng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận, Quận 4 và Thủ Đức.",
  "Nếu doanh nghiệp bạn cần địa chỉ gần Ga Sài Gòn với chi phí khởi điểm thấp nhất, hãy chọn CMT8; nếu ưu tiên vị trí gần Đại học Bách Khoa và các trường/bệnh viện lớn, 618 Ba Tháng Hai sẽ phù hợp hơn — cả hai đều là lựa chọn tốt tại khu vực Quận 10 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan10CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 10 (cũ)"
      heroDescription="2 địa chỉ tại Quận 10 (cũ) — CMT8 (Phường Hoà Hưng) và 618 Ba Tháng Hai (Phường Diên Hồng)."
      intro={INTRO}
    />
  );
}
