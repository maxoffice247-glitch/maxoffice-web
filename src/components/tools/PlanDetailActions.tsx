"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon } from "../icons";
import PlanQuoteCard, { type QuoteBenefitTag } from "./PlanQuoteCard";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";

export default function PlanDetailActions({
  plan,
  address,
  facadeSrc,
  benefits,
}: {
  plan: OfferedPlan;
  address: string;
  facadeSrc: string;
  benefits?: QuoteBenefitTag[];
}) {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  const handleDownloadQuote = async () => {
    const node = quoteRef.current;
    if (!node) return;
    setStatus("generating");
    try {
      const { toPng } = await import("html-to-image");
      // 2 lượt liên tiếp: html-to-image thi thoảng chụp thiếu ảnh nếu <img>
      // (mặt tiền, logo) chưa kịp decode xong ở lượt gọi đầu tiên.
      await toPng(node, { pixelRatio: 1, cacheBust: true });
      const dataUrl = await toPng(node, { pixelRatio: 1, cacheBust: true });
      const link = document.createElement("a");
      link.download = `bao-gia-${plan.locationSlug}-${plan.planKey}.png`;
      link.href = dataUrl;
      link.click();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="mb-1 text-[13px] text-body-text">Gói {plan.planName} tại {plan.locationName}</p>
      <p className="mb-5 font-mono text-[26px] font-bold text-primary">
        {formatVoPrice(plan.price)}
        <span className="text-[13px] font-sans font-medium text-body-text"> /tháng</span>
      </p>

      <Link
        href={`/lien-he?service=${encodeURIComponent("Văn phòng ảo")}&location=${encodeURIComponent(plan.locationSlug)}`}
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
        <DownloadIcon className="h-4 w-4" />
        {status === "generating" ? "Đang tạo ảnh báo giá..." : "Tải báo giá"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-[12.5px] text-accent">
          Không tạo được ảnh báo giá, vui lòng thử lại.
        </p>
      )}

      {/* Off-screen — dựng đúng 1080x1350px để html-to-image chụp lại, không hiển thị trực tiếp cho người dùng. */}
      <div
        aria-hidden
        style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}
      >
        <div ref={quoteRef}>
          <PlanQuoteCard plan={plan} address={address} facadeSrc={facadeSrc} benefits={benefits} />
        </div>
      </div>
    </div>
  );
}
