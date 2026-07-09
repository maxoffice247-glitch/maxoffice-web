"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon, ChevronRightIcon } from "./icons";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const SWIPE_THRESHOLD = 50;

export type LightboxImage = { src: string; alt: string };

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  /** Currently open image index, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;
  const hasMultiple = images.length > 1;

  const goPrev = () => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  };
  const goNext = () => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  if (typeof document === "undefined") return null;

  const current = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Ảnh trước"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:left-6"
              >
                <ChevronRightIcon className="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Ảnh tiếp theo"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:right-6"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={current.src}
            className="relative flex h-full max-h-[85vh] w-full max-w-[1100px] items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > SWIPE_THRESHOLD && hasMultiple) {
                if (dx > 0) goPrev();
                else goNext();
              }
              touchStartX.current = null;
            }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={1600}
              height={1200}
              sizes="100vw"
              className="h-full max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {hasMultiple && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[13px] font-semibold text-white/80 sm:bottom-6">
              {index + 1} / {images.length}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
