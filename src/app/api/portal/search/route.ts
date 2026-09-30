import { NextResponse } from "next/server";
import { getRedis } from "@/lib/portal/redisClient";
import { getClientIp } from "@/lib/portal/requestIp";
import { checkAndRecordLookup } from "@/lib/portal/rateLimit";
import { readContractRecordsCache } from "@/lib/portal/recordsCache";
import { searchContract } from "@/lib/portal/search";
import { maskEmail, maskPhone } from "@/lib/portal/mask";
import { createLookupSession } from "@/lib/portal/lookupSession";

const MAX_QUERY_LENGTH = 40;

/** Mức 1 — tìm kiếm. CHƯA gửi OTP ở bước này (đổi so với thiết kế trước) —
    chỉ hiện thông tin che 1 phần + ngày hợp đồng (không nhạy cảm, hiển thị
    đầy đủ để khách yên tâm đã tìm đúng) để khách sang Mức 2 xác nhận SĐT/
    email đầy đủ trước khi hệ thống tự gửi OTP. Xem chú thích logic phân
    biệt "ambiguous" (2+ kết quả gần đúng, không tự đoán) trong search.ts —
    CHỦ Ý không cho khách phân biệt với "not_found", cả 2 hiện y hệt nhau. */
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

  // Không có CẢ SĐT lẫn email trong dữ liệu -> không có cách nào để xác
  // minh danh tính (Mức 2 lẫn Mức 3 đều bế tắc) -> báo CSKH ngay, không
  // tạo phiên tra cứu vì không còn bước nào để làm tiếp.
  if (!record.phone && !record.email) {
    return NextResponse.json({
      status: "no_contact_info",
      companyName: record.companyName,
      message:
        "Hợp đồng này chưa có SĐT hoặc email đăng ký để xác minh danh tính. Vui lòng liên hệ CSKH để được hỗ trợ.",
    });
  }

  // Tên công ty hiển thị ĐẦY ĐỦ, không che — không phải thông tin cần bảo
  // mật (đã công khai qua chính MST dùng để tra cứu). Chỉ SĐT/email còn
  // che theo tỉ lệ/mẫu đã chốt.
  const phoneMasked = record.phone ? maskPhone(record.phone) : null;
  const emailMasked = record.email ? maskEmail(record.email) : null;

  const sessionId = await createLookupSession(redis, {
    mst: record.mst,
    contractNumber: record.contractNumber,
    companyName: record.companyName,
    phoneFull: record.phone,
    phoneMasked,
    emailFull: record.email,
    emailMasked,
  });

  return NextResponse.json({
    status: "found",
    sessionId,
    companyName: record.companyName,
    startDate: record.startDate,
    endDate: record.endDate,
    phoneMasked,
    emailMasked,
  });
}
