import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Mở Rộng Kinh Doanh — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/hero-chi-nhanh.jpg",
  });
}
