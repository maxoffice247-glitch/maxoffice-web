"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import Button from "../Button";
import { CheckCircleIcon, BuildingIcon, UsersIcon, KeyIcon, ScreenIcon } from "../icons";

type Employees = "1" | "2-3" | "4-10" | "tren-10";
type Budget = "duoi-500k" | "500k-2trieu" | "2-5trieu" | "tren-5trieu";
type YesNo = "yes" | "no";
type MeetingFreq = "khong" | "it" | "thuong-xuyen";

type Answers = {
  employees: Employees | "";
  budget: Budget | "";
  needLegalAddress: YesNo | "";
  needPrivateSpace: YesNo | "";
  meetingFreq: MeetingFreq | "";
};

const EMPLOYEES_OPTIONS: { value: Employees; label: string }[] = [
  { value: "1", label: "1 người" },
  { value: "2-3", label: "2-3 người" },
  { value: "4-10", label: "4-10 người" },
  { value: "tren-10", label: "Trên 10 người" },
];

const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "duoi-500k", label: "Dưới 500.000đ" },
  { value: "500k-2trieu", label: "500.000đ - 2.000.000đ" },
  { value: "2-5trieu", label: "2.000.000đ - 5.000.000đ" },
  { value: "tren-5trieu", label: "Trên 5.000.000đ" },
];

const YES_NO_OPTIONS: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Có" },
  { value: "no", label: "Không" },
];

const MEETING_OPTIONS: { value: MeetingFreq; label: string }[] = [
  { value: "khong", label: "Không họp / hiếm khi" },
  { value: "it", label: "1-3 lần/tháng" },
  { value: "thuong-xuyen", label: "Thường xuyên (>3 lần/tháng)" },
];

const PACKAGES = {
  "van-phong-ao": {
    slug: "van-phong-ao",
    icon: BuildingIcon,
    name: "Văn phòng ảo",
    price: "299.000đ",
    unit: "/ tháng",
    reason:
      "Bạn chỉ cần địa chỉ đăng ký kinh doanh hợp lệ, chưa cần không gian làm việc cố định — đây là lựa chọn tiết kiệm nhất.",
  },
  "cho-ngoi-linh-dong": {
    slug: "cho-ngoi-linh-dong",
    icon: UsersIcon,
    name: "Chỗ ngồi linh động",
    price: "2.000.000đ",
    unit: "/ tháng",
    reason:
      "Với quy mô đội ngũ nhỏ, chỗ ngồi linh động giúp bạn có nơi làm việc chuyên nghiệp mà không phải cam kết không gian cố định.",
  },
  "van-phong-tron-goi": {
    slug: "van-phong-tron-goi",
    icon: KeyIcon,
    name: "Văn phòng trọn gói",
    price: "4.500.000đ",
    unit: "/ tháng",
    reason:
      "Bạn cần không gian riêng cho đội ngũ — văn phòng trọn gói sẵn sàng sử dụng ngay với đầy đủ tiện ích.",
  },
  "phong-hop": {
    slug: "phong-hop",
    icon: ScreenIcon,
    name: "Phòng họp theo giờ",
    price: "150.000đ",
    unit: "/ giờ",
    reason:
      "Bạn họp khá thường xuyên nhưng không cần không gian cố định — đặt phòng họp theo giờ sẽ tối ưu chi phí hơn.",
  },
} as const;

type PackageKey = keyof typeof PACKAGES;

