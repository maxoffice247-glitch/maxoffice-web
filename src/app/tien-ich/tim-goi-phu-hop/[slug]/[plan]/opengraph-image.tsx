import { renderOgImage, size, contentType } from "@/lib/og";
import { getOfferedPlan, formatVoPrice } from "@/lib/planFinder";

export { size, contentType };

// Trước đây route này KHÔNG có opengraph-image riêng — generateMetadata()
// trong page.tsx cùng thư mục trỏ thẳng openGraph.images tới ảnh mặt tiền
// GỐC của chi nhánh, một ảnh nền trơn không qua renderOgImage() nên share
// link hiện ảnh trống, không logo/tiêu đề/overlay — dù ảnh mặt tiền theo
// đúng chi nhánh (không sai chi nhánh, chỉ thiếu phần thương hiệu/tiêu
// đề). Route này dùng lại ảnh mặt tiền GỐC /images/dia-diem-{slug}.jpg
// (cùng file dùng cho /locations/{slug}/opengraph-image.tsx) với
// backgroundFit "contain" — KHÔNG dùng bản crop riêng /images/og/
// dia-diem-{slug}.jpg như trước đây, vì bản crop đó phải tạo thủ công
// cho từng chi nhánh mới nên từng bị sót (chi nhánh Ba Tháng Hai thêm
// sau này thiếu file, route trả lỗi 500) — đọc thẳng ảnh gốc thì chi
// nhánh mới thêm sau tự động có OG image đúng, không cần bước thủ công
// nào. Render qua template chuẩn — tiêu đề tự sinh theo đúng gói + chi
// nhánh. Toàn bộ 26 chi nhánh đang hoạt động (+ vuon-lai đang ẩn) đã
// xác nhận có sẵn file /images/dia-diem-{slug}.jpg.
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
    backgroundImagePath: `/images/dia-diem-${slug}.jpg`,
    backgroundFit: "contain",
  });
}
