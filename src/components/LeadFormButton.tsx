"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { CloseIcon, PhoneIcon, BadgePercentIcon } from "./icons";
import { scrollToLeadForm } from "@/lib/serviceSelectEvent";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

/** Phòng họp theo giờ is billed hourly — the "10% off first month" promo doesn't apply. */
const NO_PROMO_SERVICE = "Phòng họp theo giờ";

type Variant = "primary" | "outline" | "ghost" | "link";

export default function LeadFormButton({
  service,
  variant = "primary",
  className,
  children,
}: {
  /** Exact label from BookingForm's "Dịch vụ quan tâm" dropdown to pre-select, if known. */
  service?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [showPromo, setShowPromo] = useState(false);
  const hasPromo = !!service && service !== NO_PROMO_SERVICE;
  const fallbackHref = service ? `/lien-he?service=${encodeURIComponent(service)}` : "/lien-he";

  const goToForm = () => {
    // If a lead form is already on this page, scroll to it instead of navigating —
    // same-page "#lead-form" hrefs don't reliably scroll via next/link. Otherwise
    // fall back to a real navigation to /lien-he with the service pre-filled.
    if (!scrollToLeadForm(service)) router.push(fallbackHref);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (hasPromo) {
      e.preventDefault();
      setShowPromo(true);
      return;
    }
    if (scrollToLeadForm(service)) e.preventDefault();
  };

  useEffect(() => {
    if (!showPromo) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPromo(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [showPromo]);

  const promoText =
    service === "Thành lập doanh nghiệp"
      ? `Giảm 10% phí dịch vụ ${service}`
      : `Giảm 10% tháng đầu tiên khi đăng ký ${service}`;

  return (
    <>
      <Button href={fallbackHref} variant={variant} className={className} onClick={handleClick}>
        {children}
      </Button>

      {hasPromo &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showPromo && (
              <motion.div
                key="promo-modal"
                className="fixed inset-0 z-[300] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                  onClick={() => setShowPromo(false)}
                  aria-hidden
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="promo-modal-title"
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                  className="relative max-h-[92vh] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(11,31,58,0.35)] sm:p-8"
                >
                  <button
                    type="button"
                    onClick={() => setShowPromo(false)}
                    aria-label="Đóng"
                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-body-text transition-colors duration-200 hover:bg-bg-tint hover:text-navy"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>

                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <BadgePercentIcon className="h-7 w-7" />
                  </span>

                  <h3 id="promo-modal-title" className="mb-2 text-[20px] font-bold text-navy">
                    Ưu đãi đặc biệt cho bạn!
                  </h3>
                  <p className="mb-6 text-[14.5px] leading-relaxed text-body-text">{promoText}</p>

                  <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                    <div>
                      <a
                        href="tel:0898082188"
                        className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-[14.5px] font-bold whitespace-nowrap text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_16px_32px_rgba(229,57,53,0.38)]"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        Gọi ngay nhận ưu đãi
                      </a>
                      <p className="mt-2 text-center text-[11.5px] leading-snug text-body-text">
                        Tư vấn viên hỗ trợ ngay, giữ ưu đãi cho bạn
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromo(false);
                        goToForm();
                      }}
                      className="flex items-center justify-center rounded-full border-[1.5px] border-line bg-white px-5 py-3.5 text-center text-[14.5px] font-bold whitespace-nowrap text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                    >
                      Để lại thông tin
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
