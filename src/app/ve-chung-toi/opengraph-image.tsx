import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Về MAX OFFICE - Đối Tác Vận Hành Doanh Nghiệp TP.HCM",
    backgroundImagePath: "/images/og/hero-ve-chung-toi.jpg",
  });
}
