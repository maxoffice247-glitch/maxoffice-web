import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Lệ Phí Môn Bài Đã Bãi Bỏ Từ 2026 - Cập Nhật Mới Nhất | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "25 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
