import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-tan-phu-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-tan-phu-cu" },
  title: "Văn Phòng Ảo Quận Tân Phú (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận Tân Phú (cũ): Tân Thắng và 79 Nguyễn Thế Truyện, cùng Phường Tân Sơn Nhì. Văn phòng ảo từ 199.000đ/tháng, gần Aeon Mall Tân Phú Celadon.",
};

const INTRO = [
  "Quận Tân Phú (cũ) hiện có 2 chi nhánh MAX OFFICE, cùng thuộc Phường Tân Sơn Nhì: Tân Thắng (121A-123-125 Tân Thắng) và 79 Nguyễn Thế Truyện — khu vực phát triển nhanh phía Tây TP.HCM, phục vụ nhu cầu văn phòng cho các doanh nghiệp hoạt động quanh khu Tân Phú và vùng lân cận.",
  "Tân Thắng nằm không xa Aeon Mall Tân Phú Celadon — một trong những trung tâm thương mại lớn phía Tây thành phố — phù hợp cho doanh nghiệp muốn kết hợp tiếp khách, mua sắm sau giờ làm. Trong khi đó, 79 Nguyễn Thế Truyện nằm trên tuyến đường đã hình thành nhiều toà nhà văn phòng cho thuê, ngay gần trụ sở UBND Phường Tân Sơn Nhì — thuận tiện cho doanh nghiệp cần xử lý thủ tục hành chính với chính quyền phường.",
  "Mỗi chi nhánh áp dụng một bảng giá văn phòng ảo riêng: Tân Thắng có 3 gói BASE, ORIGIN, ORIGIN+ (từ 500.000đ/tháng); 79 Nguyễn Thế Truyện có 3 gói LEAN, GROWING, SCALE-UP (từ 199.000đ/tháng), thiết kế theo từng giai đoạn phát triển doanh nghiệp — cả hai đều có không gian làm việc chung, phòng họp theo giờ, dịch vụ thành lập doanh nghiệp và kế toán thuế như các chi nhánh khác trong hệ thống.",
  "Nếu doanh nghiệp bạn cần một địa chỉ tại khu vực Tân Phú, hãy chọn Tân Thắng nếu ưu tiên gần trung tâm thương mại, hoặc 79 Nguyễn Thế Truyện nếu cần chi phí khởi điểm thấp hơn và ở gần trụ sở phường — cả hai đều là lựa chọn phù hợp tại khu vực Quận Tân Phú (cũ) trong hệ thống MAX OFFICE.",
];

export default function QuanTanPhuCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Tân Phú (cũ)"
      heroDescription="2 địa chỉ tại Phường Tân Sơn Nhì — Tân Thắng và 79 Nguyễn Thế Truyện."
      intro={INTRO}
    />
  );
}
