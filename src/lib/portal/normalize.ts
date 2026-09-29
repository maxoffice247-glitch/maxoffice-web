/** Các hàm chuẩn hoá chuỗi dùng chung cho tra cứu/so khớp trạng thái —
    tách riêng để test độc lập, không phụ thuộc Redis/Sheets. */

/** MST chỉ giữ chữ số — loại bỏ dấu nháy đơn Google Sheets hay chèn trước
    số (để giữ số 0 đầu), khoảng trắng, dấu gạch ngang. */
export function normalizeMst(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** Số hợp đồng: chỉ trim + viết hoa toàn bộ — GIỮ NGUYÊN dấu `/` và các ký
    tự khác vì đây là 1 phần cấu trúc có ý nghĩa (VD "H250807/B82/HĐTVP"),
    không phải nhiễu cần loại bỏ như MST. So khớp không phân biệt hoa
    thường (nhân viên có thể gõ "hđtvp" hay "HĐTVP" khi tạo hồ sơ). */
export function normalizeContractNumber(value: string): string {
  return value.trim().toUpperCase();
}

/** Chuẩn hoá text trạng thái (cột P/"Thanh toán") trước khi so khớp chuỗi
    con — chỉ lowercase + trim, KHÔNG bỏ dấu: dữ liệu thật chỉ lệch nhau ở
    HOA/thường ("Đã Gia Hạn" vs "đã gia hạn", đã xác nhận thực tế trong
    sheet), không lệch dấu. */
export function normalizeStatusText(value: string): string {
  return value.trim().toLowerCase();
}
