import { CheckCircleIcon, InfoIcon } from "../icons";
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
/**
 * Xác định cách hiển thị khuyến mãi cho cả nhóm gói (nhiều chi nhánh):
 * - "none": không chi nhánh nào trong nhóm có khuyến mãi được ghi nhận
 *   -> ẩn hẳn khối này ở card.
 * - "shared": MỌI chi nhánh trong nhóm có ĐÚNG cùng 1 danh sách khuyến mãi
 *   -> hiển thị chung 1 lần ngay dưới "Gói + giá", đỡ lặp lại 7 lần giống
 *   hệt nhau khi cả nhóm dùng chung 1 chính sách.
 * - "per-location": các chi nhánh có khuyến mãi khác nhau (hoặc chỉ 1 vài
 *   chi nhánh có, số còn lại không) -> hiển thị riêng theo từng dòng chi
 *   nhánh trong "Danh sách chi nhánh áp dụng", bỏ qua chi nhánh không có.
 */
function resolvePromoDisplay(locations: PlanGroup["locations"]) {
  const withPromo = locations.filter((l) => l.promotions && l.promotions.length > 0);
  if (withPromo.length === 0) return { mode: "none" as const };
  const allHavePromo = withPromo.length === locations.length;
  const first = JSON.stringify(withPromo[0].promotions);
  const allSame = allHavePromo && withPromo.every((l) => JSON.stringify(l.promotions) === first);
  return allSame
    ? { mode: "shared" as const, promotions: withPromo[0].promotions! }
    : { mode: "per-location" as const };
}

export default function PlanGroupQuoteCard({ group }: { group: PlanGroup }) {
  const promoDisplay = resolvePromoDisplay(group.locations);

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
      <div className="mx-14 rounded-2xl bg-bg-tint px-8 py-7">
        <div className="flex items-center justify-between">
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
        {/* Phụ phí một lần (vd. bảng hiệu công ty của gói LITE) — tách biệt
            khỏi danh sách "Tính năng đi kèm" bên dưới vì đây KHÔNG phải
            tiện ích đi kèm hàng tháng, mà là 1 khoản thu riêng, 1 lần. */}
        {group.addonNote && (
          <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-[14px] leading-relaxed text-amber-dark">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {group.addonNote}
          </p>
        )}
      </div>

      {/* Khuyến mãi dùng CHUNG cho cả nhóm — chỉ hiện khi mọi chi nhánh
          trong nhóm có ĐÚNG cùng 1 danh sách khuyến mãi (resolvePromoDisplay).
          Nếu khuyến mãi khác nhau giữa các chi nhánh thì hiển thị riêng theo
          từng dòng trong "Danh sách chi nhánh áp dụng" bên dưới thay vì ở
          đây, để không gán nhầm ưu đãi của 1 chi nhánh cho cả nhóm. */}
      {promoDisplay.mode === "shared" && (
        <div className="mx-14 mt-6 rounded-2xl border border-accent/25 bg-accent/8 px-8 py-6">
          <p className="mb-2 flex items-center gap-1.5 text-[16px] font-bold text-accent">
            <span aria-hidden>🎁</span> Ưu đãi khi ký hợp đồng dài hạn
          </p>
          <ul className="space-y-1.5">
            {promoDisplay.promotions.slice(0, 3).map((p) => (
              <li key={p} className="flex items-start gap-2 text-[15px] leading-snug text-ink">
                <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

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
                {/* /images/quote/ — bản đã resize/nén riêng cho xuất ảnh báo
                    giá (xem waitForImages.ts), không phải ảnh gốc full-res:
                    hiển thị ở đây chỉ 64px, ảnh gốc vài trăm KB là dư thừa
                    và làm chậm export trên mobile khi nhóm có nhiều chi
                    nhánh. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/quote/dia-diem-${loc.slug}.jpg`}
                  alt={loc.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[19px] font-bold text-navy">{loc.name}</p>
                <p className="text-[15px] text-body-text">{loc.shortAddress}</p>
                {/* Chế độ "per-location": mỗi chi nhánh có ưu đãi khác nhau
                    (hoặc chỉ 1 vài chi nhánh có), nên gắn đúng vào dòng của
                    chi nhánh đó thay vì 1 khối chung dễ gây hiểu nhầm là áp
                    dụng cho tất cả. Bỏ qua hẳn dòng này nếu chi nhánh không
                    có khuyến mãi nào được ghi nhận. */}
                {promoDisplay.mode === "per-location" && loc.promotions && loc.promotions.length > 0 && (
                  <p className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-accent">
                    <span aria-hidden>🎁</span>
                    <span>{loc.promotions.slice(0, 2).join(" · ")}</span>
                  </p>
                )}
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
