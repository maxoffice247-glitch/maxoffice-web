import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Checklist Thành Lập Doanh Nghiệp — Tải PDF Miễn Phí | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "24 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
