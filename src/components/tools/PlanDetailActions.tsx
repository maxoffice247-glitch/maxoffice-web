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

      {/* Off-screen — dựng đúng 1080px rộng (cao tự động theo nội dung) để
          html-to-image chụp lại, không hiển thị trực tiếp cho người dùng.
          TRƯỚC ĐÂY đặt `left: -99999px` (đẩy ra rất xa khung nhìn) — đây
          chính là nguyên nhân THẬT gây mất ảnh mặt tiền trên iPhone (2 lần
          fix trước — nhúng data URL, chọn định dạng JPEG/PNG, khai
          width/height cho <img> — đều đúng nhưng chưa đủ vì vẫn dựng ở vị
          trí này): Safari/WebKit trì hoãn hoặc bỏ qua việc tải/giải mã ảnh
          cho nội dung nằm quá xa ngoài khung nhìn (tối ưu hiệu năng), trong
          khi Chrome (Samsung/Android) không làm vậy nên không lộ lỗi khi
          test. Đổi sang giữ card ở đúng góc (0,0) — vẫn "vô hình" với người
          dùng nhờ `opacity: 0` + kẹp trong khung ngoài rộng/cao 0 với
          `overflow: hidden` (không dùng display:none vì nó bỏ qua layout
          hẳn) — buộc trình duyệt phải layout/tải/giải mã ảnh như nội dung
          bình thường thay vì coi là nội dung "ở rất xa, chưa cần render".
          `opacity: 0` đặt ở div NGOÀI (không phải chính node được chụp) —
          html-to-image đọc style ngay trên node truyền vào captureQuotePng()
          để dựng bản sao, nếu đặt opacity: 0 trực tiếp lên node đó thì ảnh
          PNG xuất ra cũng bị trong suốt theo; opacity không phải thuộc tính
          kế thừa nên style ở tổ tiên không ảnh hưởng tới getComputedStyle()
          của node con khi chụp riêng node đó.
          KHÔNG được ép width/height: 0 + overflow: hidden ở div ngoài (đã
          thử, phải revert): phần tử position: fixed không có width/height
          khai rõ vốn co theo NỘI DUNG (shrink-to-fit), nhưng div con
          `quoteRef` bên trong lại là block thường (width: auto = lấp đầy
          containing block) — ép containing block về 0 làm chính
          `quoteRef` bị tính rộng 0, kéo theo html-to-image dựng canvas
          0x0 và `toBlob()` trả về null (lỗi này lộ ra ngay cả trên Chrome
          desktop khi test lại, không phải riêng iPhone). opacity: 0 một
          mình là đủ ẩn khỏi mắt người dùng mà không đụng tới kích thước. */}
      <div aria-hidden style={{ position: "fixed", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}>
        <div ref={quoteRef}>
          <PlanQuoteCard plan={plan} address={address} facadeSrc={facadeSrc} benefits={benefits} promotions={promotions} />
        </div>
      </div>
    </div>
  );
}
