"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  KeyIcon,
  DocumentCheckIcon,
  BadgePercentIcon,
  ListIcon,
  BuildingIcon,
  ShieldCheckIcon,
  ScaleIcon,
  RouteIcon,
  ChevronDownIcon,
  PhoneIcon,
  ArrowRightSmallIcon,
} from "./icons";
import { useNavIndicator } from "./NavIndicator";

const TOOL_CATEGORIES = [
  {
    title: "Công cụ tính toán",
    tools: [
      { slug: "chon-goi-van-phong", icon: KeyIcon, title: "Chọn gói văn phòng" },
      { slug: "tinh-chi-phi-thanh-lap", icon: DocumentCheckIcon, title: "Tính chi phí thành lập" },
      { slug: "tinh-le-phi-mon-bai", icon: BadgePercentIcon, title: "Lệ phí môn bài" },
    ],
  },
  {
    title: "Checklist tải về",
    tools: [
      { slug: "checklist-thanh-lap-doanh-nghiep", icon: ListIcon, title: "Checklist thành lập DN" },
      { slug: "checklist-mo-chi-nhanh", icon: BuildingIcon, title: "Checklist mở chi nhánh" },
      {
        slug: "checklist-thay-doi-giay-phep-kinh-doanh",
        icon: ShieldCheckIcon,
        title: "Checklist thay đổi giấy phép",
      },
    ],
  },
  {
    title: "So sánh & lộ trình",
    tools: [
      {
        slug: "so-sanh-van-phong-ao-va-tron-goi",
        icon: ScaleIcon,
        title: "So sánh Văn phòng ảo & Trọn gói",
      },
      { slug: "so-sanh-tnhh-va-co-phan", icon: ScaleIcon, title: "So sánh TNHH & Cổ phần" },
      { slug: "quy-trinh-thanh-lap-doanh-nghiep", icon: RouteIcon, title: "Quy trình thành lập DN" },
    ],
  },
];

export default function ToolsMegaMenu({ solid, isActive }: { solid: boolean; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { registerRef, setHoveredKey } = useNavIndicator();

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    setHoveredKey("tien-ich");
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
    setHoveredKey(null);
  };

  return (
    <div
      ref={(node) => registerRef("tien-ich", node)}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className={`flex items-center gap-1.5 text-[14.5px] whitespace-nowrap transition-colors duration-300 ${
          isActive
            ? "font-bold text-accent"
            : `font-semibold hover:text-accent ${solid ? "text-ink" : "text-white/90"}`
        }`}
        aria-expanded={open}
      >
        Tiện ích
        <ChevronDownIcon className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 0.9, 0.32, 1] }}
            className="absolute top-[calc(100%+18px)] left-1/2 z-50 w-[820px] max-w-[92vw] -translate-x-1/2"
          >
            <div className="grid grid-cols-[2.2fr_1fr] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              <div className="grid grid-cols-3 gap-4 p-6">
                {TOOL_CATEGORIES.map((cat) => (
                  <div key={cat.title}>
                    <h4 className="mb-3 text-[11px] font-bold tracking-[0.08em] text-body-text uppercase">
                      {cat.title}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {cat.tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tien-ich/${tool.slug}`}
                          className="group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-bg-tint"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                            <tool.icon className="h-4 w-4" />
                          </span>
                          <span className="pt-1.5 text-[12.5px] leading-snug font-semibold text-navy">
                            {tool.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-between bg-gradient-to-br from-navy to-primary-dark p-6">
                <div>
                  <span className="mb-2 inline-block text-[11.5px] font-bold tracking-[0.12em] text-[#8FC1F5] uppercase">
                    Cần tư vấn nhanh?
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-white/75">
                    9 công cụ miễn phí giúp bạn tự tra cứu — hoặc gọi ngay để
                    được chuyên viên hỗ trợ trực tiếp.
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
                    href="/tien-ich"
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent hover:gap-2.5"
                  >
                    Xem tất cả tiện ích
                    <ArrowRightSmallIcon />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
