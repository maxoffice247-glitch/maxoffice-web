import type { PortalRedisClient } from "./redisClient";
import type { LookupSession } from "./types";

/** "Phiên tra cứu" nối bước 1 (tìm thấy công ty) và bước 2 (xác minh OTP) —
    client chỉ giữ `sessionId` ngẫu nhiên, KHÔNG giữ MST/tên đầy đủ, tránh
    lộ thông tin thật trước khi qua được OTP. TTL 15 phút — đủ thời gian
    nhận + nhập OTP (OTP tự nó có TTL ngắn hơn, 5-10 phút, xem otp.ts),
    dài hơn 1 chút để không làm phiên hết hạn ngay trước khi OTP hết hạn. */

const SESSION_TTL_SECONDS = 15 * 60;

function sessionKey(sessionId: string): string {
  return `portal:lookup-session:${sessionId}`;
}

export function generateSessionId(): string {
  // crypto.randomUUID() có sẵn trong Node 19+/mọi runtime Vercel hiện tại —
  // không cần thêm thư viện uuid.
  return crypto.randomUUID();
}

export async function createLookupSession(
  redis: PortalRedisClient,
  data: Omit<LookupSession, "attempts" | "createdAt">
): Promise<string> {
  const sessionId = generateSessionId();
  const session: LookupSession = { ...data, attempts: 0, createdAt: Date.now() };
  await redis.set(sessionKey(sessionId), JSON.stringify(session), { ex: SESSION_TTL_SECONDS });
  return sessionId;
}

export async function getLookupSession(
  redis: PortalRedisClient,
  sessionId: string
): Promise<LookupSession | null> {
  const raw = await redis.get(sessionKey(sessionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LookupSession;
  } catch {
    return null;
  }
}

/** Tăng số lần thử sai OTP của phiên — GHI ĐÈ LẠI với cùng TTL còn lại
    (không reset TTL về 15 phút, tránh 1 khách cố tình thử sai liên tục để
    kéo dài phiên vô hạn). `remainingTtlSeconds` do route.ts tự tính từ
    session đã đọc trước đó (createdAt), tránh thêm lệnh Redis TTL riêng. */
export async function incrementLookupSessionAttempts(
  redis: PortalRedisClient,
  sessionId: string,
  session: LookupSession,
  remainingTtlSeconds: number
): Promise<LookupSession> {
  const updated: LookupSession = { ...session, attempts: session.attempts + 1 };
  await redis.set(sessionKey(sessionId), JSON.stringify(updated), {
    ex: Math.max(1, remainingTtlSeconds),
  });
  return updated;
}

export async function deleteLookupSession(redis: PortalRedisClient, sessionId: string): Promise<void> {
  await redis.del(sessionKey(sessionId));
}

export function lookupSessionRemainingTtlSeconds(session: LookupSession): number {
  const elapsedSeconds = Math.floor((Date.now() - session.createdAt) / 1000);
  return SESSION_TTL_SECONDS - elapsedSeconds;
}
