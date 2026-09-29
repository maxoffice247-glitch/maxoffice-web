import { Redis } from "@upstash/redis";

/** Interface TỐI THIỂU mà các module portal/* cần từ Redis — khai báo
    riêng (không dùng thẳng type `Redis` đầy đủ của @upstash/redis, vốn có
    hàng trăm method) để:
      1. Các hàm nghiệp vụ (rateLimit.ts, otp.ts, lookupSession.ts) nhận
         client qua tham số (dependency injection) thay vì tự import
         singleton — TEST ĐƯỢC bằng 1 client giả (in-memory) triển khai
         đúng interface này, chạy ĐÚNG cùng 1 đoạn code nghiệp vụ như lúc
         chạy thật, không phải mock hành vi.
      2. Instance `Redis` thật (từ getRedis() bên dưới) tự nhiên khớp
         interface này (structural typing) — không cần ép kiểu ở nơi gọi
         thật trong route.ts. */
export type PortalRedisClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  zadd(key: string, scoreMember: { score: number; member: string }): Promise<unknown>;
  zremrangebyscore(key: string, min: number, max: number): Promise<unknown>;
  zcard(key: string): Promise<number>;
};

let cached: Redis | null = null;

/** Lazy singleton — chỉ tạo client khi thực sự cần (lần gọi đầu trong 1
    lượt chạy serverless function), đọc 2 biến môi trường Upstash. Ném lỗi
    rõ ràng nếu thiếu cấu hình thay vì để lỗi mờ mịt lúc gọi lệnh Redis đầu
    tiên. */
export function getRedis(): PortalRedisClient {
  if (!cached) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "Thiếu UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN — xem .env.example."
      );
    }
    cached = new Redis({ url, token });
  }
  return cached;
}
