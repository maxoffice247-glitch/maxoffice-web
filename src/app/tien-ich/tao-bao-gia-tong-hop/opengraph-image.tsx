import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tạo Báo Giá Tổng Hợp Nhiều Dịch Vụ - Miễn Phí | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-bang-gia.jpg",
    subtitle: "Gộp nhiều dịch vụ vào 1 ảnh báo giá duy nhất",
  });
}
