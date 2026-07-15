import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Bảng Giá Dịch Vụ MAX OFFICE - Minh Bạch, Không Phát Sinh",
    backgroundImagePath: "/images/og/hero-bang-gia.jpg",
  });
}
