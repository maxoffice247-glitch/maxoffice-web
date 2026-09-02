import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Văn Phòng Ảo Giá Tốt — Từ 299.000đ/Tháng | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
  });
}
