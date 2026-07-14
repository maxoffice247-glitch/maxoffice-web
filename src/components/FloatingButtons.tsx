"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PhoneIcon, PlusIcon } from "./icons";
import BrandIcon from "./BrandIcon";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const CYCLE_INTERVAL_MS = 2600;

const CONTACT_OPTIONS = [
  {
    key: "phone" as const,
    href: "tel:0898082188",
    label: "Gọi ngay",
    ariaLabel: "Gọi ngay 089 8082 188",
    icon: PhoneIcon,
    image: null,
    external: false,
    bg: "bg-accent",
  },
  {
    key: "zalo" as const,
    href: "https://zalo.me/0898082188",
    label: "Zalo",
    ariaLabel: "Nhắn tin qua Zalo",
    icon: null,
    image: "zalo" as const,
    external: true,
    bg: "bg-white",
  },
  {
    key: "messenger" as const,
    href: "https://www.facebook.com/maxoffice.hcm/",
    label: "Messenger",
    ariaLabel: "Nhắn tin qua Messenger",
    icon: null,
    image: "messenger" as const,
    external: true,
    bg: "bg-white",
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
          a duplicate speed-dial here would give two Zalo entry points on the same screen.
          Raised to bottom-[150px] (was 80px) to clear the Elfsight Facebook Chat bubble,
          which docks itself at the page's bottom-right corner above the bottom nav. */}
      <a
        href="tel:0898082188"
        aria-label="Gọi ngay 089 8082 188"
        className="animate-pulse-call fixed right-4 bottom-[150px] z-[97] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:hidden"
      >
        <PhoneIcon className="h-[22px] w-[22px]" />
      </a>

      {/* Tablet/desktop: no bottom nav present, so the full phone/Zalo/Messenger speed-dial stays.
          Raised to bottom-[104px] (was bottom-6/24px) to clear the Elfsight Facebook Chat bubble,
          which docks itself at the page's bottom-right corner. */}
      <div
        ref={rootRef}
        className="fixed right-[22px] bottom-[104px] z-[97] hidden flex-col items-end gap-3 sm:flex"
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
                {opt.image ? (
                  <BrandIcon type={opt.image} className="h-full w-full" sizes="50px" />
                ) : (
                  opt.icon && <opt.icon className="h-5 w-5" />
                )}
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
                {current.image ? (
                  <BrandIcon type={current.image} className="h-[22px] w-[22px]" sizes="22px" />
                ) : (
                  current.icon && <current.icon className="h-[22px] w-[22px]" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}
