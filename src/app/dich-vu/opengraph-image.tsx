import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tất Cả Dịch Vụ MAX OFFICE - Văn Phòng, Thành Lập DN, Kế Toán Thuế",
    backgroundImagePath: "/images/og/hero-dich-vu.jpg",
  });
}
