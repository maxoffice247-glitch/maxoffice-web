import Reveal from "./Reveal";
import LeadFormButton from "./LeadFormButton";
import ScrollFadeContainer from "./ScrollFadeContainer";
import { DocumentCheckIcon, WalletIcon, ScaleIcon } from "./icons";
import type { AccountingPricing } from "./ServicePricingTable";

const SURCHARGE_ICONS = [ScaleIcon, DocumentCheckIcon, WalletIcon];

export default function AccountingPricingTable({
  pricing,
  serviceName,
}: {
  pricing: AccountingPricing;
  serviceName?: string;
}) {
  return (
    <div>
      <Reveal>
        <p className="mx-auto mb-6 max-w-[860px] text-center text-[13.5px] leading-relaxed text-body-text">
          {pricing.groups.map((group, i) => (
            <span key={group.key}>
              <strong className="text-navy">Nhóm {group.key}:</strong> {group.desc}
              {i < pricing.groups.length - 1 && " "}
            </span>
          ))}
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <ScrollFadeContainer className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 z-10 w-[190px] border-r border-line bg-bg-tint px-5 py-3.5 text-[12px] leading-snug font-bold text-navy shadow-[2px_0_6px_rgba(15,27,45,0.08)] sm:w-[220px]">
                  Số hoá đơn ra/vào, chứng từ mỗi quý
                </th>
                {pricing.groups.map((group) => (
                  <th
                    key={group.key}
                    className="bg-bg-tint px-5 py-3.5 text-right text-[12px] leading-snug font-bold whitespace-nowrap text-navy"
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing.tiers.map((tier, i) => (
                <tr key={tier.range}>
                  <td
                    className={`sticky left-0 z-10 w-[190px] border-r border-b border-line px-5 py-3 text-[13px] font-medium text-navy shadow-[2px_0_6px_rgba(15,27,45,0.08)] sm:w-[220px] ${
                      i % 2 === 1 ? "bg-[#f9fbfe]" : "bg-white"
                    }`}
                  >
                    {tier.range}
                  </td>
                  {pricing.groups.map((group) => (
                    <td
                      key={group.key}
                      className={`border-b border-line px-5 py-3 text-right font-mono text-[14.5px] font-bold whitespace-nowrap text-primary ${
                        i % 2 === 1 ? "bg-bg-tint/50" : ""
                      }`}
                    >
                      {tier.prices[group.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollFadeContainer>
      </Reveal>

      <Reveal>
        <div id="phi-phat-sinh-them" className="mt-10 scroll-mt-24">
          <p className="mb-5 text-center text-[15.5px] font-bold text-navy">
            Phí phát sinh thêm (nếu có, áp dụng chung cả 3 nhóm loại hình)
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {pricing.surcharges.map((surcharge, i) => {
              const Icon = SURCHARGE_ICONS[i % SURCHARGE_ICONS.length];
              return (
                <div
                  key={surcharge.title}
                  className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft"
                >
                  <span className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h4 className="mb-3 text-[14px] font-bold text-navy">{surcharge.title}</h4>
                  <ul className="flex-1 space-y-2">
                    {surcharge.rows.map((row) => (
                      <li
                        key={row.label}
                        className="flex items-baseline justify-between gap-3 text-[12.5px] text-body-text"
                      >
                        <span>{row.label}</span>
                        <span className="whitespace-nowrap font-mono font-bold text-navy">
                          {row.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {surcharge.note && (
                    <p className="mt-3 text-[11px] text-body-text">{surcharge.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 text-center">
        <LeadFormButton service={serviceName} variant="primary">
          Nhận tư vấn miễn phí
        </LeadFormButton>
      </div>
    </div>
  );
}
