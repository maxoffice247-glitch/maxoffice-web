"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, PhoneIcon, ArrowRightSmallIcon } from "./icons";
import { useNavIndicator } from "./NavIndicator";
import { TOOL_GROUPS } from "@/lib/toolsData";

/** Từ 6 mục trở lên trong 1 danh mục, danh mục đó tự chia 2 cột con (cùng
    kỹ thuật gridAutoFlow: "column" + Math.ceil(n/2) hàng đã dùng cho
    "Tính năng đi kèm"/danh sách chi nhánh trong card báo giá PNG) — thay
    vì 1 cột dọc dài kéo cao cả dropdown so với 2 danh mục còn lại ít mục
    hơn. Ngưỡng tự kích hoạt, không cần sửa code khi thêm/bớt công cụ. */
const SUB_GRID_THRESHOLD = 6;
const hasSubGridCategory = TOOL_GROUPS.some((cat) => cat.tools.length >= SUB_GRID_THRESHOLD);

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
            className={`absolute top-[calc(100%+18px)] left-1/2 z-50 max-w-[92vw] -translate-x-1/2 ${
              hasSubGridCategory ? "w-[1080px]" : "w-[820px]"
            }`}
          >
            <div className="grid grid-cols-[2.2fr_1fr] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_rgba(11,31,58,0.22)]">
              <div
                className="grid gap-4 p-6"
                style={{
                  // Danh mục chia 2 cột con cần rộng hơn 1 đơn vị để mỗi cột
                  // con còn đủ chỗ cho nhãn (icon + text), tránh chữ vỡ dòng
                  // theo từng từ 1 — các danh mục 1 cột giữ đúng 1 đơn vị,
                  // giống layout gốc (grid-cols-3 đều nhau) khi không có
                  // danh mục nào cần chia cột con.
                  gridTemplateColumns: TOOL_GROUPS.map((cat) =>
                    cat.tools.length >= SUB_GRID_THRESHOLD ? "1.5fr" : "1fr"
                  ).join(" "),
                }}
              >
                {TOOL_GROUPS.map((cat) => {
                  const useSubGrid = cat.tools.length >= SUB_GRID_THRESHOLD;
                  const subGridRows = Math.ceil(cat.tools.length / 2);
                  return (
                    <div key={cat.title}>
                      <h4 className="mb-3 text-[11px] font-bold tracking-[0.08em] text-body-text uppercase">
                        {cat.title}
                      </h4>
                      <div
                        className={useSubGrid ? "grid gap-x-2 gap-y-1" : "flex flex-col gap-1"}
                        style={
                          useSubGrid
                            ? {
                                gridTemplateColumns: "1fr 1fr",
                                gridTemplateRows: `repeat(${subGridRows}, auto)`,
                                gridAutoFlow: "column",
                              }
                            : undefined
                        }
                      >
                        {cat.tools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tien-ich/${tool.slug}`}
                            className="group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-bg-tint"
                          >
                            {/* highlight (Tìm VPA theo nhu cầu, So sánh thuế):
                                icon tô đỏ (accent) thay vì xanh mặc định để
                                làm điểm nhấn nổi bật hơn các mục còn lại. */}
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                                tool.highlight
                                  ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                                  : "bg-primary-tint text-primary group-hover:bg-primary group-hover:text-white"
                              }`}
                            >
                              <tool.icon className="h-4 w-4" />
                            </span>
                            <span className="pt-1.5 text-[12.5px] leading-snug font-semibold text-navy">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col justify-between bg-gradient-to-br from-navy to-primary-dark p-6">
                <div>
                  <span className="mb-2 inline-block text-[11.5px] font-bold tracking-[0.12em] text-[#8FC1F5] uppercase">
                    Cần tư vấn nhanh?
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-white/75">
                    12 công cụ miễn phí giúp bạn tự tra cứu — hoặc gọi ngay để
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
