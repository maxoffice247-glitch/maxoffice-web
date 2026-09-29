import { normalizeMst } from "./normalize";
import type { ContractRecord, PendingOrder } from "./types";

export type OrderMatch = { order: PendingOrder; record: ContractRecord };

/** Khớp đơn "paid" đang chờ với dòng hợp đồng thật MỚI xuất hiện trong dữ
    liệu đã gộp — CHỈ khớp theo MST (đã bỏ hẳn nhánh khớp gần đúng theo tên
    công ty theo quyết định của người dùng: MST hộ kinh doanh = CCCD nên
    luôn duy nhất, không cần fallback). Đơn KHÔNG có MST (khách để trống
    lúc đăng ký vì chưa lập công ty) sẽ KHÔNG được tự động khớp bởi hàm
    này — hạn chế đã biết, xem báo cáo: cần nhân viên xử lý thủ công khi
    khách bổ sung MST sau. Hàm THUẦN — nhận dữ liệu sẵn, không tự đọc
    Redis/Sheets, test được không cần I/O. */
export function findMatchingOrders(records: ContractRecord[], paidOrders: PendingOrder[]): OrderMatch[] {
  const matches: OrderMatch[] = [];
  for (const order of paidOrders) {
    if (!order.mst) continue;
    const orderMstNormalized = normalizeMst(order.mst);
    if (!orderMstNormalized) continue;
    const record = records.find((r) => normalizeMst(r.mst) === orderMstNormalized);
    if (record) matches.push({ order, record });
  }
  return matches;
}
