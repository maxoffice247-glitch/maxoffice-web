"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, SpinnerIcon } from "../icons";
import PlanGroupQuoteCard from "./PlanGroupQuoteCard";
import type { PlanGroup } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { waitForImages } from "@/lib/waitForImages";

export default function PlanGroupDetailActions({ group }: { group: PlanGroup }) {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  const handleDownloadQuote = async () => {
    const node = quoteRef.current;
    if (!node) return;
    setStatus("generating");
    try {
      // Đợi mọi <img> trong card (logo + ảnh từng chi nhánh — có thể 7+
      // tấm) load + decode xong TRƯỚC khi chụp, xem chi tiết lý do trong
      // PlanDetailActions (component tương đương cho báo giá 1 chi nhánh).
      await waitForImages(node);
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(node, { pixelRatio: 1, cacheBust: true });
      if (!blob) throw new Error("toBlob returned null");
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `bao-gia-tong-hop-${group.groupKey}.png`;
      link.href = blobUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="mb-1 text-[13px] text-body-text">
        Gói {group.planName} · {group.locations.length} chi nhánh áp dụng
      </p>
      <p className="mb-5 font-mono text-[26px] font-bold text-primary">
        {formatVoPrice(group.price)}
        <span className="text-[13px] font-sans font-medium text-body-text"> /tháng</span>
      </p>

      <Link
        href={`/lien-he?service=${encodeURIComponent("Văn phòng ảo")}`}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(220,53,48,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark"
      >
        <PhoneIcon className="h-4 w-4" />
        Liên hệ tư vấn ngay
      </Link>

      <button
        type="button"
        onClick={handleDownloadQuote}
        disabled={status === "generating"}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-navy px-6 py-3.5 text-[15px] font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "generating" ? (
          <SpinnerIcon className="h-4 w-4" />
        ) : (
          <DownloadIcon className="h-4 w-4" />
        )}
        {status === "generating" ? "Đang tạo báo giá..." : "Tải báo giá tổng hợp"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-[12.5px] text-accent">
          Không tạo được ảnh báo giá, vui lòng thử lại.
        </p>
      )}

      {/* Off-screen — dựng khung rộng 1080px (cao tự động theo số chi nhánh)
          để html-to-image chụp lại, không hiển thị trực tiếp cho người dùng. */}
      <div
        aria-hidden
        style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}
      >
        <div ref={quoteRef}>
          <PlanGroupQuoteCard group={group} />
        </div>
      </div>
    </div>
  );
}
