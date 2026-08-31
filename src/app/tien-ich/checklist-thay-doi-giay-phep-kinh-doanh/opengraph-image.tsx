import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Checklist Thay Đổi Giấy Phép Kinh Doanh — Tải PDF | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "23 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
