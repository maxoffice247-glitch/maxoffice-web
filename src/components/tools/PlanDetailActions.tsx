"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, SpinnerIcon } from "../icons";
import PlanQuoteCard, { type QuoteBenefitTag } from "./PlanQuoteCard";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { waitForImages } from "@/lib/waitForImages";

export default function PlanDetailActions({
  plan,
  address,
  facadeSrc,
  benefits,
  promotions,
}: {
  plan: OfferedPlan;
  address: string;
  /** Ảnh mặt tiền dành riêng cho luồng xuất ảnh báo giá — đã resize/nén
      (xem /public/images/quote), KHÔNG phải ảnh gốc full-res dùng hiển thị
      trên trang (card báo giá chỉ hiển thị ảnh ở khung 270px, dùng ảnh gốc
      vài trăm KB–600KB không cần thiết và làm chậm export trên mobile). */
  facadeSrc: string;
  benefits?: QuoteBenefitTag[];
  promotions?: string[];
}) {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  const handleDownloadQuote = async () => {
    const node = quoteRef.current;
    if (!node) return;
    setStatus("generating");
    try {
      // Đợi mọi <img> trong card (logo + ảnh mặt tiền) load + decode xong
      // TRƯỚC khi chụp — trước đây không đợi gì, chỉ vá bằng cách gọi
      // toPng() 2 lần liên tiếp (vẫn có thể trật trên mobile/mạng chậm,
      // đồng thời tốn gần gấp đôi thời gian xử lý một cách không cần thiết).
      await waitForImages(node);
      const { toBlob } = await import("html-to-image");
      // toBlob thay vì toPng (trả data: URL): Safari iOS xử lý thuộc tính
      // `download` trên <a> trỏ tới data: URL lớn không ổn định — thường mở
      // thẳng ảnh ra xem (điều hướng) thay vì tải về, hoặc treo lâu khi
      // phải điều hướng tới 1 chuỗi base64 vài MB. blob: URL qua
      // createObjectURL được Safari hỗ trợ tải về đáng tin cậy hơn nhiều.
      const blob = await toBlob(node, { pixelRatio: 1, cacheBust: true });
      if (!blob) throw new Error("toBlob returned null");
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `bao-gia-${plan.locationSlug}-${plan.planKey}.png`;
      link.href = blobUrl;
      link.click();
      // Trì hoãn revoke — thu hồi ngay có thể huỷ tải trên vài trình duyệt
      // (đặc biệt Safari) nếu việc tải chưa kịp bắt đầu đọc blob.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
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
        {status === "generating" ? (
          <SpinnerIcon className="h-4 w-4" />
        ) : (
          <DownloadIcon className="h-4 w-4" />
        )}
        {status === "generating" ? "Đang tạo báo giá..." : "Tải báo giá"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-[12.5px] text-accent">
          Không tạo được ảnh báo giá, vui lòng thử lại.
        </p>
      )}

      {/* Off-screen — dựng đúng 1080px rộng (cao tự động theo nội dung) để html-to-image chụp lại, không hiển thị trực tiếp cho người dùng. */}
      <div
        aria-hidden
        style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}
      >
        <div ref={quoteRef}>
          <PlanQuoteCard plan={plan} address={address} facadeSrc={facadeSrc} benefits={benefits} promotions={promotions} />
        </div>
      </div>
    </div>
  );
}
