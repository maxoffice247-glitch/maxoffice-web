import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import PlanDetailActions from "@/components/tools/PlanDetailActions";
import { CheckCircleIcon, MapPinIcon, ArrowRightSmallIcon } from "@/components/icons";
import { getAllOfferedPlans, getOfferedPlan, formatVoPrice } from "@/lib/planFinder";
import { LOCATIONS_DATA, resolveTimedPromotions } from "@/lib/locationsData";
import { SITE_URL } from "@/lib/siteConfig";

export async function generateStaticParams() {
  return getAllOfferedPlans().map((p) => ({ slug: p.locationSlug, plan: p.planKey }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; plan: string }>;
}): Promise<Metadata> {
  const { slug, plan: planKey } = await params;
  const plan = getOfferedPlan(slug, planKey);
  if (!plan) return {};
  const title = `Gói ${plan.planName} tại ${plan.locationName} - ${formatVoPrice(plan.price)}/tháng | MAX OFFICE`;
  const description = `Chi tiết gói văn phòng ảo ${plan.planName} tại chi nhánh ${plan.locationName}, ${plan.area.name} — ${formatVoPrice(plan.price)}/tháng (chưa gồm VAT 10%). Xem đầy đủ tính năng đi kèm, ảnh mặt tiền và liên hệ tư vấn ngay.`;
  return {
    title,
    description,
    alternates: { canonical: `/tien-ich/tim-goi-phu-hop/${slug}/${planKey}` },
    openGraph: {
      images: [{ url: `${SITE_URL}/images/og/dia-diem-${slug}.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string; plan: string }>;
}) {
  const { slug, plan: planKey } = await params;
  const plan = getOfferedPlan(slug, planKey);
  const location = LOCATIONS_DATA[slug];
  if (!plan || !location || location.isActive === false) notFound();

  const facadeSrc = `/images/dia-diem-${slug}.jpg`;
  const interiorImages = (location.interiorImages ?? []).slice(0, 2);
  // Dựng sẵn icon thành JSX ngay tại Server Component này (không phải
  // component reference) — PlanDetailActions là "use client", còn
  // BenefitItem.icon là 1 function; truyền hàm qua ranh giới Server -> Client
  // sẽ lỗi runtime vì React Server Components không serialize được hàm.
  const quoteBenefits = location.benefits?.map((b) => ({
    title: b.title,
    icon: <b.icon className="h-4 w-4 shrink-0" />,
  }));

  return (
    <main>
      <PageHero
        image={location.image}
        eyebrow="Chi tiết gói văn phòng ảo"
        title={`Gói ${plan.planName} tại ${plan.locationName}`}
        description={`${formatVoPrice(plan.price)}/tháng (chưa gồm VAT 10%) — ${plan.area.name}`}
      />
      <Breadcrumb
        items={[
          { label: "Tiện ích", href: "/tien-ich" },
          { label: "Tìm VPA theo nhu cầu", href: "/tien-ich/tim-goi-phu-hop" },
          { label: `${plan.planName} · ${plan.locationName}` },
        ]}
      />

      <section className="py-9">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Ảnh mặt tiền là ảnh DỌC — dùng đúng tỉ lệ thật của ảnh
                  (facadeAspectRatio, giống cách /locations/[slug] tự làm) +
                  object-contain thay vì ép vào khung 4:3 ngang như trước,
                  để không còn cắt mất góc trên/dưới. */}
              <div
                className="relative col-span-1 overflow-hidden rounded-2xl bg-bg-tint sm:col-span-2"
                style={{ aspectRatio: location.facadeAspectRatio }}
              >
                <Image
                  src={facadeSrc}
                  alt={`Mặt tiền văn phòng ${plan.locationName}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                />
              </div>
              {interiorImages.map((img) => (
                <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                    style={{ objectPosition: img.objectPosition ?? "center" }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-white p-6 sm:p-7">
              <p className="mb-1.5 text-[12px] font-bold tracking-[0.1em] text-primary uppercase">
                {plan.area.name}
              </p>
              <h2 className="mb-2 text-[20px] font-bold text-navy">{plan.locationName}</h2>
              <p className="mb-6 flex items-start gap-2 text-[14px] text-body-text">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {location.address}
              </p>

              <div className="mb-6 flex items-baseline gap-2 border-t border-line pt-6">
                <span className="font-mono text-[32px] font-bold text-primary">
                  {formatVoPrice(plan.price)}
                </span>
                <span className="text-[13px] text-body-text">/tháng · chưa gồm VAT 10%</span>
              </div>

              <h3 className="mb-3.5 text-[15px] font-bold text-navy">
                Tính năng đi kèm gói {plan.planName}
              </h3>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-body-text">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.addonNote && (
                <p className="mt-5 rounded-xl bg-bg-tint p-3.5 text-[12.5px] leading-relaxed text-body-text">
                  * {plan.addonNote}
                </p>
              )}
            </div>

            <Link
              href={`/locations/${slug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:gap-2.5"
            >
              Xem đầy đủ thông tin chi nhánh
              <ArrowRightSmallIcon className="transition-transform duration-200" />
            </Link>
          </div>

          <div className="lg:sticky lg:top-24">
            <PlanDetailActions
              plan={plan}
              address={location.address}
              facadeSrc={facadeSrc}
              benefits={quoteBenefits}
              promotions={resolveTimedPromotions(location.promotions)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
