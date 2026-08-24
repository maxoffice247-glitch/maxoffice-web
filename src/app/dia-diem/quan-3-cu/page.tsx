import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-3-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-3-cu" },
  title: "Văn Phòng Ảo Quận 3 (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận 3 (cũ): 60 Nguyễn Thông và 520 Cách Mạng Tháng 8, cùng Phường Nhiêu Lộc. Văn phòng ảo 4 gói riêng từ 379.000đ/tháng, gần trung tâm Quận 1 (cũ).",
};

const INTRO = [
  "Quận 3 (cũ) hiện có 2 chi nhánh MAX OFFICE, cùng thuộc Phường Nhiêu Lộc: 60 Nguyễn Thông và 520 Cách Mạng Tháng 8 — cả hai chỉ cách ranh giới Quận 1 (cũ) một đoạn ngắn. Đây là khu vực trung tâm, quy tụ nhiều toà nhà văn phòng và trụ sở doanh nghiệp vừa và nhỏ lâu năm, phù hợp cho doanh nghiệp muốn có địa chỉ gần trung tâm hành chính, tài chính của thành phố mà không phải chịu mức giá cao nhất của khu lõi Quận 1.",
  "60 Nguyễn Thông nằm trên một tuyến phố nội bộ yên tĩnh, gần Bệnh viện Da Liễu Thành phố Hồ Chí Minh và dọc kênh Nhiêu Lộc - Thị Nghè — phù hợp cho doanh nghiệp ưu tiên không gian làm việc ổn định, ít ồn ào. Trong khi đó, 520 Cách Mạng Tháng 8 nằm ngay mặt tiền trục đường lớn, nhiều làn xe, dễ tìm và dễ nhận diện — phù hợp cho doanh nghiệp cần địa chỉ thuận tiện cho đối tác, khách hàng lần đầu ghé thăm. Lưu ý: 520 Cách Mạng Tháng 8 hoàn toàn khác với chi nhánh CMT8 tại khu vực Quận 10 (cũ), dù trùng tên đường.",
  "Cả 2 chi nhánh tại Quận 3 (cũ) đều dùng chung bảng giá văn phòng ảo riêng biệt gồm 4 gói — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — phân hoá theo nhu cầu sử dụng phòng họp, sảnh tiếp khách và các dịch vụ pháp lý đi kèm như hỗ trợ chuyển đổi địa chỉ trên giấy phép kinh doanh (từ gói GOLD) hay bộ hồ sơ pháp lý toà nhà (gói PREMIUM).",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh ở khu vực trung tâm, gần Quận 1 (cũ), hãy chọn 60 Nguyễn Thông nếu ưu tiên không gian yên tĩnh, hoặc 520 Cách Mạng Tháng 8 nếu ưu tiên vị trí mặt tiền dễ tìm — cả hai đều là lựa chọn phù hợp tại khu vực Quận 3 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan3CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 3 (cũ)"
      heroDescription="2 địa chỉ gần trung tâm thành phố — 60 Nguyễn Thông và 520 Cách Mạng Tháng 8, cùng Phường Nhiêu Lộc."
      intro={INTRO}
    />
  );
}
