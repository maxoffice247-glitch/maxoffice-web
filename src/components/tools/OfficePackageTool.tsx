"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import LeadFormButton from "../LeadFormButton";
import { CheckCircleIcon, BuildingIcon, UsersIcon, KeyIcon, ScreenIcon } from "../icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";
import { getPlansForLocation, getCheapestPlanForLocation } from "@/lib/virtualOfficePlans";
import { SERVICE_NAME_BY_SLUG, scrollToLeadForm } from "@/lib/serviceSelectEvent";

type SpaceNeed = "khong" | "linh-hoat" | "rieng";
type Budget = "duoi-2trieu" | "2-4.5trieu" | "4.5-10trieu" | "tren-10trieu";
type YesNo = "yes" | "no";
type MeetingFreq = "khong" | "it" | "thuong-xuyen";

type Answers = {
  employees: string;
  budget: Budget | "";
  needLegalAddress: YesNo | "";
  spaceNeed: SpaceNeed | "";
  meetingFreq: MeetingFreq | "";
  location: string;
};

const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "duoi-2trieu", label: "Dưới 2.000.000đ" },
  { value: "2-4.5trieu", label: "2.000.000đ - 4.500.000đ" },
  { value: "4.5-10trieu", label: "4.500.000đ - 10.000.000đ" },
  { value: "tren-10trieu", label: "Trên 10.000.000đ" },
];

const YES_NO_OPTIONS: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Có" },
  { value: "no", label: "Không" },
];

const SPACE_NEED_OPTIONS: { value: SpaceNeed; label: string }[] = [
  { value: "khong", label: "Không cần — chỉ cần địa chỉ đăng ký" },
  { value: "linh-hoat", label: "Cần chỗ ngồi, nhưng linh hoạt không cố định" },
  { value: "rieng", label: "Cần không gian / phòng riêng cố định" },
];

const MEETING_OPTIONS: { value: MeetingFreq; label: string }[] = [
  { value: "khong", label: "Không bao giờ họp trực tiếp" },
  { value: "it", label: "Thỉnh thoảng (1-3 lần/tháng)" },
  { value: "thuong-xuyen", label: "Thường xuyên (>3 lần/tháng)" },
];

const COWORKING_PRICE_PER_HEAD = 2000000;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const PACKAGES = {
  "van-phong-ao": {
    slug: "van-phong-ao",
    icon: BuildingIcon,
    name: "Văn phòng ảo",
    price: "299.000đ",
    unit: "/ tháng",
    reason:
      "Bạn chỉ cần địa chỉ đăng ký kinh doanh hợp lệ, chưa cần không gian làm việc cố định — đây là lựa chọn tiết kiệm nhất. Văn phòng ảo có 6 gói (LITE, START, BASE, ORIGIN, ORIGIN+, RISE), gói và mức giá cụ thể tuỳ theo chi nhánh bạn chọn.",
  },
  "cho-ngoi-linh-dong": {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    name: "Chỗ ngồi linh động",
    price: "2.000.000đ",
    unit: "/ người / tháng",
    reason:
      "Với nhu cầu chỗ ngồi linh hoạt, không cố định, chỗ ngồi linh động giúp đội ngũ có nơi làm việc chuyên nghiệp mà không phải cam kết không gian riêng.",
  },
  "van-phong-tron-goi": {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    name: "Văn phòng trọn gói",
    price: "4.500.000đ",
    unit: "/ tháng",
    reason:
      "Bạn cần không gian riêng cơ bản cho đội ngũ 4-6 người — văn phòng trọn gói sẵn sàng sử dụng ngay với đầy đủ tiện ích.",
  },
  "phong-rieng-lon": {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    name: "Gói phòng riêng lớn",
    price: "10.000.000đ",
    unit: "/ tháng",
    reason:
      "Đội ngũ 7-10 người cần phòng riêng rộng hơn (khoảng 20m²) — gói phòng riêng lớn đáp ứng đủ không gian và tiện ích cho quy mô này.",
  },
  "phong-hop": {
    slug: "phong-hop",
    icon: ScreenIcon,
    name: "Phòng họp theo giờ",
    price: "150.000đ",
    unit: "/ giờ",
    reason:
      "Bạn không cần chỗ ngồi cố định nhưng thỉnh thoảng cần gặp khách hàng/đối tác — đặt phòng họp theo giờ sẽ tối ưu chi phí hơn.",
  },
} as const;

