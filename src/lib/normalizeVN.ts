/**
 * (Tách ra từ LocationsAreaBrowser.tsx để ô tìm chi nhánh ở /dia-diem và combobox
 * chọn địa chỉ MAX OFFICE ở form Checklist thành lập DN dùng CHUNG 1 hàm.)
 *
 * Chuẩn hoá chuỗi tiếng Việt để so khớp tìm kiếm không phân biệt hoa/thường
 * và không phân biệt dấu — "Tân Định" và "tan dinh" phải khớp nhau. NFD tách
 * dấu thanh/dấu phụ ra khỏi ký tự gốc rồi xoá, riêng "đ" không tách được bằng
 * NFD (là 1 chữ cái riêng trong bảng mã, không phải "d" + dấu) nên xử lý tay.
 *
 * Sau đó bỏ tiếp tiền tố hành chính "phường"/"p."/"p " — dữ liệu địa chỉ
 * (`shortAddress`) luôn lưu dạng viết tắt "P. Tân Định", trong khi người
 * dùng có thể gõ đầy đủ "Phường Tân Định". Áp dụng CÙNG 1 hàm này cho cả
 * chuỗi tìm kiếm lẫn dữ liệu (area.name/loc.name/loc.shortAddress, xem 3
 * lượt gọi bên dưới) nên "Phường Xuân Hòa", "P. Xuân Hòa", "P Xuân Hòa" và
 * "Xuân Hòa" đều chuẩn hoá về cùng 1 chuỗi, khớp nhau bất kể cách viết.
 * `\b` đảm bảo chỉ xoá đúng token "p"/"phuong" đứng riêng (có khoảng
 * trắng/dấu câu bao quanh), không cắt nhầm vào giữa từ khác.
 *
 * Đã KIỂM TRA riêng cho "Quận" — 2 trường hợp khác nhau:
 * 1) Dữ liệu (`area.name`) không bao giờ viết tắt "Quận" thành "Q." (luôn
 *    ghi đủ "Quận Bình Thạnh (cũ)"...), nên "Quận Bình Thạnh" ĐÃ khớp
 *    thẳng mà không cần bỏ tiền tố gì — không có lỗi ở chiều này.
 * 2) Người dùng có thể tự gõ tắt "Q. Bình Thạnh" (thực đo: trước khi sửa,
 *    cách gõ này ra 0 kết quả) — nên có bỏ thêm đúng token viết tắt 1 chữ
 *    cái "q"/"q." (KHÔNG bỏ nguyên từ "quận"/"quan", chỉ bỏ chữ "q" đứng
 *    riêng). Nhờ vậy "Q. Bình Thạnh" → "binh thanh", vẫn khớp bình thường
 *    vào chuỗi dữ liệu "quan binh thanh (cu)" (chưa bị đụng tới) qua phép
 *    so khớp chuỗi con sẵn có — không cần bỏ "quan " ở dữ liệu. Nếu bỏ cả
 *    nguyên từ "quan "/"q " (kể cả khi đứng trước số), "Quận 10" sẽ rút
 *    gọn còn mỗi "10" và có thể khớp nhầm vào địa chỉ không liên quan
 *    chứa số 10 (VD "06-08-10 Cửu Long") — nên KHÔNG làm vậy.
 */
export function normalizeVN(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\bphuong\.?\s+/g, "")
    .replace(/\bp\.?\s+/g, "")
    .replace(/\bq\.?\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
