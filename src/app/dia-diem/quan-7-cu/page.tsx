import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-7-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-7-cu" },
  title: "Văn Phòng Ảo Quận 7 (cũ) — Chi Nhánh Bùi Văn Ba | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 7 (cũ): Bùi Văn Ba, Phường Tân Thuận. Văn phòng ảo từ 450.000đ/tháng (gói W-BASE, W-PRO), gần Khu chế xuất Tân Thuận.",
};

const INTRO = [
  "Quận 7 (cũ) là khu vực Nam Sài Gòn, nơi MAX OFFICE đặt chi nhánh Bùi Văn Ba — chi nhánh duy nhất của hệ thống tại khu vực này, cũng là chi nhánh áp dụng bảng giá văn phòng ảo riêng biệt thứ hai bên cạnh Phạm Văn Đồng. Đây là khu vực có tốc độ đô thị hoá nhanh, tập trung nhiều doanh nghiệp sản xuất, xuất nhập khẩu và các công ty có yếu tố nước ngoài nhờ vị trí gần khu chế xuất và cảng biển.",
  "Chi nhánh toạ lạc tại Unit B3.8, Tầng 3, Block B, 210 Bùi Văn Ba, phường Tân Thuận — bên trong một khu phức hợp cao tầng hiện đại nhìn ra sông Sài Gòn và cầu Phú Mỹ. Khu vực Tân Thuận gắn liền với Khu chế xuất Tân Thuận — khu chế xuất đầu tiên của Việt Nam — hiện vẫn là nơi tập trung đông đảo doanh nghiệp sản xuất, xuất nhập khẩu và logistics. Toà nhà nơi đặt chi nhánh còn có tiện ích nội khu như hồ bơi, mang lại không gian làm việc thoải mái hơn hẳn văn phòng truyền thống.",
  "Chi nhánh cung cấp 2 gói văn phòng ảo riêng: W-BASE (450.000đ/tháng) và W-PRO (750.000đ/tháng, giá chưa bao gồm VAT 10%), kèm nhiều tiện ích bổ sung như phòng họp, chỗ ngồi làm việc linh động và dịch vụ pháp lý trọn gói thiết kế riêng cho toà nhà.",
  "Từ chi nhánh, việc di chuyển qua cầu Tân Thuận hoặc cầu Phú Mỹ để vào trung tâm Quận 1, Quận 4 hay sang khu đô thị Phú Mỹ Hưng đều khá thuận tiện. Nếu doanh nghiệp bạn hoạt động trong lĩnh vực thương mại quốc tế, xuất nhập khẩu tại khu vực Nam Sài Gòn, chi nhánh Bùi Văn Ba là lựa chọn phù hợp nhất trong hệ thống MAX OFFICE.",
];

export default function Quan7CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 7 (cũ)"
      heroDescription="Văn phòng ảo view sông Sài Gòn — chi nhánh Bùi Văn Ba, gần Khu chế xuất Tân Thuận."
      intro={INTRO}
    />
  );
}
