"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { RevealItem } from "./Reveal";
import { CheckCircleIcon } from "./icons";
import type { VirtualOfficePlan } from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/** Đơn vị 1 hàng grid — PHẢI khớp `sm:auto-rows-[minmax(195px,auto)]` ở
    grid cha (LocationServicesList.tsx). Đổi 1 trong 2 nơi thì phải đổi cả
    2. */
const ROW_UNIT_PX = 195;
/** `p-5` (20px) trên + dưới của card — cố định theo class Tailwind, không
    đổi theo nội dung nên an toàn để hardcode (khác hẳn checklist tính
    năng bên dưới, PHẢI đo thật vì thay đổi theo từng gói/chi nhánh). */
const CARD_PADDING_Y_PX = 40;

type RowSpan = 1 | 2 | 3 | 4;

/**
 * Làm tròn "gần nhất" (`Math.round`), KHÔNG làm tròn lên để "đảm bảo đủ
 * chỗ" — thoạt tưởng làm tròn lên an toàn hơn, nhưng thực đo cho thấy
 * ngược lại: khi chiều cao thật lệch chỉ vài px qua khỏi 1 mốc (vd. gói
 * BASE ở nhiều chi nhánh cao ~412-413px, vượt mốc 2 hàng ~410px đúng 2-3px
 * — do KHÔNG cộng thêm khoảng gap-5 giữa các hàng vào phép chia, y hệt
 * cách tính cũ), làm tròn lên sẽ nhảy hẳn thêm 1 hàng (~195px) chỉ để bù
 * 2-3px thiếu — tạo khoảng trắng ~200px, đúng kiểu lỗi đang phải sửa.
 * Làm tròn "gần nhất" đôi khi làm hàng NGẮN hơn thật vài px, nhưng phần
 * `auto` trong `minmax(195px,auto)` tự giãn bù đúng phần thiếu nhỏ đó —
 * gần như không thấy được, thay vì tạo khoảng trắng lớn.
 */
function spanForHeight(px: number): RowSpan {
  const span = Math.round(px / ROW_UNIT_PX);
  return Math.max(1, Math.min(4, span)) as RowSpan;
}

function rowSpanClass(n: RowSpan): string {
  switch (n) {
    case 1:
      return "sm:row-span-1";
    case 2:
      return "sm:row-span-2";
    case 3:
      return "sm:row-span-3";
    default:
      return "sm:row-span-4";
  }
}

