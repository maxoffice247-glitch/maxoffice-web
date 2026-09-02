import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Văn Phòng & Địa Điểm — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/coworking.jpg",
  });
}
