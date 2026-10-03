"use client";

import { useRef, type ChangeEvent } from "react";

/** Dùng chung cho công cụ Đề nghị thanh toán và form Hồ sơ thành lập doanh
 * nghiệp (trước đây nằm trong PaymentRequestTool.tsx). */
/** Chèn dấu "." phân cách hàng nghìn CHỈ ĐỂ HIỂN THỊ (VD "36.300.000") —
 * không đổi giá trị thật, chỉ đổi cách trình bày trong ô nhập, giúp phát
 * hiện ngay khi gõ nhầm thiếu/thừa số 0 ở số tiền lớn (VD 10.000.000 vs
 * 100.000.000). State/tính toán vẫn luôn là chuỗi số thuần (toInt() ở trên
 * tự strip dấu "." nên không cần đổi gì ở logic tính). */
function formatThousands(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Ô nhập tiền có dấu phân cách hàng nghìn tự động — tự giữ đúng vị trí con
 * trỏ khi gõ/xoá GIỮA CHỪNG số (không chỉ gõ nối ở cuối), vì format lại
 * toàn bộ chuỗi mỗi lần gõ sẽ tự đẩy con trỏ ra cuối nếu không tính lại thủ
 * công — đếm số CHỮ SỐ (không tính dấu chấm) đứng trước con trỏ ở giá trị
 * cũ, rồi đặt lại con trỏ ở đúng vị trí có cùng số chữ số đứng trước trong
 * chuỗi đã format mới. */
export default function MoneyInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  name,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPos = el.selectionStart ?? el.value.length;
    const digitsBeforeCursor = el.value.slice(0, cursorPos).replace(/\D/g, "").length;
    const rawDigits = el.value.replace(/\D/g, "");
    onChange(rawDigits);
    requestAnimationFrame(() => {
      const input = ref.current;
      if (!input) return;
      const formatted = formatThousands(rawDigits);
      let seen = 0;
      let newPos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen === digitsBeforeCursor) {
          newPos = i + 1;
          break;
        }
      }
      if (digitsBeforeCursor === 0) newPos = 0;
      input.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={formatThousands(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      id={id}
      name={name}
      autoComplete="off"
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    />
  );
}