/**
 * Card gói VPA trong lưới CSS Grid dense (xem LocationServicesList.tsx) —
 * TỰ ĐO chiều cao nội dung THẬT bằng ResizeObserver để tính row-span chính
 * xác, thay cho công thức hồi quy tuyến tính theo SỐ tính năng đã dùng
 * trước đây (`naturalHeight ≈ 25×N + 164`, hiệu chỉnh từ 1 số mẫu giới hạn
 * — Sông Thao START/BASE, Yên Thế BASE/ORIGIN/ORIGIN+/RISE).
 *
 * VÌ SAO BỎ CÔNG THỨC CŨ: công thức giả định MỌI tính năng cao đúng ~25px
 * như nhau (luôn 1 dòng), nhưng độ dài chữ mỗi tính năng khác nhau theo
 * TỪNG gói — tính năng chữ dài xuống 2 dòng ở độ rộng cột thật (đặc biệt
 * sau khi có LOCATION_VO_FEATURE_OVERRIDES cho phép 1 chi nhánh có
 * checklist khác chi nhánh khác dù cùng tên gói) khiến chiều cao thật lệch
 * hẳn so với N dự đoán — bug thực tế: Hoàng Việt START/BASE cùng SỐ tính
 * năng (N) với Sông Thao START/BASE nhưng vẫn bị ước lượng sai (quá cao),
 * vì công thức tuyến tính theo N không thể phản ánh việc xuống dòng — 2
 * chi nhánh cùng N vẫn có thể có chiều cao thật khác nhau tuỳ text. Đo DOM
 * thật loại bỏ hẳn nguồn sai số này: đúng với MỌI tổ hợp nội dung hiện có
 * lẫn sau này (thêm gói/chi nhánh mới, đổi text tính năng) mà không cần
 * hiệu chỉnh lại công thức mỗi lần.
 *
 * CHỈ đo phần "content" (tên gói + giá + checklist + addOn) — trước đây có
 * thêm nút "Tạo báo giá" riêng ở footer mỗi card, đo tách riêng khỏi
 * content qua 1 spacer flex-grow ở giữa; nút đó đã gộp thành 1 nút DUY
 * NHẤT ở đầu section (QuotePlanMenu, xem LocationServicesList.tsx) nên
 * card giờ không còn phần "footer" nào để đo/ghim xuống đáy nữa — bỏ luôn
 * spacer + footerRef, đo thẳng toàn bộ nội dung card.
 *
 * `useLayoutEffect` (không phải `useEffect`) để đo VÀ set state TRƯỚC khi
 * trình duyệt vẽ khung hình đầu tiên — tránh nháy layout sai (mặc định
 * row-span-1) rồi mới nhảy đúng ngay sau đó. ResizeObserver (không chỉ đo
 * 1 lần lúc mount) để tự đo lại khi cột đổi bề rộng (resize cửa sổ đổi số
 * cột grid → đổi điểm xuống dòng của checklist) hoặc web font tải xong sau
 * (đổi độ rộng chữ → đổi điểm xuống dòng) — 1 lần đo lúc mount là không đủ
 * cho các trường hợp này. Thêm `visibilitychange` phòng trường hợp trang
 * mount lúc tab đang ở nền (1 số trình duyệt tạm dừng callback
 * ResizeObserver cho tab nền) — đo lại ngay khi tab hiện lên để không bị
 * kẹt ở phép đo sai chụp lúc còn ẩn (phát hiện được khi test qua Browser
 * pane bị host ẩn giữa chừng — layout co lại bất thường lúc đó khiến phép
 * đo ban đầu sai, rồi bị kẹt mãi ở giá trị sai vì ResizeObserver không bắn
 * lại dù nội dung đã đổi kích thước thật khi hiện lại).
 */
export default function VoPlanCard({ plan }: { plan: VirtualOfficePlan }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [span, setSpan] = useState<RowSpan>(1);

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const measure = () => {
      const naturalHeight = CARD_PADDING_Y_PX + contentEl.offsetHeight;
      const next = spanForHeight(naturalHeight);
      setSpan((prev) => (prev === next ? prev : next));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(contentEl);

    // Phòng trường hợp trang được render/mount trong lúc tab/khung xem
    // đang ẩn (vd. mở link ở tab nền, hoặc cửa sổ trình duyệt bị thu nhỏ) —
    // 1 số trình duyệt tạm dừng ResizeObserver cho tab nền, nên phép đo lúc
    // mount có thể chụp đúng lúc layout đang co lại bất thường (đo được
    // rồi không có cơ hội đo lại khi tab hiện lên bình thường trở lại, vì
    // ResizeObserver bị treo, không bắn callback tiếp dù nội dung đổi kích
    // thước thật ngay khi tab hiện lại). Đo lại ngay khi tab hiện lại để
    // luôn tự sửa nếu phép đo ban đầu bị sai do lý do này.
    const onVisible = () => {
      if (document.visibilityState === "visible") measure();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <RevealItem className={rowSpanClass(span)}>
      <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
        <div ref={contentRef}>
          <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
          <div className="mb-3 font-mono text-[20px] font-bold text-primary">
            {formatVND(plan.price)}
            <span className="ml-1 font-sans text-[12px] font-medium text-body-text">{plan.duration}</span>
          </div>
          <ul className="space-y-1.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
          {plan.addOn && (
            <p className="mt-3 text-[11px] leading-relaxed text-body-text">
              +{formatVND(plan.addOn.price)} {plan.addOn.label} ({plan.addOn.note})
            </p>
          )}
        </div>
      </div>
    </RevealItem>
  );
}
