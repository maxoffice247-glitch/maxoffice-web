"use client";

import { useMemo, useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import CurrencyInput from "../CurrencyInput";
import { CheckCircleIcon, DocumentCheckIcon } from "../icons";
import { SETUP_FEES, type EntityType } from "@/lib/setupFees";

const ENTITY_OPTIONS: { value: EntityType; label: string }[] = [
  { value: "ho-kinh-doanh", label: "Hộ kinh doanh" },
  { value: "tnhh-1tv", label: "Công ty TNHH 1 thành viên" },
  { value: "tnhh-2tv", label: "Công ty TNHH 2 thành viên trở lên" },
  { value: "co-phan", label: "Công ty Cổ phần" },
];

const KE_TOAN_STARTUP = 800000;
const KE_TOAN_BUSINESS = 1500000;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function SetupCostTool() {
  const [entityType, setEntityType] = useState<EntityType | "">("");
  const [withVirtualOffice, setWithVirtualOffice] = useState<"yes" | "no" | "">("");
  const [capital, setCapital] = useState("");
  const [industry, setIndustry] = useState("");
  const [needAccounting, setNeedAccounting] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const allAnswered =
    entityType !== "" && withVirtualOffice !== "" && capital !== "" && needAccounting !== "";

  const result = useMemo(() => {
    if (!submitted || entityType === "" || withVirtualOffice === "") return null;
    const fee = SETUP_FEES[entityType];
    const setupCost = withVirtualOffice === "yes" ? fee.included : fee.standalone;
    return {
      entityLabel: fee.label,
      setupCost,
      needAccounting: needAccounting === "yes",
    };
  }, [submitted, entityType, withVirtualOffice, needAccounting]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setEntityType("");
    setWithVirtualOffice("");
    setCapital("");
    setIndustry("");
    setNeedAccounting("");
    setSubmitted(false);
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Tính chi phí thành lập công ty"
          description="Chọn loại hình doanh nghiệp và điền thông tin để nhận ước tính chi phí thành lập theo bảng giá mới nhất của MAX OFFICE."
        />

        {!result ? (
          <Reveal className="mx-auto max-w-[720px] rounded-2xl border border-line bg-white p-7 sm:p-9">
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Loại hình doanh nghiệp
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {ENTITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEntityType(opt.value)}
                      className={`rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
                        entityType === opt.value
                          ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
                          : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn có muốn đăng ký kèm Văn phòng ảo không?
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { value: "yes" as const, label: "Có, đăng ký kèm Văn phòng ảo" },
                    { value: "no" as const, label: "Không, chỉ thành lập doanh nghiệp" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setWithVirtualOffice(opt.value)}
                      className={`rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
                        withVirtualOffice === opt.value
                          ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
                          : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[12.5px] text-body-text">
                  Đăng ký kèm Văn phòng ảo giúp giảm đáng kể phí dịch vụ thành lập.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy">
                    Vốn điều lệ dự kiến (VNĐ)
                  </label>
                  <CurrencyInput
                    placeholder="Ví dụ: 1.000.000.000"
                    value={capital}
                    onChange={setCapital}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy">
                    Ngành nghề kinh doanh
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thương mại, dịch vụ..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn có cần dịch vụ kế toán thuế không?
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { value: "yes" as const, label: "Có" },
                    { value: "no" as const, label: "Không" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNeedAccounting(opt.value)}
                      className={`rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
                        needAccounting === opt.value
                          ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
                          : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-40"
            >
              Tính chi phí thành lập
            </button>
            {!allAnswered && (
              <p className="mt-3 text-center text-[12.5px] text-body-text">
                Vui lòng điền đầy đủ thông tin để xem kết quả (vốn điều lệ nhập 0 nếu chưa xác định).
              </p>
            )}
          </Reveal>
        ) : (
          <Reveal className="mx-auto max-w-[720px] overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-card">
            <div className="flex items-center gap-4 bg-gradient-to-tr from-navy to-primary-dark p-7 sm:p-8">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <DocumentCheckIcon className="h-7 w-7" />
              </span>
              <div>
                <span className="mb-1 block text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase">
                  Ước tính chi phí
                </span>
                <h3 className="font-display text-[20px] font-extrabold text-white">
                  {result.entityLabel}
                </h3>
              </div>
            </div>
            <div className="p-7 sm:p-8">
              <ul className="mb-5 space-y-3.5">
                <li className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-navy">Tổng chi phí ban đầu</span>
                  <span className="font-mono text-[22px] font-bold text-primary">
                    {formatVND(result.setupCost)}
                  </span>
                </li>
              </ul>
              <p className="mb-6 flex items-start gap-2 rounded-xl bg-primary-tint p-3.5 text-[12.5px] leading-relaxed text-navy">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Từ 01/01/2026, lệ phí môn bài đã được bãi bỏ theo Nghị quyết 198/2025/QH15 nên
                không còn tính vào chi phí ban đầu.
              </p>

              {result.needAccounting && (
                <div className="mb-6 rounded-xl bg-primary-tint p-4">
                  <p className="text-[13.5px] leading-relaxed text-navy">
                    <strong>Kế toán thuế trọn gói (hàng tháng, riêng):</strong> Từ{" "}
                    {formatVND(KE_TOAN_STARTUP)}/tháng cho gói Startup (doanh thu dưới 1 tỷ/năm),
                    hoặc {formatVND(KE_TOAN_BUSINESS)}/tháng cho gói Business (doanh thu 1-10 tỷ/năm).
                  </p>
                </div>
              )}

              <p className="mb-6 text-[12.5px] text-body-text">
                *Chi phí trên là ước tính dựa trên thông tin bạn cung cấp, chưa bao gồm các khoản
                phát sinh khác (nếu có). Đội ngũ MAX OFFICE sẽ báo giá chính xác sau khi tư vấn chi
                tiết.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <Button href="/services/thanh-lap-doanh-nghiep" variant="ghost">
                  Xem chi tiết dịch vụ
                </Button>
                <Button href="#lead-form" variant="primary">
                  Nhận tư vấn miễn phí
                </Button>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 text-[13px] font-bold text-body-text underline decoration-line underline-offset-4 hover:text-primary"
              >
                Tính lại
              </button>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-[720px] items-start gap-3 rounded-xl bg-primary-tint p-4">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[12.5px] leading-relaxed text-navy">
            Đây là chi phí ước tính. Để nhận báo giá chính xác theo ngành nghề và loại hình cụ
            thể, hãy để lại thông tin bên dưới để được tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
