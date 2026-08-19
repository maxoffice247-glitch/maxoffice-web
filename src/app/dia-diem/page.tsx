import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import { ArrowRightSmallIcon, MapPinIcon } from "@/components/icons";
import { AREAS, getLocationsForArea } from "@/lib/locationsData";

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem" },
  title: "14 Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM",
  description:
    "Danh sách đầy đủ 14 chi nhánh văn phòng ảo, văn phòng trọn gói và coworking của MAX OFFICE, nhóm theo 7 khu vực tại Tân Bình, Gò Vấp, Tân Phú, Quận 10, Quận 1, Quận 7 và Thủ Đức, TP.HCM.",
  openGraph: {
    images: [{ url: "/images/og/hero-dia-diem.jpg", width: 1200, height: 630 }],
  },
};

export default function DiaDiemPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-dia-diem.jpg"
        eyebrow="Chi nhánh"
        title="14 chi nhánh văn phòng tại TP.HCM"
        description="Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 — chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho đội ngũ của bạn."
      />
      <Breadcrumb items={[{ label: "Chi nhánh" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Hệ thống chi nhánh"
            title="Toàn bộ 14 chi nhánh MAX OFFICE, theo 7 khu vực"
            description="Mỗi địa điểm đều đủ điều kiện đăng ký kinh doanh, đăng ký thuế và sẵn sàng phục vụ văn phòng ảo, văn phòng trọn gói, phòng họp và chỗ ngồi linh động. Chọn khu vực gần bạn nhất để xem chi tiết từng chi nhánh."
          />
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area) => {
              const locations = getLocationsForArea(area.slug);
              return (
                <RevealItem key={area.slug} y={18}>
                  <Link
                    href={`/dia-diem/${area.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                          <MapPinIcon className="h-5 w-5" />
                        </span>
                        <h3 className="text-[16px] font-bold text-navy">{area.name}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent/8 px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-accent">
                        {locations.length} chi nhánh
                      </span>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-body-text">{area.description}</p>
                    <ul className="space-y-1">
                      {locations.map((loc) => (
                        <li key={loc.slug} className="text-[12.5px] text-body-text">
                          • {loc.name}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                      Xem chi nhánh trong khu vực
                      <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
