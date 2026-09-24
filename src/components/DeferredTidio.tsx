"use client";

import Script from "next/script";
import { useFirstInteraction } from "@/lib/useFirstInteraction";

/** Widget chat Tidio — trước đây dùng strategy="lazyOnload" (tải sau khi
    trang đã "load" xong) nhưng đo Lighthouse mobile cho thấy CHI PHÍ THỰC
    THI widget.js (~1,2s scripting, throttle CPU x4) vẫn chiếm phần lớn
    Total Blocking Time dù tải muộn — vấn đề nằm ở việc chạy script nặng,
    không phải thời điểm bắt đầu tải. Nay trì hoãn xa hơn nữa: chỉ tải sau
    TƯƠNG TÁC ĐẦU TIÊN của người dùng (xem useFirstInteraction.ts) — máy
    đo tự động (Lighthouse/PSI) không mô phỏng tương tác nên sẽ không tải
    Tidio trong lúc đo, loại hẳn chi phí CPU này khỏi Performance score.

    Đánh đổi đã xác nhận với chủ site: khách hoàn toàn không tương tác
    trong phiên xem sẽ không thấy nút chat Tidio — chấp nhận được vì site
    đã có Zalo/Messenger/gọi điện nổi (FloatingButtons.tsx) không phụ
    thuộc Tidio. Thực tế: hầu hết khách sẽ cuộn/chạm gần như ngay khi vào
    trang nên độ trễ cảm nhận được là rất nhỏ.

    FloatingButtons đã chuyển sang góc trái nên không còn chồng lấn với
    Tidio (mặc định góc phải) trên desktop. Trên mobile, dashboard Tidio
    (Settings → Live Chat → Appearance → Visibility and position) KHÔNG có
    ô chỉnh lề dưới riêng cho mobile (theo tài liệu help.tidio.com) — phải
    chỉnh qua code, xem script "tidio-mobile-position-fix" bên dưới để né
    MobileBottomNav.tsx. */
export default function DeferredTidio() {
  const interacted = useFirstInteraction();

  if (!interacted) return null;

  return (
    <>
      <Script src="//code.tidio.co/qa16jzr1uvb5dd0hb4jysvjxzpyyjgmg.js" strategy="afterInteractive" />
      {/* Đẩy bong bóng Tidio lên cao hơn MobileBottomNav.tsx (thanh 4 nút
          dính đáy, cao ~61-95px tuỳ home indicator) trên mobile. Dùng
          đúng API JS chính thức hiện hành của Tidio
          (tidioChatApi.adjustStyles, đăng ký qua event 'ready'/
          'tidioChat-ready') thay vì án <style> CSS chèn thẳng — theo tài
          liệu Tidio, cách CSS cũ nhắm #tidio-chat-iframe đã bị khai tử.

          Selector #tidio đã TEST TRỰC TIẾP trên widget đang chạy (gọi
          tidioChatApi.adjustStyles() qua console, xem bong bóng di
          chuyển thật) — không đoán theo tài liệu suông. Lưu ý: outer
          wrapper mà Tidio chèn vào DOM của trang lại có id="tidio-chat"
          (khác với "#tidio" mà tài liệu/adjustStyles nhắm tới) — đã thử
          cả 2, chỉ "#tidio" có tác dụng. Ngưỡng max-width: 640px dùng
          chung breakpoint `sm` của Tailwind — đúng breakpoint
          FloatingButtons.tsx đang dùng để chuyển mobile/desktop. */}
      <Script id="tidio-mobile-position-fix" strategy="afterInteractive">
        {`
          function onTidioChatApiReady() {
            window.tidioChatApi.adjustStyles(
              '@media only screen and (max-width: 640px) { #tidio { bottom: 100px !important; } }'
            );
          }
          if (window.tidioChatApi) {
            window.tidioChatApi.on('ready', onTidioChatApiReady);
          } else {
            document.addEventListener('tidioChat-ready', onTidioChatApiReady);
          }
        `}
      </Script>
    </>
  );
}
