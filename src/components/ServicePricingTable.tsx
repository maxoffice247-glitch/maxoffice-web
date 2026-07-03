import SectionHead from "./SectionHead";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import Button from "./Button";
import { CheckCircleIcon } from "./icons";

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

export type ServicePricing = SinglePricing | DualPricing | TiersPricing;

export default function ServicePricingTable({
  title,
  description,
  pricing,
}: {
  title: string;
  description?: string;
  pricing: ServicePricing;
}) {
  return (
    <section id="bang-gia" className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow="Bảng giá" title={title} description={description} />

        {pricing.mode === "single" && (
          <Reveal className="mx-auto max-w-[420px] rounded-2xl border-2 border-primary bg-white p-8 text-center shadow-card">
            <div className="mb-1 font-mono text-[38px] font-bold text-primary">
              {pricing.price}
            </div>
            <div className="mb-6 text-[13.5px] font-medium text-body-text">
              {pricing.unit}
            </div>
            <ul className="mb-7 space-y-2.5 text-left">
              {pricing.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px] text-body-text">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button href="#lead-form" variant="primary" className="w-full">
              Nhận tư vấn miễn phí
            </Button>
            {pricing.note && (
              <p className="mt-4 text-[12px] text-body-text">{pricing.note}</p>
            )}
          </Reveal>
        )}

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
              <Button href="#lead-form" variant="primary">
                Nhận tư vấn miễn phí
              </Button>
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
                  <Button href="#lead-form" variant={tier.featured ? "primary" : "ghost"} className="w-full">
                    Chọn gói này
                  </Button>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
