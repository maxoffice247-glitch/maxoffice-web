import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Công Cụ So Sánh Thuế TNCN vs Hộ Kinh Doanh 2026 | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "24 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
