import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("phu-nhuan-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/phu-nhuan-cu" },
  title: "Văn Phòng Ảo Quận Phú Nhuận (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận Phú Nhuận (cũ): 89 Phan Đình Phùng (gói SILVER/GOLD/PREMIUM từ 379.000đ/tháng) và 68 Phan Đăng Lưu — toà nhà hạng A L'MAK 68 (gói CORE/PLUS/PRO từ 499.000đ/tháng). Hai hệ giá riêng, gần chợ Phú Nhuận và Cầu Kiệu.",
};

const INTRO = [
  "Quận Phú Nhuận (cũ) hiện có 2 chi nhánh MAX OFFICE: 89 Phan Đình Phùng (Phường Phú Nhuận) và 68 Phan Đăng Lưu (Phường Đức Nhuận) — cùng thuộc khu vực trung tâm giáp ranh Quận 1, Quận 3, Bình Thạnh và Tân Bình. Hai địa chỉ nằm gần nhau, chỉ cách một đoạn qua ngã tư Phú Nhuận, nhưng ở trên hai tuyến phố khác nhau và áp dụng hai bảng giá văn phòng ảo hoàn toàn riêng biệt — bạn nên xác định rõ chi nhánh khi tra cứu hoặc đặt lịch tham quan.",
  "89 Phan Đình Phùng là chi nhánh mở đầu của khu vực, đặt tại một cao ốc văn phòng nhiều tầng mặt tiền kính hiện đại ngay trục Phan Đình Phùng, sảnh lễ tân ốp đá sang trọng — phù hợp cho doanh nghiệp cần một địa chỉ trung chuyển thuận tiện giữa nhiều khu trung tâm. 68 Phan Đăng Lưu là chi nhánh thứ hai, đặt tại toà nhà hạng A L'MAK 68 — cao ốc kính nguyên khối với hệ lam đứng đặc trưng, sảnh marble, quầy tiếp tân riêng và bảng chỉ dẫn điện tử, do đơn vị ESTA Property Management vận hành chuyên nghiệp — phù hợp cho doanh nghiệp coi trọng hình ảnh khi đón tiếp đối tác.",
  "Hai chi nhánh dùng hai hệ giá KHÁC NHAU. 89 Phan Đình Phùng áp dụng 3 gói SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng) — cùng bảng giá đang dùng tại các chi nhánh khu vực Bình Thạnh và Thủ Đức, phân hoá theo thời lượng dùng phòng họp, sảnh tiếp khách và hỗ trợ pháp lý. 68 Phan Đăng Lưu áp dụng 3 gói CORE, PLUS (cùng 499.000đ/tháng) và PRO (899.000đ/tháng) thuộc hệ đối tác không gian LiteSpace — khác cả hệ thống LITE–RISE chung của MAX OFFICE lẫn hệ SILVER/GOLD/PREMIUM của 89 Phan Đình Phùng. Toàn bộ mức giá của cả hai chi nhánh đều chưa bao gồm thuế VAT 10%.",
  "Nếu doanh nghiệp bạn ưu tiên mức giá khởi điểm thấp và hệ gói SILVER/GOLD/PREMIUM quen thuộc, hãy chọn 89 Phan Đình Phùng. Nếu bạn cần địa chỉ mang hình ảnh của một toà nhà văn phòng hạng A có đơn vị quản lý riêng, hoặc đang chuyển từ cá nhân/hộ kinh doanh lên công ty và muốn gói CORE kèm hỗ trợ thủ tục, hãy chọn 68 Phan Đăng Lưu — cả hai đều là lựa chọn phù hợp tại khu vực Quận Phú Nhuận (cũ) trong hệ thống MAX OFFICE.",
];

export default function PhuNhuanCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Phú Nhuận (cũ)"
      heroDescription="2 địa chỉ gần ngã tư Phú Nhuận — 89 Phan Đình Phùng và 68 Phan Đăng Lưu (toà nhà hạng A L'MAK 68), hai hệ giá riêng."
      intro={INTRO}
    />
  );
}
