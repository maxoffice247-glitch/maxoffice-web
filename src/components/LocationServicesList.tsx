import Link from "next/link";
import SectionHead from "./SectionHead";
import { RevealGroup, RevealItem } from "./Reveal";
import {
  BuildingIcon,
  KeyIcon,
  UsersIcon,
  ScreenIcon,
  DocumentCheckIcon,
  CalculatorIcon,
  ArrowRightSmallIcon,
} from "./icons";
import { getPlansForLocation } from "@/lib/virtualOfficePlans";

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

export default function LocationServicesList({ name, slug }: { name: string; slug: string }) {
  const voPlans = getPlansForLocation(slug);
  const cheapest = voPlans.reduce((min, p) => (p.price < min.price ? p : min), voPlans[0]);
  const voPlanNames = voPlans.map((p) => p.name).join(", ");

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Dịch vụ tại chi nhánh"
          title={`Dịch vụ sẵn sàng tại văn phòng ${name}`}
          description="Toàn bộ 6 dịch vụ cốt lõi của MAX OFFICE đều được cung cấp tại chi nhánh này với mức giá minh bạch, không phát sinh."
        />
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <RevealItem>
            <Link
              href="/services/van-phong-ao"
              className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <div>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <BuildingIcon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-[15.5px] font-bold text-navy">Văn phòng ảo</h3>
                <p className="font-mono text-[13.5px] font-bold text-primary">
                  Từ {formatVND(cheapest.price)}/tháng
                </p>
                <p className="mt-1 text-[12px] text-body-text">Gói khả dụng: {voPlanNames}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                Xem chi tiết
                <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealItem>
          {OTHER_SERVICES.map((svc) => (
            <RevealItem key={svc.slug}>
              <Link
                href={`/services/${svc.slug}`}
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
