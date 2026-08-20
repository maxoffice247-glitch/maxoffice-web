import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("thu-duc-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/thu-duc-cu" },
  title: "Văn Phòng Ảo Tp. Thủ Đức (Cũ) — Chi Nhánh Phạm Văn Đồng | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Tp. Thủ Đức (Cũ): Phạm Văn Đồng. Văn phòng ảo từ 370.000đ/tháng (gói M-START, M-BASE, M-ORIGIN riêng biệt), gần các trường đại học lớn.",
};

const INTRO = [
  "Tp. Thủ Đức (Cũ) là khu vực cửa ngõ Đông Bắc TP.HCM, nơi MAX OFFICE đặt chi nhánh Phạm Văn Đồng — chi nhánh mới nhất và cũng là chi nhánh đầu tiên của hệ thống áp dụng bảng giá văn phòng ảo hoàn toàn riêng biệt. Khu vực này đang phát triển nhanh về dân số và hạ tầng trong những năm gần đây, kéo theo nhu cầu văn phòng đăng ký kinh doanh tăng đáng kể từ các doanh nghiệp vừa và nhỏ mới thành lập.",
  "Chi nhánh toạ lạc tại 1148A Phạm Văn Đồng, phường Thủ Đức — mặt tiền một trong những đại lộ hiện đại và rộng rãi bậc nhất thành phố, nối liền khu vực Gò Vấp, Bình Thạnh với Thủ Đức. Khu vực này tập trung nhiều trường đại học lớn như Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật — mang lại nguồn nhân lực trẻ dồi dào cho doanh nghiệp đặt văn phòng tại đây, đồng thời không xa sông Sài Gòn nên giữ được không gian thoáng đãng hơn nhiều khu vực nội thành khác.",
  "Chi nhánh đặt trong một toà nhà phong cách biệt thự tân cổ điển, cung cấp 3 gói văn phòng ảo riêng: M-START (370.000đ/tháng), M-BASE (500.000đ/tháng) và M-ORIGIN (800.000đ/tháng) — thiết kế phù hợp với đặc điểm không gian tại toà nhà này, kèm chính sách khuyến mãi riêng khi ký hợp đồng dài hạn.",
  "Nếu doanh nghiệp bạn cần địa chỉ tại khu vực Thủ Đức, gần các trường đại học lớn, hoặc đơn giản là muốn một không gian văn phòng ảo khác biệt, sang trọng hơn so với văn phòng truyền thống, chi nhánh Phạm Văn Đồng là lựa chọn phù hợp nhất trong hệ thống MAX OFFICE.",
];

export default function ThuDucCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Tp. Thủ Đức (Cũ)"
      heroDescription="Văn phòng ảo phong cách biệt thự sang trọng — chi nhánh Phạm Văn Đồng, cửa ngõ Đông Bắc thành phố."
      intro={INTRO}
    />
  );
}
