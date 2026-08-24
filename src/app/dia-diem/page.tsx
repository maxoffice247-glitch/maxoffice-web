import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import LocationCard from "@/components/LocationCard";
import { getGroupedLocations } from "@/lib/locationsData";

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem" },
  title: "19 Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM",
  description:
    "Danh sách đầy đủ 19 chi nhánh văn phòng ảo, văn phòng trọn gói và coworking của MAX OFFICE, nhóm theo 7 khu vực tại Tân Bình, Gò Vấp, Tân Phú, Quận 10, Quận 1, Quận 7 và Thủ Đức, TP.HCM.",
  openGraph: {
    images: [{ url: "/images/og/hero-dia-diem.jpg", width: 1200, height: 630 }],
  },
};

export default function DiaDiemPage() {
  const { multiBranchGroups, singleBranchLocations } = getGroupedLocations();

  return (
    <main>
      <PageHero
        image="/images/hero-dia-diem.jpg"
        eyebrow="Chi nhánh"
        title="19 chi nhánh văn phòng tại TP.HCM"
        description="Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 — chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho đội ngũ của bạn."
      />
      <Breadcrumb items={[{ label: "Chi nhánh" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Hệ thống chi nhánh"
            title="Toàn bộ 19 chi nhánh MAX OFFICE"
            description="Mỗi địa điểm đều đủ điều kiện đăng ký kinh doanh, đăng ký thuế và sẵn sàng phục vụ văn phòng ảo, văn phòng trọn gói, phòng họp và chỗ ngồi linh động."
          />

          {multiBranchGroups.map((group) => (
            <div
              key={group.area.slug}
              className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{group.area.name}</h3>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
                  {group.locations.length} chi nhánh
                </span>
              </div>
              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.locations.map((loc, i) => (
                  <LocationCard key={loc.slug} loc={loc} index={i} />
                ))}
              </RevealGroup>
            </div>
          ))}

          {singleBranchLocations.length > 0 && (
            <div>
              <h3 className="mb-5 text-[18px] font-bold text-navy sm:text-[20px]">
                Các chi nhánh khu vực khác
              </h3>
              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {singleBranchLocations.map((loc, i) => (
                  <LocationCard key={loc.slug} loc={loc} index={i} areaBadge={loc.area.name} />
                ))}
              </RevealGroup>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
