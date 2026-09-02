import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Thành Lập Doanh Nghiệp — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/thanh-lap-doanh-nghiep.jpg",
  });
}
