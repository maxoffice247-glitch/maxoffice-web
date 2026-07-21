"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPinIcon, CloseIcon } from "./icons";

export default function LocationCountBadge({ locations }: { locations: string[] }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const openWithRect = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setRect({ top: r.bottom, left: r.left + r.width / 2, width: r.width });
    setOpen(true);
  };

  // Click-to-open on both desktop and mobile — a hover-only popup can't be
  // selected/copied because it closes the moment the pointer leaves the
  // trigger to reach the text.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openWithRect())}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-body-text transition-colors duration-200 hover:border-primary/40 hover:text-primary"
      >
        <MapPinIcon className="h-3 w-3 shrink-0" />
        {locations.length} chi nhánh
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div ref={popupRef}>
            {/* Desktop popover, positioned via measured trigger rect to escape any clipped/scrollable ancestor */}
            {rect && (
              <div
                className="fixed z-30 hidden w-64 -translate-x-1/2 rounded-2xl border border-line bg-white p-4 text-left shadow-card md:block"
                style={{ top: rect.top + 8, left: rect.left }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-navy">
                    Áp dụng tại {locations.length} chi nhánh
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Đóng"
                    className="shrink-0 text-body-text transition-colors duration-200 hover:text-navy"
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ul className="max-h-64 space-y-1.5 overflow-y-auto">
                  {locations.map((loc) => (
                    <li key={loc} className="text-[12.5px] leading-snug text-body-text">
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile bottom sheet — header stays put, only the list scrolls.
                z-index must clear MobileBottomNav (z-[95]) and the floating
                call button (z-[97]); at z-50 those painted on top of it and
                clipped the last item regardless of list length. Matches the
                z-[200]+ convention this app already uses for full-screen
                modals (SearchOverlay, LeadCapturePopup). */}
            <div className="md:hidden">
              <div className="fixed inset-0 z-[200] bg-navy/40" onClick={() => setOpen(false)} />
              <div className="fixed inset-x-0 bottom-0 z-[201] flex max-h-[85vh] flex-col rounded-t-2xl border-t border-line bg-white shadow-[0_-10px_40px_rgba(11,31,58,0.2)]">
                <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4">
                  <span className="text-[16px] font-bold text-navy">
                    Áp dụng tại {locations.length} chi nhánh
                  </span>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
                    <CloseIcon className="h-5 w-5 text-body-text" />
                  </button>
                </div>
                <ul
                  className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-6 pt-4"
                  style={{ paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))" }}
                >
                  {locations.map((loc) => (
                    <li key={loc} className="text-[14px] leading-relaxed text-body-text">
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
