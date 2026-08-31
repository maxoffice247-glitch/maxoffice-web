import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-go-vap-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-go-vap-cu" },
  title: "Văn Phòng Ảo Quận Gò Vấp (cũ) — Chi Nhánh Nguyễn Oanh | MAX OFFICE",
  description:
    "Chi nhánh MAX OFFICE tại khu vực Quận Gò Vấp (cũ): Nguyễn Oanh. Văn phòng ảo hạng A từ 499.000đ/tháng, gần sân bay Tân Sơn Nhất.",
};

const INTRO = [
  "Quận Gò Vấp (cũ) là khu vực dân cư đông đúc phía Bắc TP.HCM, nơi MAX OFFICE đặt chi nhánh Nguyễn Oanh — một trong số ít lựa chọn văn phòng ảo hạng A chất lượng cao tại khu vực này.",
  "Chi nhánh toạ lạc tại 238-240-242 Nguyễn Oanh, phường Gò Vấp, không xa sân bay quốc tế Tân Sơn Nhất. Khu vực Gò Vấp từ lâu là một trong những địa bàn có mật độ dân cư và doanh nghiệp vừa, nhỏ dày đặc nhất thành phố, với nhu cầu văn phòng đăng ký kinh doanh ngày càng tăng khi nhiều hộ kinh doanh, startup chuyển đổi lên mô hình công ty. Đội ngũ vận hành tại chi nhánh cũng quen thuộc với đặc thù thủ tục đăng ký kinh doanh của khu vực, giúp doanh nghiệp mới thành lập rút ngắn thời gian hoàn tất hồ sơ ban đầu.",
  "Khác với phần lớn hệ thống MAX OFFICE tập trung tại khu vực Tân Bình, chi nhánh Nguyễn Oanh phục vụ riêng nhu cầu của khu vực Gò Vấp và vùng lân cận, giúp doanh nghiệp không phải di chuyển xa để có địa chỉ đăng ký kinh doanh hợp lệ. Chi nhánh cung cấp các gói văn phòng ảo cao cấp ORIGIN, ORIGIN+ và RISE (từ 499.000đ/tháng) — mức giá thấp hơn mặt bằng chung thị trường khu vực nhưng đi kèm nhiều đặc quyền vượt trội như tư vấn tự động hoá AI, ưu tiên hỗ trợ 24/7 và phòng họp miễn phí hàng năm.",
  "Nếu doanh nghiệp bạn hoạt động tại khu vực Gò Vấp hoặc các quận lân cận phía Bắc thành phố và cần một địa chỉ văn phòng ảo hạng A đầy đủ tiện ích, không phải di chuyển về khu trung tâm hay Tân Bình, chi nhánh Nguyễn Oanh là lựa chọn phù hợp nhất trong hệ thống MAX OFFICE.",
];

export default function QuanGoVapCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Gò Vấp (cũ)"
      heroDescription="Văn phòng ảo hạng A tại khu vực Gò Vấp — chi nhánh Nguyễn Oanh, gần sân bay Tân Sơn Nhất."
      intro={INTRO}
    />
  );
}
