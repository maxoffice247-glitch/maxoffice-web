"use client";

import { useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, ShareIcon, SpinnerIcon } from "../icons";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";

/**
 * TRƯỚC ĐÂY: dựng 1 bản PlanQuoteCard off-screen rồi dùng html-to-image để
 * "chụp" lại thành PNG ngay trên trình duyệt của khách. Sau 4 lần sửa lỗi
 * thiếu ảnh mặt tiền/logo trên iPhone (fetch nội bộ lỗi, PNG phình dung
 * lượng, thiếu width/height <img>, card đặt quá xa khung nhìn) mà lỗi vẫn
 * còn — kể cả khi đã xác nhận qua ảnh chụp màn hình thật từ máy lỗi rằng cả
 * logo lẫn ảnh mặt tiền đều trắng trơn ngay trong bước xem trước (không
 * phải lỗi hiển thị/chia sẻ sau đó) — nguyên nhân nhiều khả năng là hạn chế
 * ĐÃ BIẾT của html-to-image trên Safari/WebKit (đóng gói nội dung vào 1 SVG
 * rồi nạp SVG đó như 1 "ảnh" để rasterize — Safari có chính sách bảo mật
 * riêng cho "SVG dùng làm ảnh" thường từ chối vẽ ảnh raster nhúng bên trong
 * <foreignObject> trong ngữ cảnh đó), không vá được bằng cách tinh chỉnh
 * thêm ở tầng DOM/CSS.
 *
 * GIỜ: ảnh báo giá được RENDER SẴN Ở SERVER (xem
 * src/app/api/quote-image/[slug]/[plan]/route.tsx, dùng next/og +
 * Satori — cùng hạ tầng đã dùng cho ảnh Open Graph) — trình duyệt của
 * khách chỉ cần TẢI VỀ 1 file PNG có sẵn, không phải tự "chụp" gì nữa, nên
 * né hoàn toàn giới hạn của Safari nói trên.
 */
export default function PlanDetailActions({ plan }: { plan: OfferedPlan }) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  // Xem trước ảnh vừa tải về ngay trên trang — giữ lại từ luồng cũ, vẫn hữu
  // ích để khách xem nhanh trước khi gửi cho khách hàng của họ.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // false lúc SSR/lần render đầu (không có `navigator`) -> luôn ra nút
  // "Tải báo giá" trước, rồi chuyển thành "Chia sẻ báo giá" ngay khi
  // hydrate xong nếu trình duyệt hỗ trợ (hầu hết là di động — Safari
  // iOS/Chrome Android) — xem useCanShareFiles() trong waitForImages.ts.
  const canShare = useCanShareFiles();

  const handleDownloadQuote = async () => {
    setStatus("generating");
    try {
      const res = await fetch(`/api/quote-image/${plan.locationSlug}/${plan.planKey}`);
      if (!res.ok) throw new Error(`Server trả về lỗi ${res.status} khi tạo ảnh báo giá.`);
      const blob = await res.blob();
      const filename = `bao-gia-${plan.locationSlug}-${plan.planKey}.png`;
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
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
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
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
