import type { Metadata } from "next";
import AreaPageTemplate from "@/components/AreaPageTemplate";
import { getAreaBySlug } from "@/lib/locationsData";

const area = getAreaBySlug("quan-tan-binh-cu")!;

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem/quan-tan-binh-cu" },
  title: "Văn Phòng Ảo Quận Tân Bình (cũ) — 9 Chi Nhánh | MAX OFFICE",
  description:
    "Danh sách 9 chi nhánh MAX OFFICE tại khu vực Quận Tân Bình (cũ): Sông Thao, Yên Thế, Cộng Hoà, Cửu Long, Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm, 40A-40B Út Tịch. Văn phòng ảo từ 299.000đ/tháng.",
};

const INTRO = [
  "Quận Tân Bình (cũ) là khu vực MAX OFFICE hiện diện dày đặc nhất trong toàn hệ thống, với 9 chi nhánh trải quanh khu vực sân bay quốc tế Tân Sơn Nhất — từ trụ sở chính tại Sông Thao đến các chi nhánh vệ tinh tại Yên Thế, Cộng Hoà, Cửu Long, Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm và 40A-40B Út Tịch. Đây là khu vực có lịch sử phát triển lâu đời, mật độ doanh nghiệp vừa và nhỏ cao, phù hợp với đa dạng ngành nghề.",
  "Địa bàn khu vực này trải qua nhiều phường khác nhau sau khi sáp nhập hành chính — từ Tân Sơn Hoà, Tân Sơn Nhất gần sân bay, đến Bảy Hiền vốn nổi tiếng với nghề dệt may truyền thống của cộng đồng người Quảng Nam, và phường Tân Bình trung tâm. Mỗi chi nhánh vì vậy phục vụ một nhóm khách hàng khác nhau: doanh nghiệp logistics, xuất nhập khẩu, du lịch thường ưu tiên các chi nhánh gần sân bay như Yên Thế, Hoàng Việt, 40A-40B Út Tịch; trong khi doanh nghiệp thương mại, may mặc lại phù hợp hơn với khu vực Bảy Hiền, Bàu Cát 2.",
  "Nhờ số lượng chi nhánh lớn, khu vực Tân Bình (cũ) sở hữu dải giá văn phòng ảo đa dạng nhất hệ thống — từ gói LITE 299.000đ/tháng tại Hoàng Việt, Bàu Cát 2, Lam Sơn, Hoàng Kế Viêm, đến các gói cao cấp ORIGIN, ORIGIN+ và cả RISE tại Yên Thế. Sông Thao — trụ sở chính của MAX OFFICE — cũng đặt tại đây, cung cấp đầy đủ toàn bộ dịch vụ dưới một mái nhà. Yên Thế còn là chi nhánh duy nhất trong hệ thống có phòng đào tạo & sự kiện riêng biệt, sức chứa 30-50 người. Chi nhánh 40A-40B Út Tịch là chi nhánh MỚI NHẤT và cũng là chi nhánh ĐẦU TIÊN tại Tân Bình dùng bảng giá riêng SILVER/GOLD/PREMIUM (khác hệ LITE-RISE chung của 8 chi nhánh còn lại), nổi bật với khu vực nghỉ ngơi riêng cho nhân viên — tiện ích hiếm gặp so với các chi nhánh khác.",
  "Giao thông trong khu vực rất thuận tiện nhờ các trục đường lớn như Cộng Hoà, Trường Sơn, Trường Chinh, Cách Mạng Tháng 8 — kết nối nhanh chóng đến trung tâm Quận 1, Quận 3, Quận 10 và các quận lân cận. Nếu doanh nghiệp bạn cần địa chỉ gần sân bay, thuận tiện tiếp đối tác quốc tế, hoặc đơn giản là mức giá tối ưu nhất trong hệ thống, khu vực Tân Bình (cũ) là lựa chọn nên cân nhắc đầu tiên.",
];

export default function QuanTanBinhCuPage() {
  return (
    <AreaPageTemplate
      area={area}
      heroTitle="Chi Nhánh MAX OFFICE Tại Quận Tân Bình (cũ)"
      heroDescription="9 chi nhánh văn phòng ảo, văn phòng trọn gói quanh khu vực sân bay Tân Sơn Nhất — mật độ dày đặc nhất trong toàn hệ thống MAX OFFICE."
      intro={INTRO}
    />
  );
}
