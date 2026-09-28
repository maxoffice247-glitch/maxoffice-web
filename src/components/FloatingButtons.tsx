"use client";

import { useEffect, useState } from "react";
import { PhoneIcon, MessengerIcon, ZaloIcon, ChatBotIcon, SpinnerIcon } from "./icons";
import {
  openTidioChat,
  useTidioAnnouncement,
  useTidioReady,
  useTidioUnread,
} from "@/lib/tidioChat";

/** Cụm nút liên hệ nổi — MỘT CỘT DỌC duy nhất ở góc dưới phải (trước đây
    tách 2 bên: linh vật + popup click-để-mở bên trái, launcher Tidio mặc
    định bên phải — nay gộp lại theo đúng layout mẫu người dùng cung cấp:
    nhãn → linh vật chỉ tay xuống → Gọi điện → Zalo → Messenger → Chat).

    Các nút LUÔN HIỆN (không còn state open/đóng, không còn AnimatePresence
    popup) — đơn giản hoá hẳn so với bản cũ. Linh vật + nhãn "Liên hệ ngay"
    nay CHỈ TRANG TRÍ (pointer-events-none, aria-hidden) vì không còn là
    trigger của popup nào — 4 nút bên dưới mới là điểm bấm thật.

    Desktop (>= sm): đủ 4 nút (Gọi/Zalo/Messenger/Chat).
    Mobile (< sm): CHỈ nút Chat (Gọi/Zalo/Messenger đã có sẵn trên
    MobileBottomNav.tsx — không lặp lại), đặt ngay trên thanh nav đó, có
    chừa safe-area-inset-bottom cho iPhone có home indicator. */

const OPEN_ICON_SIZE = "h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]";

const BUTTON_BASE =
  "relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 focus-visible:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[50px] sm:w-[50px]";

const CONTACT_LINKS = [
  {
    key: "phone" as const,
    href: "tel:0898082188",
    ariaLabel: "Gọi điện 089 8082 188",
    icon: PhoneIcon,
    external: false,
    bg: "bg-accent",
  },
  {
    key: "zalo" as const,
    href: "https://zalo.me/0898082188",
    ariaLabel: "Chat Zalo",
    icon: ZaloIcon,
    external: true,
    bg: "bg-[#0068FF]",
  },
  {
    key: "messenger" as const,
    href: "https://www.facebook.com/maxoffice.hcm/",
    ariaLabel: "Chat Messenger",
    icon: MessengerIcon,
    external: true,
    bg: "bg-[#0084FF]",
  },
];

/** Nút "Chat trực tuyến" — mở khung chat Tidio qua src/lib/tidioChat.ts
    (show()+open(), xem chú thích ở đó) thay vì launcher mặc định (đã ẩn
    hẳn). Nếu Tidio chưa tải xong lúc bấm (VD bấm ngay khi trang vừa vào,
    trước khi có tương tác nào khác) — hiện spinner, tự mở khi sẵn sàng;
    có hẹn giờ 12s tự tắt spinner nếu Tidio không tải được (mất mạng,
    ad-block) để không kẹt trạng thái chờ mãi — bấm lại vẫn thử tiếp bình
    thường. Kích thước nút KHÔNG đổi giữa 2 trạng thái (chỉ đổi icon bên
    trong) để không giật layout. */
function ChatButton({ className }: { className?: string }) {
  const ready = useTidioReady();
  const unread = useTidioUnread();
  const announcement = useTidioAnnouncement();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!pending) return;
    const t = window.setTimeout(() => setPending(false), 12000);
    return () => window.clearTimeout(t);
  }, [pending]);

  const handleClick = () => {
    if (!ready) setPending(true);
    openTidioChat(() => setPending(false));
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          unread
            ? "Chat trực tuyến, có tin nhắn mới"
            : "Chat trực tuyến với trợ lý MAX OFFICE"
        }
        className={`${BUTTON_BASE} bg-gradient-to-br from-[#4FACFE] to-[#0068FF] ${className ?? ""}`}
      >
        {pending ? (
          <SpinnerIcon className="h-5 w-5" />
        ) : (
          <>
            <ChatBotIcon className={OPEN_ICON_SIZE} />
            {/* Chấm "online" — trang trí, không mang thông tin trạng thái
                thật (Tidio có thể offline, xem lời chào mặc định "Hiện tại
                chúng tôi đang offline..."), nên aria-hidden. */}
            <span
              aria-hidden
              className="animate-chat-online-pulse absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]"
            />
            {/* Chấm "có tin nhắn mới" — góc trên-TRÁI, màu đỏ, cố ý khác cả
                vị trí lẫn màu với chấm online ở trên-phải. aria-hidden vì
                trạng thái đã được truyền đạt qua aria-label (thay đổi khi
                unread) + vùng aria-live bên dưới, tránh trùng lặp thông tin
                cho trình đọc màn hình. position: absolute, kích thước cố
                định — không đổi kích thước nút, không gây CLS. */}
            {unread && (
              <span
                aria-hidden
                className="animate-chat-unread-pulse absolute -top-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#EF4444]"
              />
            )}
          </>
        )}
      </button>
      {/* Vùng thông báo cho trình đọc màn hình — đọc 1 LẦN mỗi khi có tin
          nhắn mới hợp lệ tới (xem triggerAnnounce() trong tidioChat.ts, kỹ
          thuật zero-width space để buộc đọc lại cho từng tin dù nội dung
          hiển thị giống hệt lần trước). Rỗng ban đầu nên không đọc gì lúc
          trang vừa tải. */}
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}

