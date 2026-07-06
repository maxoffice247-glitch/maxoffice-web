"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BuildingIcon,
  KeyIcon,
  ScreenIcon,
  UsersIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ChevronDownIcon,
  PhoneIcon,
  ArrowRightSmallIcon,
} from "./icons";

const MEGA_SERVICES = [
  {
    slug: "van-phong-ao",
    icon: BuildingIcon,
    title: "Văn phòng ảo",
    desc: "Địa chỉ đăng ký kinh doanh hợp lệ",
  },
  {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    title: "Văn phòng trọn gói",
    desc: "Không gian riêng, sẵn sàng làm việc",
    featured: true,
  },
  {
    slug: "phong-hop",
    icon: ScreenIcon,
    title: "Phòng họp theo giờ",
    desc: "Thiết bị trình chiếu, âm thanh hiện đại",
  },
  {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    title: "Chỗ ngồi linh động",
    desc: "Coworking cho freelancer & nhóm nhỏ",
  },
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    desc: "Tư vấn hồ sơ, thủ tục nhanh gọn — Từ 1.299.000đ*",
  },
  {
    slug: "ke-toan-thue",
    icon: CalculatorIcon,
    title: "Kế toán & thuế",
    desc: "Kê khai đúng hạn, sổ sách minh bạch",
  },
];

export default function MegaMenu({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="mega-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[90] bg-black/35"
                style={{ pointerEvents: "none" }}
                aria-hidden
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          type="button"
          className={`flex items-center gap-1.5 text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-accent ${
            solid ? "text-ink" : "text-white/90"
          }`}
          aria-expanded={open}
        >
          Dịch vụ
          <ChevronDownIcon
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 0.9, 0.32, 1] }}
              className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[720px] max-w-[88vw] -translate-x-1/2"
            >
              <div className="grid grid-cols-[1.6fr_1fr] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
                <div className="grid grid-cols-2 gap-1 p-5">
                  {MEGA_SERVICES.map((svc) => (
                    <Link
                      key={svc.title}
                      href={`/services/${svc.slug}`}
                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-bg-tint"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                        <svc.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-navy">
                          {svc.title}
                        </span>
                        {svc.featured && (
                          <span className="mt-1 inline-block rounded-full bg-accent px-1.5 py-[3px] text-[9px] font-bold tracking-wide whitespace-nowrap text-white">
                            Phổ biến nhất
                          </span>
                        )}
                        <span className="mt-1 block text-[12.5px] text-body-text">
                          {svc.desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-navy to-primary-dark p-6">
                  <div>
                    <span className="mb-2 inline-block text-[11.5px] font-bold tracking-[0.12em] text-[#8FC1F5] uppercase">
                      Cần tư vấn nhanh?
                    </span>
                    <p className="text-[13.5px] leading-relaxed text-white/75">
                      Đội ngũ MAX OFFICE sẵn sàng hỗ trợ bạn chọn đúng dịch vụ
                      trong 15 phút.
                    </p>
                  </div>
                  <div className="mt-5 space-y-3">
                    <a
                      href="tel:0898082188"
                      className="flex items-center gap-2 text-[14px] font-bold text-white"
                    >
                      <PhoneIcon />
                      089 8082 188
                    </a>
                    <Link
                      href="/dich-vu"
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent hover:gap-2.5"
                    >
                      Xem tất cả dịch vụ
                      <ArrowRightSmallIcon />
                    </Link>
                  </div>
                </div>
                <div className="col-span-2 border-t border-line bg-bg-tint px-5 py-2.5 text-[11px] text-body-text">
                  *Áp dụng khi đăng ký kèm Văn phòng ảo tại MAX OFFICE.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
