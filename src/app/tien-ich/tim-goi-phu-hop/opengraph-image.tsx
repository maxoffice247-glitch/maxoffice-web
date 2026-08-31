import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Công Cụ Tìm Gói Văn Phòng Ảo Phù Hợp Theo Ngân Sách | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "22 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
