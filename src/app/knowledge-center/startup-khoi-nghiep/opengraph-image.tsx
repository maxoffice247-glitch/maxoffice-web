import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Startup & Khởi Nghiệp — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/hero-ve-chung-toi-2.jpg",
  });
}
