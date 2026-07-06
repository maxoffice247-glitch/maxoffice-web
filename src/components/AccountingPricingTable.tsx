"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import Button from "./Button";
import { DocumentCheckIcon, WalletIcon, ScaleIcon } from "./icons";
import type { AccountingPricing, AccountingGroupKey } from "./ServicePricingTable";

const SURCHARGE_ICONS = [ScaleIcon, DocumentCheckIcon, WalletIcon];

export default function AccountingPricingTable({ pricing }: { pricing: AccountingPricing }) {
  const [activeKey, setActiveKey] = useState<AccountingGroupKey>(pricing.groups[0].key);
  const activeGroup = pricing.groups.find((g) => g.key === activeKey) ?? pricing.groups[0];

  return (
    <div>
      <Reveal>
        <div className="mb-6 flex flex-wrap justify-center gap-2.5">
          {pricing.groups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => setActiveKey(group.key)}
              aria-pressed={activeKey === group.key}
              className={`rounded-full border-[1.5px] px-5 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
                activeKey === group.key
                  ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
                  : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="mx-auto mb-6 max-w-[640px] text-center text-[13.5px] leading-relaxed text-body-text">
          {activeGroup.desc}
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-[640px] overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-line bg-bg-tint">
              <th className="px-6 py-3.5 text-[12.5px] font-bold text-navy">
                Số hoá đơn ra/vào, chứng từ mỗi quý
              </th>
              <th className="px-6 py-3.5 text-right text-[12.5px] font-bold text-navy">
                {pricing.tableUnit}
              </th>
            </tr>
          </thead>
          <tbody>
            {pricing.tiers.map((tier, i) => (
              <tr
                key={tier.range}
                className={`border-b border-line last:border-b-0 ${i % 2 === 1 ? "bg-bg-tint/50" : ""}`}
              >
                <td className="px-6 py-3 font-medium text-navy">{tier.range}</td>
                <td className="px-6 py-3 text-right font-mono text-[15px] font-bold text-primary">
                  {tier.prices[activeKey]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal>
        <div className="mt-10">
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
                    <p className="mt-3 text-[11px] text-body-text/70">{surcharge.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 text-center">
        <Button href="#lead-form" variant="primary">
          Nhận tư vấn miễn phí
        </Button>
      </div>
    </div>
  );
}
