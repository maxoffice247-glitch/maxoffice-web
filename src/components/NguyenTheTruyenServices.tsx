import Link from "next/link";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import Reveal from "./Reveal";
import QuotePlanMenu from "./QuotePlanMenu";
import {
  BuildingIcon,
  KeyIcon,
  UsersIcon,
  ScreenIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ArrowRightSmallIcon,
} from "./icons";
import { NGUYEN_THE_TRUYEN_VO_PLANS } from "@/lib/virtualOfficePlans";
import { resolveTimedPromotions, type LocationData } from "@/lib/locationsData";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const OTHER_SERVICES = [
  { slug: "van-phong-tron-goi", icon: KeyIcon, title: "Văn phòng trọn gói", price: "Từ 4.500.000đ/tháng" },
  { slug: "cho-ngoi-linh-dong", icon: UsersIcon, title: "Chỗ ngồi linh động", price: "Từ 2.000.000đ/tháng" },
  { slug: "phong-hop", icon: ScreenIcon, title: "Phòng họp theo giờ", price: "Từ 150.000đ/giờ" },
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    price: "Từ 1.299.000đ (kèm văn phòng ảo)",
  },
  { slug: "ke-toan-thue", icon: CalculatorIcon, title: "Kế toán & thuế", price: "Từ 500.000đ/tháng" },
];

/**
 * Bảng giá 3 gói LEAN/GROWING/SCALE-UP — hệ giá đối tác riêng, hiện chỉ
 * dùng cho chi nhánh "79 Nguyễn Thế Truyện" (xem NGUYEN_THE_TRUYEN_VO_PLANS
 * trong virtualOfficePlans.ts để biết lý do KHÔNG hiển thị tên đối tác
 * gốc). Thiết kế nhận props branchName/slug/promotions (giống
 * SilverGoldPremiumServices/Quan3CuVOServices/LitespaceServices, KHÔNG
 * hardcode tên chi nhánh như PhamVanDongServices/QuanBaServices) để chi
 * nhánh tương lai cùng hệ giá đối tác này tái sử dụng ngay được, chỉ cần
 * đổi branchName/slug khi gọi.
 *
 * Card gói dùng `plan.features` PHẲNG (không có field breakdown riêng như
 * "Bảng tên:"/"Phòng họp:" của SilverGoldPremiumServices/QuanBaServices)
 * — đúng bản chất NguyenTheTruyenPlan (mỗi gói tự liệt kê đủ tính năng,
 * kể cả dòng "Toàn bộ tính năng <gói thấp hơn>" kế thừa), giống cách
 * VoPlanCard/PlanQuoteCard hiển thị VirtualOfficePlan.features.
 */
export default function NguyenTheTruyenServices({
  branchName,
  slug,
  promotions,
}: {
  branchName: string;
  slug: string;
  promotions?: LocationData["promotions"];
}) {
  const resolvedPromotions = resolveTimedPromotions(promotions);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title={`Bảng giá riêng tại chi nhánh ${branchName}`}
          description={`Chi nhánh ${branchName} áp dụng 3 gói văn phòng ảo RIÊNG BIỆT (LEAN, GROWING, SCALE-UP), khác với hệ thống LITE–RISE chung của MAX OFFICE. Các dịch vụ khác vẫn theo bảng giá chung.`}
        />

        <Reveal className="mb-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Văn phòng ảo</h3>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11.5px] font-bold text-accent">
                  Giá áp dụng riêng tại chi nhánh {branchName}
                </span>
              </div>
            </div>
            {/* Nút "Tạo báo giá" DUY NHẤT thay cho nút lặp lại dưới từng
                card gói (xem doc comment QuotePlanMenu.tsx). */}
            <div className="flex shrink-0 items-center gap-3">
              <QuotePlanMenu slug={slug} plans={NGUYEN_THE_TRUYEN_VO_PLANS} />
              <Link
                href="/services/van-phong-ao#bang-gia"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
              >
                Xem chi tiết
                <ArrowRightSmallIcon className="transition-transform duration-200" />
              </Link>
            </div>
          </div>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {NGUYEN_THE_TRUYEN_VO_PLANS.map((plan) => (
              <RevealItem key={plan.key}>
                <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
                  <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
                  <div className="mb-3 font-mono text-[22px] font-bold text-primary">
                    {formatVND(plan.price)}
                    <span className="ml-1 font-sans text-[12px] font-medium text-body-text">
                      {plan.duration}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-6 text-[12px] text-body-text italic">Giá các gói trên chưa bao gồm VAT 10%.</p>
        </Reveal>

        {resolvedPromotions && resolvedPromotions.length > 0 && (
          <Reveal className="mb-6 rounded-2xl bg-accent/8 p-6 sm:p-7">
            <p className="mb-2 flex items-center gap-1.5 text-[14.5px] font-bold text-navy">
              <span aria-hidden>🎁</span> Khuyến mãi & ưu đãi
            </p>
            <ul className="space-y-1.5">
              {resolvedPromotions.map((note) => (
                <li key={note} className="text-[13.5px] leading-relaxed text-body-text">
                  • {note}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* Các dịch vụ khác — giá chung, không đổi tại chi nhánh này */}
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OTHER_SERVICES.map((svc) => (
            <RevealItem key={svc.slug}>
              <Link
                href={`/services/${svc.slug}#bang-gia`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
              >
                <div>
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <svc.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1.5 text-[15.5px] font-bold text-navy">{svc.title}</h3>
                  <p className="font-mono text-[13.5px] font-bold text-primary">{svc.price}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                  Xem chi tiết
                  <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
