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
import { QUAN_7_VO_PLANS, QUAN_7_ADDONS } from "@/lib/virtualOfficePlans";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const OTHER_SERVICES = [
  {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    title: "Văn phòng trọn gói",
    price: "Từ 4.500.000đ/tháng",
  },
  {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    title: "Chỗ ngồi linh động",
    price: "Từ 2.000.000đ/tháng",
  },
  {
    slug: "phong-hop",
    icon: ScreenIcon,
    title: "Phòng họp theo giờ",
    price: "Từ 150.000đ/giờ",
  },
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
      Giá áp dụng riêng tại chi nhánh Bùi Văn Ba
    </span>
  );
}

export default function QuanBaServices() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title="Dịch vụ khả dụng tại chi nhánh Bùi Văn Ba"
          description="Chi nhánh Bùi Văn Ba áp dụng bảng giá Văn phòng ảo RIÊNG BIỆT (gói W-BASE, W-PRO), khác với bảng giá chung của hệ thống MAX OFFICE."
        />

        {/* Văn phòng ảo — W-BASE / W-PRO */}
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
            <Link
              href="/services/van-phong-ao#bang-gia"
              className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5"
            >
              Xem chi tiết
              <ArrowRightSmallIcon className="transition-transform duration-200" />
            </Link>
          </div>
          <RevealGroup className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {QUAN_7_VO_PLANS.map((plan) => (
              <RevealItem key={plan.key}>
                <div className="flex h-full flex-col rounded-xl border border-line bg-bg-tint p-5">
                  <div className="mb-1 text-[14.5px] font-bold text-navy">{plan.name}</div>
                  <div className="mb-1 font-mono text-[22px] font-bold text-primary">
                    {formatVND(plan.price)}
                    <span className="ml-1 font-sans text-[12px] font-medium text-body-text">
                      {plan.duration}
                    </span>
                  </div>
                  <p className="mb-3 text-[11.5px] font-semibold text-accent">{plan.vatNote}</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                      <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        <span className="font-semibold text-navy">Bảng tên: </span>
                        {plan.nameplate}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                      <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        <span className="font-semibold text-navy">Xác minh địa điểm: </span>
                        {plan.locationVerification}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 text-[12.5px] text-body-text">
                      <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        <span className="font-semibold text-navy">Lễ tân: </span>
                        {plan.reception}
                      </span>
                    </li>
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mb-3 text-[13px] font-bold text-navy">Tiện ích bổ sung</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-bg-tint">
                  <th className="px-5 py-3 text-[12.5px] font-bold text-navy">Dịch vụ</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">W-BASE</th>
                  <th className="px-5 py-3 text-[12.5px] font-bold text-primary">W-PRO</th>
                </tr>
              </thead>
              <tbody>
                {QUAN_7_ADDONS.map((row, i) => (
                  <tr key={row.service} className={i !== QUAN_7_ADDONS.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-5 py-3 text-[13px] font-semibold text-navy">{row.service}</td>
                    <td className="px-5 py-3 font-mono text-[13px] font-bold text-primary">{row.wBase}</td>
                    <td className="px-5 py-3 font-mono text-[13px] font-bold text-primary">{row.wPro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12.5px] font-semibold text-accent">
            Giá các gói và tiện ích bổ sung nêu trên chưa bao gồm VAT 10%.
          </p>
        </Reveal>

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
