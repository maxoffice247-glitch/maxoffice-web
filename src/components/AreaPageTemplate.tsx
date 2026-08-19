import PageHero from "./PageHero";
import Breadcrumb from "./Breadcrumb";
import SectionHead from "./SectionHead";
import Reveal, { RevealGroup } from "./Reveal";
import LocationCard from "./LocationCard";
import CtaBanner from "./CtaBanner";
import { getLocationsForArea, type AreaInfo } from "@/lib/locationsData";

export default function AreaPageTemplate({
  area,
  heroTitle,
  heroDescription,
  intro,
}: {
  area: AreaInfo;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
}) {
  const locations = getLocationsForArea(area.slug);

  return (
    <main>
      <PageHero image="/images/hero-dia-diem.jpg" eyebrow="Chi nhánh" title={heroTitle} description={heroDescription} />
      <Breadcrumb
        items={[
          { label: "Chi nhánh", href: "/dia-diem" },
          { label: area.name },
        ]}
      />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal className="mx-auto mb-12 max-w-[820px] space-y-5 sm:mb-14">
            {intro.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-justify-vn text-[17px] leading-relaxed font-medium text-ink"
                    : "text-justify-vn text-[15.5px] leading-relaxed text-body-text"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>

          <SectionHead
            eyebrow="Danh sách chi nhánh"
            title={`${locations.length} chi nhánh tại ${area.name}`}
            description="Chọn chi nhánh phù hợp nhất với nhu cầu và ngân sách của doanh nghiệp bạn."
          />
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc, i) => (
              <LocationCard key={loc.slug} loc={loc} index={i} />
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
