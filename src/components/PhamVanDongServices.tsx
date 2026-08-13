import Link from "next/link";
import SectionHead from "./SectionHead";
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
import { PHAM_VAN_DONG_VO_PLANS, PHAM_VAN_DONG_VO_PROMOS } from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const PACKAGE_TIERS = [
  { size: "4-5 nhân sự", price: "8.000.000đ/tháng" },
  { size: "7-8 nhân sự", price: "10.000.000đ/tháng" },
  { size: "10 nhân sự", price: "15.000.000đ/tháng", note: "đã bao gồm điện nước" },
  { size: "Full sàn trống", price: "18.000.000đ - 20.000.000đ/tháng", note: "tuỳ diện tích" },
];

const PACKAGE_AMENITIES =
  "Bàn, ghế, tủ hồ sơ, máy lạnh, Internet, in-photo, scan, dán bảng tên công ty, phòng họp miễn phí.";

const FLEX_SEAT_TIERS = [
  { qty: "1 chỗ", price: "2.000.000đ/chỗ/tháng" },
  { qty: "Từ 2 chỗ trở lên", price: "1.800.000đ/chỗ/tháng" },
];

const FLEX_SEAT_TERMS = [
  "Hợp đồng 1 năm: cọc 2 tháng",
  "Thanh toán 1 lần 6 tháng: tặng dịch vụ thành lập doanh nghiệp/đổi địa chỉ + 1 tháng",
  "Thanh toán 1 lần 12 tháng: tặng dịch vụ thành lập doanh nghiệp/đổi địa chỉ + 2 tháng",
];

const MEETING_ROOM_RATES = [
  { capacity: "2-5 người", hour: "150.000đ", session: "500.000đ", day: "900.000đ" },
  { capacity: "6-10 người", hour: "200.000đ", session: "600.000đ", day: "1.100.000đ" },
  { capacity: "10-15 người", hour: "250.000đ", session: "700.000đ", day: "1.200.000đ" },
];

const GENERIC_SERVICES = [
  {
    slug: "thanh-lap-doanh-nghiep",
    icon: DocumentCheckIcon,
    title: "Thành lập doanh nghiệp",
    price: "Từ 1.299.000đ (kèm văn phòng ảo)",
  },
  {
    slug: "ke-toan-thue",
    icon: CalculatorIcon,
    title: "Kế toán & thuế",
    price: "Từ 500.000đ/tháng",
  },
];

function BranchPriceBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11.5px] font-bold text-accent">
      Giá áp dụng riêng tại chi nhánh Phạm Văn Đồng
    </span>
  );
}

function DetailLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
    >
      Xem chi tiết
      <ArrowRightSmallIcon className="transition-transform duration-200" />
    </Link>
  );
}

