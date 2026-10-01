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
import { loadVerifiedRecordResponse } from "@/lib/portal/verifiedRecord";

const MAX_CONFIRM_ATTEMPTS = 5;

/** Mức 2 — 2 nhánh xác minh LOẠI TRỪ NHAU theo dữ liệu đã lưu trong phiên
    từ Mức 1 (xem search/route.ts):
      a. Nhánh "contact" (session có phoneFull/emailFull — luồng gốc):
         khách nhập lại TOÀN BỘ SĐT hoặc email, so khớp CHÍNH XÁC với giá
         trị đầy đủ đã lưu. Khớp bằng SĐT hay email đều được — nhưng OTP
         LUÔN gửi tới email ĐÃ LƯU SẴN (`emailFull`), không phải giá trị
         khách vừa gõ, kể cả khi khách xác nhận thành công bằng SĐT.
      b. Nhánh "password" (session có lookupPasswordFull, KHÔNG có contact
         — nhóm Mộc Gia không có SĐT/email ở sheet nguồn): so khớp TRỰC
         TIẾP (không hash — quy mô nhỏ) với 1 mật khẩu DÙNG CHUNG cho toàn
         bộ nhóm Mộc Gia (biến môi trường PORTAL_MOC_GIA_SHARED_PASSWORD,
         xem search/route.ts — không phải mật khẩu riêng từng công ty).
         Khớp đúng -> BỎ QUA OTP, vào thẳng Mức 3 luôn (không có email nào
         để gửi OTP tới; mật khẩu chung + MST tra đúng đã là đủ xác thực ở
         quy mô này — không phải bí mật tuyệt đối riêng từng khách, chỉ
         nhằm ngăn người ngoài đoán mò/dò quét hàng loạt).
    Cả 2 nhánh dùng CHUNG bộ đếm `confirmAttempts`/`MAX_CONFIRM_ATTEMPTS`
    (đúng yêu cầu "dùng lại cơ chế đếm lần thử đã có"), không tách bộ đếm
    riêng cho nhánh mật khẩu. */
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
    return NextResponse.json({ status: "error", message: "Vui lòng nhập thông tin xác nhận" }, { status: 400 });
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

  const usesPassword = session.lookupPasswordFull !== null;

  const isMatch = usesPassword
    ? value === session.lookupPasswordFull
    : (session.phoneFull !== null && normalizePhone(value) === normalizePhone(session.phoneFull)) ||
      (session.emailFull !== null && normalizeEmail(value) === normalizeEmail(session.emailFull));

  if (!isMatch) {
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
      message: usesPassword
        ? `Mật khẩu không đúng. Còn ${attemptsLeft} lần thử.`
        : `Số điện thoại hoặc email không khớp. Còn ${attemptsLeft} lần thử.`,
    });
  }

  // Nhánh mật khẩu: khớp đúng -> vào thẳng Mức 3, không qua OTP.
  if (usesPassword) {
    await deleteLookupSession(redis, sessionId);
    const record = await loadVerifiedRecordResponse(redis, session);
    if (!record) {
      return NextResponse.json(
        { status: "error", message: "Có lỗi khi tải lại thông tin hợp đồng. Vui lòng tra cứu lại." },
        { status: 500 }
      );
    }
    return NextResponse.json({ status: "verified", record });
  }

  // Nhánh contact: khớp SĐT hoặc email — nhưng nếu KHÔNG có email trong dữ
  // liệu thì không có nơi để gửi OTP -> bế tắc, báo CSKH, KHÔNG hiện chi tiết.
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
