"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearch } from "./SearchContext";
import { SEARCH_INDEX } from "@/lib/searchIndex";
import { SearchIcon, CloseIcon, ArrowRightSmallIcon } from "./icons";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

const QUICK_LINKS = [
  "Văn phòng ảo",
  "Văn phòng trọn gói",
  "Thành lập doanh nghiệp",
  "Kế toán & thuế",
];

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-24 sm:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE_PREMIUM }}
        className="relative w-full max-w-[600px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(11,31,58,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <SearchIcon className="shrink-0 text-body-text" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm dịch vụ, địa điểm, bài viết..."
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-body-text/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng tìm kiếm"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body-text transition-colors duration-200 hover:bg-bg-tint hover:text-navy"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" && (
            <div className="p-4">
              <p className="mb-3 text-[11.5px] font-bold tracking-[0.12em] text-body-text uppercase">
                Tìm kiếm phổ biến
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_LINKS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setQuery(label)}
                    className="rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-navy transition-colors duration-200 hover:border-primary hover:text-primary"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <div className="p-8 text-center text-[14px] text-body-text">
              Không tìm thấy kết quả cho &ldquo;{query}&rdquo;. Hãy thử từ
              khoá khác hoặc{" "}
              <a href="tel:0898082188" className="font-bold text-primary">
                gọi 089 8082 188
              </a>{" "}
              để được tư vấn trực tiếp.
            </div>
          )}

          {results.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              className="group flex items-start justify-between gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-bg-tint"
            >
              <div>
                <span className="mb-1 inline-block rounded-full bg-primary-tint px-2 py-0.5 text-[10.5px] font-bold text-primary">
                  {item.category}
                </span>
                <div className="text-[14.5px] font-bold text-navy">{item.title}</div>
                <div className="text-[13px] text-body-text">{item.desc}</div>
              </div>
              <ArrowRightSmallIcon className="mt-1 shrink-0 text-body-text transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SearchOverlay() {
  const { open, setOpen } = useSearch();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </AnimatePresence>
  );
}
