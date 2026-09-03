import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHead from "@/components/SectionHead";
import { RevealGroup } from "@/components/Reveal";
import CtaBanner from "@/components/CtaBanner";
import LocationCard from "@/components/LocationCard";
import { SearchIcon, ArrowRightSmallIcon } from "@/components/icons";
import { getGroupedLocations, stripCuSuffix, ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export const metadata: Metadata = {
  alternates: { canonical: "/dia-diem" },
  title: `${ACTIVE_BRANCH_COUNT} Chi Nhánh Văn Phòng MAX OFFICE Tại TP.HCM`,
  description: `Danh sách đầy đủ ${ACTIVE_BRANCH_COUNT} chi nhánh văn phòng ảo, văn phòng trọn gói và coworking của MAX OFFICE, nhóm theo 7 khu vực tại Tân Bình, Gò Vấp, Tân Phú, Quận 10, Quận 1, Quận 7 và Thủ Đức, TP.HCM.`,
  // Ảnh OG giờ đến từ opengraph-image.tsx cùng thư mục (dùng renderOgImage()
  // — logo + overlay chuẩn hoá như mọi trang khác). Trước đây trỏ thẳng tới
  // 1 ảnh nền thô "/images/og/hero-dia-diem.jpg" không qua template, không
  // có logo/overlay như các trang khác.
};

export default function DiaDiemPage() {
  const { multiBranchGroups, singleBranchLocations } = getGroupedLocations();

  return (
    <main>
      <PageHero
        image="/images/hero-chi-nhanh.png"
        eyebrow="Chi nhánh"
        title={`${ACTIVE_BRANCH_COUNT} chi nhánh văn phòng tại TP.HCM`}
        description="Từ Tân Bình, Gò Vấp, Tân Phú, Quận 10 đến trung tâm Quận 1 — chọn địa chỉ gần đối tác, khách hàng hoặc thuận tiện nhất cho đội ngũ của bạn."
      />
      <Breadcrumb items={[{ label: "Chi nhánh" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Hệ thống chi nhánh"
            title={`Toàn bộ ${ACTIVE_BRANCH_COUNT} chi nhánh MAX OFFICE`}
            tagline="Hệ thống văn phòng ảo phủ khắp Sài Gòn"
            description="Mỗi địa điểm đều đủ điều kiện đăng ký kinh doanh, đăng ký thuế và sẵn sàng phục vụ văn phòng ảo, văn phòng trọn gói, phòng họp và chỗ ngồi linh động."
          />

          {/* Lối tắt cho khách vào thẳng /dia-diem (không qua dropdown mega
              menu) — khỏi phải tự kéo xem hết {ACTIVE_BRANCH_COUNT} chi
              nhánh để tìm gói phù hợp. */}
          <Link
            href="/tien-ich/tim-goi-phu-hop"
            className="group mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-tint/60 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-card sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                <SearchIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[15.5px] font-bold text-navy">
                  Chưa biết chọn chi nhánh hay gói nào phù hợp?
                </p>
                <p className="text-[13.5px] text-body-text">
                  Dùng công cụ tìm gói phù hợp — trả lời vài câu hỏi, nhận gợi ý ngay.
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-bold whitespace-nowrap text-white transition-colors duration-200 group-hover:bg-primary-dark">
              Tìm nhanh VPA phù hợp
              <ArrowRightSmallIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>

          {multiBranchGroups.map((group) => (
            <div
              key={group.area.slug}
              className="mb-10 rounded-3xl border border-primary/15 bg-primary-tint/40 p-5 sm:p-7"
            >
              {group.subGroups ? (
                // Khu vực 2 chi nhánh ghép thêm 1 khu vực 1-chi-nhánh cho đủ
                // hàng — mỗi khu vực con vẫn có khung riêng (viền + tên +
                // số lượng) để không bị đọc nhầm là 1 khu vực duy nhất, thay
                // vì gộp phẳng vào 1 lưới 3 cột như trước.
                <div className="flex flex-col gap-4 sm:flex-row">
                  {group.subGroups.map((sub, subIndex) => {
                    const startIndex = group.subGroups!.slice(0, subIndex).reduce((n, s) => n + s.locations.length, 0);
                    return (
                      <div
                        key={sub.area.slug}
                        className={`min-w-0 rounded-2xl border border-line bg-white/70 p-3.5 sm:p-4 ${
                          sub.locations.length >= 2 ? "sm:basis-2/3" : "sm:basis-1/3"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h4 className="text-[13.5px] font-bold text-navy">{stripCuSuffix(sub.area.name)}</h4>
                          <span className="shrink-0 rounded-full bg-bg-tint px-2 py-0.5 text-[10.5px] font-bold whitespace-nowrap text-primary">
                            {sub.locations.length} chi nhánh
                          </span>
                        </div>
                        <RevealGroup
                          className={`grid grid-cols-1 gap-3.5 ${sub.locations.length >= 2 ? "sm:grid-cols-2" : ""}`}
                        >
                          {sub.locations.map((loc, i) => (
                            <LocationCard key={loc.slug} loc={loc} index={startIndex + i} />
                          ))}
                        </RevealGroup>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-[18px] font-bold text-navy sm:text-[20px]">{stripCuSuffix(group.area.name)}</h3>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-primary">
                      {group.locations.length} chi nhánh
                    </span>
                  </div>
                  <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.locations.map((loc, i) => (
                      <LocationCard key={loc.slug} loc={loc} index={i} />
                    ))}
                  </RevealGroup>
                </>
              )}
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
