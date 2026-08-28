import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-4-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-4-cu" },
  title: "Văn Phòng Ảo Quận 4 (cũ) — Chi Nhánh 84-86 Nguyễn Trường Tộ | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 4 (cũ): 84-86 Nguyễn Trường Tộ, Phường Xóm Chiếu. Văn phòng ảo từ 379.000đ/tháng (gói SILVER, GOLD, PREMIUM), chỉ cách trung tâm Quận 1 một nhịp cầu.",
};

const INTRO = [
  "Quận 4 (cũ) là khu vực mới nhất trong hệ thống MAX OFFICE, đánh dấu bằng chi nhánh đầu tiên tại 84-86 Nguyễn Trường Tộ, Phường Xóm Chiếu — chỉ cách trung tâm Quận 1 một nhịp cầu qua cầu Ông Lãnh hoặc cầu Calmette. Đây là lựa chọn phù hợp cho doanh nghiệp muốn đặt trụ sở sát trung tâm thành phố với chi phí hợp lý hơn.",
  "Chi nhánh đặt tại một cao ốc văn phòng nhiều tầng với mặt tiền kính xanh hiện đại, sảnh lễ tân ốp đá cẩm thạch trang nhã. Từ đây, việc di chuyển sang trung tâm Quận 1 hay ghé phố ẩm thực Vĩnh Khánh, Bến Nhà Rồng đều khá thuận tiện.",
  "Chi nhánh 84-86 Nguyễn Trường Tộ áp dụng bảng giá văn phòng ảo riêng biệt gồm 3 gói — SILVER (379.000đ/tháng), GOLD (490.000đ/tháng) và PREMIUM (990.000đ/tháng, giá chưa bao gồm VAT 10%) — cùng bảng giá đang áp dụng tại các chi nhánh khu vực Bình Thạnh, Phú Nhuận và Thủ Đức, phân hoá theo thời lượng sử dụng phòng họp, sảnh tiếp khách và các hỗ trợ pháp lý đi kèm.",
  "Nếu doanh nghiệp bạn cần một địa chỉ đăng ký kinh doanh sát trung tâm Quận 1 mà không phải trả chi phí như đặt văn phòng ngay trong lõi trung tâm, chi nhánh 84-86 Nguyễn Trường Tộ là lựa chọn phù hợp tại khu vực Quận 4 (cũ) trong hệ thống MAX OFFICE.",
];

export default function Quan4CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 4 (cũ)"
      heroDescription="Chi nhánh đầu tiên của khu vực — 84-86 Nguyễn Trường Tộ, chỉ cách trung tâm Quận 1 một nhịp cầu."
      intro={INTRO}
    />
  );
}
