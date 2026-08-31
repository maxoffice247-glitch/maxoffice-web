import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-4-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-4-cu" },
  title: "Văn Phòng Ảo Quận 4 (cũ) — 2 Chi Nhánh | MAX OFFICE",
  description:
    "2 chi nhánh MAX OFFICE tại khu vực Quận 4 (cũ): 84-86 Nguyễn Trường Tộ và 54-56 Lê Quốc Hưng, cùng Phường Xóm Chiếu. Văn phòng ảo 3 gói riêng từ 379.000đ/tháng, gần trung tâm Quận 1 và Quận 7.",
};

const INTRO = [
  "Quận 4 (cũ) hiện có 2 chi nhánh MAX OFFICE, cùng thuộc Phường Xóm Chiếu: 84-86 Nguyễn Trường Tộ và 54-56 Lê Quốc Hưng — nhưng nằm trên 2 trục đường khác nhau. Đây là khu vực chỉ cách trung tâm Quận 1 một nhịp cầu, phù hợp cho doanh nghiệp muốn đặt trụ sở sát trung tâm thành phố với chi phí hợp lý hơn khu lõi Quận 1.",
  "84-86 Nguyễn Trường Tộ đặt tại một cao ốc văn phòng nhiều tầng với mặt tiền kính xanh hiện đại, gần phía cầu Ông Lãnh và cầu Calmette — thuận tiện di chuyển vào trung tâm Quận 1, gần phố ẩm thực Vĩnh Khánh và Bến Nhà Rồng. Trong khi đó, 54-56 Lê Quốc Hưng đặt tại toà nhà văn phòng The Vintage 54, gần phía cầu Tân Thuận và trục Nguyễn Tất Thành — thuận tiện hơn cho doanh nghiệp cần di chuyển sang khu vực Quận 7, Phú Mỹ Hưng, gần chợ Xóm Chiếu.",
  "Cả 2 chi nhánh tại Quận 4 (cũ) đều dùng chung bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận và Thủ Đức, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh gần trung tâm Quận 1, hãy chọn 84-86 Nguyễn Trường Tộ; nếu ưu tiên kết nối sang Quận 7 và khu vực cảng, 54-56 Lê Quốc Hưng sẽ thuận tiện hơn — cả hai đều là lựa chọn phù hợp tại khu vực Quận 4 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan4CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 4 (cũ)"
      heroDescription="2 địa chỉ cùng Phường Xóm Chiếu — 84-86 Nguyễn Trường Tộ và 54-56 Lê Quốc Hưng."
      intro={INTRO}
    />
  );
}
