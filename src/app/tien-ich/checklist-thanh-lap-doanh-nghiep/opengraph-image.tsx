import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Checklist Thành Lập Doanh Nghiệp — Tải PDF Miễn Phí | MAX OFFICE",
    backgroundImagePath: "/images/og/thanh-lap-doanh-nghiep.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
