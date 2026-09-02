import { renderOgImage, size, contentType } from "@/lib/og";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Kế Toán & Thuế — Kiến Thức MAX OFFICE",
    backgroundImagePath: "/images/og/ke-toan-thue.jpg",
  });
}
