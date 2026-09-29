import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import {
  deleteLookupSession,
  getLookupSession,
  lookupSessionRemainingTtlSeconds,
  patchLookupSession,
} from "@/lib/portal/lookupSession";
import { normalizeEmail, normalizePhone } from "@/lib/portal/normalize";
import { generateOtpCode, sendOtpEmail, storeOtp } from "@/lib/portal/otp";

const MAX_CONFIRM_ATTEMPTS = 5;

/** Mức 2 — khách nhập lại TOÀN BỘ SĐT hoặc email (không đoán ký tự bị
    che), so khớp CHÍNH XÁC với giá trị đầy đủ đã lưu trong phiên (server
    lấy sẵn từ dữ liệu gốc lúc Mức 1, KHÔNG đọc lại Sheets/cache ở đây).
    Khớp bằng SĐT hay email đều được — nhưng OTP LUÔN gửi tới email ĐÃ LƯU
    SẴN trong dữ liệu (`emailFull`), không phải giá trị khách vừa gõ, kể
    cả khi khách xác nhận thành công bằng SĐT. */
export async function POST(request: Request) {
  let body: { sessionId?: string; value?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const sessionId = (body.sessionId || "").trim();
  const value = (body.value || "").trim();
  if (!sessionId || !value) {
    return NextResponse.json({ status: "error", message: "Vui lòng nhập số điện thoại hoặc email" }, { status: 400 });
  }

  const redis = getRedis();
  const session = await getLookupSession(redis, sessionId);
  if (!session) {
    return NextResponse.json({ status: "expired", message: "Phiên tra cứu đã hết hạn. Vui lòng tra cứu lại." });
  }

  if (session.confirmAttempts >= MAX_CONFIRM_ATTEMPTS) {
    await deleteLookupSession(redis, sessionId);
    return NextResponse.json({
      status: "too_many_attempts",
      message: "Bạn đã nhập sai quá số lần cho phép. Vui lòng tra cứu lại từ đầu.",
    });
  }

  const matchesPhone = session.phoneFull !== null && normalizePhone(value) === normalizePhone(session.phoneFull);
  const matchesEmail = session.emailFull !== null && normalizeEmail(value) === normalizeEmail(session.emailFull);

  if (!matchesPhone && !matchesEmail) {
    const remainingTtl = lookupSessionRemainingTtlSeconds(session);
    const updated = await patchLookupSession(
      redis,
      sessionId,
      session,
      { confirmAttempts: session.confirmAttempts + 1 },
      remainingTtl
    );
    const attemptsLeft = MAX_CONFIRM_ATTEMPTS - updated.confirmAttempts;
    if (attemptsLeft <= 0) {
      await deleteLookupSession(redis, sessionId);
      return NextResponse.json({
        status: "too_many_attempts",
        message: "Bạn đã nhập sai quá số lần cho phép. Vui lòng tra cứu lại từ đầu.",
      });
    }
    return NextResponse.json({
      status: "invalid",
      attemptsLeft,
      message: `Số điện thoại hoặc email không khớp. Còn ${attemptsLeft} lần thử.`,
    });
  }

  // Khớp SĐT hoặc email — nhưng nếu KHÔNG có email trong dữ liệu thì
  // không có nơi để gửi OTP -> bế tắc, báo CSKH, KHÔNG hiện chi tiết.
  if (!session.emailFull) {
    await deleteLookupSession(redis, sessionId);
    return NextResponse.json({
      status: "no_email",
      message: "Vui lòng liên hệ CSKH để được hỗ trợ, hoặc bổ sung email vào hệ thống.",
    });
  }

  const remainingTtl = lookupSessionRemainingTtlSeconds(session);
  await patchLookupSession(redis, sessionId, session, { confirmed: true }, remainingTtl);

  const code = generateOtpCode();
  await storeOtp(redis, sessionId, code);
  try {
    await sendOtpEmail(session.emailFull, code);
  } catch (err) {
    console.error("[portal/confirm] send OTP email failed:", err);
    return NextResponse.json(
      { status: "error", message: "Không gửi được email xác minh, vui lòng thử lại sau." },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: "otp_sent", emailMasked: session.emailMasked });
}
