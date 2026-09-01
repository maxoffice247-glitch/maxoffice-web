import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-1-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-1-cu" },
  title: "Văn Phòng Ảo Quận 1 (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận 1 (cũ): Điện Biên Phủ và 36 Mạc Đĩnh Chi, cùng Phường Tân Định. Văn phòng ảo từ 350.000đ/tháng, địa chỉ uy tín trung tâm thành phố.",
};

const INTRO = [
  "Quận 1 (cũ) là khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM — nơi MAX OFFICE hiện có 2 chi nhánh, cùng thuộc Phường Tân Định: Điện Biên Phủ và 36 Mạc Đĩnh Chi. Đây là khu vực được đánh giá vị trí VIP nhất hệ thống, thường là lựa chọn của các doanh nghiệp đã có quy mô nhất định, cần nâng tầm hình ảnh thương hiệu.",
  "Điện Biên Phủ toạ lạc tại số 95 Điện Biên Phủ — khu vực gắn liền với những địa danh quen thuộc như Nhà thờ Tân Định, chợ Tân Định và khu Đa Kao, áp dụng gói START và BASE (từ 350.000đ/tháng) thuộc hệ LITE-RISE chung của MAX OFFICE. Trong khi đó, 36 Mạc Đĩnh Chi nằm trên trục đường gần Thảo Cầm Viên Sài Gòn và khu vực nhiều lãnh sự quán, áp dụng 4 gói SAVE/SILVER/GOLD/PREMIUM (từ 379.000đ/tháng) — bảng giá HOÀN TOÀN KHÁC, cùng hệ đang dùng tại 2 chi nhánh khu vực Quận 3 (cũ).",
  "Từ cả 2 chi nhánh, việc di chuyển đến các khu vực trung tâm lân cận như Quận 3, Bình Thạnh chỉ mất vài phút nhờ vị trí kết nối thuận lợi. Cả hai đều cung cấp đầy đủ dịch vụ văn phòng trọn gói, phòng họp trang bị hiện đại phù hợp tiếp đối tác quan trọng, thành lập doanh nghiệp và kế toán thuế — không có phụ phí riêng cho vị trí trung tâm.",
  "Nếu doanh nghiệp bạn ưu tiên yếu tố hình ảnh, uy tín và khả năng tiếp cận nhanh khu trung tâm thành phố, hãy chọn Điện Biên Phủ nếu cần gói giá phổ thông của hệ LITE-RISE, hoặc 36 Mạc Đĩnh Chi nếu phù hợp hơn với hệ giá SAVE/SILVER/GOLD/PREMIUM — cả hai đều là lựa chọn phù hợp tại khu vực Quận 1 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan1CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 1 (cũ)"
      heroDescription="2 địa chỉ cùng Phường Tân Định — Điện Biên Phủ và 36 Mạc Đĩnh Chi, vị trí VIP trung tâm hệ thống."
      intro={INTRO}
    />
  );
}
