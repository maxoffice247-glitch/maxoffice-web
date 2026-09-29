import type { PortalRedisClient } from "./redisClient";
import type { ContractRecord } from "./types";

/** Cache toàn bộ danh sách ContractRecord đã gộp — trang tra cứu LUÔN đọc
    từ đây, KHÔNG BAO GIỜ gọi Sheets API trực tiếp lúc khách đang tra cứu
    (xem lý do: giới hạn lượt gọi Sheets API/phút). Route cron (Phase 1
    triển khai luôn, dù trước đây gọi là việc của "Phase 2 cũ" — tra cứu
    không có gì để tìm nếu không có bước này) chịu trách nhiệm làm mới
    cache theo lịch. */

const RECORDS_KEY = "portal:records";
// Không đặt TTL ngắn cho cache — nếu cron lỗi/trễ, thà phục vụ dữ liệu cũ
// hơn là mất hẳn khả năng tra cứu. TTL dài (7 ngày) chỉ để tự dọn nếu cron
// ngừng hẳn trong thời gian dài, không phải cơ chế làm mới.
const RECORDS_TTL_SECONDS = 7 * 24 * 60 * 60;

export async function writeContractRecordsCache(redis: PortalRedisClient, records: ContractRecord[]): Promise<void> {
  await redis.set(RECORDS_KEY, JSON.stringify({ records, syncedAt: Date.now() }), {
    ex: RECORDS_TTL_SECONDS,
  });
}

export async function readContractRecordsCache(
  redis: PortalRedisClient
): Promise<{ records: ContractRecord[]; syncedAt: number } | null> {
  const raw = await redis.get(RECORDS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { records: ContractRecord[]; syncedAt: number };
  } catch {
    return null;
  }
}
