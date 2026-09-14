"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon, PhoneIcon, ShareIcon, SpinnerIcon } from "../icons";
import PlanGroupQuoteCard from "./PlanGroupQuoteCard";
import type { PlanGroup } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";
import { captureQuotePng, shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";

export default function PlanGroupDetailActions({ group }: { group: PlanGroup }) {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  // Xem PlanDetailActions (component tương đương cho báo giá 1 chi nhánh)
  // để biết vì sao dùng useCanShareFiles() thay vì useEffect + setState.
  const canShare = useCanShareFiles();

  const handleDownloadQuote = async () => {
    const node = quoteRef.current;
    if (!node) return;
    setStatus("generating");
    try {
      const filename = `bao-gia-tong-hop-${group.groupKey}.png`;
      // captureQuotePng() đợi + nhúng ảnh thành data: URL (ngăn html-to-
      // image tự fetch lại — nguyên nhân thật gây mất ảnh trên mobile, xem
      // waitForImages.ts) và ném lỗi rõ ràng nếu vẫn thiếu ảnh sau khi thử
      // lại — càng quan trọng ở đây vì báo giá nhóm có thể phải nhúng 7+
      // ảnh cùng lúc (logo + ảnh từng chi nhánh).
      const blob = await captureQuotePng(node);
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
        </p>
      )}

      {/* Off-screen — dựng khung rộng 1080px (cao tự động theo số chi nhánh)
          để html-to-image chụp lại, không hiển thị trực tiếp cho người dùng.
          Xem chú thích đầy đủ ở PlanDetailActions.tsx (component tương
          đương cho báo giá 1 chi nhánh): TRƯỚC ĐÂY đặt `left: -99999px`
          (đẩy ra rất xa khung nhìn) là nguyên nhân THẬT gây mất ảnh trên
          iPhone — Safari/WebKit trì hoãn/bỏ qua tải-giải mã ảnh cho nội
          dung nằm quá xa ngoài khung nhìn, Chrome (Samsung/Android) thì
          không nên trước đây không lộ lỗi khi test. Đổi sang giữ card ở
          đúng góc (0,0), ẩn bằng `opacity: 0` đặt ở div NGOÀI (không phải
          node truyền vào captureQuotePng(), tránh ảnh PNG xuất ra cũng bị
          trong suốt theo). KHÔNG ép width/height: 0 + overflow: hidden ở
          div ngoài (đã thử, phải revert — xem chú thích đầy đủ ở
          PlanDetailActions.tsx): làm `quoteRef` bên trong bị tính rộng 0
          (block thường width: auto lấp đầy containing block, containing
          block lại bị ép về 0), kéo theo html-to-image dựng canvas 0x0 và
          `toBlob()` trả về null — lộ ra ngay cả trên Chrome desktop, không
          phải riêng iPhone. opacity: 0 một mình là đủ ẩn. */}
      <div aria-hidden style={{ position: "fixed", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}>
        <div ref={quoteRef}>
          <PlanGroupQuoteCard group={group} />
        </div>
      </div>
    </div>
  );
}
