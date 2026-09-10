import { RevealItem } from "./Reveal";
import { CheckCircleIcon } from "./icons";
import type { LitespacePlan } from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * Card 1 gói hệ LiteSpace (CORE/PLUS/PRO). 3 gói có nội dung cao KHÁC NHAU
 * rõ rệt (CORE 5 tính năng + khối combo nền vàng; PLUS 5 tính năng; PRO 9
 * tính năng).
 *
 * ĐỒNG BỘ CHIỀU CAO — không cần ResizeObserver + row-span như VoPlanCard.tsx:
 * VoPlanCard phải đo pixel thật để tính SỐ HÀNG grid mỗi card chiếm, vì ở
 * hệ LITE-RISE các card gói bị GỘP CHUNG 1 lưới dày (grid-flow-row-dense)
 * với các card "Dịch vụ khác" — card gói phải khai đúng số hàng để card
 * dịch vụ khác chảy vào ô trống còn lại. LiteSpace render 3 gói trong lưới
 * `sm:grid-cols-3` RIÊNG (đúng 3 gói = đúng 3 cột = đúng 1 hàng, KHÔNG gộp
 * với "Dịch vụ khác" — xem LitespaceServices.tsx), nên `align-items: stretch`
 * mặc định của CSS Grid TỰ kéo cả 3 card trong hàng cao bằng card cao nhất,
 * không cần JS. Bên trong card: `flex flex-col h-full` + spacer `grow` đẩy
 * khối combo (nếu có) xuống ĐÁY, giữ nội dung chính (tên/giá/mô tả/tính
 * năng) neo ở đỉnh — y hệt cách VoPlanCard ghim nút "Tạo báo giá" xuống đáy
 * độc lập với nội dung co giãn ở trên. Card thấp hơn (PLUS) bị kéo giãn thì
 * phần dư nằm ở spacer `grow` (khoảng trống ở đáy, viền vẫn thẳng hàng với
 * CORE/PRO), không phải đáy so le trông như lỗi.
 */
export default function LitespacePlanCard({ plan }: { plan: LitespacePlan }) {
  return (
    <RevealItem className="h-full">
      <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
        <div>
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
        </div>
        {/* Spacer đẩy khối combo xuống đáy — xem doc comment trên đầu file. */}
        <div className="grow" />
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
