import type { ComponentType } from "react";
import Image from "next/image";
import SectionHead from "./SectionHead";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import LocationCountBadge from "./LocationCountBadge";
import ScrollFadeContainer from "./ScrollFadeContainer";
import HeaderOffsetProvider from "./HeaderOffsetProvider";
import AccountingPricingTable from "./AccountingPricingTable";
import LeadFormButton from "./LeadFormButton";
import {
  CheckCircleIcon,
  CloseIcon,
  CalendarIcon,
  TrendingUpIcon,
  RocketIcon,
  BadgePercentIcon,
} from "./icons";

const PROMO_ICONS: ComponentType<{ className?: string }>[] = [
  CalendarIcon,
  TrendingUpIcon,
  RocketIcon,
  BadgePercentIcon,
];

/** Bolds+recolors "X-Y tháng" / "N%" spans within a promo line so the offer number pops. */
function highlightPromoNumber(text: string) {
  const parts = text.split(/(\d+-\d+ tháng|\d+%)/g);
  return parts.map((part, i) =>
    /^(\d+-\d+ tháng|\d+%)$/.test(part) ? (
      <span key={i} className="font-bold text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Below `md`, the table still needs horizontal scroll, and CSS forces `overflow-y` to
 * behave as non-visible on any ancestor with `overflow-x: auto` — which breaks
 * viewport-relative `position: sticky`. So below `md` we bound the table in its own
 * scrollport (sticky top-0, relative to that box) instead of the page. From `md` up the
 * compacted table fits without horizontal scroll, so there's no such ancestor and sticky
 * resolves against the real page scroll — top offset must clear the fixed site header. The
 * site header resizes between its tall/transparent and short/solid states as the page
 * scrolls, so the offset uses `--header-h`, measured live by HeaderOffsetProvider, instead
 * of a fixed guess that can drift out of sync and leave a gap the first row shows through.
 */
const STICKY_TOP = "top-0 md:top-[var(--header-h)]";

type SinglePricing = {
  mode: "single";
  price: string;
  unit: string;
  features: string[];
  note?: string;
};

type DualRow = { name: string; included: string; standard: string };
type DualPricing = {
  mode: "dual";
  rows: DualRow[];
  footnote: string;
};

type Tier = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  featured?: boolean;
};
type TiersPricing = {
  mode: "tiers";
  tiers: Tier[];
};

type MatrixPlan = {
  key: string;
  name: string;
  price: string;
  unit: string;
  locations: string[];
  featured?: boolean;
};
type MatrixFeatureRow = {
  label: string;
  values: (boolean | "addon")[];
};
type MatrixPricing = {
  mode: "matrix";
  plans: MatrixPlan[];
  features: MatrixFeatureRow[];
  addonNote?: string;
  promoNotes?: string[];
  promoEffectiveDate?: string;
};

export type AccountingGroupKey = "A" | "B" | "C";
export type AccountingGroup = { key: AccountingGroupKey; label: string; desc: string };
export type AccountingTierRow = {
  range: string;
  prices: Record<AccountingGroupKey, string>;
};
export type AccountingSurcharge = {
  title: string;
  note?: string;
  rows: { label: string; value: string }[];
};
export type AccountingPricing = {
  mode: "accounting";
  tableUnit: string;
  groups: AccountingGroup[];
  tiers: AccountingTierRow[];
  surcharges: AccountingSurcharge[];
};

export type ServicePricing =
  | SinglePricing
  | DualPricing
  | TiersPricing
  | MatrixPricing
  | AccountingPricing;

type PricingImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

export default function ServicePricingTable({
  title,
  description,
  pricing,
  image,
  serviceName,
}: {
  title: string;
  description?: string;
  pricing: ServicePricing;
  image?: PricingImage;
  /** Exact label in the lead form's "Dịch vụ quan tâm" dropdown to pre-select when a CTA here is clicked. */
  serviceName?: string;
}) {
  const singleCard = pricing.mode === "single" && (
    <div
      className={`mx-auto w-full max-w-[420px] rounded-2xl border-2 border-primary bg-white p-8 text-center shadow-card ${
        image ? "lg:mx-0" : ""
      }`}
    >
      <div className="mb-1 font-mono text-[38px] font-bold text-primary">{pricing.price}</div>
      <div className="mb-6 text-[13.5px] font-medium text-body-text">{pricing.unit}</div>
      <ul className="mb-7 space-y-2.5 text-left">
        {pricing.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[14px] text-body-text">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>
      <LeadFormButton service={serviceName} variant="primary" className="w-full">
        Nhận tư vấn miễn phí
      </LeadFormButton>
      {pricing.note && <p className="mt-4 text-[12px] text-body-text">{pricing.note}</p>}
    </div>
  );

  return (
    <section id="bang-gia" className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow="Bảng giá" title={title} description={description} />

        {pricing.mode === "single" && image && (
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div
                className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-card ${
                  image.fit === "contain" ? "bg-bg-tint" : ""
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={image.fit === "contain" ? "object-contain" : "object-cover"}
                  style={
                    image.fit === "contain"
                      ? undefined
                      : { objectPosition: image.objectPosition ?? "center" }
                  }
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>{singleCard}</Reveal>
          </div>
        )}

        {pricing.mode === "single" && !image && <Reveal>{singleCard}</Reveal>}

        {pricing.mode === "dual" && (
          <div>
            <Reveal className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-bg-tint">
                    <th className="px-6 py-4 text-[13.5px] font-bold text-navy">Loại hình</th>
                    <th className="px-6 py-4 text-[13.5px] font-bold text-primary">
                      Kèm Văn phòng ảo
                    </th>
                    <th className="px-6 py-4 text-[13.5px] font-bold text-body-text">
                      Không kèm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.rows.map((row, i) => (
                    <tr
                      key={row.name}
                      className={i !== pricing.rows.length - 1 ? "border-b border-line" : ""}
                    >
                      <td className="px-6 py-4 text-[14.5px] font-bold text-navy">{row.name}</td>
                      <td className="px-6 py-4 font-mono text-[17px] font-bold text-primary">
                        {row.included}
                      </td>
                      <td className="px-6 py-4 font-mono text-[15px] font-medium text-body-text">
                        {row.standard}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <p className="mt-5 text-center text-[12.5px] text-body-text">{pricing.footnote}</p>
            <div className="mt-7 text-center">
              <LeadFormButton service={serviceName} variant="primary">
                Nhận tư vấn miễn phí
              </LeadFormButton>
            </div>
          </div>
        )}

        {pricing.mode === "tiers" && (
          <RevealGroup
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              pricing.tiers.length >= 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {pricing.tiers.map((tier) => (
              <RevealItem key={tier.name} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-7 text-left transition-all duration-400 ease-out hover:-translate-y-2 ${
                    tier.featured
                      ? "border-navy bg-navy shadow-[0_20px_50px_rgba(11,31,58,0.3)]"
                      : "border-line bg-white hover:border-primary/30 hover:shadow-card"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-[11.5px] font-bold tracking-wide whitespace-nowrap text-white shadow-[0_6px_16px_rgba(229,57,53,0.35)]">
                      Phổ biến nhất
                    </span>
                  )}
                  <div className={`mb-1.5 text-[15.5px] font-bold ${tier.featured ? "text-white" : "text-navy"}`}>
                    {tier.name}
                  </div>
                  <div className={`font-mono text-[26px] font-bold ${tier.featured ? "text-[#8FC1F5]" : "text-primary"}`}>
                    {tier.price}
                  </div>
                  <span className={`mb-4 block text-[12.5px] ${tier.featured ? "text-white/70" : "text-body-text"}`}>
                    {tier.unit}
                  </span>
                  <p className={`mb-4 text-[13px] leading-relaxed ${tier.featured ? "text-white/70" : "text-body-text"}`}>
                    {tier.desc}
                  </p>
                  <ul className="mb-6 flex-1 space-y-2">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-[13px] ${tier.featured ? "text-white/80" : "text-body-text"}`}
                      >
                        <CheckCircleIcon className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-[#8FC1F5]" : "text-primary"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <LeadFormButton
                    service={serviceName}
                    variant={tier.featured ? "primary" : "ghost"}
                    className="w-full"
                  >
                    Chọn gói này
                  </LeadFormButton>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {pricing.mode === "matrix" && (
          <div>
            <div className="mx-auto w-fit max-w-full">
            <HeaderOffsetProvider>
              <Reveal className="rounded-2xl border border-line bg-white shadow-soft">
                <ScrollFadeContainer className="max-h-[480px] overflow-auto rounded-2xl md:max-h-none md:overflow-visible">
                  <table className="border-collapse text-left">
                    <thead>
                      <tr className="border-b border-line">
                        <th
                          className={`sticky ${STICKY_TOP} left-0 z-30 w-[190px] border-r border-line bg-bg-tint px-6 py-3 text-[12.5px] font-bold text-navy shadow-[2px_0_6px_rgba(15,27,45,0.08)] sm:w-[210px]`}
                        >
                          Tính năng
                        </th>
                        {pricing.plans.map((plan) => (
                          <th
                            key={plan.key}
                            className={`sticky ${STICKY_TOP} z-20 px-[26px] py-3 text-center ${
                              plan.featured ? "bg-primary-tint" : "bg-bg-tint"
                            }`}
                          >
                            <div className={`text-[13px] font-bold ${plan.featured ? "text-primary" : "text-navy"}`}>
                              {plan.name}
                            </div>
                            <div className="mt-1 font-mono text-[15.5px] font-bold text-primary">
                              {plan.price}
                            </div>
                            <div className="text-[10.5px] font-medium text-body-text">{plan.unit}</div>
                            <div className="mt-1.5 flex justify-center">
                              <LocationCountBadge locations={plan.locations} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.features.map((row, i) => (
                        <tr key={row.label}>
                          <td
                            className={`sticky left-0 z-10 w-[190px] border-r border-line px-6 py-2.5 text-[12.5px] leading-snug font-medium text-navy shadow-[2px_0_6px_rgba(15,27,45,0.08)] sm:w-[210px] ${
                              i % 2 === 1 ? "bg-[#f9fbfe]" : "bg-white"
                            }`}
                          >
                            {row.label}
                          </td>
                          {row.values.map((v, ci) => (
                            <td
                              key={ci}
                              className={`px-[26px] py-2.5 text-center ${i % 2 === 1 ? "bg-bg-tint/50" : ""}`}
                            >
                              {v === true && (
                                <CheckCircleIcon className="mx-auto h-4 w-4 text-primary" />
                              )}
                              {v === "addon" && (
                                <span className="text-[10px] font-bold text-accent">+phí</span>
                              )}
                              {v === false && (
                                <CloseIcon className="mx-auto h-3.5 w-3.5 text-line" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollFadeContainer>
              </Reveal>
            </HeaderOffsetProvider>
            {pricing.addonNote && (
              <p className="mt-4 text-center text-[12.5px] text-body-text">{pricing.addonNote}</p>
            )}
            {pricing.promoNotes && pricing.promoNotes.length > 0 && (
              <div className="mt-6 w-full rounded-2xl border-2 border-accent/40 bg-accent/10 p-6 sm:p-7">
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <BadgePercentIcon className="h-4 w-4" />
                  </span>
                  <p className="text-[15.5px] font-bold text-navy">Khuyến mãi chung (áp dụng mọi gói)</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pricing.promoNotes.map((note, i) => {
                    const Icon = PROMO_ICONS[i % PROMO_ICONS.length];
                    return (
                      <div
                        key={note}
                        className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(15,27,45,0.05)]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-[15px] leading-relaxed text-navy">
                          {highlightPromoNumber(note)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {pricing.promoEffectiveDate && (
                  <p className="mt-4 text-[11.5px] text-body-text/70">
                    Áp dụng từ {pricing.promoEffectiveDate}.
                  </p>
                )}
              </div>
            )}
            </div>
            <div className="mt-7 text-center">
              <LeadFormButton service={serviceName} variant="primary">
                Nhận tư vấn miễn phí
              </LeadFormButton>
            </div>
          </div>
        )}

        {pricing.mode === "accounting" && (
          <AccountingPricingTable pricing={pricing} serviceName={serviceName} />
        )}
      </div>
    </section>
  );
}
