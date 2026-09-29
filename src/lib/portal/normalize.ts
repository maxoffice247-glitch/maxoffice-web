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

/** SĐT chỉ giữ chữ số — bỏ khoảng trắng/dấu chấm/gạch ngang khách có thể
    gõ khác cách trình bày trong dữ liệu gốc (VD dữ liệu lưu "0902 632
    428", khách gõ "0902632428" vẫn phải khớp). KHÔNG chuẩn hoá đầu số
    quốc tế (+84 -> 0) ở Phase 1 — dữ liệu gốc quan sát được toàn dùng
    dạng 0 đầu, chưa thấy dạng +84 nào cần xử lý. */
export function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** Email: trim + lowercase toàn bộ (kể cả phần domain — email không phân
    biệt hoa/thường theo chuẩn thực tế dùng phổ biến, dù RFC kỹ thuật cho
    phép local-part phân biệt, các nhà cung cấp lớn đều không phân biệt). */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
