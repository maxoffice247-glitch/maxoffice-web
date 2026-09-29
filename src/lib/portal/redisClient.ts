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
  /** `get: true` — Phase 2 dùng làm nguyên tố idempotency cho webhook
      SePay (xem order.ts markOrderPaidIfNotAlready): SET ... GET là 1 lệnh
      Redis ATOMIC vừa ghi giá trị mới vừa trả về giá trị CŨ cùng lúc — nếu
      giá trị cũ là null (key chưa tồn tại) thì lệnh gọi này là lần đầu
      "thắng cuộc", các lệnh gọi lại sau (SePay retry webhook) sẽ thấy giá
      trị cũ đã là "1" và biết đây là lần xử lý trùng, không cần Lua script
      riêng cho việc này. */
  set(key: string, value: string, opts?: { ex?: number; get?: boolean }): Promise<string | null>;
  del(key: string): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  zadd(key: string, scoreMember: { score: number; member: string }): Promise<unknown>;
  zremrangebyscore(key: string, min: number, max: number): Promise<unknown>;
  zcard(key: string): Promise<number>;
  /** Liệt kê key theo mẫu — dùng ở cron portal-sync để quét toàn bộ đơn
      hàng "paid" đang chờ khớp MST (KEYS chấp nhận được ở quy mô vài chục-
      vài trăm đơn hàng cùng lúc của 1 doanh nghiệp nhỏ; không dùng cho tập
      dữ liệu lớn/production ở quy mô khác). */
  keys(pattern: string): Promise<string[]>;
};

let cached: Redis | null = null;

/** Lazy singleton — chỉ tạo client khi thực sự cần (lần gọi đầu trong 1
    lượt chạy serverless function). Đọc tên biến `KV_REST_API_URL`/
    `KV_REST_API_TOKEN` — ĐÂY LÀ TÊN VERCEL TỰ ĐỘNG BƠM VÀO MÔI TRƯỜNG khi
    liên kết tích hợp Upstash qua Vercel Marketplace (không phải
    `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` như tên gốc của
    Upstash) — cố ý đọc đúng tên Vercel cấp để KHÔNG phải tự tay thêm biến
    trùng lặp mãi mãi lúc deploy thật (Vercel tự bơm sẵn, chỉ .env.local
    lúc dev cần khai báo tay theo đúng tên này). Ném lỗi rõ ràng nếu thiếu
    cấu hình thay vì để lỗi mờ mịt lúc gọi lệnh Redis đầu tiên. */
export function getRedis(): PortalRedisClient {
  if (!cached) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      throw new Error("Thiếu KV_REST_API_URL/KV_REST_API_TOKEN — xem .env.example.");
    }
    // automaticDeserialization: false — QUAN TRỌNG, đã bắt được lỗi thật
    // khi test với Redis thật: mặc định @upstash/redis TỰ ĐỘNG JSON.parse()
    // giá trị trả về nếu trông giống JSON (kể cả 1 chuỗi số thuần như OTP
    // "123456" cũng bị parse thành NUMBER 123456). Hậu quả kép:
    //   1. recordsCache.ts/lookupSession.ts tự JSON.parse() THÊM 1 LẦN NỮA
    //      trên giá trị ĐÃ được parse sẵn (nay là object) -> JSON.parse(1
    //      object) ném lỗi, bị try/catch nuốt âm thầm, trả về null.
    //   2. verifyOtp so `stored !== submittedCode` (chuỗi) nhưng `stored`
    //      thực ra là NUMBER do bị tự parse -> so sánh luôn lệch kiểu dữ
    //      liệu -> OTP ĐÚNG vẫn báo sai.
    // Tắt hẳn tính năng này để get()/set() hoạt động đúng như hợp đồng
    // kiểu PortalRedisClient đã khai báo (chuỗi vào, chuỗi ra) — toàn bộ
    // code portal/* đã tự JSON.stringify/parse tường minh ở đúng chỗ cần,
    // không cần SDK làm hộ.
    cached = new Redis({ url, token, automaticDeserialization: false });
  }
  return cached;
}
