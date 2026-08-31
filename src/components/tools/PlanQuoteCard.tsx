import { CheckCircleIcon } from "../icons";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";

/**
 * Nội dung ảnh báo giá 1080x1350 xuất bằng html-to-image (xem PlanDetailActions).
 * Kích thước cố định bằng inline style (không dùng class responsive) vì đây
 * là DOM off-screen được chụp đúng 1:1 pixel, không hiển thị trực tiếp cho
 * người dùng xem trên trang.
 */
export default function PlanQuoteCard({
  plan,
  address,
  facadeSrc,
}: {
  plan: OfferedPlan;
  address: string;
  facadeSrc: string;
}) {
  return (
    <div
      style={{ width: 1080, height: 1350 }}
      className="flex flex-col bg-white"
    >
      {/* Header — logo + tiêu đề báo giá */}
      <div className="flex items-center justify-between px-14 pt-12 pb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-red.png" alt="MAX OFFICE" style={{ height: 56 }} />
        <span className="rounded-full bg-navy px-6 py-2.5 text-[22px] font-bold text-white">
          Báo giá
        </span>
      </div>

      {/* Ảnh mặt tiền */}
      <div className="relative mx-14 overflow-hidden rounded-3xl" style={{ height: 420 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={facadeSrc} alt={plan.locationName} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(11,31,58,0.75)] to-transparent px-8 pt-16 pb-6">
          <p className="text-[30px] font-extrabold text-white">{plan.locationName}</p>
          <p className="mt-1 text-[19px] text-white/85">{address}</p>
        </div>
      </div>

      {/* Gói + giá */}
      <div className="mx-14 mt-10 flex items-center justify-between rounded-2xl bg-bg-tint px-8 py-7">
        <div>
          <p className="text-[16px] font-bold tracking-[0.08em] text-primary uppercase">
            Gói {plan.planName}
          </p>
          <p className="mt-1 text-[15px] text-body-text">Văn phòng ảo · {plan.area.name}</p>
        </div>
        <div className="text-right">
          <p className="text-[44px] font-extrabold text-accent">{formatVoPrice(plan.price)}</p>
          <p className="text-[15px] text-body-text">/tháng · chưa gồm VAT 10%</p>
        </div>
      </div>

      {/* Danh sách tính năng */}
      <div className="mx-14 mt-9 flex-1">
        <p className="mb-5 text-[20px] font-bold text-navy">Tính năng đi kèm</p>
        <div className="flex flex-col gap-4">
          {plan.features.slice(0, 9).map((f) => (
            <div key={f} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <CheckCircleIcon className="h-4 w-4" />
              </span>
              <span className="text-[19px] leading-snug text-ink">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mx-14 mb-12 flex items-center justify-between border-t border-line pt-7">
        <div>
          <p className="text-[22px] font-extrabold text-navy">Hotline: 089 8082 188</p>
          <p className="mt-1 text-[16px] text-body-text">maxoffice.vn</p>
        </div>
        <span className="rounded-full bg-accent px-6 py-3 text-[16px] font-bold text-white">
          Liên hệ tư vấn ngay
        </span>
      </div>
    </div>
  );
}