export default function FloatingButtons() {
  return (
    <div
      className="fixed right-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[96] flex flex-col items-center gap-2.5 sm:right-5 sm:bottom-5 sm:gap-3"
      aria-hidden={false}
    >
      {/* Nhãn tĩnh — CHỈ TRANG TRÍ, không còn là nút (khác bản cũ: trước
          đây bấm được để mở popup). Vì không tương tác được nên không cần
          aria-label chứa chữ hiển thị như yêu cầu accessibility trước đó
          — yêu cầu đó áp dụng cho NÚT, đây giờ là span thuần tuý. */}
      <span
        aria-hidden
        className="rounded-full bg-accent px-2 py-1 text-[10px] leading-none font-bold whitespace-nowrap text-white shadow-[0_6px_14px_rgba(0,0,0,0.22)] sm:px-3 sm:py-1.5 sm:text-[12px] sm:shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
      >
        Liên hệ ngay
      </span>

      {/* Linh vật chỉ tay xuống các nút bên dưới — CHỈ TRANG TRÍ. Trì hoãn
          bản động tới sau window "load" (giữ nguyên kỹ thuật đã áp dụng ở
          bản cũ — xem lý do trong git history: giảm tranh băng thông lúc
          tải trang, đo Lighthouse xác nhận). */}
      <MascotDecoration />

      {/* Gọi điện/Zalo/Messenger: CHỈ desktop — mobile đã có 3 nút này trên
          MobileBottomNav.tsx, không lặp lại. `hidden sm:contents` để 3 nút
          vẫn nằm ĐÚNG vị trí trong cùng 1 cột flex của cha (không tạo thêm
          1 cấp flex con làm lệch gap) khi hiện ở desktop. */}
      <div className="hidden sm:contents">
        {CONTACT_LINKS.map((opt) => (
          <a
            key={opt.key}
            href={opt.href}
            target={opt.external ? "_blank" : undefined}
            rel={opt.external ? "noopener" : undefined}
            aria-label={opt.ariaLabel}
            className={`${BUTTON_BASE} ${opt.bg}`}
          >
            <opt.icon className={OPEN_ICON_SIZE} />
          </a>
        ))}
      </div>

      <ChatButton />
    </div>
  );
}

function MascotDecoration() {
  // Trì hoãn tải bản WebP ĐỘNG tới SAU KHI trang đã load xong (window
  // "load"), thay vì tải ngay từ đầu trên MỌI trang — xem lý do đầy đủ
  // (đo Lighthouse mobile, tranh băng thông với ảnh Hero) trong git
  // history của bản linh vật góc trái cũ, áp dụng y hệt cho bản mới.
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onLoad = () => setAnimate(true);
    if (document.readyState === "complete") {
      // setTimeout(0) thay vì gọi setState thẳng trong thân effect — tránh
      // lỗi lint react-hooks/set-state-in-effect (setState đồng bộ trong
      // effect có thể gây render dây chuyền).
      const t = window.setTimeout(onLoad, 0);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <picture>
      <img
        src={
          animate
            ? "/images/mascot/linh-vat-max-chi-xuong-widget-v1.webp"
            : "/images/mascot/linh-vat-max-chi-xuong-widget-v1-tinh.webp"
        }
        alt=""
        aria-hidden
        width={168}
        height={152}
        decoding="async"
        className="pointer-events-none block h-[76px] w-[84px] object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
      />
    </picture>
  );
}
