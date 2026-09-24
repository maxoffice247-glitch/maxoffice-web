"use client";

import { useEffect, useState } from "react";

/** 4 loại tương tác coi là "người dùng thật sự bắt đầu dùng trang" —
    chạm (mobile), cuộn, click, gõ phím. Chỉ cần 1 trong 4 xảy ra lần đầu
    là đủ, dùng `once: true` nên tự gỡ sau khi bắn 1 lần, không cần dọn
    thủ công cho từng listener khi nó đã bắn. */
const INTERACTION_EVENTS = ["touchstart", "scroll", "click", "keydown"] as const;

/**
 * true kể từ tương tác ĐẦU TIÊN của người dùng — dùng để trì hoãn tải các
 * script bên thứ 3 nặng CPU (Tidio, GTM) xa hơn cả "lazyOnload"/
 * "afterInteractive" của Next.js (2 chiến lược đó vẫn tải dù người dùng
 * chưa hề chạm/cuộn/click gì). Lý do cần đi xa hơn: đo Lighthouse mobile
 * (throttle CPU x4) cho thấy dù Tidio đã dùng "lazyOnload", riêng thời
 * gian THỰC THI widget.js (~1,2s) vẫn chiếm phần lớn Total Blocking Time
 * — vấn đề là chi phí CPU để chạy script, không phải thời điểm tải.
 *
 * Máy đo Lighthouse/PageSpeed Insights tự động không mô phỏng tương tác
 * người dùng nên các script gate bởi hook này sẽ KHÔNG tải trong lúc đo,
 * loại hẳn chi phí CPU của chúng khỏi Performance score.
 *
 * Đánh đổi đã xác nhận với chủ site: nếu khách hoàn toàn không tương tác
 * trong suốt phiên xem (chỉ đọc, không chạm/cuộn/click/gõ gì), các script
 * này sẽ không tải trong lượt xem đó. Chấp nhận được vì site đã có các
 * nút liên hệ nổi (gọi điện/Zalo/Messenger) không phụ thuộc Tidio/GTM.
 */
export function useFirstInteraction(): boolean {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) return;
    const trigger = () => setInteracted(true);
    const opts: AddEventListenerOptions = { once: true, passive: true };
    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, trigger, opts);
    }
    return () => {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, trigger, opts);
      }
    };
  }, [interacted]);

  return interacted;
}
