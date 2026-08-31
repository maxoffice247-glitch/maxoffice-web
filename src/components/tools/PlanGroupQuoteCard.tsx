import { CheckCircleIcon } from "../icons";
import type { PlanGroup } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";

/**
 * Nội dung ảnh báo giá TỔNG HỢP xuất bằng html-to-image (xem
 * PlanGroupDetailActions) — 1 gói áp dụng ở NHIỀU chi nhánh, nên không có 1
 * ảnh mặt tiền đại diện duy nhất như PlanQuoteCard (gói 1 chi nhánh); thay
 * vào đó liệt kê từng chi nhánh kèm ảnh nhỏ (object-contain, không cắt ảnh
 * dù mỗi chi nhánh có tỉ lệ ảnh gốc khác nhau).
 *
 * Chiều rộng cố định 1080px (đúng khung ảnh dọc xem trên điện thoại), chiều
 * cao để TỰ ĐO theo số chi nhánh (1-7+ chi nhánh) thay vì cố định 1350px như
 * ảnh báo giá 1 chi nhánh — số chi nhánh mỗi nhóm chênh lệch quá lớn để dùng
 * chung 1 chiều cao cố định mà không bị trống hoặc tràn.
 */
export default function PlanGroupQuoteCard({ group }: { group: PlanGroup }) {
  return (
    <div style={{ width: 1080 }} className="flex flex-col bg-white">
      {/* Header — logo + tiêu đề báo giá */}
      <div className="flex items-center justify-between px-14 pt-12 pb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-red.png" alt="MAX OFFICE" style={{ height: 56 }} />
        <span className="rounded-full bg-navy px-6 py-2.5 text-[22px] font-bold text-white">
          Báo giá tổng hợp
        </span>
      </div>

      {/* Gói + giá */}
      <div className="mx-14 flex items-center justify-between rounded-2xl bg-bg-tint px-8 py-7">
        <div>
          <p className="text-[16px] font-bold tracking-[0.08em] text-primary uppercase">
            Gói {group.planName}
          </p>
          <p className="mt-1 text-[15px] text-body-text">
            Văn phòng ảo · Áp dụng tại {group.locations.length} chi nhánh
          </p>
        </div>
        <div className="text-right">
          <p className="text-[44px] font-extrabold text-accent">{formatVoPrice(group.price)}</p>
          <p className="text-[15px] text-body-text">/tháng · chưa gồm VAT 10%</p>
        </div>
      </div>

      {/* Danh sách tính năng */}
      <div className="mx-14 mt-9">
        <p className="mb-5 text-[20px] font-bold text-navy">Tính năng đi kèm</p>
        <div className="flex flex-col gap-4">
          {group.features.map((f) => (
            <div key={f} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <CheckCircleIcon className="h-4 w-4" />
              </span>
              <span className="text-[19px] leading-snug text-ink">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách chi nhánh áp dụng */}
      <div className="mx-14 mt-9">
        <p className="mb-5 text-[20px] font-bold text-navy">
          Áp dụng tại {group.locations.length} chi nhánh
        </p>
        <div className="flex flex-col gap-3">
          {group.locations.map((loc) => (
            <div key={loc.slug} className="flex items-center gap-4 rounded-2xl bg-bg-tint p-3">
              <div className="relative aspect-[3/4] w-[64px] shrink-0 overflow-hidden rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/dia-diem-${loc.slug}.jpg`}
                  alt={loc.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[19px] font-bold text-navy">{loc.name}</p>
                <p className="text-[15px] text-body-text">{loc.shortAddress}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mx-14 mt-9 mb-12 flex items-center justify-between border-t border-line pt-7">
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
