import Link from "next/link";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { ArrowRightSmallIcon, BuildingIcon } from "./icons";
import { SERVICES_LIST } from "@/lib/servicesData";

export default function ServiceCrossLinks({ currentSlug }: { currentSlug: string }) {
  const related = SERVICES_LIST.filter((s) => s.slug !== currentSlug);

  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
            Dịch vụ liên quan
          </span>
          <h2 className="mb-3.5 font-display text-[26px] leading-[1.2] font-extrabold text-navy sm:text-[32px]">
            Khám phá thêm giải pháp từ MAX OFFICE
          </h2>
          <p className="text-[15.5px] text-body-text">
            Kết hợp nhiều dịch vụ để tối ưu chi phí vận hành doanh nghiệp của
            bạn ngay từ đầu.
          </p>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {related.map((svc) => (
            <RevealItem key={svc.slug}>
              <Link
                href={`/services/${svc.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card"
              >
                <div>
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <svc.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1 text-[14.5px] font-bold text-navy">{svc.name}</h3>
                  <p className="text-[12.5px] text-body-text">{svc.shortDesc}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">
                  Xem chi tiết
                  <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-line bg-white p-7"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
              <BuildingIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15.5px] font-bold text-navy">
                Xem 12 địa điểm tại TP.HCM
              </h3>
              <p className="text-[13.5px] text-body-text">
                Chọn địa chỉ thuận tiện nhất cho bạn và đối tác.
              </p>
            </div>
          </div>
          <Button href="/#locations" variant="ghost">
            Xem địa điểm
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
