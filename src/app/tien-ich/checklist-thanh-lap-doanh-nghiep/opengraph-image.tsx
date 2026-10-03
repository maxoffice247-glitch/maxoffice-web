import { renderOgImage, size, contentType } from "@/lib/og";
import { REGISTRATION_CONFIG, REGISTRATION_TYPES } from "@/lib/companyRegistration";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Hồ sơ thành lập doanh nghiệp",
    // "contain": nền navy đặc + ảnh gốc đặt khung bên phải — chữ (nhất là dòng 4
    // loại hình) luôn rõ, không đè lên vùng sáng của ảnh nền như chế độ cover.
    backgroundImagePath: "/images/thanh-lap-doanh-nghiep.jpg",
    backgroundFit: "contain",
    // Dấu cách không ngắt (NBSP) trong từng tên loại hình để khi xuống dòng chỉ
    // ngắt ở dấu "•", không bẻ giữa tên (VD "Hộ kinh / doanh").
    subtitle: REGISTRATION_TYPES.map((t) => REGISTRATION_CONFIG[t].label.replace(/ /g, "\u00A0")).join(" • "),
  });
}
