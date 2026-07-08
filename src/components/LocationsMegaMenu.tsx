"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, MapPinIcon, PhoneIcon } from "./icons";
import Button from "./Button";
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
            className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[860px] max-w-[92vw] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              <div className="grid grid-cols-2 gap-1 p-5 sm:grid-cols-3">
                {LOCATIONS_LIST.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="group flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-bg-tint"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <MapPinIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] leading-snug font-bold text-navy">
                        {loc.name}
                      </span>
                      <span className="block truncate text-[11.5px] text-body-text">
                        {loc.shortAddress}
                      </span>
                      {loc.tag && (
                        <span className="mt-1 inline-block rounded-full bg-accent/8 px-2 py-0.5 text-[10px] font-bold text-accent">
                          {loc.tag}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="flex flex-col items-start gap-3 border-t border-line bg-bg-tint px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-[12.5px] text-body-text">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
                  12 chi nhánh trung tâm TP.HCM — luôn có vị trí phù hợp nhu cầu của bạn
                </p>
                <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                  <Button
                    href="tel:0898082188"
                    variant="ghost"
                    icon={<PhoneIcon className="h-3.5 w-3.5" />}
                    className="flex-1 !px-4 !py-2 !text-[12.5px] sm:flex-none"
                  >
                    Gọi ngay
                  </Button>
                  <Button
                    href="/#lead"
                    variant="primary"
                    className="flex-1 !px-4 !py-2 !text-[12.5px] sm:flex-none"
                  >
                    Đặt lịch tham quan
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
