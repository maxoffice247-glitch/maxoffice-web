import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Kiến Thức Doanh Nghiệp — Cẩm Nang MAX OFFICE",
    backgroundImagePath: "/images/og/hero-kien-thuc.jpg",
  });
}
