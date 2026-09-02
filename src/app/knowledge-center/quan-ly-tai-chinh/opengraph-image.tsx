import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Quản Lý Tài Chính — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/hero-so-sanh-thue.jpg",
  });
}
