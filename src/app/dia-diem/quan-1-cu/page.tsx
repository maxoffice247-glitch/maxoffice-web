import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-1-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-1-cu" },
  title: "Văn Phòng Ảo Quận 1 (cũ) — 5 Chi Nhánh | MAX OFFICE",
  description:
    "5 chi nhánh MAX OFFICE tại khu vực Quận 1 (cũ): Điện Biên Phủ, 36 Mạc Đĩnh Chi, 28-34 Pasteur, 159C Đề Thám và 36 Bùi Thị Xuân. Văn phòng ảo từ 350.000đ/tháng, địa chỉ uy tín trung tâm thành phố.",
};

const INTRO = [
  "Quận 1 (cũ) là khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM — nơi MAX OFFICE hiện có 5 chi nhánh: Điện Biên Phủ, 36 Mạc Đĩnh Chi (cùng Phường Tân Định), 28-34 Pasteur (Phường Sài Gòn), 159C Đề Thám (Phường Cầu Ông Lãnh) và 36 Bùi Thị Xuân (Phường Bến Thành — chi nhánh đầu tiên của toàn hệ thống tại phường này). Đây là khu vực được đánh giá vị trí VIP nhất hệ thống, thường là lựa chọn của các doanh nghiệp đã có quy mô nhất định, cần nâng tầm hình ảnh thương hiệu.",
  "Điện Biên Phủ toạ lạc tại số 95 Điện Biên Phủ — khu vực gắn liền với những địa danh quen thuộc như Nhà thờ Tân Định, chợ Tân Định và khu Đa Kao, áp dụng gói START và BASE (từ 350.000đ/tháng) thuộc hệ LITE-RISE chung của MAX OFFICE. 36 Mạc Đĩnh Chi nằm trên trục đường gần Thảo Cầm Viên Sài Gòn và khu vực nhiều lãnh sự quán. 28-34 Pasteur nằm ngay lõi trung tâm, gần chợ Bến Thành và phố đi bộ Nguyễn Huệ. 159C Đề Thám nằm ngay trong khu Phố Tây Đề Thám - Bùi Viện - Phạm Ngũ Lão, phù hợp đặc biệt cho doanh nghiệp du lịch, lữ hành. 36 Mạc Đĩnh Chi, 28-34 Pasteur và 159C Đề Thám cùng áp dụng 3 gói SILVER/GOLD/PREMIUM (từ 479.000đ/tháng) — bảng giá HOÀN TOÀN KHÁC với Điện Biên Phủ, cùng hệ đang dùng tại 2 chi nhánh khu vực Quận 3 (cũ). Riêng 36 Bùi Thị Xuân áp dụng gói STANDARD DUY NHẤT (500.000đ/tháng), tiện ích tối giản đúng nhu cầu cơ bản — một hệ giá riêng biệt, khác cả hai hệ trên.",
  "Từ cả 5 chi nhánh, việc di chuyển đến các khu vực trung tâm lân cận như Quận 3, Bình Thạnh chỉ mất vài phút nhờ vị trí kết nối thuận lợi. Cả năm đều cung cấp đầy đủ dịch vụ văn phòng trọn gói, phòng họp trang bị hiện đại phù hợp tiếp đối tác quan trọng, thành lập doanh nghiệp và kế toán thuế — không có phụ phí riêng cho vị trí trung tâm.",
  "Nếu doanh nghiệp bạn ưu tiên yếu tố hình ảnh, uy tín và khả năng tiếp cận nhanh khu trung tâm thành phố, hãy chọn Điện Biên Phủ nếu cần gói giá phổ thông của hệ LITE-RISE, 36 Mạc Đĩnh Chi/28-34 Pasteur/159C Đề Thám nếu phù hợp hơn với hệ giá SILVER/GOLD/PREMIUM (chọn theo khu vực gần Thảo Cầm Viên, gần chợ Bến Thành, hay ngay khu Phố Tây), hoặc 36 Bùi Thị Xuân nếu chỉ cần một địa chỉ đăng ký kinh doanh với chi phí tối ưu nhất — cả năm đều là lựa chọn phù hợp tại khu vực Quận 1 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan1CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 1 (cũ)"
      heroDescription="5 địa chỉ trung tâm — Điện Biên Phủ, 36 Mạc Đĩnh Chi, 28-34 Pasteur, 159C Đề Thám và 36 Bùi Thị Xuân, vị trí VIP trung tâm hệ thống."
      intro={INTRO}
    />
  );
}
