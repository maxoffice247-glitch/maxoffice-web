import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { getClientIp } from "@/lib/portal/requestIp";
import { checkAndRecordLookup } from "@/lib/portal/rateLimit";
import { readContractRecordsCache } from "@/lib/portal/recordsCache";
import { searchContract } from "@/lib/portal/search";
import { maskCompanyName, maskEmail } from "@/lib/portal/mask";
import { createLookupSession } from "@/lib/portal/lookupSession";
import { generateOtpCode, sendOtpEmail, storeOtp } from "@/lib/portal/otp";

const MAX_QUERY_LENGTH = 40;

/** Bước 1 — tìm kiếm. Xem chú thích chi tiết logic trong search.ts. Phản
    hồi CHỦ Ý không phân biệt "ambiguous" (2+ kết quả gần đúng) với
    "not_found" ở phía khách — cả 2 hiện y hệt nhau ("không tìm thấy") vì
    khách không cần biết chi tiết nội bộ; log lại phía server để debug. */
export async function POST(request: Request) {
  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const query = (body.query || "").trim();
  if (!query) {
    return NextResponse.json({ status: "error", message: "Vui lòng nhập MST hoặc số hợp đồng" }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ status: "not_found" });
  }

  const redis = getRedis();
  const ip = getClientIp(request);

  const rateLimit = await checkAndRecordLookup(redis, ip, query.toUpperCase());
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        status: "rate_limited",
        message: "Bạn đã tra cứu quá nhiều lần khác nhau trong thời gian ngắn. Vui lòng thử lại sau.",
      },
      { status: 429 }
    );
  }

  const cache = await readContractRecordsCache(redis);
  if (!cache) {
    return NextResponse.json(
      { status: "error", message: "Hệ thống đang cập nhật dữ liệu, vui lòng thử lại sau ít phút." },
      { status: 503 }
    );
  }

  const outcome = searchContract(cache.records, query);
  if (outcome.type !== "found") {
    if (outcome.type === "ambiguous") {
      console.warn("[portal/search] ambiguous fuzzy match for query:", query);
    }
    return NextResponse.json({
      status: "not_found",
      message: "Không tìm thấy hợp đồng khớp với thông tin bạn nhập. Vui lòng kiểm tra lại hoặc liên hệ CSKH.",
    });
  }

  const { record } = outcome;
  if (!record.email) {
    return NextResponse.json({
      status: "no_email",
      companyNameMasked: maskCompanyName(record.companyName),
      message:
        "Hợp đồng này chưa có email đăng ký để nhận mã xác minh. Vui lòng liên hệ CSKH để bổ sung email vào hệ thống, sau đó quay lại tra cứu.",
    });
  }

  const emailMasked = maskEmail(record.email);
  const sessionId = await createLookupSession(redis, {
    mst: record.mst,
    contractNumber: record.contractNumber,
    companyNameMasked: maskCompanyName(record.companyName),
    email: record.email,
    emailMasked,
  });

  const code = generateOtpCode();
  await storeOtp(redis, sessionId, code);
  try {
    await sendOtpEmail(record.email, code);
  } catch (err) {
    console.error("[portal/search] send OTP email failed:", err);
    return NextResponse.json(
      { status: "error", message: "Không gửi được email xác minh, vui lòng thử lại sau." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: "otp_sent",
    sessionId,
    companyNameMasked: maskCompanyName(record.companyName),
    emailMasked,
  });
}
