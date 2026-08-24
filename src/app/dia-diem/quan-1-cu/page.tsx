import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-1-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-1-cu" },
  title: "Văn Phòng Ảo Quận 1 (cũ) — Chi Nhánh Điện Biên Phủ | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 1 (cũ): Điện Biên Phủ, Phường Tân Định. Văn phòng ảo, văn phòng trọn gói từ 350.000đ/tháng, địa chỉ uy tín trung tâm thành phố.",
};

const INTRO = [
  "Quận 1 (cũ) là khu vực trung tâm hành chính, tài chính và thương mại sầm uất bậc nhất TP.HCM — nơi MAX OFFICE đặt chi nhánh Điện Biên Phủ, được đánh giá là vị trí VIP nhất trong toàn hệ thống 18 địa điểm. Dù chỉ có một chi nhánh duy nhất, khu vực này vẫn đóng vai trò quan trọng — thường là lựa chọn của các doanh nghiệp đã có quy mô nhất định, cần nâng tầm hình ảnh thương hiệu.",
  "Chi nhánh toạ lạc tại số 95 Điện Biên Phủ, thuộc phường Tân Định — khu vực gắn liền với những địa danh quen thuộc của Sài Gòn như Nhà thờ Tân Định, chợ Tân Định và khu Đa Kao. Đây là lựa chọn hàng đầu cho doanh nghiệp muốn khẳng định vị thế ngay từ địa chỉ đăng ký kinh doanh, đặc biệt phù hợp với các ngành tư vấn, tài chính, pháp lý và công nghệ — nơi địa chỉ trụ sở góp phần thể hiện quy mô, độ tin cậy khi giao dịch với đối tác, nhà đầu tư.",
  "Từ chi nhánh, việc di chuyển đến các khu vực trung tâm lân cận như Quận 3, Bình Thạnh chỉ mất vài phút nhờ vị trí kết nối thuận lợi. Chi nhánh cung cấp gói văn phòng ảo START và BASE (từ 350.000đ/tháng) — không có phụ phí riêng cho vị trí trung tâm — cùng đầy đủ dịch vụ văn phòng trọn gói, phòng họp trang bị hiện đại phù hợp tiếp đối tác quan trọng, thành lập doanh nghiệp và kế toán thuế.",
  "Nếu doanh nghiệp bạn ưu tiên yếu tố hình ảnh, uy tín và khả năng tiếp cận nhanh khu trung tâm thành phố, chuẩn bị gọi vốn hoặc mở rộng hợp tác với đối tác nước ngoài, khu vực Quận 1 (cũ) với chi nhánh Điện Biên Phủ là lựa chọn phù hợp nhất trong hệ thống MAX OFFICE.",
];

export default function Quan1CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 1 (cũ)"
      heroDescription="Địa chỉ đăng ký kinh doanh đẳng cấp tại trung tâm hành chính, tài chính TP.HCM — chi nhánh Điện Biên Phủ, vị trí VIP nhất hệ thống."
      intro={INTRO}
    />
  );
}
