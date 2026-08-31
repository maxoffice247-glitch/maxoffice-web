import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "So Sánh Văn Phòng Ảo & Văn Phòng Trọn Gói | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "23 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
