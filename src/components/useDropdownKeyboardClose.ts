"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/** Đóng dropdown header (Dịch vụ/Tiện ích/Chi nhánh) bằng bàn phím — dùng
    chung cho cả 3, bổ sung THÊM vào cơ chế hover-leave hẹn giờ 150ms sẵn có
    (không thay thế), vì cơ chế đó chỉ phản ứng với chuột rời khỏi vùng,
    không phản ứng với bàn phím:
    - Phím Escape: đóng ngay bất kể đang focus ở đâu trong trang, miễn
      dropdown đang mở (không cần focus nằm trong menu).
    - Tab ra khỏi TOÀN BỘ vùng dropdown (nút trigger + nội dung mở): dùng
      sự kiện `focusout` nổi bọt trên chính div bọc ngoài, kiểm tra
      `relatedTarget` (phần tử SẮP nhận focus) có còn nằm trong vùng đó
      không — nếu không (kể cả rời hẳn khỏi trang) thì đóng, tránh menu bị
      "kẹt" mở khi người dùng đã Tab tiếp sang chỗ khác. */
export function useDropdownKeyboardClose(
  open: boolean,
  close: () => void,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const node = containerRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (!node || !next || !node.contains(next)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    node?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [open, close, containerRef]);
}
