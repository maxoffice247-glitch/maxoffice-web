import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-3-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-3-cu" },
  title: "Văn Phòng Ảo Quận 3 (cũ) — Chi Nhánh 60 Nguyễn Thông | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 3 (cũ): 60 Nguyễn Thông, Phường Nhiêu Lộc. Văn phòng ảo 4 gói riêng từ 379.000đ/tháng, gần trung tâm Quận 1 (cũ).",
};

const INTRO = [
  "Quận 3 (cũ) là khu vực mới nhất trong hệ thống MAX OFFICE, hiện có 1 chi nhánh mang tên 60 Nguyễn Thông, toạ lạc tại Phường Nhiêu Lộc — chỉ cách ranh giới Quận 1 (cũ) một đoạn ngắn. Đây là khu vực trung tâm, quy tụ nhiều toà nhà văn phòng và trụ sở doanh nghiệp vừa và nhỏ lâu năm, phù hợp cho doanh nghiệp muốn có địa chỉ gần trung tâm hành chính, tài chính của thành phố mà không phải chịu mức giá cao nhất của khu lõi Quận 1.",
  "Chi nhánh nằm trên đường Nguyễn Thông — một trong những tuyến phố yên tĩnh, ít kẹt xe của Quận 3 (cũ), gần Bệnh viện Da Liễu Thành phố Hồ Chí Minh và dọc kênh Nhiêu Lộc - Thị Nghè. Khu vực Phường Nhiêu Lộc có mật độ dân cư ổn định, nhiều cơ quan hành chính và trường học, tạo môi trường làm việc chuyên nghiệp, ổn định cho doanh nghiệp đặt văn phòng tại đây.",
  "Chi nhánh 60 Nguyễn Thông cung cấp 4 gói văn phòng ảo riêng biệt — SAVE (379.000đ/tháng), SILVER (479.000đ/tháng), GOLD (639.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — phân hoá theo nhu cầu sử dụng phòng họp, sảnh tiếp khách và các dịch vụ pháp lý đi kèm như hỗ trợ chuyển đổi địa chỉ trên giấy phép kinh doanh (từ gói GOLD) hay bộ hồ sơ pháp lý toà nhà (gói PREMIUM).",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh ở khu vực trung tâm, gần Quận 1 (cũ), với sảnh tiếp khách sang trọng và nhiều lựa chọn gói dịch vụ theo ngân sách, chi nhánh 60 Nguyễn Thông là lựa chọn phù hợp nhất tại khu vực Quận 3 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan3CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 3 (cũ)"
      heroDescription="Địa chỉ gần trung tâm thành phố — chi nhánh 60 Nguyễn Thông, Phường Nhiêu Lộc."
      intro={INTRO}
    />
  );
}
