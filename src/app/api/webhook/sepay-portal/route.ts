import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { markOrderPaidIfNotAlready } from "@/lib/portal/order";
import { sendStaffNewOrderEmail } from "@/lib/portal/staffNotify";

/** Webhook SePay cho VA riêng của portal (khác VA của GPKD) — xác thực
    qua query string `?key=...` gắn thẳng vào URL đăng ký trên dashboard
    SePay (KHÔNG phải header, theo đúng cách GPKD đã làm và xác nhận hoạt
    động ổn định — Apps Script không đọc được header tuỳ ý nên GPKD chọn
    cách này; Next.js đọc header được nhưng giữ nhất quán 1 cách cho cả 2
    hệ thống dùng chung SePay). Payload `{content, transferAmount}` đã xác
    nhận đúng field tên thật qua code GPKD, không phải đoán. */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const keyParam = url.searchParams.get("key") || "";
  const expectedKey = process.env.SEPAY_PORTAL_API_KEY;
  if (!expectedKey || keyParam !== expectedKey) {
    return NextResponse.json({ success: false, error: "Sai API key" }, { status: 401 });
  }

  let payload: { content?: string; transferAmount?: number | string; amount?: number | string };
  try {
    payload = await request.json();
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 400 });
  }

  const content = String(payload.content || "");
  const amount = Number(payload.transferAmount ?? payload.amount ?? 0);

  const match = content.match(/MAXHD\d+/);
  if (!match) {
    // Không tìm thấy mã đơn trong nội dung chuyển khoản — có thể là giao
    // dịch KHÔNG liên quan tới portal (VA có thể dùng chung tài khoản
    // SePay với hệ thống khác). Vẫn ACK thành công (đúng hành vi GPKD) để
    // SePay không lặp lại gọi vô ích — không phải lỗi của webhook.
    return NextResponse.json({ success: true });
  }

  const orderCode = match[0];
  const redis = getRedis();
  const result = await markOrderPaidIfNotAlready(redis, orderCode, amount);

  if (result.outcome === "paid_now") {
    try {
      await sendStaffNewOrderEmail(result.order);
    } catch (err) {
      // Thanh toán ĐÃ được ghi nhận thành công (phần quan trọng nhất) —
      // lỗi gửi email chỉ log lại, KHÔNG trả lỗi cho SePay (gọi lại webhook
      // không giải quyết được lỗi gửi email, chỉ gây xử lý trùng vô ích).
      console.error("[sepay-portal webhook] gửi email nhân viên thất bại:", err);
    }
  } else if (result.outcome === "insufficient_amount") {
    console.warn(
      `[sepay-portal webhook] đơn ${orderCode} nhận ${result.received}đ, cần ${result.required}đ — chưa đủ, không mark paid.`
    );
  } else if (result.outcome === "not_found") {
    console.warn(`[sepay-portal webhook] không tìm thấy đơn hàng ${orderCode} (có thể đã hết hạn 30 phút).`);
  }
  // "already_paid" — retry của SePay, không cần log ồn ào, đây là hành vi
  // bình thường/mong đợi.

  return NextResponse.json({ success: true });
}
