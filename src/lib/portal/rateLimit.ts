import type { PortalRedisClient } from "./redisClient";

/** Chống dò quét MST/số hợp đồng hàng loạt — đã chốt với người dùng: tối
    đa 5 lượt tra cứu KHÁC NHAU trong 10 phút/IP, vượt thì khoá 45 phút
    (giữa khoảng 30-60 phút cho phép).

    Dùng Sorted Set (ZADD/ZREMRANGEBYSCORE/ZCARD) thay vì bộ đếm thường —
    2 lý do:
      1. "TTL trượt" thật (sliding window) thay vì cửa sổ cố định (fixed
         window có nhược điểm dồn cụm ở ranh giới cửa sổ).
      2. Tự loại trùng theo NGHĨA — tra lại đúng 1 MST nhiều lần trong cùng
         10 phút chỉ cập nhật lại điểm (timestamp) của đúng 1 phần tử đó
         trong set, không tính thêm lượt mới — đúng yêu cầu "5 lượt KHÁC
         NHAU", không phải "5 lần gọi API". */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_DISTINCT_QUERIES = 5;
const LOCK_SECONDS = 45 * 60;

function rateLimitKey(ip: string): string {
  return `portal:ratelimit:queries:${ip}`;
}
function lockKey(ip: string): string {
  return `portal:ratelimit:locked:${ip}`;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "locked" };

/** Gọi TRƯỚC khi xử lý 1 lượt tra cứu. `normalizedQuery` nên là chuỗi đã
    chuẩn hoá (MST/số hợp đồng) để "tra lại y hệt 1 truy vấn" được nhận
    diện đúng là trùng, không tính thêm lượt. `now` truyền vào để test
    được xác định. */
export async function checkAndRecordLookup(
  redis: PortalRedisClient,
  ip: string,
  normalizedQuery: string,
  now: number = Date.now()
): Promise<RateLimitResult> {
  const locked = await redis.get(lockKey(ip));
  if (locked) return { allowed: false, reason: "locked" };

  const key = rateLimitKey(ip);
  // Dọn các lượt tra cứu đã quá 10 phút trước khi đếm — đây chính là phần
  // "trượt" của cửa sổ, chạy mỗi lần gọi thay vì cần cron dọn riêng.
  await redis.zremrangebyscore(key, 0, now - WINDOW_MS);
  await redis.zadd(key, { score: now, member: normalizedQuery });
  await redis.expire(key, Math.ceil(WINDOW_MS / 1000)); // tự dọn key nếu IP ngừng tra cứu hẳn

  const distinctCount = await redis.zcard(key);
  if (distinctCount > MAX_DISTINCT_QUERIES) {
    await redis.set(lockKey(ip), "1", { ex: LOCK_SECONDS });
    return { allowed: false, reason: "locked" };
  }
  return { allowed: true };
}
