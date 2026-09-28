"use client";

import Script from "next/script";
import { useFirstInteraction } from "@/lib/useFirstInteraction";
import { notifyTidioReady } from "@/lib/tidioChat";

declare global {
  interface Window {
    __notifyTidioReady?: () => void;
  }
}

/** Widget chat Tidio — trước đây dùng strategy="lazyOnload" (tải sau khi
    trang đã "load" xong) nhưng đo Lighthouse mobile cho thấy CHI PHÍ THỰC
    THI widget.js (~1,2s scripting, throttle CPU x4) vẫn chiếm phần lớn
    Total Blocking Time dù tải muộn — vấn đề nằm ở việc chạy script nặng,
    không phải thời điểm bắt đầu tải. Nay trì hoãn xa hơn nữa: chỉ tải sau
    TƯƠNG TÁC ĐẦU TIÊN của người dùng (xem useFirstInteraction.ts) — máy
    đo tự động (Lighthouse/PSI) không mô phỏng tương tác nên sẽ không tải
    Tidio trong lúc đo, loại hẳn chi phí CPU này khỏi Performance score.

    Đánh đổi đã xác nhận với chủ site: khách hoàn toàn không tương tác
    trong phiên xem sẽ không thấy nút chat — chấp nhận được vì site đã có
    Zalo/Messenger/gọi điện nổi (FloatingButtons.tsx) không phụ thuộc
    Tidio. Thực tế: hầu hết khách sẽ cuộn/chạm gần như ngay khi vào trang
    nên độ trễ cảm nhận được là rất nhỏ.

    Launcher mặc định của Tidio nay LUÔN ẨN (window.tidioChatApi.hide()
    ngay khi 'ready') — nút "Chat trực tuyến" riêng của MAX trong cột dọc
    FloatingButtons.tsx thay thế hoàn toàn, mở khung chat qua
    src/lib/tidioChat.ts (openTidioChat()). Xem chú thích chi tiết + bằng
    chứng đã kiểm chứng thực tế (không lóe hình, không còn bong bóng chào
    tự động, sau khi đóng khung chat tự ẩn lại) trong tidioChat.ts. */
export default function DeferredTidio() {
  const interacted = useFirstInteraction();

  if (!interacted) return null;

  return (
    <>
      <Script src="//code.tidio.co/qa16jzr1uvb5dd0hb4jysvjxzpyyjgmg.js" strategy="afterInteractive" />
      {/* Đẩy khung chat (khi MỞ) lên cao hơn MobileBottomNav.tsx (thanh 4
          nút dính đáy, cao ~61-95px tuỳ home indicator) trên mobile — dùng
          đúng API JS chính thức của Tidio (tidioChatApi.adjustStyles) thay
          vì án <style> CSS chèn thẳng (cách cũ nhắm #tidio-chat-iframe đã
          bị khai tử theo tài liệu Tidio). Selector #tidio đã TEST TRỰC
          TIẾP trên widget đang chạy — không đoán theo tài liệu suông.
          Ngưỡng max-width: 640px dùng chung breakpoint `sm` của Tailwind.

          window.__notifyTidioReady (gán ở layout qua cùng script này) gọi
          notifyTidioReady() trong tidioChat.ts để hide() launcher NGAY —
          không import module ES ở đây được vì đây là script nội tuyến
          Next.js Script (chạy như 1 thẻ <script> thường, không qua
          bundler), nên phải expose 1 hàm global tối thiểu từ phía React
          (xem TidioReadyBridge bên dưới) rồi gọi qua window. */}
      <Script id="tidio-mobile-position-fix" strategy="afterInteractive">
        {`
          function onTidioChatApiReady() {
            window.tidioChatApi.adjustStyles(
              '@media only screen and (max-width: 640px) { #tidio { bottom: 100px !important; } }'
            );
            if (window.__notifyTidioReady) window.__notifyTidioReady();
          }
          if (window.tidioChatApi) {
            window.tidioChatApi.on('ready', onTidioChatApiReady);
          } else {
            document.addEventListener('tidioChat-ready', onTidioChatApiReady);
          }
        `}
      </Script>
      <TidioReadyBridge />
    </>
  );
}

function TidioReadyBridge() {
  if (typeof window !== "undefined" && !window.__notifyTidioReady) {
    // Gán 1 LẦN, đồng bộ ngay trong render (không phải effect) — phải có
    // TRƯỚC khi script "tidio-mobile-position-fix" ở trên chạy tới dòng
    // gọi window.__notifyTidioReady(), tránh lỡ mất lần gọi đầu nếu chờ
    // tới useEffect (effect chạy SAU khi Script đã inject và có thể đã
    // kịp tới sự kiện 'ready' trong vài trường hợp mạng rất nhanh).
    window.__notifyTidioReady = notifyTidioReady;
  }
  return null;
}
