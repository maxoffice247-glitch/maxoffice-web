import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tiện Ích Miễn Phí - Công Cụ, Checklist, So Sánh | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-ve-chung-toi-2.jpg",
  });
}
