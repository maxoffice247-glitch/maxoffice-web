"use client";

import { useMemo, useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import { CheckCircleIcon, BadgePercentIcon } from "../icons";

type EntityType = "cong-ty" | "ho-kinh-doanh" | "chi-nhanh";

const ENTITY_OPTIONS: { value: EntityType; label: string }[] = [
  { value: "cong-ty", label: "Công ty (TNHH, Cổ phần...)" },
  { value: "ho-kinh-doanh", label: "Hộ kinh doanh" },
  { value: "chi-nhanh", label: "Chi nhánh / Văn phòng đại diện" },
];

const TEN_TY = 10_000_000_000;
const FEE_OVER_10TY = 1000000;
const FEE_UNDER_10TY = 500000;
const FEE_HO_KINH_DOANH = 300000;
const FEE_CHI_NHANH = 300000;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function LicenseFeeTool() {
  const [entityType, setEntityType] = useState<EntityType | "">("");
  const [capital, setCapital] = useState("");
  const [establishDate, setEstablishDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const capitalNumber = Number(capital.replace(/[^\d]/g, "")) || 0;

  const allAnswered =
    entityType !== "" &&
    establishDate !== "" &&
    (entityType !== "cong-ty" || capital !== "");

  const result = useMemo(() => {
    if (!submitted || entityType === "") return null;

    let base: number;
    let basis: string;
    if (entityType === "ho-kinh-doanh") {
      base = FEE_HO_KINH_DOANH;
      basis = "Hộ kinh doanh";
    } else if (entityType === "chi-nhanh") {
      base = FEE_CHI_NHANH;
      basis = "Chi nhánh / Văn phòng đại diện";
    } else {
      const over = capitalNumber > TEN_TY;
      base = over ? FEE_OVER_10TY : FEE_UNDER_10TY;
      basis = over
        ? "Công ty có vốn điều lệ trên 10 tỷ đồng"
        : "Công ty có vốn điều lệ từ 10 tỷ đồng trở xuống";
    }

    let exempt = false;
    if (establishDate) {
      const month = new Date(establishDate).getMonth() + 1;
      exempt = month >= 1 && month <= 6;
    }

    return {
      basis,
      base,
      exempt,
      final: exempt ? 0 : base,
    };
  }, [submitted, entityType, capitalNumber, establishDate]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setEntityType("");
    setCapital("");
    setEstablishDate("");
    setSubmitted(false);
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Tính lệ phí môn bài"
          description="Nhập loại hình doanh nghiệp và vốn điều lệ để biết chính xác mức lệ phí môn bài bạn cần đóng."
        />

        {!result ? (
          <Reveal className="mx-auto max-w-[640px] rounded-2xl border border-line bg-white p-7 sm:p-9">
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

              {entityType === "cong-ty" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy">
                    Vốn điều lệ (VNĐ)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ví dụ: 5.000.000.000"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-navy">
                  Ngày thành lập (dự kiến)
                </label>
                <input
                  type="date"
                  value={establishDate}
                  onChange={(e) => setEstablishDate(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-2 text-[12.5px] text-body-text">
                  Doanh nghiệp thành lập từ 1/1 đến 30/6 được miễn lệ phí môn bài năm đầu tiên.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-40"
            >
              Tính lệ phí môn bài
            </button>
            {!allAnswered && (
              <p className="mt-3 text-center text-[12.5px] text-body-text">
                Vui lòng điền đầy đủ thông tin để xem kết quả.
              </p>
            )}
          </Reveal>
        ) : (
          <Reveal className="mx-auto max-w-[640px] overflow-hidden rounded-2xl border-2 border-primary bg-white text-center shadow-card">
            <div className="bg-gradient-to-tr from-navy to-primary-dark p-8 sm:p-10">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <BadgePercentIcon className="h-7 w-7" />
              </span>
              <span className="mb-2 block text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase">
                {result.basis}
              </span>
              <div className="font-mono text-[38px] font-bold text-white">
                {formatVND(result.final)}
                <span className="text-[16px] font-medium text-white/70"> / năm</span>
              </div>
              {result.exempt && (
                <p className="mt-2 text-[13.5px] font-bold text-[#8FC1F5]">
                  Được miễn 100% lệ phí môn bài năm đầu tiên
                </p>
              )}
            </div>
            <div className="p-7 sm:p-9">
              {result.exempt && (
                <p className="mb-4 text-[13.5px] text-body-text">
                  Mức lệ phí tiêu chuẩn là {formatVND(result.base)}/năm, nhưng do thành lập trong
                  giai đoạn 1/1 - 30/6, doanh nghiệp của bạn được miễn hoàn toàn lệ phí môn bài
                  trong năm đầu tiên hoạt động.
                </p>
              )}
              <p className="mb-6 text-[12.5px] text-body-text">
                *Kết quả trên áp dụng theo quy định lệ phí môn bài hiện hành của MAX OFFICE tư
                vấn. Vui lòng liên hệ để được xác nhận chính xác theo tình huống cụ thể của doanh
                nghiệp bạn.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Button href="/services/thanh-lap-doanh-nghiep" variant="ghost">
                  Xem dịch vụ thành lập DN
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

        <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-[640px] items-start gap-3 rounded-xl bg-primary-tint p-4">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[12.5px] leading-relaxed text-navy">
            Cần hỗ trợ kê khai và nộp lệ phí môn bài đúng hạn? Để lại thông tin để chuyên viên
            MAX OFFICE tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
