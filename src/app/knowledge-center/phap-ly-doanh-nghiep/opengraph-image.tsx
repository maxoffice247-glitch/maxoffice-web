import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Pháp Lý Doanh Nghiệp — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/hero-lien-he-2.jpg",
  });
}
