import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("phu-nhuan-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/phu-nhuan-cu" },
  title: "Văn Phòng Ảo Quận Phú Nhuận (cũ) — 3 Chi Nhánh | MAX OFFICE",
  description:
    "3 chi nhánh MAX OFFICE tại khu vực Quận Phú Nhuận (cũ): 89 Phan Đình Phùng (gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng), 68 Phan Đăng Lưu — toà nhà hạng A L'MAK 68 và 62 Trần Huy Liệu — toà nhà L'MAK The Venture (cả hai gói CORE/PLUS/PRO từ 499.000đ/tháng). Gần chợ Phú Nhuận, Cầu Kiệu và giao lộ Trần Huy Liệu - Nguyễn Văn Trỗi.",
};

const INTRO = [
  "Quận Phú Nhuận (cũ) hiện có 3 chi nhánh MAX OFFICE: 89 Phan Đình Phùng và 62 Trần Huy Liệu (cùng Phường Phú Nhuận), cùng 68 Phan Đăng Lưu (Phường Đức Nhuận) — đều thuộc khu vực trung tâm giáp ranh Quận 1, Quận 3, Bình Thạnh và Tân Bình. Ba địa chỉ nằm gần nhau quanh ngã tư Phú Nhuận nhưng trên ba tuyến phố khác nhau, và áp dụng hai bảng giá văn phòng ảo riêng biệt — bạn nên xác định rõ chi nhánh khi tra cứu hoặc đặt lịch tham quan.",
  "89 Phan Đình Phùng là chi nhánh mở đầu của khu vực, đặt tại một cao ốc văn phòng nhiều tầng mặt tiền kính hiện đại ngay trục Phan Đình Phùng, sảnh lễ tân ốp đá sang trọng. 68 Phan Đăng Lưu là chi nhánh thứ hai, đặt tại toà nhà hạng A L'MAK 68 — cao ốc kính nguyên khối với hệ lam đứng đặc trưng, sảnh marble và quầy tiếp tân riêng, do đơn vị ESTA Property Management vận hành. 62 Trần Huy Liệu là chi nhánh thứ 3, đặt tại toà nhà văn phòng L'MAK The Venture (còn gọi Betrimex Building) hạng C+, gần giao lộ Trần Huy Liệu - Nguyễn Văn Trỗi, sảnh có quầy lễ tân cong ốp màu đồng, khu sofa tiếp khách và cổng soát vé tự động.",
  "Ba chi nhánh dùng hai hệ giá KHÁC NHAU. 89 Phan Đình Phùng áp dụng 3 gói SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — cùng bảng giá đang dùng tại các chi nhánh khu vực Bình Thạnh và Thủ Đức. 68 Phan Đăng Lưu và 62 Trần Huy Liệu cùng áp dụng 3 gói CORE, PLUS (cùng 499.000đ/tháng) và PRO (899.000đ/tháng) thuộc hệ đối tác riêng — khác cả hệ thống LITE–RISE chung của MAX OFFICE lẫn hệ SILVER/GOLD/PREMIUM. Toàn bộ mức giá của cả ba chi nhánh đều chưa bao gồm thuế VAT 10%.",
  "Nếu doanh nghiệp bạn ưu tiên mức giá khởi điểm thấp và hệ gói SILVER/GOLD/PREMIUM quen thuộc, hãy chọn 89 Phan Đình Phùng. Nếu bạn cần địa chỉ trong toà nhà hạng A có đơn vị quản lý riêng, hoặc đang chuyển từ cá nhân/hộ kinh doanh lên công ty và muốn gói CORE kèm hỗ trợ thủ tục, hãy chọn 68 Phan Đăng Lưu hoặc 62 Trần Huy Liệu — hai nơi cùng giá, khác vị trí: một ở trục Phan Đăng Lưu, một gần giao lộ với Nguyễn Văn Trỗi. Cả ba đều là lựa chọn phù hợp tại khu vực Quận Phú Nhuận (cũ) trong hệ thống MAX OFFICE.",
];

export default function PhuNhuanCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Phú Nhuận (cũ)"
      heroDescription="3 địa chỉ quanh ngã tư Phú Nhuận — 89 Phan Đình Phùng, 68 Phan Đăng Lưu (toà nhà hạng A L'MAK 68) và 62 Trần Huy Liệu (toà nhà L'MAK The Venture), hai hệ giá riêng."
      intro={INTRO}
    />
  );
}
