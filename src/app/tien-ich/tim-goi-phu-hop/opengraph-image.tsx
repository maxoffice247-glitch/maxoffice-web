import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tìm VPA Theo Nhu Cầu - Công Cụ Chọn Văn Phòng Ảo Phù Hợp | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "25 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
