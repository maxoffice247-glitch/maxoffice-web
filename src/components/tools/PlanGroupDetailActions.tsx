"use client";

import { useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, ShareIcon, SpinnerIcon } from "../icons";
import type { PlanGroup } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";

/**
 * Xem PlanDetailActions.tsx (component tương đương cho báo giá 1 chi
 * nhánh) để biết đầy đủ lý do chuyển từ html-to-image (chụp DOM off-screen
 * ở trình duyệt) sang render PNG sẵn ở SERVER
 * (src/app/api/quote-image/goi/[groupKey]/route.tsx): hạn chế đã biết của
 * html-to-image trên Safari/WebKit khi rasterize ảnh raster bên trong SVG
 * <foreignObject>, không vá được bằng cách tinh chỉnh thêm ở DOM/CSS.
 */
export default function PlanGroupDetailActions({ group }: { group: PlanGroup }) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  const canShare = useCanShareFiles();
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDownloadQuote = async () => {
    setStatus("generating");
    try {
      const res = await fetch(`/api/quote-image/goi/${group.groupKey}`);
      if (!res.ok) throw new Error(`Server trả về lỗi ${res.status} khi tạo ảnh báo giá.`);
      const blob = await res.blob();
      const filename = `bao-gia-tong-hop-${group.groupKey}.png`;
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
      if (
        canShare &&
        (await shareQuotePng(blob, filename, `Báo giá ${group.planName} - ${group.locations.length} chi nhánh`))
      ) {
        setStatus("idle");
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      setStatus("idle");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
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
        ) : canShare ? (
          <ShareIcon className="h-4 w-4" />
        ) : (
          <DownloadIcon className="h-4 w-4" />
        )}
        {status === "generating" ? "Đang tạo báo giá..." : canShare ? "Chia sẻ báo giá tổng hợp" : "Tải báo giá tổng hợp"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-[12.5px] text-accent">
          Không tạo được ảnh báo giá, vui lòng thử lại.
          {errorDetail && <span className="block break-words text-[11px] text-body-text">({errorDetail})</span>}
        </p>
      )}
      {previewUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-line">
          <p className="bg-bg-tint px-3 py-1.5 text-[11px] font-semibold text-body-text">
            Xem trước ảnh vừa tạo
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Xem trước báo giá vừa tạo" className="w-full" />
        </div>
      )}
    </div>
  );
}
