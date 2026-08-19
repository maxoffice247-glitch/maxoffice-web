import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-tan-phu-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-tan-phu-cu" },
  title: "Văn Phòng Ảo Quận Tân Phú (cũ) — Chi Nhánh Tân Thắng | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận Tân Phú (cũ): Tân Thắng, Phường Tân Sơn Nhì. Văn phòng ảo từ 500.000đ/tháng, gần Aeon Mall Tân Phú Celadon.",
};

const INTRO = [
  "Quận Tân Phú (cũ) là khu vực phát triển nhanh phía Tây TP.HCM, nơi MAX OFFICE đặt chi nhánh Tân Thắng tại 121A-123-125 Tân Thắng, phường Tân Sơn Nhì. Đây là chi nhánh duy nhất của hệ thống tại khu vực này, phục vụ nhu cầu văn phòng cho các doanh nghiệp hoạt động quanh khu Tân Phú và vùng lân cận.",
  "Khu vực Tân Sơn Nhì nằm không xa Aeon Mall Tân Phú Celadon — một trong những trung tâm thương mại lớn phía Tây thành phố — cùng nhiều khu dân cư mới được quy hoạch hiện đại. Môi trường xung quanh mang tính hiện đại, trẻ trung hơn so với nhiều chi nhánh truyền thống khác của MAX OFFICE, phù hợp với các doanh nghiệp công nghệ, thương mại điện tử hoặc startup mới thành lập cần không gian làm việc năng động. Đây cũng là khu vực có nhiều doanh nghiệp trẻ, nên đội ngũ tại chi nhánh Tân Thắng thường xuyên hỗ trợ tư vấn các thủ tục pháp lý cơ bản cho nhóm khách hàng mới khởi nghiệp.",
  "Chi nhánh Tân Thắng cung cấp các gói văn phòng ảo BASE, ORIGIN và ORIGIN+ (từ 500.000đ/tháng), cùng không gian làm việc chung (coworking), phòng họp theo giờ, dịch vụ thành lập doanh nghiệp và kế toán thuế — đầy đủ như các chi nhánh khác trong hệ thống MAX OFFICE.",
  "Từ chi nhánh, việc di chuyển sang khu vực Tân Bình hoặc trung tâm thành phố khá thuận tiện qua trục đường Tân Sơn Nhì. Nếu doanh nghiệp bạn cần một địa chỉ tại khu vực Tân Phú với môi trường hiện đại, gần trung tâm thương mại lớn và khu dân cư mới, chi nhánh Tân Thắng là lựa chọn phù hợp nhất trong hệ thống.",
];

export default function QuanTanPhuCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Tân Phú (cũ)"
      heroDescription="Văn phòng ảo hiện đại gần Aeon Mall Tân Phú — chi nhánh Tân Thắng."
      intro={INTRO}
    />
  );
}
