import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Blog MAX OFFICE — Kiến Thức Vận Hành Doanh Nghiệp",
    backgroundImagePath: "/images/og/coworking.jpg",
  });
}
