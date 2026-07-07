"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "./icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";

export default function LocationsMegaMenu({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const linkColor = solid ? "text-ink" : "text-white/90";

  return (
    <div className="relative flex items-center" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href="/dia-diem"
        className={`text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-accent ${linkColor}`}
      >
        Chi nhánh
      </Link>
      <button
        type="button"
        aria-label="Xem danh sách chi nhánh"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center py-1 pl-1 transition-colors duration-300 hover:text-accent ${linkColor}`}
      >
        <ChevronDownIcon className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 0.9, 0.32, 1] }}
            className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[300px] -translate-x-1/2"
          >
            <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-line bg-white p-2.5 shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              {LOCATIONS_LIST.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-navy transition-colors duration-200 hover:bg-bg-tint hover:text-primary"
                >
                  {loc.name}
                  {loc.tag && (
                    <span className="shrink-0 rounded-full bg-accent/8 px-2 py-0.5 text-[10.5px] font-bold text-accent">
                      {loc.tag}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
