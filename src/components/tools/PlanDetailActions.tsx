"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, ShareIcon, SpinnerIcon } from "../icons";
import PlanQuoteCard, { type QuoteBenefitTag } from "./PlanQuoteCard";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { captureQuotePng, shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";

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
  // false lúc SSR/lần render đầu (không có `navigator`) -> luôn ra nút
  // "Tải báo giá" trước, rồi chuyển thành "Chia sẻ báo giá" ngay khi
  // hydrate xong nếu trình duyệt hỗ trợ (hầu hết là di động — Safari
  // iOS/Chrome Android) — xem useCanShareFiles() trong waitForImages.ts.
  const canShare = useCanShareFiles();

  const handleDownloadQuote = async () => {
    const node = quoteRef.current;
    if (!node) return;
    setStatus("generating");
    try {
      const filename = `bao-gia-${plan.locationSlug}-${plan.planKey}.png`;
      // captureQuotePng() đợi ảnh tải xong + nhúng thành data: URL (ngăn
      // html-to-image tự fetch lại ảnh — nguyên nhân khiến ảnh mặt tiền
      // biến mất trên mobile, chi tiết xem waitForImages.ts) và ném lỗi rõ
      // ràng nếu vẫn còn ảnh thiếu sau khi đã thử lại, thay vì âm thầm xuất
      // ra 1 ảnh báo giá thiếu ảnh mặt tiền.
      const blob = await captureQuotePng(node);
      // Trên di động có hỗ trợ chia sẻ file: mở thẳng sheet chia sẻ gốc của
      // hệ điều hành (Zalo/Messenger/Facebook nếu đã cài) thay vì bắt tải
      // file về rồi tự đính kèm thủ công. Rơi về tải file như cũ nếu không
      // hỗ trợ hoặc chia sẻ thất bại vì lý do khác Huỷ.
      if (canShare && (await shareQuotePng(blob, filename, `Báo giá ${plan.planName} - ${plan.locationName}`))) {
        setStatus("idle");
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
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
        ) : canShare ? (
          <ShareIcon className="h-4 w-4" />
        ) : (
          <DownloadIcon className="h-4 w-4" />
        )}
        {status === "generating" ? "Đang tạo báo giá..." : canShare ? "Chia sẻ báo giá" : "Tải báo giá"}
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
