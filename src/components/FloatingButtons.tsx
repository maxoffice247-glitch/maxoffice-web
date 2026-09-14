"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PhoneIcon, PlusIcon, MessengerIcon, ZaloIcon } from "./icons";

const BUBBLE_FIRST_DELAY_MS = 3000;
const BUBBLE_REPEAT_MS = 12000;
const BUBBLE_VISIBLE_MS = 4000;

/** Linh vật MAX bay lượn cạnh cụm nút gọi/Zalo/Messenger, kèm bong bóng
    thoại nhắc nhở định kỳ — tham khảo hiệu ứng nổi bật ở góc dưới phải
    acb.com.vn (KHÔNG phải khung chat AI của họ, chỉ lấy cảm hứng phần
    linh vật trôi nổi liên tục + bong bóng thoại, theo đúng yêu cầu người
    dùng). Bấm vào link thẳng tới Zalo (kênh chat tức thời phổ biến nhất),
    khác với nút chính (gọi điện trên mobile, mở speed-dial trên desktop).
    Hoạt hoạ trôi nổi bằng CSS thuần (.animate-mascot-fly, xem
    globals.css) thay vì cần dựng GIF/video từ ảnh gốc. */
function WavingMascotBubble({ className }: { className?: string }) {
  const [showBubble, setShowBubble] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Giảm chuyển động -> không tự bật bong bóng định kỳ (gây xao nhãng),
    // nhân vật vẫn đứng yên (rule global đã tắt hẳn animation-duration).
    if (reduceMotion) return;
    let hideId: ReturnType<typeof setTimeout>;
    const tick = () => {
      setShowBubble(true);
      hideId = setTimeout(() => setShowBubble(false), BUBBLE_VISIBLE_MS);
    };
    const firstId = setTimeout(tick, BUBBLE_FIRST_DELAY_MS);
    const intervalId = setInterval(tick, BUBBLE_REPEAT_MS);
    return () => {
      clearTimeout(firstId);
      clearInterval(intervalId);
      clearTimeout(hideId);
    };
  }, [reduceMotion]);

  return (
    <div className={`z-[96] ${className ?? ""}`}>
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="absolute right-0 bottom-full mb-1.5 w-max max-w-[150px] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[12px] leading-snug font-bold text-navy shadow-[0_8px_20px_rgba(15,27,45,0.18)]"
          >
            Cần hỗ trợ? Nhắn Zalo ngay!
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href="https://zalo.me/0898082188"
        target="_blank"
        rel="noopener"
        aria-label="Chat Zalo với MAX OFFICE"
        title="Chat Zalo với MAX OFFICE"
        className="block drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110"
      >
        <Image
          src="/images/mascot/linh-vat-max-xin-chao.png"
          alt=""
          width={160}
          height={107}
          className="animate-mascot-fly h-[58px] w-auto object-contain"
        />
      </a>
    </div>
  );
}

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const CYCLE_INTERVAL_MS = 2600;

// Same icon-to-button ratio for every option in both states, so
// phone/Zalo/Messenger never look mismatched next to each other.
const CYCLE_ICON_SIZE = "h-[27px] w-[27px]";
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
  const [cycleIndex, setCycleIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Auto-cycle the closed button's icon through phone/Zalo/Messenger so
  // customers understand it opens multiple contact channels. Paused while
  // the speed-dial is open and skipped entirely under reduced motion.
  useEffect(() => {
    if (open || reduceMotion) return;
    const id = setInterval(() => {
      setCycleIndex((i) => (i + 1) % CONTACT_OPTIONS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [open, reduceMotion]);

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

  const current = CONTACT_OPTIONS[cycleIndex];

  return (
    <>
      {/* Mobile: single call button only — Zalo/Messenger already live in MobileBottomNav, so
          a duplicate speed-dial here would give two Zalo entry points on the same screen. */}
      <a
        href="tel:0898082188"
        aria-label="Gọi ngay 089 8082 188"
        className="animate-pulse-call fixed right-4 bottom-[80px] z-[97] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:hidden"
      >
        <PhoneIcon className="h-[22px] w-[22px]" />
      </a>
      <WavingMascotBubble className="fixed right-1 bottom-[140px] sm:hidden" />

      {/* Tablet/desktop: no bottom nav present, so the full phone/Zalo/Messenger speed-dial stays. */}
      {!open && <WavingMascotBubble className="fixed right-[14px] bottom-[92px] hidden sm:block" />}
      <div
        ref={rootRef}
        className="fixed right-[22px] bottom-6 z-[97] hidden flex-col items-end gap-3 sm:flex"
      >
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Đóng danh sách liên hệ" : "Mở danh sách liên hệ: gọi điện, Zalo, Messenger"}
          className="animate-pulse-call relative flex h-[54px] w-[54px] items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              >
                <PlusIcon className="h-[22px] w-[22px] rotate-45" />
              </motion.span>
            ) : (
              <motion.span
                key={current.key}
                initial={{ opacity: 0, y: 8, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.7 }}
                transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              >
                <current.icon className={CYCLE_ICON_SIZE} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}
