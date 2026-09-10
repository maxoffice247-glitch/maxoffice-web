import { RevealItem } from "./Reveal";
import { CheckCircleIcon } from "./icons";
import type { LitespacePlan } from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * Card 1 gói hệ LiteSpace (CORE/PLUS/PRO). 3 gói cao KHÁC NHAU rõ rệt (CORE
 * 5 tính năng + khối combo nền vàng; PLUS 5 tính năng; PRO 9 tính năng) —
 * KHÔNG dùng lưới "gộp dày" (grid-flow-row-dense + row-span) như
 * SilverGoldPremiumServices.tsx / VoPlanCard.tsx: lưới đó chỉ hợp khi các
 * card gói cao BẰNG NHAU (SGP) hoặc khi cần lấp cột lẻ còn dư (LITE-RISE có
 * 1-4 gói không khớp số cột). LiteSpace có ĐÚNG 3 gói = ĐÚNG 3 cột nên
 * không có cột lẻ; ép 3 card cao lệch nhau vào cùng 1 hàng grid dày sẽ kéo
 * giãn card thấp nhất (PLUS) để lại ~130px trắng ở đáy. Ở đây render lưới
 * đơn giản `items-start` (mỗi card cao theo nội dung thật, đáy so le nhẹ —
 * bình thường với bảng giá) + khối "Dịch vụ khác" tách thành lưới riêng
 * bên dưới (xem LitespaceServices.tsx).
 */
export default function LitespacePlanCard({ plan }: { plan: LitespacePlan }) {
  return (
    <RevealItem>
      <div className="flex flex-col rounded-xl border border-line bg-bg-tint p-5">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[14.5px] font-bold text-navy">{plan.name}</span>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-[10.5px] font-bold text-accent">
            {plan.badge}
          </span>
        </div>
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-mono text-[20px] font-bold text-primary">{formatVND(plan.price)}</span>
          <span className="font-sans text-[12px] font-medium text-body-text">{plan.duration}</span>
        </div>
        <div className="mb-3 text-[12px] text-body-text">
          <span className="text-body-text/70 line-through">{formatVND(plan.originalPrice)}</span>{" "}
          <span className="text-body-text/70">(chưa bao gồm VAT 10%)</span>
        </div>
        <p className="mb-4 text-[12px] leading-relaxed text-body-text">{plan.description}</p>
        <ul className="space-y-1.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
              <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
        {plan.comboBox && (
          <div className="mt-4 rounded-lg bg-amber/12 p-3">
            <p className="mb-1 text-[12px] font-bold text-amber-dark">{plan.comboBox.title}</p>
            <p className="text-[11.5px] leading-relaxed text-body-text">{plan.comboBox.body}</p>
          </div>
        )}
      </div>
    </RevealItem>
  );
}
