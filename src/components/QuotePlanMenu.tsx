"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDownIcon, DownloadIcon, ShareIcon, SpinnerIcon } from "./icons";
import { fetchBranchQuoteBlob, saveBranchQuote, useCanShareFiles } from "@/lib/waitForImages";

export type QuotePlanOption = { key: string; name: string };

/**
 * Nút "📄 Tạo báo giá" DUY NHẤT ở đầu section "Văn phòng ảo" — thay cho nút
 * lặp lại dưới TỪNG card gói trước đây (2-4 nút giống hệt nhau tuỳ chi
 * nhánh, gây nhiễu thị giác). Bấm mở dropdown ngắn liệt kê ĐÚNG tên các gói
 * của CHÍNH chi nhánh đang xem (`plans`, truyền từ nơi gọi theo đúng hệ giá
 * — LITE-RISE/Q1Q3-SGP/SGP — không phải danh sách cứng), chọn 1 gói điều
 * hướng thẳng tới `/tien-ich/tim-goi-phu-hop/{slug}/{plan.key}` (trang chi
 * tiết gói đã có sẵn preview + xuất PNG báo giá qua PlanDetailActions/
 * PlanQuoteCard).
 *
 * KHÔNG dùng trang trung gian `/tien-ich/tim-goi-phu-hop/{slug}` (liệt kê
 * mọi gói của 1 chi nhánh trước khi vào trang chi tiết gói) vì trang đó
 * CHƯA TỒN TẠI — đã rà soát route trước khi làm, chỉ có
 * `/tien-ich/tim-goi-phu-hop/[slug]/[plan]`, không có `page.tsx` nào riêng
 * ở cấp `[slug]`. Dropdown này là giải pháp thay thế được xác nhận trước
 * khi triển khai, không tự ý thêm route mới.
 *
 * Khi chi nhánh có từ 2 gói trở lên, đầu dropdown có thêm mục "Báo giá tất cả
 * các gói" — tải/chia sẻ 1 ảnh so sánh mọi gói của chi nhánh
 * (/api/quote-image/{slug}/tat-ca) để gửi khách mới tìm hiểu. Bấm mục này tạo
 * ảnh rồi mở hộp XEM TRƯỚC ảnh (như "Xem trước ảnh vừa tạo" ở trang chi tiết
 * gói) với nút Chia sẻ/Tải ảnh. Chi nhánh chỉ có 1 gói thì route đó trả 404
 * nên mục này không hiện.
 */
export default function QuotePlanMenu({ slug, plans }: { slug: string; plans: QuotePlanOption[] }) {
  const [open, setOpen] = useState(false);
  const [allStatus, setAllStatus] = useState<"idle" | "generating" | "error">("idle");
  const canShare = useCanShareFiles();
  const [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Hộp xem trước: Esc để đóng, khoá cuộn nền, thu hồi blob URL khi đóng.
  useEffect(() => {
    if (!preview) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const url = preview.url;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      URL.revokeObjectURL(url);
    };
  }, [preview]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (plans.length === 0) return null;

  const handleAllPlans = async () => {
    setAllStatus("generating");
    try {
      const blob = await fetchBranchQuoteBlob(slug);
      setPreview({ url: URL.createObjectURL(blob), blob });
      setAllStatus("idle");
      setOpen(false);
    } catch {
      setAllStatus("error");
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      {preview &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Xem trước báo giá tất cả các gói"
            className="fixed inset-0 z-[300] flex items-center justify-center bg-navy/60 p-3 sm:p-6"
            onClick={() => setPreview(null)}
          >
            <div
              className="flex max-h-full w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(11,31,58,0.35)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                <p className="text-[14px] font-bold text-navy">Xem trước báo giá tất cả các gói</p>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  aria-label="Đóng xem trước"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[22px] leading-none text-body-text hover:bg-bg-tint"
                >
                  ×
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-bg-tint p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt="Xem trước báo giá tất cả các gói" className="w-full rounded-lg border border-line bg-white" />
              </div>
              <div className="border-t border-line p-3">
                <button
                  type="button"
                  onClick={() => saveBranchQuote(preview.blob, slug, "Báo giá các gói văn phòng ảo", canShare).catch(() => {})}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-bold text-white hover:bg-accent-dark"
                >
                  {canShare ? <ShareIcon className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
                  {canShare ? "Chia sẻ báo giá" : "Tải ảnh báo giá"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-line bg-white px-3.5 py-2 text-[12.5px] md:min-h-0 font-bold text-navy transition-all duration-200 hover:border-primary hover:text-primary"
      >
        📄 Tạo báo giá
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white shadow-[0_20px_40px_rgba(15,27,45,0.14)]"
        >
          {plans.length >= 2 && (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={handleAllPlans}
                disabled={allStatus === "generating"}
                className="flex min-h-11 w-full items-center gap-2 border-b border-line bg-bg-tint px-4 py-2.5 text-left text-[13px] font-bold text-primary transition-colors duration-150 hover:bg-white disabled:pointer-events-none disabled:opacity-70"
              >
                {allStatus === "generating" ? (
                  <SpinnerIcon className="h-4 w-4 shrink-0" />
                ) : canShare ? (
                  <ShareIcon className="h-4 w-4 shrink-0" />
                ) : (
                  <DownloadIcon className="h-4 w-4 shrink-0" />
                )}
                {allStatus === "generating" ? "Đang tạo báo giá..." : "Báo giá tất cả các gói"}
              </button>
              {allStatus === "error" && (
                <p role="alert" className="px-4 py-2 text-[12px] text-accent">
                  Không tạo được ảnh báo giá, vui lòng thử lại.
                </p>
              )}
            </>
          )}
          {plans.map((p) => (
            <Link
              key={p.key}
              href={`/tien-ich/tim-goi-phu-hop/${slug}/${p.key}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-bg-tint hover:text-primary"
            >
              Gói {p.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
