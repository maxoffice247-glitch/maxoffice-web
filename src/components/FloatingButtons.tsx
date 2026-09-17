"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneIcon, MessengerIcon, ZaloIcon } from "./icons";

/** Linh vật MAX bay lượn — nay là TRIGGER DUY NHẤT của speed-dial liên hệ
    (gọi điện/Zalo/Messenger), tham khảo hiệu ứng nổi bật ở góc dưới phải
    acb.com.vn (KHÔNG phải khung chat AI của họ, chỉ lấy cảm hứng phần
    linh vật trôi nổi liên tục, theo đúng yêu cầu người dùng). Hoạt hoạ
    trôi nổi bằng CSS thuần (.animate-mascot-fly, xem globals.css) thay vì
    cần dựng GIF/video từ ảnh gốc.

    Trước đây linh vật link thẳng tới Zalo VÀ có một nút tròn speed-dial
    riêng biệt bên dưới (2 điểm chạm tách rời, dư thừa) — nay gộp làm một:
    bấm linh vật để mở/đóng popup 3 lựa chọn, dùng chung state
    `open`/`onToggle` với popup (component cha truyền vào). Vị trí bên
    trái của linh vật giữ nguyên như trước khi gộp (không đổi): mobile
    left-1/bottom-140px, desktop left-[14px]/bottom-[92px].

    Popup 3 lựa chọn (xem FloatingButtons() bên dưới) neo NGAY PHÍA TRÊN
    linh vật thay vì giữ toạ độ neo cũ của nút tròn đã xoá (trước đây
    left-22/bottom-6) — bắt buộc phải đổi neo vì linh vật giờ luôn hiển
    thị kể cả khi popup đang mở (để còn bấm lại đóng), trong khi nút tròn
    cũ nằm ở một vị trí khác và linh vật trước đây tự ẩn đi lúc mở
    (`{!open && <WavingMascotBubble />}`) để tránh đúng kiểu chồng lấn
    này; giữ nguyên toạ độ neo cũ sẽ khiến các nút Zalo/Messenger đè lên
    chính linh vật khi mở popup. */
function WavingMascotBubble({
  className,
  open,
  onToggle,
}: {
  className?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`z-[96] ${className ?? ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? "Đóng danh sách liên hệ" : "Mở danh sách liên hệ: gọi điện, Zalo, Messenger"}
        className="block drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110"
      >
        <Image
          src="/images/mascot/linh-vat-max-xin-chao.png"
          alt=""
          width={160}
          height={107}
          className="animate-mascot-fly h-[58px] w-auto object-contain"
        />
      </button>
    </div>
  );
}

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

// Same icon-to-button ratio for every option, so phone/Zalo/Messenger
// never look mismatched next to each other.
const OPEN_ICON_SIZE = "h-[23px] w-[23px] sm:h-[25px] sm:w-[25px]";

const CONTACT_OPTIONS = [
  {
    key: "phone" as const,
    href: "tel:0898082188",
    label: "Gọi ngay",
    ariaLabel: "Gọi ngay 089 8082 188",
    icon: PhoneIcon,
    external: false,
    bg: "bg-accent",
  },
  {
    key: "zalo" as const,
    href: "https://zalo.me/0898082188",
    label: "Zalo",
    ariaLabel: "Nhắn tin qua Zalo",
    icon: ZaloIcon,
    external: true,
    bg: "bg-[#0068FF]",
  },
  {
    key: "messenger" as const,
    href: "https://www.facebook.com/maxoffice.hcm/",
    label: "Messenger",
    ariaLabel: "Nhắn tin qua Messenger",
    icon: MessengerIcon,
    external: true,
    bg: "bg-[#0084FF]",
  },
];

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      {/* Mobile: nút gọi nhanh cố định riêng — Zalo/Messenger vẫn có sẵn
          trong MobileBottomNav. Linh vật bên dưới nay mở thêm popup 3 lựa
          chọn (gọi/Zalo/Messenger) nên trùng lối liên hệ với
          MobileBottomNav ở Zalo/Messenger — đây là đánh đổi có chủ đích
          khi gộp linh vật thành điểm chạm duy nhất; MobileBottomNav vẫn
          là thanh liên hệ độc lập, không phụ thuộc cụm này. */}
      <a
        href="tel:0898082188"
        aria-label="Gọi ngay 089 8082 188"
        className="animate-pulse-call fixed left-4 bottom-[80px] z-[97] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:hidden"
      >
        <PhoneIcon className="h-[22px] w-[22px]" />
      </a>

      <div ref={rootRef}>
        <WavingMascotBubble
          className="fixed left-1 bottom-[140px] sm:left-[14px] sm:bottom-[92px]"
          open={open}
          onToggle={() => setOpen((v) => !v)}
        />

        {/* Popup 3 lựa chọn — neo ngay phía trên linh vật (xem giải thích
            trong doc comment của WavingMascotBubble). */}
        <div className="fixed left-1 bottom-[210px] z-[97] flex flex-col items-end gap-3 sm:left-[14px] sm:bottom-[162px]">
          <AnimatePresence>
            {open &&
              [...CONTACT_OPTIONS].reverse().map((opt, idx) => (
                <motion.a
                  key={opt.key}
                  href={opt.href}
                  target={opt.external ? "_blank" : undefined}
                  rel={opt.external ? "noopener" : undefined}
                  title={opt.label}
                  aria-label={opt.ariaLabel}
                  initial={{ opacity: 0, y: 16, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: EASE_PREMIUM, delay: idx * 0.06 }}
                  className={`relative flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:h-[50px] sm:w-[50px] ${opt.bg}`}
                >
                  <opt.icon className={OPEN_ICON_SIZE} />
                </motion.a>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
