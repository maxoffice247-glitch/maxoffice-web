import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Quy Trình Thành Lập Doanh Nghiệp — Timeline Tương Tác | MAX OFFICE",
    backgroundImagePath: "/images/og/anh-hero-trang-chu.jpg",
    subtitle: "23 chi nhánh TP.HCM • Công cụ miễn phí",
  });
}
