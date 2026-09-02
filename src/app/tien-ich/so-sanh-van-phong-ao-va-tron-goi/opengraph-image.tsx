import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "So Sánh Văn Phòng Ảo & Văn Phòng Trọn Gói | MAX OFFICE",
    backgroundImagePath: "/images/og/van-phong-tron-goi.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
