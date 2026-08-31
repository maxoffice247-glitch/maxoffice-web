import type { ReactNode } from "react";
import { CheckCircleIcon } from "../icons";
import type { OfferedPlan } from "@/lib/planFinder";
import { formatVoPrice } from "@/lib/planFinder";

/**
 * Icon ĐÃ được dựng thành JSX (không phải component reference) — bắt buộc
 * vì trang chi tiết gói ([slug]/[plan]/page.tsx) là Server Component, còn
 * PlanDetailActions/PlanQuoteCard chạy phía client ("use client"): truyền
 * thẳng `BenefitItem.icon` (một function/component reference) qua ranh giới
 * Server -> Client sẽ lỗi runtime "Functions cannot be passed directly to
 * Client Components" vì React Server Components không serialize được hàm.
 * JSX đã dựng sẵn (ReactNode) thì serialize bình thường.
 */
export type QuoteBenefitTag = { title: string; icon: ReactNode };

/**
 * Nội dung ảnh báo giá xuất bằng html-to-image (xem PlanDetailActions).
 * Chỉ cố định CHIỀU RỘNG 1080px bằng inline style (không dùng class
 * responsive, vì đây là DOM off-screen được chụp đúng 1:1 pixel, không hiển
 * thị trực tiếp cho người dùng xem trên trang) — chiều cao để TỰ ĐO theo nội
 * dung thực tế (số tính năng 1 cột hay 2 cột, có/không "Tiện ích khu vực"),
 * giống cách PlanGroupQuoteCard đã làm. Trước đây từng cố định height:1350
 * (tỉ lệ Instagram 4:5), nhưng không có ràng buộc kỹ thuật nào khác phụ
 * thuộc vào con số đó (html-to-image không truyền width/height cố định khi
 * gọi toPng, và card nhóm bên cạnh vốn đã auto-height) — cố định cứng chỉ
 * gây khoảng trắng thừa cuối card khi nội dung ngắn hơn (VD gói LITE 1 cột,
 * hoặc RISE 9 tính năng rút gọn còn 5 dòng sau khi chia 2 cột).
 */
export default function PlanQuoteCard({
  plan,
  address,
  facadeSrc,
  benefits,
}: {
  plan: OfferedPlan;
  address: string;
  facadeSrc: string;
  /** Tiện ích khu vực của chi nhánh — lấy nguyên trạng từ `LOCATIONS_DATA[slug].benefits` (đã có sẵn, dùng chung với "Vì sao nên chọn văn phòng..." trên trang chi nhánh). Bỏ trống hoặc undefined => ẩn khối "Tiện ích khu vực". */
  benefits?: QuoteBenefitTag[];
}) {
  // Gói giá cao (VD RISE 1.199.000đ) có tới 9 tính năng — 1 cột dọc kéo card
  // quá cao khi export PNG. Từ 6 tính năng trở lên thì chia lưới 2 cột, cột
  // trái lấp đầy trước (grid-auto-flow: column + đúng số hàng), nên số lẻ tự
  // cân đối kiểu 9 -> 5/4 chứ không lệch hẳn 1 bên. Dưới 6 tính năng (gói cơ
  // bản như LITE) giữ 1 cột như cũ — 2 cột ở số lượng ít làm layout trống trải.
  const features = plan.features.slice(0, 9);
  const useFeatureGrid = features.length >= 6;
  const featureGridRows = Math.ceil(features.length / 2);

  return (
    <div style={{ width: 1080 }} className="flex flex-col bg-white">
      {/* Header — logo + tiêu đề báo giá */}
      <div className="flex items-center justify-between px-14 pt-12 pb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-red.png" alt="MAX OFFICE" style={{ height: 56 }} />
        <span className="rounded-full bg-navy px-6 py-2.5 text-[22px] font-bold text-white">
          Báo giá
        </span>
      </div>

      {/* Ảnh mặt tiền — ảnh gốc là ảnh DỌC, nên đặt cạnh phần tên/địa chỉ
          thay vì phủ nền toàn chiều ngang như trước (cách đó giả định ảnh
          NGANG, sẽ mất góc trên/dưới nặng khi ảnh thật là ảnh dọc). Khung
          aspect-[3/4] + object-contain đảm bảo không cắt ảnh dù tỉ lệ thật
          của từng chi nhánh khác nhau. */}
      <div className="mx-14 flex items-center gap-7 rounded-3xl bg-bg-tint p-6">
        <div className="relative aspect-[3/4] w-[270px] shrink-0 overflow-hidden rounded-2xl bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={facadeSrc} alt={plan.locationName} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-[30px] leading-tight font-extrabold text-navy">{plan.locationName}</p>
          <p className="mt-2 text-[18px] leading-relaxed text-body-text">{address}</p>
          {/* Tiện ích khu vực — tái sử dụng nguyên field benefits có sẵn của
              chi nhánh (cùng dữ liệu với "Vì sao nên chọn văn phòng..." trên
              trang chi nhánh), không bịa nội dung mới. Tối đa 4 tag, giữ
              đúng thứ tự ưu tiên có sẵn trong data; ẩn hẳn khối nếu rỗng. */}
          {benefits && benefits.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {benefits.slice(0, 4).map((b) => (
                <span
                  key={b.title}
                  className="flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 text-[14px] font-semibold text-primary"
                >
                  {b.icon}
                  {b.title}
                </span>
              ))}
            </div>
          )}
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
      <div className="mx-14 mt-9">
        <p className="mb-5 text-[20px] font-bold text-navy">Tính năng đi kèm</p>
        <div
          className={useFeatureGrid ? "grid gap-x-8 gap-y-4" : "flex flex-col gap-4"}
          style={
            useFeatureGrid
              ? {
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: `repeat(${featureGridRows}, auto)`,
                  gridAutoFlow: "column",
                }
              : undefined
          }
        >
          {features.map((f) => (
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
