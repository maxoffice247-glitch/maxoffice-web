import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import { ArrowRightSmallIcon } from "@/components/icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";

export const metadata: Metadata = {
  title: "12 Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM",
  description:
    "Danh sách đầy đủ 12 chi nhánh văn phòng ảo, văn phòng trọn gói và coworking của MAX OFFICE tại Tân Bình, Gò Vấp, Tân Phú, Quận 10 và Quận 1, TP.HCM.",
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
        title="12 chi nhánh văn phòng tại TP.HCM"
        description="Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 — chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho đội ngũ của bạn."
      />
      <Breadcrumb items={[{ label: "Chi nhánh" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Hệ thống chi nhánh"
            title="Toàn bộ 12 chi nhánh MAX OFFICE"
            description="Mỗi địa điểm đều đủ điều kiện đăng ký kinh doanh, đăng ký thuế và sẵn sàng phục vụ văn phòng ảo, văn phòng trọn gói, phòng họp và chỗ ngồi linh động."
          />
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS_LIST.map((loc, i) => (
              <RevealItem key={loc.slug} y={18}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                >
                  <div className="flex gap-4">
                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-bg-tint font-mono text-[13px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="mb-1 text-[15.5px] font-bold text-navy">
                        {loc.name}
                      </h3>
                      <p className="text-[13.5px] text-body-text">{loc.shortAddress}</p>
                      {loc.tag && (
                        <span className="mt-2.5 inline-block rounded-full bg-accent/8 px-2.5 py-1 text-[11.5px] font-bold text-accent">
                          {loc.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                    Xem chi tiết
                    <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
