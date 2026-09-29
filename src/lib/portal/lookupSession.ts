import type { PortalRedisClient } from "./redisClient";
import type { LookupSession } from "./types";

/** "Phiên tra cứu" nối 3 mức hiển thị (xem chú thích đầy đủ ở types.ts) —
    client chỉ giữ `sessionId` ngẫu nhiên, KHÔNG giữ MST/SĐT/email thật,
    tránh lộ thông tin trước khi qua đủ các bước xác minh. TTL 15 phút —
    đủ thời gian cho cả Mức 2 (nhập lại SĐT/email) lẫn Mức 3 (nhập OTP,
    OTP tự nó có TTL ngắn hơn, xem otp.ts). */

const SESSION_TTL_SECONDS = 15 * 60;

function sessionKey(sessionId: string): string {
  return `portal:lookup-session:${sessionId}`;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function createLookupSession(
  redis: PortalRedisClient,
  data: Pick<LookupSession, "mst" | "contractNumber" | "companyNameMasked" | "phoneFull" | "phoneMasked" | "emailFull" | "emailMasked">
): Promise<string> {
  const sessionId = generateSessionId();
  const session: LookupSession = {
    ...data,
    confirmed: false,
    confirmAttempts: 0,
    otpAttempts: 0,
    createdAt: Date.now(),
  };
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

/** Ghi đè 1 phần phiên (VD tăng số lần thử, đánh dấu confirmed) — GIỮ
    NGUYÊN TTL còn lại (không reset về 15 phút mỗi lần patch, tránh 1
    khách cố tình thử sai liên tục để kéo dài phiên vô hạn).
    `remainingTtlSeconds` do route.ts tự tính từ session đã đọc trước đó
    (createdAt), tránh thêm lệnh Redis TTL riêng. */
export async function patchLookupSession(
  redis: PortalRedisClient,
  sessionId: string,
  session: LookupSession,
  patch: Partial<LookupSession>,
  remainingTtlSeconds: number
): Promise<LookupSession> {
  const updated: LookupSession = { ...session, ...patch };
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
