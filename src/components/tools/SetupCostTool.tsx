"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import LeadFormButton from "../LeadFormButton";
import { CheckCircleIcon, DocumentCheckIcon } from "../icons";
import {
  SETUP_PACKAGES,
  AMENDMENT_SERVICES,
  COMBO_DISCOUNT_RULE,
  calculateAmendmentCombo,
  type SetupPackageKey,
} from "@/lib/setupFees";

const PACKAGE_OPTIONS: { value: SetupPackageKey; label: string }[] = [
  { value: "goi-1", label: "Gói 1 — Cơ bản" },
  { value: "goi-2", label: "Gói 2 — Đầy đủ" },
];

const KE_TOAN_TU = 500000;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function SetupCostTool() {
  const [packageKey, setPackageKey] = useState<SetupPackageKey | "">("");
  const [withVirtualOffice, setWithVirtualOffice] = useState<"yes" | "no" | "">("");
  const [selectedAmendments, setSelectedAmendments] = useState<string[]>([]);
  const [needAccounting, setNeedAccounting] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const toggleAmendment = (slug: string) => {
    setSelectedAmendments((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const allAnswered =
    packageKey !== "" &&
    (packageKey !== "goi-1" || withVirtualOffice !== "") &&
    needAccounting !== "";

  const result = useMemo(() => {
    if (!submitted || packageKey === "") return null;
    const pkg = SETUP_PACKAGES[packageKey];
    const packagePrice =
      packageKey === "goi-1" && withVirtualOffice === "yes" && pkg.priceWithVirtualOffice
        ? pkg.priceWithVirtualOffice
        : pkg.priceStandalone;
    const combo = calculateAmendmentCombo(selectedAmendments);
    return {
      pkg,
      packagePrice,
      combo,
      total: packagePrice + combo.total,
      needAccounting: needAccounting === "yes",
    };
  }, [submitted, packageKey, withVirtualOffice, selectedAmendments, needAccounting]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setPackageKey("");
    setWithVirtualOffice("");
    setSelectedAmendments([]);
    setNeedAccounting("");
    setSubmitted(false);
  };

  const pillClass = (active: boolean) =>
    `rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
      active
        ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
        : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
    }`;

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Tính chi phí thành lập công ty"
          description="Chọn gói dịch vụ và các dịch vụ pháp lý sửa đổi (nếu có) để nhận ước tính chi phí theo bảng giá mới nhất của MAX OFFICE."
        />

        {!result ? (
          <Reveal className="mx-auto max-w-[720px] rounded-2xl border border-line bg-white p-7 sm:p-9">
            <div className="space-y-6">
              <div>
                <label id="sct-package-label" className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn muốn dùng gói dịch vụ nào?
                </label>
                <div role="group" aria-labelledby="sct-package-label" className="flex flex-wrap gap-2.5">
                  {PACKAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={packageKey === opt.value}
                      onClick={() => setPackageKey(opt.value)}
                      className={pillClass(packageKey === opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {packageKey !== "" && (
                  <ul className="mt-3 space-y-1.5 rounded-xl bg-bg-tint p-4">
                    {SETUP_PACKAGES[packageKey].includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-body-text">
                        <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {packageKey === "goi-1" && (
                <div>
                  <label id="sct-vo-label" className="mb-3 block text-[15px] font-bold text-navy">
                    Bạn có muốn đăng ký kèm Văn phòng ảo không?
                  </label>
                  <div role="group" aria-labelledby="sct-vo-label" className="flex flex-wrap gap-2.5">
                    {[
                      { value: "yes" as const, label: "Có, đăng ký kèm Văn phòng ảo" },
                      { value: "no" as const, label: "Không, chỉ thành lập doanh nghiệp" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={withVirtualOffice === opt.value}
                        onClick={() => setWithVirtualOffice(opt.value)}
                        className={pillClass(withVirtualOffice === opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[12.5px] text-body-text">
                    Đăng ký kèm Văn phòng ảo giúp giảm phí Gói 1 còn 1.299.000đ thay vì
                    1.500.000đ.
                  </p>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[15px] font-bold text-navy">
                  Cần thêm dịch vụ pháp lý sửa đổi? (không bắt buộc)
                </label>
                <p className="mb-3 text-[12.5px] text-body-text">{COMBO_DISCOUNT_RULE}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {AMENDMENT_SERVICES.map((svc) => {
                    const checked = selectedAmendments.includes(svc.slug);
                    return (
                      <label
                        key={svc.slug}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors duration-200 ${
                          checked ? "border-primary bg-primary-tint" : "border-line bg-white hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmendment(svc.slug)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                        />
                        <span className="text-[13px] leading-snug text-ink">
                          {svc.name}
                          <span className="ml-1 font-mono text-[12px] font-bold text-primary">
                            {formatVND(svc.price)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label id="sct-accounting-label" className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn có cần dịch vụ kế toán thuế không?
                </label>
                <div role="group" aria-labelledby="sct-accounting-label" className="flex flex-wrap gap-2.5">
                  {[
                    { value: "yes" as const, label: "Có" },
                    { value: "no" as const, label: "Không" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={needAccounting === opt.value}
                      onClick={() => setNeedAccounting(opt.value)}
                      className={pillClass(needAccounting === opt.value)}
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
                Vui lòng chọn gói dịch vụ{packageKey === "goi-1" ? " và điều kiện Văn phòng ảo" : ""} để xem kết quả.
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
                  {result.pkg.name}
                </h3>
              </div>
            </div>
            <div className="p-7 sm:p-8">
              <ul className="mb-5 space-y-3.5">
                <li className="flex items-center justify-between border-b border-line pb-3.5">
                  <span className="text-[14.5px] text-body-text">{result.pkg.name}</span>
                  <span className="font-mono text-[16px] font-bold text-navy">
                    {formatVND(result.packagePrice)}
                  </span>
                </li>
                {result.combo.items.map((item) => (
                  <li key={item.slug} className="flex items-center justify-between border-b border-line pb-3.5">
                    <span className="text-[13.5px] text-body-text">{item.name}</span>
                    <span className="font-mono text-[15px] font-bold text-navy">
                      {item.discounted && (
                        <span className="mr-1.5 text-[12.5px] font-medium text-body-text line-through">
                          {formatVND(item.price)}
                        </span>
                      )}
                      {formatVND(item.finalPrice)}
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-navy">Tổng chi phí</span>
                  <span className="font-mono text-[22px] font-bold text-primary">
                    {formatVND(result.total)}
                  </span>
                </li>
              </ul>

              {result.combo.items.length >= 2 && (
                <p className="mb-6 text-[12px] leading-relaxed text-body-text">
                  {COMBO_DISCOUNT_RULE}
                </p>
              )}

              <p className="mb-6 flex items-start gap-2 rounded-xl bg-primary-tint p-3.5 text-[12.5px] leading-relaxed text-navy">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Từ 01/01/2026, lệ phí môn bài đã được bãi bỏ theo Nghị quyết 198/2025/QH15 nên
                không còn tính vào chi phí ban đầu.
              </p>

              {result.needAccounting && (
                <div className="mb-6 rounded-xl bg-primary-tint p-4">
                  <p className="text-[13.5px] leading-relaxed text-navy">
                    <strong>Kế toán thuế trọn gói (hàng tháng, riêng):</strong> Từ{" "}
                    {formatVND(KE_TOAN_TU)}/tháng, tính theo số hoá đơn/quý và loại hình kinh
                    doanh —{" "}
                    <Link href="/services/ke-toan-thue#bang-gia" className="font-bold underline">
                      xem bảng giá chi tiết
                    </Link>
                    .
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
                <LeadFormButton service="Thành lập doanh nghiệp" variant="primary">
                  Nhận tư vấn miễn phí
                </LeadFormButton>
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
            Đây là chi phí ước tính. Để nhận báo giá chính xác theo nhu cầu cụ thể, hãy để lại
            thông tin bên dưới để được tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
