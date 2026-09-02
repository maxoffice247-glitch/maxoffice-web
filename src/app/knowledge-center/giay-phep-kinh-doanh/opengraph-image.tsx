import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Giấy Phép Kinh Doanh — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/hero-bang-gia-2.jpg",
  });
}
