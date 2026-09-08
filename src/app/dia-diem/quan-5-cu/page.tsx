import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-5-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-5-cu" },
  title: "Văn Phòng Ảo Quận 5 (cũ) — Chi Nhánh 380 Trần Hưng Đạo | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận 5 (cũ): 380 Trần Hưng Đạo, Phường Chợ Dừa. Văn phòng ảo từ 499.000đ/tháng (gói ORIGIN, ORIGIN+, RISE), có pantry cà phê/trà miễn phí trên tầng thượng, gần khu Chợ Lớn.",
};

const INTRO = [
  "Quận 5 (cũ) là khu vực từ lâu được biết đến là Chợ Lớn — trung tâm thương mại lâu đời của cộng đồng người Hoa tại Sài Gòn, gần chợ An Đông, Bệnh viện Chợ Rẫy và Đại học Y Dược TP.HCM. MAX OFFICE đặt chi nhánh đầu tiên tại khu vực này ở 380 Trần Hưng Đạo, Phường Chợ Dừa — toạ lạc trong Wings Tower, một cao ốc văn phòng mới xây với mặt tiền kính hiện đại, ngay trên tuyến đường huyết mạch nối liền trung tâm Quận 1 với khu vực Quận 5.",
  "Điểm khác biệt đáng chú ý nhất của chi nhánh này là khu pantry ngoài trời trên tầng thượng — không gian mở với mái che gỗ, tầm nhìn ra skyline thành phố, nơi khách hàng và đối tác được mời cà phê, trà miễn phí khi ghé thăm văn phòng. Đây là tiện ích hiếm gặp so với phần lớn chi nhánh khác của MAX OFFICE, vốn thường chỉ có sảnh tiếp khách thông thường trong nhà.",
  "Chi nhánh cung cấp các gói văn phòng ảo ORIGIN (499.000đ/tháng, giá ưu đãi riêng tại đây), ORIGIN+ (699.000đ/tháng) và RISE (1.199.000đ/tháng) — cùng hệ giá LITE-RISE chung của MAX OFFICE — cùng đầy đủ văn phòng trọn gói, phòng họp theo giờ, chỗ ngồi linh động, dịch vụ thành lập doanh nghiệp và kế toán thuế.",
  "Nếu doanh nghiệp bạn hoạt động trong lĩnh vực thương mại, xuất nhập khẩu hoặc cần một địa chỉ đăng ký kinh doanh thuận tiện di chuyển cả về phía Quận 1 lẫn khu vực Chợ Lớn, 380 Trần Hưng Đạo là lựa chọn phù hợp trong hệ thống MAX OFFICE.",
];

export default function Quan5CuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận 5 (cũ)"
      heroDescription="380 Trần Hưng Đạo, Phường Chợ Dừa — ngay trục đường nối Quận 1 và khu vực Chợ Lớn."
      intro={INTRO}
    />
  );
}
