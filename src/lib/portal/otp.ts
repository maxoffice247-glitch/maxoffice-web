import nodemailer from "nodemailer";
import type { PortalRedisClient } from "./redisClient";

/** OTP 6 số, TTL 10 phút (trong khoảng 5-10 phút đã thống nhất — chọn mốc
    trên cùng để khách có đủ thời gian kiểm tra hộp thư/thư mục spam).
    Giới hạn SỐ LẦN THỬ SAI (tối đa 5) không nằm ở đây mà dùng chung
    `attempts` của lookup-session (xem lookupSession.ts) — 1 phiên tra cứu
    chỉ có đúng 1 OTP đang hiệu lực tại 1 thời điểm, không cần đếm riêng. */

const OTP_TTL_SECONDS = 10 * 60;
export const MAX_OTP_ATTEMPTS = 5;

function otpKey(sessionId: string): string {
  return `portal:otp:${sessionId}`;
}

export function generateOtpCode(): string {
  const n = Math.floor(Math.random() * 1_000_000);
  return n.toString().padStart(6, "0");
}

export async function storeOtp(redis: PortalRedisClient, sessionId: string, code: string): Promise<void> {
  await redis.set(otpKey(sessionId), code, { ex: OTP_TTL_SECONDS });
}

/** So khớp mã OTP khách nhập với mã đã lưu. Trả về `"expired"` khi không
    còn key (hết TTL hoặc đã dùng), `"invalid"` khi sai, `"ok"` khi đúng —
    XOÁ key ngay khi đúng (dùng 1 lần, không cho nhập lại mã cũ dù chưa hết
    TTL). KHÔNG xoá khi sai — để khách còn cơ hội nhập lại đúng mã cho tới
    khi hết TTL hoặc hết số lần thử (đếm ở lookupSession.ts). */
export async function verifyOtp(
  redis: PortalRedisClient,
  sessionId: string,
  submittedCode: string
): Promise<"ok" | "invalid" | "expired"> {
  const stored = await redis.get(otpKey(sessionId));
  if (!stored) return "expired";
  if (stored !== submittedCode.trim()) return "invalid";
  await redis.del(otpKey(sessionId));
  return "ok";
}

/** Gửi OTP qua Zoho SMTP — TÁI DÙNG đúng cấu hình transporter đã có ở
    src/app/api/submit-lead/route.ts (cùng 4 biến env ZOHO_*), không thêm
    dịch vụ email mới. */
export async function sendOtpEmail(toEmail: string, code: string): Promise<void> {
  const { ZOHO_EMAIL, ZOHO_APP_PASSWORD, ZOHO_SMTP_HOST, ZOHO_SMTP_PORT } = process.env;
  if (!ZOHO_EMAIL || !ZOHO_APP_PASSWORD || !ZOHO_SMTP_HOST || !ZOHO_SMTP_PORT) {
    throw new Error("Missing Zoho SMTP env vars");
  }

  const transporter = nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: Number(ZOHO_SMTP_PORT),
    secure: Number(ZOHO_SMTP_PORT) === 465,
    auth: { user: ZOHO_EMAIL, pass: ZOHO_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: ZOHO_EMAIL,
    to: toEmail,
    subject: "Mã xác minh tra cứu hợp đồng MAX OFFICE",
    html: `
      <p>Mã xác minh của bạn là:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p>
      <p>Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu tra cứu này, vui lòng bỏ qua email.</p>
    `,
  });
}
