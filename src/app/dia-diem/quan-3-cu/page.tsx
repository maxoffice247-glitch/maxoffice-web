import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-3-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-3-cu" },
  title: "Văn Phòng Ảo Quận 3 (cũ) — 3 Chi Nhánh | MAX OFFICE",
  description:
    "3 chi nhánh MAX OFFICE tại khu vực Quận 3 (cũ): 60 Nguyễn Thông, 520 Cách Mạng Tháng 8 (cùng Phường Nhiêu Lộc) và 198 Nguyễn Thị Minh Khai (Phường Xuân Hòa). Văn phòng ảo từ 479.000đ/tháng, gần trung tâm Quận 1 (cũ).",
};

const INTRO = [
  "Quận 3 (cũ) hiện có 3 chi nhánh MAX OFFICE: 60 Nguyễn Thông và 520 Cách Mạng Tháng 8 cùng thuộc Phường Nhiêu Lộc, cùng 198 Nguyễn Thị Minh Khai thuộc Phường Xuân Hòa — cả ba đều chỉ cách ranh giới Quận 1 (cũ) một đoạn ngắn. Đây là khu vực trung tâm, quy tụ nhiều toà nhà văn phòng và trụ sở doanh nghiệp vừa và nhỏ lâu năm, phù hợp cho doanh nghiệp muốn có địa chỉ gần trung tâm hành chính, tài chính của thành phố mà không phải chịu mức giá cao nhất của khu lõi Quận 1.",
  "60 Nguyễn Thông nằm trên một tuyến phố nội bộ yên tĩnh, gần Bệnh viện Da Liễu Thành phố Hồ Chí Minh và dọc kênh Nhiêu Lộc - Thị Nghè — phù hợp cho doanh nghiệp ưu tiên không gian làm việc ổn định, ít ồn ào. 520 Cách Mạng Tháng 8 nằm ngay mặt tiền trục đường lớn, nhiều làn xe, dễ tìm và dễ nhận diện — phù hợp cho doanh nghiệp cần địa chỉ thuận tiện cho đối tác, khách hàng lần đầu ghé thăm (lưu ý: hoàn toàn khác với chi nhánh CMT8 tại khu vực Quận 10 (cũ), dù trùng tên đường). Trong khi đó, 198 Nguyễn Thị Minh Khai đặt tại một toà nhà văn phòng hạng B có bề dày lịch sử, ngay trục đường nối liền Quận 1 và Quận 3, gần Hồ Con Rùa và Công viên Tao Đàn.",
  "60 Nguyễn Thông và 520 Cách Mạng Tháng 8 dùng chung bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%). Riêng 198 Nguyễn Thị Minh Khai áp dụng một bảng giá đối tác khác — 3 gói CORE, PLUS (499.000đ/tháng) và PRO (899.000đ/tháng) — cùng hệ đang dùng tại 28 Mai Chí Thọ (Thủ Đức) và 68 Phan Đăng Lưu (Phú Nhuận cũ), khác hoàn toàn với 2 chi nhánh còn lại trong khu vực.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh ở khu vực trung tâm, gần Quận 1 (cũ), hãy chọn 60 Nguyễn Thông nếu ưu tiên không gian yên tĩnh, 520 Cách Mạng Tháng 8 nếu ưu tiên vị trí mặt tiền dễ tìm, hoặc 198 Nguyễn Thị Minh Khai nếu phù hợp hơn với hệ giá CORE/PLUS/PRO và muốn một toà nhà văn phòng có thương hiệu — cả ba đều là lựa chọn phù hợp tại khu vực Quận 3 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan3CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 3 (cũ)"
      heroDescription="3 địa chỉ gần trung tâm thành phố — 60 Nguyễn Thông, 520 Cách Mạng Tháng 8 và 198 Nguyễn Thị Minh Khai."
      intro={INTRO}
    />
  );
}
