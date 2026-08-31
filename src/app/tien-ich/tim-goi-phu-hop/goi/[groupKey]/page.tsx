import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import PlanGroupDetailActions from "@/components/tools/PlanGroupDetailActions";
import { CheckCircleIcon, MapPinIcon, ArrowRightSmallIcon } from "@/components/icons";
import { getGroupedPlans, getPlanGroup, formatVoPrice } from "@/lib/planFinder";

export async function generateStaticParams() {
  return getGroupedPlans().map((g) => ({ groupKey: g.groupKey }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupKey: string }>;
}): Promise<Metadata> {
  const { groupKey } = await params;
  const group = getPlanGroup(groupKey);
  if (!group) return {};
  const title = `Gói ${group.planName} - ${formatVoPrice(group.price)}/tháng, ${group.locations.length} chi nhánh | MAX OFFICE`;
  const description = `Gói văn phòng ảo ${group.planName} — ${formatVoPrice(group.price)}/tháng (chưa gồm VAT 10%), áp dụng tại ${group.locations.length} chi nhánh MAX OFFICE: ${group.locations.map((l) => l.name).join(", ")}. Xem đầy đủ tính năng và tải báo giá tổng hợp.`;
  return {
    title,
    description,
    alternates: { canonical: `/tien-ich/tim-goi-phu-hop/goi/${groupKey}` },
  };
}

export default async function PlanGroupDetailPage({
  params,
}: {
  params: Promise<{ groupKey: string }>;
}) {
  const { groupKey } = await params;
  const group = getPlanGroup(groupKey);
  if (!group) notFound();

  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Báo giá tổng hợp theo gói"
        title={`Gói ${group.planName}`}
        description={`${formatVoPrice(group.price)}/tháng (chưa gồm VAT 10%) — áp dụng tại ${group.locations.length} chi nhánh MAX OFFICE`}
      />
      <Breadcrumb
        items={[
          { label: "Tiện ích", href: "/tien-ich" },
          { label: "Tìm VPA theo nhu cầu", href: "/tien-ich/tim-goi-phu-hop" },
          { label: `Gói ${group.planName}` },
        ]}
      />

      <section className="py-9">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-mono text-[32px] font-bold text-primary">
                  {formatVoPrice(group.price)}
                </span>
                <span className="text-[13px] text-body-text">/tháng · chưa gồm VAT 10%</span>
              </div>

              <h3 className="mb-3.5 text-[15px] font-bold text-navy">
                Tính năng đi kèm gói {group.planName}
              </h3>
              <ul className="space-y-2.5">
                {group.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-body-text">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {group.addonNote && (
                <p className="mt-5 rounded-xl bg-bg-tint p-3.5 text-[12.5px] leading-relaxed text-body-text">
                  * {group.addonNote}
                </p>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-white p-6 sm:p-7">
              <h3 className="mb-4 text-[15px] font-bold text-navy">
                Áp dụng tại {group.locations.length} chi nhánh
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {group.locations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/locations/${loc.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-bg-tint p-3 transition-colors duration-200 hover:border-primary/30 hover:bg-white"
                  >
                    <div className="relative aspect-[3/4] w-[52px] shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={`/images/dia-diem-${loc.slug}.jpg`}
                        alt={`Mặt tiền văn phòng ${loc.name}`}
                        fill
                        sizes="52px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-navy">{loc.name}</p>
                      <p className="truncate text-[12px] text-body-text">{loc.shortAddress}</p>
                    </div>
                    <span className="flex shrink-0 items-center text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <ArrowRightSmallIcon className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[12px] text-body-text">
                <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Bấm vào 1 chi nhánh để xem đầy đủ thông tin, hoặc xem chi tiết riêng gói này tại từng chi nhánh trong danh sách &quot;Xem theo khu vực&quot;.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <PlanGroupDetailActions group={group} />
          </div>
        </div>
      </section>
    </main>
  );
}
