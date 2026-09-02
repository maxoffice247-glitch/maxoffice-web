import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Điều Khoản Sử Dụng | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-bang-gia-2.jpg",
  });
}
