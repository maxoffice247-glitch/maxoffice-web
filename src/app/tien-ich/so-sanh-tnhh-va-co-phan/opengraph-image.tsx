import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "So Sánh Công Ty TNHH & Công Ty Cổ Phần | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "22 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