export default function PhamVanDongServices() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title="Bảng giá riêng tại chi nhánh Phạm Văn Đồng"
          description="Chi nhánh Phạm Văn Đồng áp dụng bảng giá Văn phòng ảo, Văn phòng trọn gói, Chỗ ngồi linh động và Phòng họp theo giờ RIÊNG BIỆT, khác với bảng giá chung của hệ thống MAX OFFICE."
        />

        {/* Văn phòng ảo — M-START / M-BASE / M-ORIGIN */}
        <Reveal className="mb-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Văn phòng ảo</h3>
                <BranchPriceBadge />
              </div>
            </div>
            <DetailLink href="/services/van-phong-ao#bang-gia" />
          </div>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PHAM_VAN_DONG_VO_PLANS.map((plan) => (
              <RevealItem key={plan.key}>
                <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
                  <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
                  <div className="mb-3 font-mono text-[22px] font-bold text-primary">
                    {formatVND(plan.price)}
                    <span className="ml-1 font-sans text-[12px] font-medium text-body-text">
                      {plan.duration}
                    </span>
                  </div>
                  <ul className="mb-4 space-y-1.5 text-[12.5px] text-body-text">
                    <li>
                      <span className="font-semibold text-navy">Bảng tên:</span> {plan.nameplateSize}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Phòng họp:</span> {plan.meetingRoom}
                    </li>
                    <li>
                      <span className="font-semibold text-navy">Chỗ ngồi làm việc:</span> {plan.flexSeat}
                    </li>
                  </ul>
                  <ul className="mb-4 flex-1 space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11.5px] font-medium text-accent">{plan.promoNote}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-5 rounded-xl bg-accent/8 p-4">
            <p className="mb-2 text-[12.5px] font-bold text-navy">Khuyến mãi riêng chi nhánh</p>
            <ul className="space-y-1">
              {PHAM_VAN_DONG_VO_PROMOS.map((note) => (
                <li key={note} className="text-[12.5px] text-body-text">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Văn phòng trọn gói */}
        <Reveal className="mb-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <KeyIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Văn phòng trọn gói</h3>
                <BranchPriceBadge />
              </div>
            </div>
            <DetailLink href="/services/van-phong-tron-goi#bang-gia" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-bg-tint">
                  <th className="px-5 py-3 text-[12.5px] font-bold text-navy">Quy mô</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">Giá</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGE_TIERS.map((tier, i) => (
                  <tr key={tier.size} className={i !== PACKAGE_TIERS.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-5 py-3 text-[13.5px] font-semibold text-navy">{tier.size}</td>
                    <td className="px-5 py-3 font-mono text-[13.5px] font-bold text-primary">
                      {tier.price}
                      {tier.note && (
                        <span className="ml-1.5 font-sans text-[11.5px] font-medium text-body-text">
                          ({tier.note})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-body-text">
            <span className="font-semibold text-navy">Tiện ích đi kèm: </span>
            {PACKAGE_AMENITIES}
          </p>
        </Reveal>

        {/* Chỗ ngồi linh động */}
        <Reveal className="mb-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <UsersIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Chỗ ngồi linh động</h3>
                <BranchPriceBadge />
              </div>
            </div>
            <DetailLink href="/services/cho-ngoi-linh-dong#bang-gia" />
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FLEX_SEAT_TIERS.map((tier) => (
              <div key={tier.qty} className="rounded-xl border border-line bg-bg-tint p-4">
                <div className="text-[13px] font-semibold text-navy">{tier.qty}</div>
                <div className="font-mono text-[18px] font-bold text-primary">{tier.price}</div>
              </div>
            ))}
          </div>
          <ul className="space-y-1.5">
            {FLEX_SEAT_TERMS.map((term) => (
              <li key={term} className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {term}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Phòng họp theo giờ */}
        <Reveal className="mb-6 rounded-2xl border border-line bg-white p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
                <ScreenIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-navy">Phòng họp theo giờ</h3>
                <BranchPriceBadge />
              </div>
            </div>
            <DetailLink href="/services/phong-hop#bang-gia" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-bg-tint">
                  <th className="px-5 py-3 text-[12.5px] font-bold text-navy">Sức chứa</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">Giờ</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">Buổi (4h)</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {MEETING_ROOM_RATES.map((row, i) => (
                  <tr key={row.capacity} className={i !== MEETING_ROOM_RATES.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-5 py-3 text-[13.5px] font-semibold text-navy">{row.capacity}</td>
                    <td className="px-5 py-3 font-mono text-[13.5px] font-bold text-primary">{row.hour}</td>
                    <td className="px-5 py-3 font-mono text-[13.5px] font-bold text-primary">{row.session}</td>
                    <td className="px-5 py-3 font-mono text-[13.5px] font-bold text-primary">{row.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12.5px] text-body-text">
            Thứ 7 &amp; Chủ nhật: phụ thu thêm{" "}
            <span className="font-mono font-bold text-accent">300.000đ</span> trên mức giá tương ứng.
          </p>
        </Reveal>

        {/* Thành lập doanh nghiệp + Kế toán & thuế — giá chung, không đổi tại chi nhánh này */}
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {GENERIC_SERVICES.map((svc) => (
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
