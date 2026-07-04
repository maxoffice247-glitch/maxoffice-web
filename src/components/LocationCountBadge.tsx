"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPinIcon, CloseIcon } from "./icons";

export default function LocationCountBadge({ locations }: { locations: string[] }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openWithRect = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setRect({ top: r.bottom, left: r.left + r.width / 2, width: r.width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div onMouseEnter={openWithRect} onMouseLeave={() => setOpen(false)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openWithRect())}
        className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-body-text transition-colors duration-200 hover:border-primary/40 hover:text-primary"
      >
        <MapPinIcon className="h-3 w-3 shrink-0" />
        {locations.length} chi nhánh
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            {/* Desktop popover, positioned via measured trigger rect to escape any clipped/scrollable ancestor */}
            {rect && (
              <div
                className="fixed z-30 hidden w-64 -translate-x-1/2 rounded-2xl border border-line bg-white p-4 text-left shadow-card md:block"
                style={{ top: rect.top + 8, left: rect.left }}
              >
                <p className="mb-2 text-[12px] font-bold text-navy">
                  Áp dụng tại {locations.length} chi nhánh
                </p>
                <ul className="max-h-64 space-y-1.5 overflow-y-auto">
                  {locations.map((loc) => (
                    <li key={loc} className="text-[12.5px] leading-snug text-body-text">
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile bottom sheet */}
            <div className="md:hidden">
              <div className="fixed inset-0 z-40 bg-navy/40" onClick={() => setOpen(false)} />
              <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-line bg-white p-6 shadow-[0_-10px_40px_rgba(11,31,58,0.2)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[16px] font-bold text-navy">
                    Áp dụng tại {locations.length} chi nhánh
                  </span>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
                    <CloseIcon className="h-5 w-5 text-body-text" />
                  </button>
                </div>
                <ul className="max-h-[50vh] space-y-2.5 overflow-y-auto">
                  {locations.map((loc) => (
                    <li key={loc} className="text-[14px] leading-relaxed text-body-text">
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
