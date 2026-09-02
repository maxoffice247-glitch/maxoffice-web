import { renderOgImage, size, contentType } from "@/lib/og";
import { getOfferedPlan, formatVoPrice } from "@/lib/planFinder";

export { size, contentType };

// Trước đây route này KHÔNG có opengraph-image riêng — generateMetadata()
// trong page.tsx cùng thư mục trỏ thẳng openGraph.images tới ảnh mặt tiền
// GỐC của chi nhánh, một ảnh nền trơn không qua renderOgImage() nên share
// link hiện ảnh trống, không logo/tiêu đề/overlay — dù ảnh mặt tiền theo
// đúng chi nhánh (không sai chi nhánh, chỉ thiếu phần thương hiệu/tiêu
// đề). Route này dùng lại ĐÚNG ảnh mặt tiền đó (đã có sẵn bản crop
// /images/og/dia-diem-{slug}.jpg cho toàn bộ 25 chi nhánh) nhưng render
// qua template chuẩn — tiêu đề tự sinh theo đúng gói + chi nhánh.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; plan: string }>;
}) {
  const { slug, plan: planKey } = await params;
  const plan = getOfferedPlan(slug, planKey);
  const title = plan
    ? `Gói ${plan.planName} tại ${plan.locationName} - ${formatVoPrice(plan.price)}/tháng`
    : "Chi tiết gói văn phòng ảo";
  return renderOgImage({
    title,
    backgroundImagePath: `/images/og/dia-diem-${slug}.jpg`,
  });
}
