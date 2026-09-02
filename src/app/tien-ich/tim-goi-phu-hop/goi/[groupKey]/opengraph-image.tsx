import { renderOgImage, size, contentType } from "@/lib/og";
import { getPlanGroup, formatVoPrice } from "@/lib/planFinder";

export { size, contentType };

// Trước đây route này KHÔNG có opengraph-image riêng (không set
// openGraph.images trong generateMetadata của page.tsx cùng cấp) — share
// link rơi về ảnh mặc định của toàn site (trang chủ), không khớp nội dung
// gói/chi nhánh đang xem. Dùng chung nền hero-tim-vpa.jpg (khớp PageHero
// của page.tsx) — tiêu đề tự sinh theo group thực tế, giống cách [slug]/
// [plan]/page.tsx đã tự set ảnh riêng cho từng chi nhánh.
export default async function Image({ params }: { params: Promise<{ groupKey: string }> }) {
  const { groupKey } = await params;
  const group = getPlanGroup(groupKey);
  const title = group
    ? `Gói ${group.planName} - ${formatVoPrice(group.price)}/tháng, ${group.locations.length} chi nhánh`
    : "Báo giá tổng hợp theo gói";
  return renderOgImage({
    title,
    backgroundImagePath: "/images/og/hero-tim-vpa.jpg",
  });
}
