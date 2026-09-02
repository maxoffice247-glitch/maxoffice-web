import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Văn Phòng Ảo Phù Hợp Ngành Nghề Nào? Hướng Dẫn Chi Tiết | MAX OFFICE",
    backgroundImagePath: "/images/og/van-phong-ao.jpg",
  });
}
