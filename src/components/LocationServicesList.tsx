import Link from "next/link";
import SectionHead from "./SectionHead";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
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
import { resolveTimedPromotions, type LocationData } from "@/lib/locationsData";

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

export default function LocationServicesList({
  name,
  slug,
  promotions,
}: {
  name: string;
  slug: string;
  /** Khuyến mãi có thời hạn/điều kiện riêng của chi nhánh — nguyên trạng từ `LocationData.promotions` (chưa resolve theo thời gian, có thể là `TimedPromoVersion[]`), tự chọn đúng phiên bản qua `resolveTimedPromotions()` ngay bên dưới. Bỏ trống/undefined => ẩn hẳn khối khuyến mãi. */
  promotions?: LocationData["promotions"];
}) {
  const voPlans = getPlansForLocation(slug);
  const cheapest = voPlans.reduce((min, p) => (p.price < min.price ? p : min), voPlans[0]);
  const voPlanNames = voPlans.map((p) => p.name).join(", ");
  const resolvedPromotions = resolveTimedPromotions(promotions);

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
              href="/services/van-phong-ao#bang-gia"
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
        {/* Khuyến mãi riêng chi nhánh — chỉ hiện khi `promotions` có dữ liệu
            sau khi resolve theo thời gian (đồng bộ cách hiển thị với
            PhamVanDongServices.tsx). Đa số chi nhánh dùng component này
            không có `promotions` riêng nên khối này ẩn hoàn toàn với các
            chi nhánh đó, chỉ hiện với chi nhánh có khai báo (VD Sông Thao). */}
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
