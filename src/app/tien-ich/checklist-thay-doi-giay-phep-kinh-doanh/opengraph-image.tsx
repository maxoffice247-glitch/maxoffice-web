import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Checklist Thay Đổi Giấy Phép Kinh Doanh — Tải PDF | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-lien-he-2.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
