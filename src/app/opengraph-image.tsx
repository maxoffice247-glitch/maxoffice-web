import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Văn Phòng Ảo Từ 299K, Trọn Gói TP.HCM | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
  });
}
