import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Công Cụ So Sánh Thuế TNCN vs Hộ Kinh Doanh 2026 | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-so-sanh-thue.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
