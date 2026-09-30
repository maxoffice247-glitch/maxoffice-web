import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { markOrderPaidIfNotAlready } from "@/lib/portal/order";
import { sendStaffNewOrderEmail } from "@/lib/portal/staffNotify";
import { verifyHmacSignature, verifyUrlKey } from "@/lib/portal/sepayAuth";

/** Webhook SePay cho VA riêng của portal (khác VA của GPKD) — chấp nhận
    CẢ HAI cơ chế xác thực SePay hỗ trợ (xem sepayAuth.ts để biết lý do
    HMAC mạnh hơn):
      1. Query string `?key=...` (cách cũ, theo đúng GPKD).
      2. Header `X-SePay-Signature`/`X-SePay-Timestamp` (HMAC-SHA256).
    Chỉ cần MỘT trong hai đúng — cho phép bạn đổi cấu hình trên dashboard
    SePay (URL key <-> HMAC) bất cứ lúc nào mà KHÔNG cần deploy lại code.
    Payload `{content, transferAmount}` đã xác nhận đúng field tên thật
    qua code GPKD, không phải đoán. */
export async function POST(request: Request) {
  // Đọc RAW TEXT trước — HMAC ký trên đúng BYTES gốc của request, không
  // phải bản JSON.parse() rồi JSON.stringify() lại (SePay cảnh báo rõ:
  // cách escape Unicode khác nhau giữa các ngôn ngữ có thể làm sai lệch
  // chữ ký dù dữ liệu "giống nhau"). Parse JSON THỦ CÔNG từ chính rawBody
  // này ở dưới, không gọi request.json() (sẽ đọc mất stream, không gọi
  // lại .text() được nữa).
  const rawBody = await request.text();

  const url = new URL(request.url);
  const keyParam = url.searchParams.get("key") || "";
  const urlKeyOk = verifyUrlKey(keyParam, process.env.SEPAY_PORTAL_API_KEY);

  const hmacResult = verifyHmacSignature(
    rawBody,
    request.headers.get("x-sepay-signature"),
    request.headers.get("x-sepay-timestamp"),
    process.env.SEPAY_PORTAL_WEBHOOK_SECRET
  );

  if (!urlKeyOk && hmacResult !== "ok") {
    const reason = hmacResult === "missing_headers" ? "Sai API key" : `Xác thực HMAC thất bại (${hmacResult})`;
    return NextResponse.json({ success: false, error: reason }, { status: 401 });
  }

  let payload: { content?: string; transferAmount?: number | string; amount?: number | string };
  try {
    payload = JSON.parse(rawBody);
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
