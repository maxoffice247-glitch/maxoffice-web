"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessengerIcon, PhoneIcon, PlusIcon } from "./icons";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

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
    <div
      ref={rootRef}
      className="fixed right-4 bottom-[80px] z-[97] flex flex-col items-end gap-3 sm:right-[22px] sm:bottom-6"
    >
      <AnimatePresence>
        {open && (
          <>
            <motion.a
              key="messenger"
              href="https://www.facebook.com/maxoffice.hcm/"
              target="_blank"
              rel="noopener"
              title="Messenger"
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.8 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM, delay: 0.06 }}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:h-[50px] sm:w-[50px]"
            >
              <MessengerIcon />
            </motion.a>
            <motion.a
              key="zalo"
              href="https://zalo.me/0898082188"
              target="_blank"
              rel="noopener"
              title="Zalo"
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.8 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#0068FF] text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:h-[50px] sm:w-[50px]"
            >
              <span className="font-mono text-[12.5px] font-extrabold sm:text-[13px]">Zalo</span>
            </motion.a>
          </>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Đóng danh sách liên hệ" : "Mở danh sách liên hệ"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_20px_rgba(11,31,58,0.3)] transition-transform duration-300 hover:scale-110 sm:h-10 sm:w-10"
        >
          <PlusIcon className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
        </button>
        <a
          href="tel:0898082188"
          title="Gọi ngay"
          className="animate-pulse-call flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:h-[54px] sm:w-[54px]"
        >
          <PhoneIcon className="h-[22px] w-[22px]" />
        </a>
      </div>
    </div>
  );
}
