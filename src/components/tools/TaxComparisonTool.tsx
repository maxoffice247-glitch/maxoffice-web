"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import LeadFormButton from "../LeadFormButton";
import CurrencyInput from "../CurrencyInput";
import { CheckCircleIcon, PlusIcon, ScaleIcon } from "../icons";
import {
  PIT_PERSONAL_DEDUCTION,
  PIT_DEPENDENT_DEDUCTION,
  calculatePitProgressive,
  HOUSEHOLD_INDUSTRY_RATES,
  HOUSEHOLD_INDUSTRY_ORDER,
  HOUSEHOLD_TAX_EXEMPT_REVENUE_YEARLY,
  HOUSEHOLD_FLAT_METHOD_MAX_REVENUE_YEARLY,
  type HouseholdIndustryKey,
} from "@/lib/taxConstants";

function formatVND(n: number) {
  return Math.round(n).toLocaleString("vi-VN") + "đ";
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

const labelClass = "mb-1.5 block text-[14.5px] font-bold text-navy";

export default function TaxComparisonTool() {
  const [incomeRaw, setIncomeRaw] = useState("20000000");
  const [dependents, setDependents] = useState(0);
  const [industryKey, setIndustryKey] = useState<HouseholdIndustryKey>("dich-vu");

  const monthlyIncome = Number(incomeRaw) || 0;

  const result = useMemo(() => {
    // Phương án 1 — Thuế TNCN theo lương/tiền công (biểu luỹ tiến 5 bậc).
    const deduction = PIT_PERSONAL_DEDUCTION + dependents * PIT_DEPENDENT_DEDUCTION;
    const taxableIncome = Math.max(0, monthlyIncome - deduction);
    const pitTaxMonthly = calculatePitProgressive(taxableIncome);
    const pitNetMonthly = monthlyIncome - pitTaxMonthly;

    // Phương án 2 — Thuế hộ kinh doanh theo % doanh thu (phương pháp khoán).
    const yearlyRevenue = monthlyIncome * 12;
    const isExempt = yearlyRevenue <= HOUSEHOLD_TAX_EXEMPT_REVENUE_YEARLY;
    const industry = HOUSEHOLD_INDUSTRY_RATES[industryKey];
    const householdRate = industry.vatRate + industry.pitRate;
    const householdTaxMonthly = isExempt ? 0 : monthlyIncome * householdRate;
    const householdNetMonthly = monthlyIncome - householdTaxMonthly;
    const overFlatMethodCap = yearlyRevenue > HOUSEHOLD_FLAT_METHOD_MAX_REVENUE_YEARLY;

    const diff = pitNetMonthly - householdNetMonthly;

    return {
      deduction,
      taxableIncome,
      pitTaxMonthly,
      pitNetMonthly,
      isExempt,
      industry,
      householdRate,
      householdTaxMonthly,
      householdNetMonthly,
      overFlatMethodCap,
      diff,
    };
  }, [monthlyIncome, dependents, industryKey]);

  const stepperBtnClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-[16px] font-bold text-navy transition-all duration-200 hover:border-primary/40 hover:text-primary";

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="So sánh thuế: TNCN vs Hộ kinh doanh"
          description="Nhập thu nhập/doanh thu dự kiến theo tháng để so sánh nhanh số thuế phải nộp giữa 2 phương án — đóng thuế TNCN theo lương/tiền công, hoặc đăng ký hộ kinh doanh nộp thuế khoán theo % doanh thu."
        />

        {/* Disclaimer — luôn hiển thị rõ, không ẩn/thu nhỏ. */}
        <Reveal className="mx-auto mb-8 max-w-[860px] rounded-2xl border-2 border-amber/40 bg-amber/8 p-5 sm:p-6">
          <p className="text-[13.5px] leading-relaxed font-semibold text-navy">
            ⚠️ Đây là công cụ ƯỚC TÍNH tham khảo dựa trên quy định thuế hiện hành (2026), CHỈ áp
            dụng phương pháp tính đơn giản theo tỷ lệ % doanh thu — chưa bao gồm các trường hợp
            đặc biệt (nhiều nguồn thu nhập, chi phí được trừ, ưu đãi thuế riêng...). Vui lòng liên
            hệ đội ngũ tư vấn MAX OFFICE hoặc kế toán/luật sư để có số liệu chính xác cho trường
            hợp cụ thể của bạn trước khi ra quyết định.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto max-w-[860px] rounded-2xl border border-line bg-white p-7 sm:p-9">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label htmlFor="tct-income" className={labelClass}>
                Thu nhập / doanh thu dự kiến theo tháng
              </label>
              <CurrencyInput
                id="tct-income"
                value={incomeRaw}
                onChange={setIncomeRaw}
                placeholder="Ví dụ: 20.000.000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Số người phụ thuộc</label>
              <p className="mb-2 text-[12px] text-body-text">Dùng để tính giảm trừ gia cảnh (phương án TNCN).</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Giảm số người phụ thuộc"
                  onClick={() => setDependents((d) => Math.max(0, d - 1))}
                  className={stepperBtnClass}
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-[16px] font-bold text-navy">
                  {dependents}
                </span>
                <button
                  type="button"
                  aria-label="Tăng số người phụ thuộc"
                  onClick={() => setDependents((d) => d + 1)}
                  className={stepperBtnClass}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tct-industry" className={labelClass}>
                Nhóm ngành (áp dụng cho phương án Hộ kinh doanh)
              </label>
              <select
                id="tct-industry"
                value={industryKey}
                onChange={(e) => setIndustryKey(e.target.value as HouseholdIndustryKey)}
                className={inputClass}
              >
                {HOUSEHOLD_INDUSTRY_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {HOUSEHOLD_INDUSTRY_RATES[key].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {monthlyIncome > 0 && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Phương án 1 — TNCN */}
                <div className="rounded-2xl border border-line bg-bg-tint p-6">
                  <p className="mb-1 text-[12px] font-bold tracking-[0.1em] text-primary uppercase">
                    Phương án 1
                  </p>
                  <h3 className="mb-4 text-[16px] font-bold text-navy">
                    Thuế TNCN (lương / tiền công)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <span className="text-[13.5px] text-body-text">Thuế phải nộp</span>
                      <div className="text-right">
                        <div className="font-mono text-[16px] font-bold text-navy">
                          {formatVND(result.pitTaxMonthly)}
                          <span className="text-[12px] font-medium text-body-text">/tháng</span>
                        </div>
                        <div className="text-[11.5px] text-body-text">
                          {formatVND(result.pitTaxMonthly * 12)}/năm
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold text-navy">Thực nhận</span>
                      <span className="font-mono text-[18px] font-bold text-primary">
                        {formatVND(result.pitNetMonthly)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-[11.5px] leading-relaxed text-body-text">
                    Giảm trừ gia cảnh: {formatVND(result.deduction)}/tháng (bản thân{" "}
                    {formatVND(PIT_PERSONAL_DEDUCTION)} + {dependents} người phụ thuộc ×{" "}
                    {formatVND(PIT_DEPENDENT_DEDUCTION)}).
                  </p>
                </div>

                {/* Phương án 2 — Hộ kinh doanh */}
                <div className="rounded-2xl border border-line bg-bg-tint p-6">
                  <p className="mb-1 text-[12px] font-bold tracking-[0.1em] text-accent uppercase">
                    Phương án 2
                  </p>
                  <h3 className="mb-4 text-[16px] font-bold text-navy">
                    Thuế Hộ kinh doanh (% doanh thu)
                  </h3>
                  {result.isExempt ? (
                    <div className="rounded-xl bg-primary-tint p-4">
                      <p className="text-[13.5px] font-bold text-navy">Miễn thuế</p>
                      <p className="text-[12.5px] text-body-text">
                        Doanh thu dự kiến ≤ 1 tỷ đồng/năm nên thuộc diện miễn thuế GTGT và TNCN.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-line pb-3">
                        <span className="text-[13.5px] text-body-text">Thuế phải nộp</span>
                        <div className="text-right">
                          <div className="font-mono text-[16px] font-bold text-navy">
                            {formatVND(result.householdTaxMonthly)}
                            <span className="text-[12px] font-medium text-body-text">/tháng</span>
                          </div>
                          <div className="text-[11.5px] text-body-text">
                            {formatVND(result.householdTaxMonthly * 12)}/năm
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-navy">Thực nhận</span>
                    <span className="font-mono text-[18px] font-bold text-primary">
                      {formatVND(result.householdNetMonthly)}
                    </span>
                  </div>
                  {!result.isExempt && (
                    <p className="mt-4 text-[11.5px] leading-relaxed text-body-text">
                      Áp dụng nhóm &quot;{result.industry.label}&quot;: GTGT{" "}
                      {(result.industry.vatRate * 100).toLocaleString("vi-VN")}% + TNCN{" "}
                      {(result.industry.pitRate * 100).toLocaleString("vi-VN")}% ={" "}
                      {(result.householdRate * 100).toLocaleString("vi-VN")}% doanh thu.
                    </p>
                  )}
                  {result.overFlatMethodCap && (
                    <p className="mt-3 rounded-lg bg-accent/10 p-3 text-[11.5px] leading-relaxed text-accent">
                      Doanh thu quy đổi năm đã vượt 3 tỷ đồng — hộ kinh doanh phải chuyển sang
                      phương pháp tính thuế trên lợi nhuận, không còn tính theo % doanh thu như
                      trên. Kết quả này chỉ mang tính tham khảo xa hơn thực tế.
                    </p>
                  )}
                </div>
              </div>

              {/* Kết luận */}
              <Reveal
                delay={0.1}
                className="mt-6 rounded-xl border border-primary/25 bg-primary-tint p-4 text-center"
              >
                <p className="flex flex-wrap items-center justify-center gap-1.5 text-[13.5px] leading-relaxed text-navy">
                  <ScaleIcon className="h-4 w-4 shrink-0 text-primary" />
                  {result.diff > 0 && (
                    <>
                      <strong>Phương án TNCN có lợi hơn</strong> trong trường hợp này — thực nhận
                      nhiều hơn <strong>{formatVND(Math.abs(result.diff))}/tháng</strong>.
                    </>
                  )}
                  {result.diff < 0 && (
                    <>
                      <strong>Phương án Hộ kinh doanh có lợi hơn</strong> trong trường hợp này —
                      thực nhận nhiều hơn <strong>{formatVND(Math.abs(result.diff))}/tháng</strong>.
                    </>
                  )}
                  {result.diff === 0 && <>Hai phương án cho số tiền thực nhận ngang nhau.</>}
                </p>
              </Reveal>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 border-t border-line pt-7">
            <Button href="/services/thanh-lap-doanh-nghiep" variant="ghost">
              Xem dịch vụ thành lập doanh nghiệp
            </Button>
            <LeadFormButton service="Thành lập doanh nghiệp" variant="primary">
              Nhận tư vấn miễn phí
            </LeadFormButton>
          </div>
          <p className="mt-4 text-center text-[12.5px] text-body-text">
            Đọc thêm:{" "}
            <Link
              href="/blog/ca-nhan-kinh-doanh-thue-tncn-hay-ho-kinh-doanh"
              className="font-bold text-primary underline"
            >
              Cá nhân kinh doanh nên đóng thuế TNCN hay đăng ký hộ kinh doanh? So sánh chi tiết
            </Link>
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-8 flex max-w-[860px] items-start gap-3 rounded-xl bg-primary-tint p-4">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[12.5px] leading-relaxed text-navy">
            Cần tư vấn để chọn đúng hình thức kinh doanh cho trường hợp cụ thể của bạn? Để lại
            thông tin để chuyên viên MAX OFFICE hỗ trợ miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
