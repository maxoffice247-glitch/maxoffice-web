/**
 * Đọc số tiền VNĐ bằng chữ tiếng Việt (VD: 1.299.000 -> "Một triệu hai trăm
 * chín mươi chín nghìn đồng") — dùng cho dòng "Bằng chữ" trên ảnh báo giá
 * tổng hợp. Cài đặt thủ công (không phụ thuộc thư viện ngoài) theo đúng quy
 * tắc đọc số tiếng Việt chuẩn: "linh" trước hàng đơn vị khi hàng chục = 0
 * (và không phải nhóm đầu tiên), "mười"/"mươi" cho hàng chục, "lăm" thay
 * "năm" và "mốt" thay "một" ở cuối nhóm khi hàng chục >= 2, "không trăm"
 * chèn vào các nhóm 3 số sau nhóm đầu tiên khi nhóm đó < 100.
 */

const ONES = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const GROUP_UNITS = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

/** Đọc 1 nhóm 3 chữ số (0-999). `isFirstGroup` = đây có phải nhóm được đọc
 * ĐẦU TIÊN trong toàn bộ số hay không — quyết định có cần "không trăm"/
 * "linh" đệm hay không (nhóm đầu tiên đọc tự nhiên, không đệm). */
function readThreeDigits(n: number, isFirstGroup: boolean): string {
  const hundred = Math.floor(n / 100);
  const remainder = n % 100;
  const ten = Math.floor(remainder / 10);
  const unit = remainder % 10;
  const parts: string[] = [];

  if (hundred > 0) {
    parts.push(`${ONES[hundred]} trăm`);
  } else if (!isFirstGroup && remainder > 0) {
    parts.push("không trăm");
  }

  if (ten === 0) {
    if (unit > 0) {
      // Cần "linh" khi đã có hàng trăm phía trước (hoặc đây không phải nhóm
      // đầu, tức đã có "không trăm" phía trước) — số đơn lẻ đầu chuỗi thì
      // đọc thẳng (VD 5000 -> "năm nghìn", không phải "linh năm nghìn").
      parts.push(hundred > 0 || !isFirstGroup ? `linh ${ONES[unit]}` : ONES[unit]);
    }
  } else if (ten === 1) {
    parts.push(unit === 0 ? "mười" : unit === 5 ? "mười lăm" : `mười ${ONES[unit]}`);
  } else {
    const tenWord = `${ONES[ten]} mươi`;
    if (unit === 0) parts.push(tenWord);
    else if (unit === 1) parts.push(`${tenWord} mốt`);
    else if (unit === 5) parts.push(`${tenWord} lăm`);
    else parts.push(`${tenWord} ${ONES[unit]}`);
  }

  return parts.join(" ");
}

/** Đọc 1 số nguyên dương bằng chữ (chưa gắn đơn vị "đồng"). */
function readInteger(value: number): string {
  if (value === 0) return "không";
  const groups: number[] = [];
  let n = Math.floor(value);
  while (n > 0) {
    groups.unshift(n % 1000);
    n = Math.floor(n / 1000);
  }
  const totalGroups = groups.length;
  const rendered: string[] = [];
  groups.forEach((g, idx) => {
    if (g === 0) return;
    const unitIdx = totalGroups - 1 - idx;
    const words = readThreeDigits(g, rendered.length === 0);
    rendered.push(GROUP_UNITS[unitIdx] ? `${words} ${GROUP_UNITS[unitIdx]}` : words);
  });
  return rendered.join(" ").replace(/\s+/g, " ").trim();
}

/** "Một triệu hai trăm chín mươi chín nghìn đồng" — viết hoa chữ cái đầu,
 * luôn gắn hậu tố "đồng". Số âm/không phải số nguyên hữu hạn trả về "" để
 * nơi gọi tự bỏ qua dòng "Bằng chữ" thay vì hiển thị chữ sai. */
export function amountToVietnameseWords(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "";
  const words = readInteger(Math.round(amount));
  return words.charAt(0).toUpperCase() + words.slice(1) + " đồng";
}
