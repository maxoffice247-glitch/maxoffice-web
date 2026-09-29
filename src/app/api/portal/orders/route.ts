import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { createPendingOrder } from "@/lib/portal/order";
import { buildPortalVietQrUrl, isPortalSepayConfigured } from "@/lib/portal/sepayVietQr";
import { getOfferedPlan } from "@/lib/planFinder";

/** Luồng B, bước 1 — tạo đơn đăng ký mới. KHÔNG cho client tự gửi tên chi
    nhánh/tên gói/giá tiền tuỳ ý (rủi ro giả mạo giá) — chỉ nhận
    locationSlug+planKey, server tự tra `getOfferedPlan()` (nguồn dữ liệu
    giá chính thức đã dùng cho /tien-ich/tim-goi-phu-hop) để lấy tên/giá
    THẬT, đúng nguyên tắc đã áp dụng cho vietQr.ts (không nhận số tài
    khoản/giá trực tiếp từ client). */
export async function POST(request: Request) {
  let body: {
    customerName?: string;
    mst?: string;
    phone?: string;
    email?: string;
    locationSlug?: string;
    planKey?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const customerName = (body.customerName || "").trim();
  const phone = (body.phone || "").trim();
  const mst = (body.mst || "").trim() || null;
  const email = (body.email || "").trim() || null;
  const locationSlug = (body.locationSlug || "").trim();
  const planKey = (body.planKey || "").trim();

  if (!customerName || !phone || !locationSlug || !planKey) {
    return NextResponse.json(
      { status: "error", message: "Vui lòng điền đầy đủ tên, số điện thoại, chi nhánh và gói dịch vụ." },
      { status: 400 }
    );
  }

  const plan = getOfferedPlan(locationSlug, planKey);
  if (!plan) {
    return NextResponse.json({ status: "error", message: "Chi nhánh/gói dịch vụ không hợp lệ." }, { status: 400 });
  }

  const redis = getRedis();
  const order = await createPendingOrder(redis, {
    customerName,
    mst,
    phone,
    email,
    locationSlug: plan.locationSlug,
    locationName: plan.locationName,
    planKey: plan.planKey,
    planName: plan.planName,
    price: plan.price,
  });

  const qrUrl = buildPortalVietQrUrl(order.orderCode, order.price);

  return NextResponse.json({
    status: "created",
    orderCode: order.orderCode,
    amount: order.price,
    qrUrl,
    sepayConfigured: isPortalSepayConfigured(),
    planName: plan.planName,
    locationName: plan.locationName,
  });
}
