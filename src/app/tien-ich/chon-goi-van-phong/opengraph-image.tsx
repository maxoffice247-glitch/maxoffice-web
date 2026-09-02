import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Công Cụ Chọn Gói Văn Phòng Phù Hợp Miễn Phí | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-tim-vpa.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
