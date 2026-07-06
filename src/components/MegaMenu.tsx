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
  MapPinIcon,
  CalendarIcon,
} from "./icons";

const MEGA_SERVICES = [
  {
    slug: "van-phong-ao",
    icon: BuildingIcon,
    title: "Văn phòng ảo",
    desc: "Địa chỉ đăng ký kinh doanh hợp lệ",
    price: "Từ 299.000đ/tháng",
  },
  {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    title: "Văn phòng trọn gói",
    desc: "Không gian riêng, sẵn sàng làm việc",
    price: "Từ 4.500.000đ/tháng",
    featured: true,
  },
  {
    slug: "phong-hop",
    icon: ScreenIcon,
    title: "Phòng họp theo giờ",
    desc: "Thiết bị trình chiếu, âm thanh hiện đại",
    price: "Từ 150.000đ/giờ",
  },
  {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    title: "Chỗ ngồi linh động",
    desc: "Coworking cho freelancer & nhóm nhỏ",
    price: "Từ 2.000.000đ/tháng",
  },
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    desc: "Tư vấn hồ sơ, thủ tục nhanh gọn",
    price: "Từ 1.299.000đ*",
  },
  {
    slug: "ke-toan-thue",
    icon: CalculatorIcon,
    title: "Kế toán & thuế",
    desc: "Kê khai đúng hạn, sổ sách minh bạch",
    price: "Từ 500.000đ/tháng",
  },
];

const TRUST_STATS = [
  { icon: MapPinIcon, label: "12 địa điểm tại TP.HCM" },
  { icon: UsersIcon, label: "500+ doanh nghiệp tin dùng" },
  { icon: CalendarIcon, label: "Từ 2022" },
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
              className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[860px] max-w-[90vw] -translate-x-1/2"
            >
              <div className="grid grid-cols-[1.7fr_1fr] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
                <div className="grid grid-cols-2 gap-1 p-5">
                  {MEGA_SERVICES.map((svc) => (
                    <Link
                      key={svc.title}
                      href={`/services/${svc.slug}`}
                      className={`group relative flex items-start gap-3 rounded-xl border-2 border-transparent px-3 py-2.5 transition-colors duration-200 hover:bg-bg-tint ${
                        svc.featured ? "mega-glow-border" : ""
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                        <svc.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold text-navy">
                          {svc.title}
                        </span>
                        <span className="mt-1 block text-[12.5px] text-body-text">
                          {svc.desc}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] text-body-text">
                          {svc.price}
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
                    <ul className="mt-5 space-y-2.5">
                      {TRUST_STATS.map((stat) => (
                        <li
                          key={stat.label}
                          className="flex items-center gap-2.5 text-[12.5px] text-white/80"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#8FC1F5]">
                            <stat.icon className="h-3.5 w-3.5" />
                          </span>
                          {stat.label}
                        </li>
                      ))}
                    </ul>
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
                      href="/#lead"
                      className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-white/30 bg-white/10 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-white/20"
                    >
                      Đặt lịch tham quan
                    </Link>
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
