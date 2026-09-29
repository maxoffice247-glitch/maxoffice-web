/** Che bớt tên công ty/email khi hiển thị gợi ý ở bước 1/2 tra cứu — đã
    thống nhất với người dùng: tên công ty giữ ~60% ký tự đầu (theo TỈ LỆ
    độ dài, không phải số ký tự cố định, vì tên dài/ngắn chênh lệch nhiều),
    email giữ 2 ký tự đầu + domain nguyên vẹn. */

const COMPANY_NAME_REVEAL_RATIO = 0.6;

/** VD "CÔNG TY TNHH THƯƠNG MẠI ABC" (27 ký tự) -> giữ 16 ký tự đầu ->
    "CÔNG TY TNHH THƯƠ***". Tên quá ngắn (<=3 ký tự, hiếm gặp) vẫn che tối
    thiểu 1 ký tự để không lộ nguyên vẹn. */
export function maskCompanyName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "";
  const revealCount = Math.max(1, Math.min(trimmed.length - 1, Math.round(trimmed.length * COMPANY_NAME_REVEAL_RATIO)));
  return `${trimmed.slice(0, revealCount)}***`;
}

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
