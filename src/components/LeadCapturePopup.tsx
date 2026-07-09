"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon, BadgePercentIcon, CheckCircleIcon } from "./icons";
import { useLeadSubmit } from "@/lib/useLeadSubmit";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const SEEN_KEY = "mo_lead_popup_seen";
const MIN_DWELL_MS = 6000;
const FALLBACK_DELAY_MS = 26000;
const SCROLL_DEPTH_RATIO = 0.55;

export default function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);
  const uid = useId();
  const { status, submit } = useLeadSubmit();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;

    const dwellStart = Date.now();
    const trigger = () => {
      if (triggeredRef.current) return;
      if (Date.now() - dwellStart < MIN_DWELL_MS) return;
      triggeredRef.current = true;
      sessionStorage.setItem(SEEN_KEY, "1");
      setOpen(true);
      cleanup();
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_DEPTH_RATIO) trigger();
    };
    const fallbackTimer = window.setTimeout(trigger, FALLBACK_DELAY_MS);

    function cleanup() {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallbackTimer);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit({ formType: "Popup ưu đãi", name, phone });
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lead-capture-popup"
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-capture-title"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="relative max-h-[92vh] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(11,31,58,0.35)] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-body-text transition-colors duration-200 hover:bg-bg-tint hover:text-navy"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            {status === "success" ? (
              <div className="text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                  <CheckCircleIcon className="h-7 w-7" />
                </span>
                <h3 className="mb-2 text-[20px] font-bold text-navy">Cảm ơn bạn!</h3>
                <p className="text-[14.5px] leading-relaxed text-body-text">
                  MAX OFFICE đã nhận được thông tin và sẽ liên hệ tư vấn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <>
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <BadgePercentIcon className="h-7 w-7" />
                </span>
                <h3 id="lead-capture-title" className="mb-2 text-[20px] font-bold text-navy">
                  Khoan đã — ưu đãi dành riêng cho bạn!
                </h3>
                <p className="mb-6 text-[14.5px] leading-relaxed text-body-text">
                  Để lại số điện thoại, MAX OFFICE tư vấn miễn phí và giữ ưu đãi giảm 10% tháng đầu
                  tiên cho bạn.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <label htmlFor={`${uid}-name`} className="sr-only">
                    Họ tên
                  </label>
                  <input
                    id={`${uid}-name`}
                    required
                    type="text"
                    placeholder="Họ tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none"
                  />
                  <label htmlFor={`${uid}-phone`} className="sr-only">
                    Số điện thoại
                  </label>
                  <div className="flex overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 focus-within:border-primary">
                    <span className="flex items-center border-r border-line px-3 text-[14.5px] font-bold text-body-text">
                      +84
                    </span>
                    <input
                      id={`${uid}-phone`}
                      required
                      type="tel"
                      placeholder="9xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-w-0 px-3 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:outline-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-[13px] text-accent">
                      Có lỗi xảy ra, vui lòng gọi hotline{" "}
                      <a href="tel:0898082188" className="font-bold underline">
                        089 8082 188
                      </a>{" "}
                      hoặc thử lại.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_16px_32px_rgba(229,57,53,0.38)] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === "loading" ? "Đang gửi..." : "Nhận ưu đãi ngay"}
                  </button>
                </form>
                <p className="mt-3 text-center text-[11.5px] leading-snug text-body-text">
                  Bằng việc gửi thông tin, bạn đồng ý để MAX OFFICE liên hệ tư vấn.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
