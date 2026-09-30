/** Che bớt email/SĐT khi hiển thị gợi ý ở Mức 1/2 tra cứu — email giữ 2 ký
    tự đầu + domain nguyên vẹn, SĐT giữ 3 ký tự đầu + 2 cuối. (Tên công ty
    KHÔNG che nữa — quyết định của người dùng: tên công ty không phải
    thông tin cần bảo mật vì đã công khai qua chính MST dùng để tra cứu;
    hàm maskCompanyName cũ đã bỏ, xem git history nếu cần khôi phục.) */

/** VD "emmax@gmail.com" -> "em***@gmail.com". Email không có "@" hợp lệ
    (không nên xảy ra vì đã lọc trước khi gọi) thì che gần hết, phòng hờ. */
export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return trimmed.length <= 2 ? "***" : `${trimmed.slice(0, 2)}***`;
  }
  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex); // gồm cả "@"
  const revealCount = Math.min(2, Math.max(0, localPart.length - 1));
  return `${localPart.slice(0, revealCount)}***${domainPart}`;
}

/** VD "0901234567" -> "090*****67" — giữ 3 ký tự đầu + 2 ký tự cuối, che
    toàn bộ phần giữa bằng đúng số dấu `*` tương ứng (không cố định 5 dấu,
    để còn hợp lý với số có độ dài khác — VD số bàn có mã vùng). Số quá
    ngắn (<=5 ký tự, hiếm gặp) che toàn bộ để không lộ gần hết. */
export function maskPhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.length <= 5) return "*".repeat(trimmed.length);
  const first = trimmed.slice(0, 3);
  const last = trimmed.slice(-2);
  const middleLength = trimmed.length - 5;
  return `${first}${"*".repeat(middleLength)}${last}`;
}
