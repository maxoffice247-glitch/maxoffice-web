"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "./icons";

export type QuotePlanOption = { key: string; name: string };

/**
 * Nút "📄 Tạo báo giá" DUY NHẤT ở đầu section "Văn phòng ảo" — thay cho nút
 * lặp lại dưới TỪNG card gói trước đây (2-4 nút giống hệt nhau tuỳ chi
 * nhánh, gây nhiễu thị giác). Bấm mở dropdown ngắn liệt kê ĐÚNG tên các gói
 * của CHÍNH chi nhánh đang xem (`plans`, truyền từ nơi gọi theo đúng hệ giá
 * — LITE-RISE/SAVE-SGP/SGP — không phải danh sách cứng), chọn 1 gói điều
 * hướng thẳng tới `/tien-ich/tim-goi-phu-hop/{slug}/{plan.key}` (trang chi
 * tiết gói đã có sẵn preview + xuất PNG báo giá qua PlanDetailActions/
 * PlanQuoteCard).
 *
 * KHÔNG dùng trang trung gian `/tien-ich/tim-goi-phu-hop/{slug}` (liệt kê
 * mọi gói của 1 chi nhánh trước khi vào trang chi tiết gói) vì trang đó
 * CHƯA TỒN TẠI — đã rà soát route trước khi làm, chỉ có
 * `/tien-ich/tim-goi-phu-hop/[slug]/[plan]`, không có `page.tsx` nào riêng
 * ở cấp `[slug]`. Dropdown này là giải pháp thay thế được xác nhận trước
 * khi triển khai, không tự ý thêm route mới.
 */
export default function QuotePlanMenu({ slug, plans }: { slug: string; plans: QuotePlanOption[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (plans.length === 0) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-line bg-white px-3.5 py-2 text-[12.5px] font-bold text-navy transition-all duration-200 hover:border-primary hover:text-primary"
      >
        📄 Tạo báo giá
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white shadow-[0_20px_40px_rgba(15,27,45,0.14)]"
        >
          {plans.map((p) => (
            <Link
              key={p.key}
              href={`/tien-ich/tim-goi-phu-hop/${slug}/${p.key}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-bg-tint hover:text-primary"
            >
              Gói {p.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
