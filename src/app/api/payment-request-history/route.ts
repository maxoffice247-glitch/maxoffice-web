import { isPaymentRequestAuthed } from "@/lib/paymentRequestAuthServer";
import { getPaymentRequestHistory } from "@/lib/paymentRequestHistory";
import type { PaymentRequestCompanyKey } from "@/lib/paymentRequestData";

/**
 * Endpoint ĐỌC cho PaymentRequestTool.tsx — trả lại chỉ số điện cuối kỳ +
 * số lượng xe đã lưu lần lập phiếu gần nhất của 1 công ty, để form tự điền
 * sẵn khi đổi dropdown công ty. Chỉ ĐỌC (ghi lịch sử nằm ở route ảnh, SAU
 * khi tạo phiếu thành công — xem api/payment-request-image/route.tsx).
 *
 * Cùng lớp mật khẩu/proxy như route ảnh (dữ liệu vận hành của khách thuê
 * thật, không công khai) — dù chỉ là vài con số (xe/chỉ số điện), không
 * nhạy cảm bằng MST/SĐT, vẫn chặn nhất quán cho đơn giản.
 */
export const runtime = "nodejs";

const KNOWN_COMPANY_KEYS: PaymentRequestCompanyKey[] = ["mtk", "tay-bac", "cul", "koolog", "qe-agency"];

export async function GET(req: Request) {
  if (!(await isPaymentRequestAuthed())) {
    return new Response("Chưa xác thực.", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");
  if (!company || !KNOWN_COMPANY_KEYS.includes(company as PaymentRequestCompanyKey)) {
    return new Response("Công ty không hợp lệ.", { status: 400 });
  }

  const history = await getPaymentRequestHistory(company as PaymentRequestCompanyKey);
  return Response.json({ history });
}
