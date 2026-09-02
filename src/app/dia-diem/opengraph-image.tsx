import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: `${ACTIVE_BRANCH_COUNT} Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM`,
    backgroundImagePath: "/images/og/hero-chi-nhanh.jpg",
  });
}
