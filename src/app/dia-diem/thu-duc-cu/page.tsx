import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("thu-duc-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/thu-duc-cu" },
  title: "Văn Phòng Ảo Tp. Thủ Đức (Cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Tp. Thủ Đức (Cũ): Phạm Văn Đồng và 27C Quốc Hương (Phường An Khánh). Văn phòng ảo từ 370.000đ/tháng, gần các trường đại học lớn và khu Thảo Điền.",
};

const INTRO = [
  "Tp. Thủ Đức (Cũ) là khu vực cửa ngõ Đông Bắc TP.HCM, nơi MAX OFFICE hiện có 2 chi nhánh: Phạm Văn Đồng và 27C Quốc Hương. Khu vực này trải dài từ phường Thủ Đức đến phường An Khánh — phần đất từng thuộc Quận 2 (cũ) trước khi chính thức sáp nhập vào TP. Thủ Đức từ năm 2021, trước cả đợt sáp nhập phường toàn TP.HCM năm 2025 — nên cả hai chi nhánh đều được xếp chung một khu vực trên hệ thống MAX OFFICE.",
  "Chi nhánh Phạm Văn Đồng toạ lạc tại 1148A Phạm Văn Đồng, phường Thủ Đức — mặt tiền một trong những đại lộ hiện đại và rộng rãi bậc nhất thành phố, gần nhiều trường đại học lớn như Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật. Trong khi đó, chi nhánh 27C Quốc Hương toạ lạc tại Bảo Thiện Building, phường An Khánh — ngay khu Thảo Điền sầm uất, tập trung nhiều chuyên gia nước ngoài và doanh nghiệp quốc tế, gần cầu Sài Gòn để kết nối sang khu vực Bình Thạnh và trung tâm Quận 1.",
  "Chi nhánh Phạm Văn Đồng cung cấp 3 gói văn phòng ảo riêng: M-START (370.000đ/tháng), M-BASE (500.000đ/tháng) và M-ORIGIN (800.000đ/tháng). Chi nhánh 27C Quốc Hương áp dụng bảng giá SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh.",
  "Nếu doanh nghiệp bạn cần địa chỉ gần các trường đại học lớn, hãy chọn Phạm Văn Đồng; nếu ưu tiên khu vực quốc tế hoá, sầm uất gần Thảo Điền, 27C Quốc Hương là lựa chọn phù hợp — cả hai đều là lựa chọn đáng cân nhắc tại khu vực Thủ Đức (cũ) trong hệ thống MAX OFFICE.",
];

export default function ThuDucCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Tp. Thủ Đức (Cũ)"
      heroDescription="2 địa chỉ — Phạm Văn Đồng và 27C Quốc Hương, cửa ngõ Đông Bắc thành phố đến khu Thảo Điền."
      intro={INTRO}
    />
  );
}
