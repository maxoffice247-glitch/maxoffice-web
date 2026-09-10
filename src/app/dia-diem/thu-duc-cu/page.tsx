import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("thu-duc-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/thu-duc-cu" },
  title: "Văn Phòng Ảo Thành phố Thủ Đức (cũ) — 3 Chi Nhánh | MAX OFFICE",
  description:
    "3 chi nhánh MAX OFFICE tại khu vực Thành phố Thủ Đức (cũ): Phạm Văn Đồng, 27C Quốc Hương và 28 Mai Chí Thọ. Văn phòng ảo từ 370.000đ/tháng, gần các trường đại học lớn, khu Thảo Điền và Thủ Thiêm.",
};

const INTRO = [
  "Thành phố Thủ Đức (cũ) là khu vực cửa ngõ Đông Bắc TP.HCM, nơi MAX OFFICE hiện có 3 chi nhánh: Phạm Văn Đồng, 27C Quốc Hương và 28 Mai Chí Thọ. Khu vực này trải dài từ phường Thủ Đức đến phường An Khánh — phần đất từng thuộc Quận 2 (cũ) trước khi chính thức sáp nhập vào TP. Thủ Đức từ năm 2021, trước cả đợt sáp nhập phường toàn TP.HCM năm 2025 — nên cả ba chi nhánh đều được xếp chung một khu vực trên hệ thống MAX OFFICE.",
  "Chi nhánh Phạm Văn Đồng toạ lạc tại 1148A Phạm Văn Đồng, phường Thủ Đức — mặt tiền một trong những đại lộ hiện đại và rộng rãi bậc nhất thành phố, gần nhiều trường đại học lớn như Đại học Quốc gia TP.HCM, Đại học Nông Lâm, Đại học Sư phạm Kỹ thuật. Chi nhánh 27C Quốc Hương toạ lạc tại Bảo Thiện Building, phường An Khánh — ngay khu Thảo Điền sầm uất, tập trung nhiều chuyên gia nước ngoài và doanh nghiệp quốc tế. Chi nhánh 28 Mai Chí Thọ cũng thuộc phường An Khánh nhưng nằm ngay mặt tiền đại lộ Mai Chí Thọ (tuyến đại lộ Đông Tây), hướng thẳng ra hầm Thủ Thiêm và khu đô thị mới Thủ Thiêm.",
  "Ba chi nhánh áp dụng ba bảng giá khác nhau: Phạm Văn Đồng có 3 gói M-START (370.000đ/tháng), M-BASE (500.000đ/tháng) và M-ORIGIN (800.000đ/tháng); 27C Quốc Hương áp dụng SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng); còn 28 Mai Chí Thọ — địa chỉ đầu tiên MAX OFFICE hợp tác với đối tác không gian LiteSpace — dùng hệ giá riêng CORE, PLUS (cùng 499.000đ/tháng) và PRO (899.000đ/tháng). Tất cả giá đều chưa bao gồm VAT 10%.",
  "Nếu doanh nghiệp bạn cần địa chỉ gần các trường đại học lớn, hãy chọn Phạm Văn Đồng; nếu ưu tiên khu vực quốc tế hoá gần Thảo Điền, 27C Quốc Hương phù hợp hơn; còn nếu cần một địa chỉ mặt tiền đại lộ dễ nhận diện, kết nối nhanh về trung tâm Quận 1 qua hầm Thủ Thiêm, hãy chọn 28 Mai Chí Thọ — cả ba đều là lựa chọn đáng cân nhắc tại khu vực Thành phố Thủ Đức (cũ) trong hệ thống MAX OFFICE.",
];

export default function ThuDucCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Thành phố Thủ Đức (cũ)"
      heroDescription="3 địa chỉ — Phạm Văn Đồng, 27C Quốc Hương và 28 Mai Chí Thọ, từ cửa ngõ Đông Bắc thành phố đến khu Thảo Điền và Thủ Thiêm."
      intro={INTRO}
    />
  );
}
