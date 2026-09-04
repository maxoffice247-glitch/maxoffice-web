import { renderOgImage, size, contentType } from "@/lib/og";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  return renderOgImage({
    title: "Tạo Mã QR Thanh Toán Tự Động (VietQR) - Miễn Phí | MAX OFFICE",
    backgroundImagePath: "/images/og/hero-bang-gia.jpg",
    subtitle: `${ACTIVE_BRANCH_COUNT} chi nhánh TP.HCM • Công cụ miễn phí`,
  });
}