function recommend(a: Answers): PackageKey {
  const { employees, budget, needLegalAddress, needPrivateSpace, meetingFreq } = a;

  if (needPrivateSpace === "yes") {
    return "van-phong-tron-goi";
  }
  if (needLegalAddress === "yes" && budget === "duoi-500k") {
    return "van-phong-ao";
  }
  if (meetingFreq === "thuong-xuyen" && needLegalAddress !== "yes") {
    return "phong-hop";
  }
  if (employees === "1" || employees === "2-3") {
    return "cho-ngoi-linh-dong";
  }
  if (needLegalAddress === "yes") {
    return "van-phong-ao";
  }
  if (budget === "duoi-500k") return "van-phong-ao";
  if (budget === "500k-2trieu") return "cho-ngoi-linh-dong";
  if (budget === "2-5trieu") return "van-phong-tron-goi";
  return "van-phong-tron-goi";
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

const QUESTIONS: {
  key: keyof Answers;
  label: string;
}[] = [
  { key: "employees", label: "Số nhân viên hiện tại của bạn?" },
  { key: "budget", label: "Ngân sách hàng tháng dự kiến?" },
  { key: "needLegalAddress", label: "Bạn có cần địa chỉ đăng ký kinh doanh hợp pháp không?" },
  { key: "needPrivateSpace", label: "Bạn có cần không gian làm việc riêng, cố định không?" },
  { key: "meetingFreq", label: "Tần suất họp với khách hàng/đối tác mỗi tháng?" },
];

export default function OfficePackageTool() {
  const [answers, setAnswers] = useState<Answers>({
    employees: "",
    budget: "",
    needLegalAddress: "",
    needPrivateSpace: "",
    meetingFreq: "",
  });
  const [result, setResult] = useState<PackageKey | null>(null);

  const allAnswered = Object.values(answers).every((v) => v !== "");

  const handleSubmit = () => {
    if (!allAnswered) return;
    setResult(recommend(answers));
  };

  const handleReset = () => {
    setAnswers({
      employees: "",
      budget: "",
      needLegalAddress: "",
      needPrivateSpace: "",
      meetingFreq: "",
    });
    setResult(null);
  };

  const pkg = result ? PACKAGES[result] : null;

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Chọn gói văn phòng phù hợp với bạn"
          description="Trả lời 5 câu hỏi ngắn để nhận gợi ý gói dịch vụ tối ưu nhất cho nhu cầu và ngân sách của doanh nghiệp bạn."
        />

        {!result ? (
          <Reveal className="mx-auto max-w-[760px] rounded-2xl border border-line bg-white p-7 sm:p-9">
            <div className="space-y-7">
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <label className="mb-3 block text-[15px] font-bold text-navy">
                    {q.label}
                  </label>
                  {q.key === "employees" && (
                    <PillGroup
                      options={EMPLOYEES_OPTIONS}
                      value={answers.employees}
                      onChange={(v) => setAnswers((a) => ({ ...a, employees: v }))}
                    />
                  )}
                  {q.key === "budget" && (
                    <PillGroup
                      options={BUDGET_OPTIONS}
                      value={answers.budget}
                      onChange={(v) => setAnswers((a) => ({ ...a, budget: v }))}
                    />
                  )}
                  {q.key === "needLegalAddress" && (
                    <PillGroup
                      options={YES_NO_OPTIONS}
                      value={answers.needLegalAddress}
                      onChange={(v) => setAnswers((a) => ({ ...a, needLegalAddress: v }))}
                    />
                  )}
                  {q.key === "needPrivateSpace" && (
                    <PillGroup
                      options={YES_NO_OPTIONS}
                      value={answers.needPrivateSpace}
                      onChange={(v) => setAnswers((a) => ({ ...a, needPrivateSpace: v }))}
                    />
                  )}
                  {q.key === "meetingFreq" && (
                    <PillGroup
                      options={MEETING_OPTIONS}
                      value={answers.meetingFreq}
                      onChange={(v) => setAnswers((a) => ({ ...a, meetingFreq: v }))}
                    />
                  )}
                </div>
              ))}
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
                Vui lòng trả lời đầy đủ {QUESTIONS.length} câu hỏi để xem kết quả.
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
                <div className="font-mono text-[32px] font-bold text-white">
                  {pkg.price}
                  <span className="text-[16px] font-medium text-white/70">{pkg.unit}</span>
                </div>
              </div>
              <div className="p-7 sm:p-9">
                <p className="mb-6 text-[15px] leading-relaxed text-body-text">
                  {pkg.reason}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <Button href={`/services/${pkg.slug}`} variant="ghost">
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
            <Link href="#lead-form" className="font-bold underline">
              để lại thông tin
            </Link>{" "}
            để chuyên viên MAX OFFICE tư vấn miễn phí.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
