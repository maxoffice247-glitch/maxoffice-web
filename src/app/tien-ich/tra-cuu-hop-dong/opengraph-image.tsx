import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tra Cứu Hợp Đồng | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-lien-he.jpg",
    subtitle: "Xem thông tin hợp đồng đang sử dụng tại MAX OFFICE",
  });
}
