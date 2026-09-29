import type { PortalRedisClient } from "./redisClient";
import type { PendingOrder } from "./types";

/** Đơn đăng ký mới (Luồng B) — theo đúng pattern đã xác nhận qua code
    GPKD thật (taoDonHangThanhToan/kiemTraThanhToan/doPost): tạo đơn
    "pending" TTL ngắn (30 phút, đủ thời gian quét QR chuyển khoản), webhook
    SePay xác nhận đủ tiền thì chuyển "paid" — KHÁC GPKD ở đúng 1 điểm: TTL
    được KÉO DÀI lên 14 ngày sau khi "paid" (GPKD giữ nguyên 1800s vì họ
    xuất file ngay khi khách bấm xem kết quả polling; portal MAX cần chờ
    NHÂN VIÊN tạo hợp đồng thật trong sheet gốc rồi CRON tự khớp MST — quá
    trình này có thể mất vài giờ tới vài ngày làm việc, 1800s là quá ngắn). */

const PENDING_TTL_SECONDS = 30 * 60;
const PAID_TTL_SECONDS = 14 * 24 * 60 * 60;
const ORDER_CODE_PREFIX = "MAXHD";

function orderKey(orderCode: string): string {
  return `portal:order:${orderCode}`;
}
function orderPaidLockKey(orderCode: string): string {
  return `portal:order-paid-lock:${orderCode}`;
}

/** "MMddHHmmss" theo giờ Việt Nam (Asia/Ho_Chi_Minh) — Vercel serverless
    chạy giờ UTC nên KHÔNG được dùng trực tiếp các hàm getMonth()/getDate()
    của `Date` (trả về theo giờ UTC/giờ máy chủ, không phải giờ VN). Dùng
    Intl.DateTimeFormat với timeZone tường minh để luôn đúng dù chạy ở đâu. */
export function formatVnTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  // hour12:false của Intl trả "24" thay vì "00" cho nửa đêm ở 1 số runtime
  // — chuẩn hoá lại cho chắc (GPKD dùng Utilities.formatDate của Apps
  // Script, không có vấn đề này, nhưng Intl của JS thuần thì có).
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("month")}${get("day")}${hour}${get("minute")}${get("second")}`;
}

/** Sinh mã đơn — cùng cấu trúc GPKD (`GPKD` + timestamp + 2 số ngẫu nhiên
    10-99), đổi tiền tố thành `MAXHD` để không lẫn giữa 2 hệ thống dù có
    dùng chung 1 tài khoản SePay. `randomFn` cho phép test xác định (mặc
    định Math.random khi chạy thật). */
export function generateOrderCode(now: Date, randomFn: () => number = Math.random): string {
  const randomPart = Math.floor(randomFn() * 90 + 10); // 10-99
  return `${ORDER_CODE_PREFIX}${formatVnTimestamp(now)}${randomPart}`;
}

export type CreateOrderInput = {
  customerName: string;
  mst: string | null;
  phone: string;
  email: string | null;
  locationSlug: string;
  locationName: string;
  planKey: string;
  planName: string;
  price: number;
};

export async function createPendingOrder(
  redis: PortalRedisClient,
  input: CreateOrderInput,
  now: Date = new Date()
): Promise<PendingOrder> {
  const orderCode = generateOrderCode(now);
  const order: PendingOrder = {
    ...input,
    orderCode,
    status: "pending",
    createdAt: now.getTime(),
    paidAt: null,
  };
  await redis.set(orderKey(orderCode), JSON.stringify(order), { ex: PENDING_TTL_SECONDS });
  return order;
}

export async function getOrder(redis: PortalRedisClient, orderCode: string): Promise<PendingOrder | null> {
  const raw = await redis.get(orderKey(orderCode));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingOrder;
  } catch {
    return null;
  }
}

export type MarkPaidResult =
  | { outcome: "paid_now"; order: PendingOrder }
  | { outcome: "already_paid" }
  | { outcome: "not_found" }
  | { outcome: "insufficient_amount"; required: number; received: number };

/** Chuyển đơn "pending" -> "paid" — IDEMPOTENT khi SePay gọi lại webhook
    (retry mạng, trùng giao dịch...). Dùng nguyên tố `SET ... GET` (1 lệnh
    Redis atomic, xem chú thích PortalRedisClient.set) làm "cổng" thay vì
    LockService của GPKD (Next.js serverless không có mutex process-wide
    tương đương) — CHỈ lệnh gọi nào thấy giá trị CŨ là null mới được coi là
    "thắng cuộc", tiếp tục cập nhật đơn hàng thật; các lệnh gọi sau (retry)
    thấy giá trị cũ đã là "1", dừng ngay, không xử lý trùng (không gửi lại
    email nhân viên, không tính lại số lần "paid"). */
export async function markOrderPaidIfNotAlready(
  redis: PortalRedisClient,
  orderCode: string,
  receivedAmount: number,
  now: Date = new Date()
): Promise<MarkPaidResult> {
  const order = await getOrder(redis, orderCode);
  if (!order) return { outcome: "not_found" };
  if (receivedAmount < order.price) {
    return { outcome: "insufficient_amount", required: order.price, received: receivedAmount };
  }

  // QUAN TRỌNG: bắt buộc `get: true` — thiếu cờ này là lỗi THẬT đã gặp khi
  // test: SET không kèm get trả về "OK" (không phải giá trị CŨ), khiến
  // `previousLockValue !== null` LUÔN đúng ngay từ lần gọi ĐẦU TIÊN, mọi
  // đơn hàng đều bị coi nhầm là "already_paid" và không bao giờ thực sự
  // được đánh dấu "paid".
  const previousLockValue = await redis.set(orderPaidLockKey(orderCode), "1", { ex: PAID_TTL_SECONDS, get: true });
  if (previousLockValue !== null) {
    // Đã có lệnh gọi trước đó xử lý xong rồi (retry webhook) — dừng ngay.
    return { outcome: "already_paid" };
  }

  const paidOrder: PendingOrder = { ...order, status: "paid", paidAt: now.getTime() };
  await redis.set(orderKey(orderCode), JSON.stringify(paidOrder), { ex: PAID_TTL_SECONDS });
  return { outcome: "paid_now", order: paidOrder };
}

/** Xoá đơn khỏi Redis — gọi khi cron đã khớp thành công với dòng hợp đồng
    thật trong sheet gốc (đơn hoàn thành vai trò, không cần giữ nữa). */
export async function deleteOrder(redis: PortalRedisClient, orderCode: string): Promise<void> {
  await redis.del(orderKey(orderCode));
}

/** Liệt kê toàn bộ đơn "paid" đang chờ khớp MST — dùng ở cron portal-sync. */
export async function listPaidOrders(redis: PortalRedisClient): Promise<PendingOrder[]> {
  const keys = await redis.keys("portal:order:*");
  const orders: PendingOrder[] = [];
  for (const key of keys) {
    const raw = await redis.get(key);
    if (!raw) continue;
    try {
      const order = JSON.parse(raw) as PendingOrder;
      if (order.status === "paid") orders.push(order);
    } catch {
      // Bỏ qua bản ghi lỗi định dạng — không để 1 đơn hỏng làm hỏng cả lượt quét.
    }
  }
  return orders;
}
