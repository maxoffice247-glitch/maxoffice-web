import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Liên Hệ MAX OFFICE - Tư Vấn Miễn Phí",
    backgroundImagePath: "/images/og/hero-lien-he.jpg",
  });
}
