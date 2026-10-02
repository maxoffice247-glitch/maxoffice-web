import { getRedis } from "./portal/redisClient";
import type { PaymentRequestCompanyKey } from "./paymentRequestData";

/**
 * "Nhớ" chỉ số điện cuối kỳ + số lượng xe của LẦN LẬP PHIẾU GẦN NHẤT cho mỗi
 * công ty — giải quyết vấn đề thật: chỉ số điện cuối kỳ tháng trước PHẢI
 * khớp chỉ số điện đầu kỳ tháng sau (cùng 1 đồng hồ điện), nhập tay dễ gõ
 * sai gây tính sai tiền điện.
 *
 * TÁI DÙNG `getRedis()` của portal/redisClient.ts (client Upstash Redis
 * dùng chung, không tạo thêm 1 kết nối Redis riêng) — file đó tuy nằm trong
 * thư mục portal/ nhưng bản thân không có logic nghiệp vụ portal nào, chỉ
 * là 1 factory client Redis chung, dùng được cho tính năng khác.
 *
 * CHỈ lưu "giá trị gần nhất" (không lưu cả lịch sử nhiều kỳ) — vì phiếu
 * luôn được lập theo đúng thứ tự thời gian thực tế (không ai lập phiếu
 * tháng 8 sau khi đã lập tháng 9), nên "giá trị gần nhất đã lưu" LUÔN CHÍNH
 * LÀ "giá trị kỳ trước" của lần lập phiếu tiếp theo — không cần đánh index
 * theo tháng/quý cụ thể.
 *
 * `soXe` mang ý nghĩa KHÁC NHAU tuỳ công ty (số xe THÁNG trước với MTK/Tây
 * Bắc/CUL/QE Agency, số xe CẢ QUÝ trước với KOOLOG) — route gọi hàm này tự
 * biết đúng ngữ cảnh của công ty mình, không cần tách field riêng.
 *
 * `chiSoCuoi` CHỈ áp dụng cho MTK/QE Agency (2 công ty duy nhất có điện
 * ĐỒNG HỒ) — Tây Bắc/CUL không có điện, KOOLOG có "điện khoán" (số tiền
 * thoả thuận cố định, không phải chỉ số đồng hồ tăng dần) nên KHÔNG có khái
 * niệm "chỉ số cuối kỳ phải khớp đầu kỳ sau" — để undefined.
 */

type PaymentRequestHistoryRecord = {
  soXe?: number;
  chiSoCuoi?: number;
  updatedAt: string;
};

/** 1 năm — theo đúng yêu cầu "không cần TTL (hoặc TTL rất dài)": đây là dữ
 * liệu vận hành cần giữ liên tục, không phải dữ liệu tạm thời như OTP/đơn
 * hàng, nhưng vẫn đặt 1 mốc an toàn thay vì vĩnh viễn tuyệt đối. */
const HISTORY_TTL_SECONDS = 60 * 60 * 24 * 365;

function historyKey(companyKey: PaymentRequestCompanyKey): string {
  return `payment-request:last:${companyKey}`;
}

/** Đọc lịch sử — trả `null` khi CHƯA từng lập phiếu cho công ty này (lần
 * đầu tiên) HOẶC khi Redis lỗi/chưa cấu hình (KHÔNG throw — tính năng này
 * chỉ là tiện ích gợi ý, không được làm hỏng việc mở form khi Redis có vấn
 * đề). */
export async function getPaymentRequestHistory(companyKey: PaymentRequestCompanyKey): Promise<PaymentRequestHistoryRecord | null> {
  try {
    const redis = getRedis();
    const raw = await redis.get(historyKey(companyKey));
    if (!raw) return null;
    return JSON.parse(raw) as PaymentRequestHistoryRecord;
  } catch {
    return null;
  }
}

/** Lưu lịch sử SAU KHI tạo phiếu (xem/tải) THÀNH CÔNG — gọi ở route ảnh,
 * KHÔNG throw khi Redis lỗi (nuốt lỗi lặng lẽ): lưu lịch sử thất bại không
 * được làm hỏng việc tạo phiếu đang chạy, nhân viên vẫn nhập tay bình
 * thường ở lần sau nếu Redis có vấn đề tạm thời. */
export async function savePaymentRequestHistory(
  companyKey: PaymentRequestCompanyKey,
  record: { soXe?: number; chiSoCuoi?: number }
): Promise<void> {
  try {
    const redis = getRedis();
    const value: PaymentRequestHistoryRecord = { ...record, updatedAt: new Date().toISOString() };
    await redis.set(historyKey(companyKey), JSON.stringify(value), { ex: HISTORY_TTL_SECONDS });
  } catch {
    // Cố ý nuốt lỗi — xem comment ở trên.
  }
}
