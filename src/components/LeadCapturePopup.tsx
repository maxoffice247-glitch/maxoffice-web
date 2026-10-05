"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, CloseIcon } from "./icons";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { POPUP_FORM_TYPE, POPUP_SERVICE_OPTIONS, defaultPopupService } from "@/lib/popupServices";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;
const SEEN_KEY = "mo_lead_popup_seen";
const MIN_DWELL_MS = 6000;
const FALLBACK_DELAY_MS = 26000;
const SCROLL_DEPTH_RATIO = 0.55;
// Khoảng "báo trước" để bắt đầu nạp ảnh động TRƯỚC khi popup thực sự bật —
// đủ xa ngưỡng thật để tải kịp (ảnh ~400KB), nhưng không xa đến mức lại
// thành tải mù như cơ chế idle/4s cũ.
const PRELOAD_LEAD_RATIO = 0.15; // nạp sớm hơn 15 điểm % cuộn trang
const PRELOAD_LEAD_MS = 6000; // nạp sớm hơn 6s so với mốc dwell 26s

export default function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);
  const preloadedRef = useRef(false);
  const uid = useId();
  const { status, submit } = useLeadSubmit();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const pathname = usePathname();
  // undefined = khách chưa đụng vào -> dùng dịch vụ chọn sẵn theo trang; null = khách chủ động bỏ chọn.
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const selected = picked === undefined ? defaultPopupService(pathname) || null : picked;

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;

    // Nạp trước ảnh động của linh vật (đã nén còn ~400KB, giảm ~50% từ
    // ~807KB gốc — xem linh-vat-max-chi-tay-xuong-v3.webp) để tới lúc
    // popup bật lên đã nằm trong cache. TRƯỚC ĐÂY nạp qua
    // requestIdleCallback/setTimeout(4000) CHẠY VÔ ĐIỀU KIỆN trên MỌI lượt
    // xem trang — trình duyệt thường rảnh chỉ sau 1-2s nên trên thực tế
    // gần như luôn tải ngay từ đầu, kể cả với người rời trang trước khi
    // popup có cơ hội hiện (chưa đủ 6s dwell, chưa cuộn, chưa 26s) — lãng
    // phí băng thông + cộng dồn vào total-byte-weight khi đo Lighthouse.
    // NAY: chỉ nạp khi có TÍN HIỆU THẬT cho thấy popup SẮP hiện — còn
    // ~15 điểm % trước ngưỡng cuộn 55% thật, hoặc còn 6s trước mốc 26s thật
    // — vẫn đủ thời gian tải xong trước khi popup thực sự bật, nhưng không
    // còn tải mù cho mọi lượt xem trang. Riêng nhánh rời trang (exit-intent)
    // không có cách báo trước, đành nạp ngay lúc đó (không tệ hơn trước).
    const preload = () => {
      if (preloadedRef.current) return;
      preloadedRef.current = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      new window.Image().src = reduce
        ? "/images/mascot/linh-vat-max-chi-tay-xuong-v3-tinh.webp"
        : "/images/mascot/linh-vat-max-chi-tay-xuong-v3.webp";
    };

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
      if (e.clientY <= 0 && !e.relatedTarget) {
        preload(); // không có tín hiệu báo trước — nạp ngay lúc rời trang
        trigger();
      }
    };
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const ratio = window.scrollY / scrollable;
      if (ratio >= SCROLL_DEPTH_RATIO - PRELOAD_LEAD_RATIO) preload();
      if (ratio >= SCROLL_DEPTH_RATIO) trigger();
    };
    const preloadTimer = window.setTimeout(preload, FALLBACK_DELAY_MS - PRELOAD_LEAD_MS);
    const fallbackTimer = window.setTimeout(trigger, FALLBACK_DELAY_MS);

    function cleanup() {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(preloadTimer);
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
    await submit(
      { formType: POPUP_FORM_TYPE, name, phone, service: selected ?? undefined },
      // GA4: chỉ NHÃN dịch vụ (không SĐT/tên); bỏ qua nếu khách không chọn gì.
      selected ? { service_interest: selected } : undefined
    );
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lead-capture-popup"
          className="short:p-3 fixed inset-0 z-[300] flex items-center justify-center p-4"
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
            className="short:p-4 relative max-h-[calc(100dvh-1.5rem)] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(11,31,58,0.35)] sm:p-8 short:sm:p-4"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="short:top-2 short:right-2 absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-body-text transition-colors duration-200 hover:bg-bg-tint hover:text-navy"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            {status === "success" ? (
              <div className="text-center">
                {/* Linh vật MAX ôm trái tim — thay cho icon dấu tích trước
                    đây, hợp với lời cảm ơn hơn. */}
                <Image
                  src="/images/mascot/linh-vat-max-yeu-thuong.png"
                  alt=""
                  width={140}
                  height={140}
                  className="mx-auto mb-3 h-[110px] w-auto object-contain"
                />
                <h3 className="mb-2 text-[20px] font-bold text-navy">Cảm ơn bạn!</h3>
                <p className="text-[14.5px] leading-relaxed text-body-text">
                  MAX OFFICE đã nhận được thông tin và sẽ liên hệ tư vấn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <>
                {/* Linh vật MAX chỉ tay XUỐNG (WebP động tách nền từ
                    bieu-tuong-chao-mung.mp4) đặt trên cùng popup, hướng vào
                    tiêu đề ưu đãi/form/nút bên dưới. <picture> + nguồn
                    prefers-reduced-motion để người bật giảm chuyển động chỉ
                    tải khung tĩnh. File động được nạp trước ở useEffect bên
                    trên (rảnh việc) nên khi popup bật lên đã có trong cache. */}
                <picture>
                  <source media="(prefers-reduced-motion: reduce)" srcSet="/images/mascot/linh-vat-max-chi-tay-xuong-v3-tinh.webp" type="image/webp" />
                  <img
                    src="/images/mascot/linh-vat-max-chi-tay-xuong-v3.webp"
                    alt=""
                    width={336}
                    height={224}
                    decoding="async"
                    className="mx-auto mb-2 block h-[112px] w-[168px] object-contain"
                  />
                </picture>
                <h3 id="lead-capture-title" className="short:mb-1 short:text-[18px] mb-2 text-center text-[20px] font-bold text-navy">
                  🎁 Voucher dành riêng cho bạn!
                </h3>
                <p className="short:mb-2 short:text-[14px] short:leading-snug mb-6 text-center text-[14.5px] leading-relaxed text-body-text">
                  Để lại số điện thoại, MAX OFFICE tư vấn miễn phí và giữ ưu đãi giảm 10% tháng đầu
                  tiên cho bạn.
                </p>

                <form onSubmit={handleSubmit} className="short:space-y-2 space-y-3">
                  <label htmlFor={`${uid}-name`} className="sr-only">
                    Tên của bạn
                  </label>
                  <input
                    id={`${uid}-name`}
                    required
                    type="text"
                    placeholder="Ví dụ: Anh Nam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="short:py-2.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none"
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
                      className="short:py-2.5 w-full min-w-0 px-3 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor={`${uid}-service`} className="short:mb-1 mb-1.5 block text-[14px] leading-snug font-semibold text-body-text">
                      Dịch vụ bạn quan tâm (không bắt buộc)
                    </label>
                    {/* <select> gốc: bộ chọn riêng của iOS/Android, thân thiện mobile. Chữ 16px trên mobile để iOS không
                        tự zoom khi chạm. Chọn sẵn theo trang (khách đổi/bỏ chọn được qua mục "Chọn dịch vụ"). */}
                    <div className="relative">
                      <select
                        id={`${uid}-service`}
                        value={selected ?? ""}
                        onChange={(e) => setPicked(e.target.value === "" ? null : e.target.value)}
                        className={`min-h-[44px] w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-[16px] transition-colors duration-200 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-[14.5px] ${
                          selected ? "border-primary font-semibold text-navy" : "border-line text-body-text"
                        }`}
                      >
                        <option value="">Chọn dịch vụ</option>
                        {POPUP_SERVICE_OPTIONS.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-body-text" />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-2.5">
                      <Image
                        src="/images/mascot/linh-vat-max-xin-loi.png"
                        alt=""
                        width={40}
                        height={43}
                        className="h-9 w-auto shrink-0 object-contain"
                      />
                      <p className="text-[13px] text-accent">
                        Có lỗi xảy ra, vui lòng gọi hotline{" "}
                        <a href="tel:0898082188" className="font-bold underline">
                          089 8082 188
                        </a>{" "}
                        hoặc thử lại.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="short:py-3 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_16px_32px_rgba(229,57,53,0.38)] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === "loading" ? "Đang gửi..." : "Nhận ưu đãi ngay"}
                  </button>
                </form>
                <p className="short:mt-2 mt-3 text-center text-[11.5px] leading-snug text-body-text">
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
