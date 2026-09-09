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

        {/* Văn phòng ảo + Dịch vụ khác — GỘP CHUNG vào 1 lưới CSS Grid +
            grid-flow-row-dense DUY NHẤT (xem lý do/cơ chế đầy đủ ở
            LocationServicesList.tsx — đợt trước dùng flex-wrap, nhưng
            flex-wrap khiến 1 card "dịch vụ khác" đứng lẻ cạnh card VPA cao
            bị stretch kéo giãn để lại khoảng trắng lớn; grid dense lấp
            NHIỀU card dịch vụ khác chồng dọc vào đúng chỗ thay vì 1 card
            bị kéo giãn). Hệ SAVE/SILVER/GOLD/PREMIUM CẢ 4 GÓI dùng chung
            đúng 1 danh sách features (TIER_FAMILY_COMMON_FEATURES) nên
            luôn cao BẰNG NHAU — không cần công thức row-span theo từng gói
            như LocationServicesList.tsx, dùng 1 hằng số row-span=2 áp dụng
            đều cho cả 4 gói (đo DOM thật SAU KHI bỏ nút "Tạo báo giá" riêng
            từng card — gộp về 1 nút chung ở đầu section, xem QuotePlanMenu:
            card cao tự nhiên ~454px, card "dịch vụ khác" ở layout 4 cột cao
            tự nhiên ~215px, 454/215≈2.11 → 2 vẫn là hợp lý nhất). 4 gói luôn
            khớp đúng 4 cột nên hàng gói VPA không
            bao giờ "cụt" — gộp lưới ở đây chủ yếu để đồng bộ code + trải
            nghiệm với LocationServicesList.tsx, an toàn nếu sau này số gói
            thay đổi. Ghi chú VAT + khối "Dịch vụ bổ sung" (đặc thù riêng
            hệ giá này) nằm SAU toàn bộ lưới gộp vì không còn "giữa" lưới
            gói VPA/lưới Dịch vụ khác để chèn vào nữa. */}
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
            {/* Nút "Tạo báo giá" DUY NHẤT thay cho nút lặp lại dưới từng
                card gói (xem doc comment QuotePlanMenu.tsx) — đặt bên trái
                "Xem chi tiết", cùng hàng tiêu đề section. */}
            <div className="flex shrink-0 items-center gap-3">
              <QuotePlanMenu slug={slug} plans={SAVE_SILVER_GOLD_PREMIUM_PLANS} />
              <Link
                href="/services/van-phong-ao#bang-gia"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
              >
                Xem chi tiết
                <ArrowRightSmallIcon className="transition-transform duration-200" />
              </Link>
            </div>
          </div>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:auto-rows-[minmax(215px,auto)] sm:grid-flow-row-dense lg:grid-cols-4">
            {SAVE_SILVER_GOLD_PREMIUM_PLANS.map((plan) => (
              <RevealItem key={plan.key} className="sm:row-span-2">
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
                </div>
              </RevealItem>
            ))}
            {/* Dịch vụ khác — nối tiếp ngay sau gói VPA cuối cùng, row-span
                mặc định = 1, grid-flow-row-dense tự lấp chồng dọc vào chỗ
                trống bên cạnh gói VPA (xem lý do ở LocationServicesList.tsx).
                justify-center để phần lệch nhỏ (nếu có) chia đều trên/dưới. */}
            {OTHER_SERVICES.map((svc) => (
              <RevealItem key={svc.slug}>
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
