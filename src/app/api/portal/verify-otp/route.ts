import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import {
  deleteLookupSession,
  getLookupSession,
  incrementLookupSessionAttempts,
  lookupSessionRemainingTtlSeconds,
} from "@/lib/portal/lookupSession";
import { MAX_OTP_ATTEMPTS, verifyOtp } from "@/lib/portal/otp";
import { readContractRecordsCache } from "@/lib/portal/recordsCache";
import { CONTRACT_STATUS_LABEL } from "@/lib/portal/contractStatus";
import { normalizeContractNumber, normalizeMst } from "@/lib/portal/normalize";

/** Bước 2 — xác minh OTP. Giới hạn số lần thử SAI (tối đa 5) đếm trên
    CHÍNH phiên tra cứu này (lookup-session), ĐỘC LẬP với giới hạn theo IP
    ở bước 1 (route search/route.ts) — đúng 2 cơ chế tách biệt đã chốt. */
export async function POST(request: Request) {
  let body: { sessionId?: string; otp?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const sessionId = (body.sessionId || "").trim();
  const otp = (body.otp || "").trim();
  if (!sessionId || !otp) {
    return NextResponse.json({ status: "error", message: "Thiếu thông tin xác minh" }, { status: 400 });
  }

  const redis = getRedis();
  const session = await getLookupSession(redis, sessionId);
  if (!session) {
    return NextResponse.json({ status: "expired", message: "Phiên tra cứu đã hết hạn. Vui lòng tra cứu lại." });
  }

  if (session.attempts >= MAX_OTP_ATTEMPTS) {
    await deleteLookupSession(redis, sessionId);
    return NextResponse.json({
      status: "too_many_attempts",
      message: "Bạn đã nhập sai quá số lần cho phép. Vui lòng tra cứu lại từ đầu.",
    });
  }

  const result = await verifyOtp(redis, sessionId, otp);

  if (result === "expired") {
    await deleteLookupSession(redis, sessionId);
    return NextResponse.json({ status: "expired", message: "Mã xác minh đã hết hạn. Vui lòng tra cứu lại." });
  }

  if (result === "invalid") {
    const remainingTtl = lookupSessionRemainingTtlSeconds(session);
    const updated = await incrementLookupSessionAttempts(redis, sessionId, session, remainingTtl);
    const attemptsLeft = MAX_OTP_ATTEMPTS - updated.attempts;
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
      message: `Mã xác minh không đúng. Còn ${attemptsLeft} lần thử.`,
    });
  }

  // result === "ok" — tra lại bản ghi ĐẦY ĐỦ từ cache theo đúng MST đã lưu
  // trong phiên (không lưu sẵn cả bản ghi trong session để tránh dữ liệu
  // cũ nếu cache được làm mới giữa lúc khách đang nhập OTP).
  await deleteLookupSession(redis, sessionId);
  const cache = await readContractRecordsCache(redis);
  const record = cache?.records.find(
    (r) => normalizeMst(r.mst) === normalizeMst(session.mst) || normalizeContractNumber(r.contractNumber) === normalizeContractNumber(session.contractNumber)
  );
  if (!record) {
    return NextResponse.json(
      { status: "error", message: "Có lỗi khi tải lại thông tin hợp đồng. Vui lòng tra cứu lại." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "verified",
    record: {
      companyName: record.companyName,
      mst: record.mstDisplay,
      contractNumber: record.contractNumber,
      branch: record.branch,
      startDate: record.startDate,
      endDate: record.endDate,
      totalValue: record.totalValue,
      statusLabel: CONTRACT_STATUS_LABEL[record.status],
      links: record.links,
    },
  });
}