type PackageKey = keyof typeof PACKAGES;

function recommend(a: Answers): PackageKey {
  const { spaceNeed, meetingFreq, employees } = a;

  // Chỉ cần địa chỉ pháp lý, không cần không gian làm việc.
  if (spaceNeed === "khong") {
    return meetingFreq === "khong" ? "van-phong-ao" : "phong-hop";
  }

  // Cần chỗ ngồi, nhưng linh hoạt, không cố định — tính theo đầu người.
  if (spaceNeed === "linh-hoat") {
    return "cho-ngoi-linh-dong";
  }

  // spaceNeed === "rieng": cần không gian/phòng riêng cố định — chọn theo quy mô.
  const n = Number(employees) || 0;
  return n >= 7 ? "phong-rieng-lon" : "van-phong-tron-goi";
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
            value === opt.value
              ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
              : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full max-w-[200px] rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";

const selectClass =
  "w-full max-w-[340px] rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink transition-colors duration-200 focus:border-primary focus:outline-none";

export default function OfficePackageTool() {
  const [answers, setAnswers] = useState<Answers>({
    employees: "",
    budget: "",
    needLegalAddress: "",
    spaceNeed: "",
    meetingFreq: "",
    location: "",
  });
  const [result, setResult] = useState<PackageKey | null>(null);

  const allAnswered =
    answers.employees !== "" &&
    Number(answers.employees) > 0 &&
    answers.budget !== "" &&
    answers.needLegalAddress !== "" &&
    answers.spaceNeed !== "" &&
    answers.meetingFreq !== "";

  const handleSubmit = () => {
    if (!allAnswered) return;
    setResult(recommend(answers));
  };

  const handleReset = () => {
    setAnswers({
      employees: "",
      budget: "",
      needLegalAddress: "",
      spaceNeed: "",
      meetingFreq: "",
      location: "",
    });
    setResult(null);
  };

  const pkg = result ? PACKAGES[result] : null;
  const employeeCount = Number(answers.employees) || 0;
  const coworkingTotal = employeeCount * COWORKING_PRICE_PER_HEAD;

  const voLocationName = answers.location
    ? LOCATIONS_LIST.find((l) => l.slug === answers.location)?.name
    : undefined;
  const voCheapest = answers.location ? getCheapestPlanForLocation(answers.location) : undefined;
  const voPlans = answers.location ? getPlansForLocation(answers.location) : [];

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Chọn gói văn phòng phù hợp với bạn"
          description="Trả lời vài câu hỏi ngắn để nhận gợi ý gói dịch vụ tối ưu nhất cho nhu cầu và ngân sách của doanh nghiệp bạn."
        />

        {!result ? (
          <Reveal className="mx-auto max-w-[760px] rounded-2xl border border-line bg-white p-7 sm:p-9">
            <div className="space-y-7">
              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Số nhân viên hiện tại của bạn?
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="Ví dụ: 3"
                    value={answers.employees}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, employees: e.target.value }))
                    }
                    className={inputClass}
                  />
                  <span className="text-[13.5px] text-body-text">người</span>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Ngân sách hàng tháng dự kiến?
                </label>
                <PillGroup
                  options={BUDGET_OPTIONS}
                  value={answers.budget}
                  onChange={(v) => setAnswers((a) => ({ ...a, budget: v }))}
                />
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn có cần địa chỉ đăng ký kinh doanh hợp pháp không?
                </label>
                <PillGroup
                  options={YES_NO_OPTIONS}
                  value={answers.needLegalAddress}
                  onChange={(v) => setAnswers((a) => ({ ...a, needLegalAddress: v }))}
                />
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Nhu cầu không gian làm việc của bạn?
                </label>
                <PillGroup
                  options={SPACE_NEED_OPTIONS}
                  value={answers.spaceNeed}
                  onChange={(v) => setAnswers((a) => ({ ...a, spaceNeed: v }))}
                />
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Tần suất họp với khách hàng/đối tác mỗi tháng?
                </label>
                <PillGroup
                  options={MEETING_OPTIONS}
                  value={answers.meetingFreq}
                  onChange={(v) => setAnswers((a) => ({ ...a, meetingFreq: v }))}
                />
              </div>

              <div>
                <label className="mb-3 block text-[15px] font-bold text-navy">
                  Bạn dự định đăng ký tại chi nhánh nào? (không bắt buộc)
                </label>
                <select
                  value={answers.location}
                  onChange={(e) => setAnswers((a) => ({ ...a, location: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">Chưa xác định</option>
                  {LOCATIONS_LIST.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-[12px] text-body-text">
                  Nếu gợi ý là Văn phòng ảo, chọn chi nhánh giúp bạn thấy đúng gói và giá khả dụng tại đó.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-40"
            >
              Xem kết quả gợi ý
            </button>
            {!allAnswered && (
              <p className="mt-3 text-center text-[12.5px] text-body-text">
                Vui lòng trả lời đầy đủ các câu hỏi (số nhân viên lớn hơn 0) để xem kết quả.
              </p>
            )}
          </Reveal>
        ) : (
          pkg && (
            <Reveal className="mx-auto max-w-[720px] overflow-hidden rounded-2xl border-2 border-primary bg-white text-center shadow-card">
              <div className="bg-gradient-to-tr from-navy to-primary-dark p-8 sm:p-10">
                <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase">
                  Gói phù hợp nhất với bạn
                </span>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <pkg.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-display text-[26px] font-extrabold text-white">
                  {pkg.name}
                </h3>
                {result === "cho-ngoi-linh-dong" ? (
                  <>
                    <div className="font-mono text-[32px] font-bold text-white">
                      {coworkingTotal.toLocaleString("vi-VN")}đ
                      <span className="text-[16px] font-medium text-white/70"> / tháng</span>
                    </div>
                    <p className="mt-2 text-[13.5px] text-white/70">
                      2.000.000đ/người × {employeeCount} người ={" "}
                      {coworkingTotal.toLocaleString("vi-VN")}đ/tháng
                    </p>
                  </>
                ) : result === "van-phong-ao" ? (
                  <>
                    <div className="font-mono text-[32px] font-bold text-white">
                      {voCheapest ? `Từ ${formatVND(voCheapest.price)}` : "Từ 299.000đ"}
                      <span className="text-[16px] font-medium text-white/70"> / tháng</span>
                    </div>
                    <p className="mt-2 text-[13.5px] text-white/70">
                      {voCheapest && voLocationName
                        ? `Tại chi nhánh ${voLocationName}: ${voPlans.map((p) => p.name).join(", ")}`
                        : "Mức giá cụ thể tuỳ chi nhánh — chọn chi nhánh ở bước trước để xem chi tiết."}
                    </p>
                  </>
                ) : (
                  <div className="font-mono text-[32px] font-bold text-white">
                    {pkg.price}
                    <span className="text-[16px] font-medium text-white/70">{pkg.unit}</span>
                  </div>
                )}
              </div>
              <div className="p-7 sm:p-9">
                <p className="mb-6 text-[15px] leading-relaxed text-body-text">
                  {pkg.reason}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <Button href={`/services/${pkg.slug}`} variant="ghost">
                    Xem chi tiết dịch vụ
                  </Button>
                  <LeadFormButton service={SERVICE_NAME_BY_SLUG[pkg.slug]} variant="primary">
                    Nhận tư vấn miễn phí
                  </LeadFormButton>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 text-[13px] font-bold text-body-text underline decoration-line underline-offset-4 hover:text-primary"
                >
                  Làm lại câu hỏi
                </button>
              </div>
            </Reveal>
          )
        )}

        <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-[720px] items-start gap-3 rounded-xl bg-primary-tint p-4">
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-[12.5px] leading-relaxed text-navy">
            Kết quả chỉ mang tính chất gợi ý dựa trên câu trả lời của bạn. Để
            có phương án chính xác nhất, hãy{" "}
            <Link
              href="/lien-he"
              onClick={(e) => {
                if (scrollToLeadForm()) e.preventDefault();
              }}
              className="font-bold underline"
            >
              để lại thông tin
            </Link>{" "}
            để chuyên viên MAX OFFICE tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
