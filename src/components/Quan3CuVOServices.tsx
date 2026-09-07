import Link from "next/link";
import SectionHead from "./SectionHead";
import Button from "./Button";
import { RevealGroup, RevealItem } from "./Reveal";
import Reveal from "./Reveal";
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
import {
  SAVE_SILVER_GOLD_PREMIUM_PLANS,
  SAVE_SILVER_GOLD_PREMIUM_VAT_NOTE,
  SAVE_SILVER_GOLD_PREMIUM_ADDONS,
} from "@/lib/virtualOfficePlans";
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
 * Bảng giá 4 gói SAVE/SILVER/GOLD/PREMIUM dùng chung cho các chi nhánh áp
 * dụng hệ giá này (Quận 3 (cũ) và Quận 1 (cũ)) — cùng nguồn dữ liệu, chỉ
 * khác tên chi nhánh hiển thị.
 */
export default function Quan3CuVOServices({
  branchName,
  slug,
  promotions,
}: {
  branchName: string;
  /** Slug chi nhánh — dùng để dựng link "Tạo báo giá" của từng gói, trỏ tới
      /tien-ich/tim-goi-phu-hop/[slug]/[plan] (trang chi tiết gói đã có sẵn
      preview + xuất PNG báo giá qua PlanDetailActions/PlanQuoteCard). */
  slug: string;
  /** Khuyến mãi riêng chi nhánh — xem LocationServicesList.tsx cho ý nghĩa
      đầy đủ. Trước đây component này KHÔNG nhận/hiển thị promotions, nên
      4 chi nhánh dùng bảng giá SAVE/SILVER/GOLD/PREMIUM (60 Nguyễn Thông,
      520 Cách Mạng Tháng 8, 36 Mạc Đĩnh Chi, 28-34 Pasteur) không có khối
      "Khuyến mãi riêng chi nhánh" trên trang, dù data đã khai báo. */
  promotions?: LocationData["promotions"];
}) {
  const resolvedPromotions = resolveTimedPromotions(promotions);
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title={`Bảng giá riêng tại chi nhánh ${branchName}`}
          description={`Chi nhánh ${branchName} áp dụng 4 gói văn phòng ảo RIÊNG BIỆT (SAVE, SILVER, GOLD, PREMIUM), khác với hệ thống LITE–RISE chung của MAX OFFICE. Các dịch vụ khác vẫn theo bảng giá chung.`}
        />

        {/* Văn phòng ảo + Dịch vụ khác — GỘP CHUNG vào 1 flex-wrap DUY NHẤT
            (xem lý do đầy đủ ở LocationServicesList.tsx). Hệ SAVE/SILVER/
            GOLD/PREMIUM luôn có đúng 4 gói nên hàng gói VPA không bao giờ
            "cụt" — gộp chung chủ yếu để đồng bộ code + trải nghiệm với
            LocationServicesList.tsx, an toàn nếu sau này số gói thay đổi.
            Ghi chú VAT + khối "Dịch vụ bổ sung" (đặc thù riêng hệ giá này)
            chuyển xuống SAU toàn bộ lưới gộp (trước đây nằm giữa lưới gói
            VPA và lưới Dịch vụ khác) vì giờ 2 loại card nằm chung 1 lưới,
            không còn "giữa" để chèn vào nữa. */}
        <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-7">
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
            <Link
              href="/services/van-phong-ao#bang-gia"
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
            >
              Xem chi tiết
              <ArrowRightSmallIcon className="transition-transform duration-200" />
            </Link>
          </div>
          <RevealGroup className="flex flex-wrap gap-5">
            {SAVE_SILVER_GOLD_PREMIUM_PLANS.map((plan) => (
              <RevealItem
                key={plan.key}
                className="w-full shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
                  <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
                  <div className="mb-3 font-mono text-[20px] font-bold text-primary">
                    {formatVND(plan.price)}
                    <span className="ml-1 font-sans text-[12px] font-medium text-body-text">
                      {plan.duration}
                    </span>
                  </div>
                  <ul className="mb-4 space-y-1.5 text-[12.5px] text-body-text">
                    <li>
                      <span className="font-semibold text-navy">Bảng tên:</span> {plan.nameplate}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Phòng họp:</span> {plan.meetingRoom}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Sảnh tiếp khách:</span> {plan.guestLounge}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Đổi địa chỉ GPKD:</span>{" "}
                      {plan.addressChangeSupport ? "Có hỗ trợ" : "Không"}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Hồ sơ pháp lý toà nhà:</span>{" "}
                      {plan.legalDossier ? "Có" : "Không"}
                    </li>
                  </ul>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {/* Spacer flex-grow + wrapper mt-auto ghim nút xuống đáy —
                      xem lý do đầy đủ ở LocationServicesList.tsx. */}
                  <div className="grow" />
                  <div className="mt-auto pt-4">
                    <Button
                      href={`/tien-ich/tim-goi-phu-hop/${slug}/${plan.key}`}
                      variant="ghost"
                      size="sm"
                      className="w-full !px-3 text-center"
                    >
                      📄 Tạo báo giá
                    </Button>
                  </div>
                </div>
              </RevealItem>
            ))}
            {/* Dịch vụ khác — nối tiếp ngay sau gói VPA cuối cùng trong
                CÙNG 1 flex-wrap (xem lý do ở LocationServicesList.tsx).
                justify-center thay vì justify-between để không bị trống
                trải giữa card khi lọt vào hàng có gói VPA cao hơn. */}
            {OTHER_SERVICES.map((svc) => (
              <RevealItem
                key={svc.slug}
                className="w-full shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
              >
                <Link
                  href={`/services/${svc.slug}#bang-gia`}
                  className="group flex h-full flex-col justify-center rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
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
          <p className="mt-6 text-[12px] text-body-text italic">{SAVE_SILVER_GOLD_PREMIUM_VAT_NOTE}</p>

          <div className="mt-5 rounded-xl bg-accent/8 p-4">
            <p className="mb-3 text-[12.5px] font-bold text-navy">Dịch vụ bổ sung (phát sinh sau khi ký hợp đồng)</p>
            <ul className="space-y-1.5">
              {SAVE_SILVER_GOLD_PREMIUM_ADDONS.map((addon) => (
                <li key={addon.label} className="flex flex-wrap items-baseline justify-between gap-x-3 text-[12.5px]">
                  <span className="text-body-text">{addon.label}</span>
                  <span className="font-mono font-bold text-accent">
                    {formatVND(addon.price)}
                    {addon.note && <span className="ml-1 font-sans font-normal text-body-text">({addon.note})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {resolvedPromotions && resolvedPromotions.length > 0 && (
          <Reveal className="mt-6 rounded-2xl bg-accent/8 p-6 sm:p-7">
            <p className="mb-2 flex items-center gap-1.5 text-[14.5px] font-bold text-navy">
              <span aria-hidden>🎁</span> Khuyến mãi riêng chi nhánh
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
      </div>
    </section>
  );
}
