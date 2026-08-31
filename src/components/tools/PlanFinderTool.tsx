"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import { ArrowRightSmallIcon } from "../icons";
import { AREAS } from "@/lib/locationsData";
import {
  getAllOfferedPlans,
  getGroupedPlans,
  isPriceInBand,
  distanceToBand,
  findNearestPlans,
  bandForPrice,
  BUDGET_BANDS,
  formatVoPrice,
  type OfferedPlan,
  type PlanGroup,
  type BudgetBandKey,
} from "@/lib/planFinder";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink transition-colors duration-200 focus:border-primary focus:outline-none";

const labelClass = "mb-1.5 block text-[14.5px] font-bold text-navy";

const pillClass = (active: boolean) =>
  `rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
    active
      ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(21,101,192,0.28)]"
      : "border-line bg-white text-body-text hover:border-primary/40 hover:text-primary"
  }`;

/**
 * Mỗi card tự bắt sự kiện "vào khung hình" riêng (Reveal độc lập) thay vì
 * dùng chung 1 RevealGroup cho toàn danh sách — với danh sách dài (vd. 21-25
 * gói khi lọc "Tất cả khu vực"), 1 RevealGroup bao hết sẽ cao hơn nhiều lần
 * chiều cao màn hình, khiến ngưỡng "amount: 0.12" của nó không bao giờ đạt
 * được (không thể có 12% khối cao hàng nghìn px lọt trong 1 khung hình thấp
 * hơn nó nhiều lần) — toàn bộ danh sách bị kẹt ở opacity: 0 vĩnh viễn.
 */
function PlanCard({ plan }: { plan: OfferedPlan }) {
  return (
    <Reveal y={20} duration={0.5} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card">
        {/* Ảnh mặt tiền gốc là ảnh DỌC (đúng cho trang chi nhánh) — khung
            aspect-[3/4] + object-contain (không phải cover) để không cắt mất
            góc trên/dưới khi nhét vào thẻ kết quả, khác tỉ lệ khung ngang cũ. */}
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-bg-tint">
          <Image
            src={`/images/dia-diem-${plan.locationSlug}.jpg`}
            alt={`Mặt tiền văn phòng ${plan.locationName}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 right-3 rounded-full bg-navy px-3 py-1 font-mono text-[13px] font-bold text-white">
            {formatVoPrice(plan.price)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="mb-1 text-[11px] font-bold tracking-[0.08em] text-primary uppercase">
            {plan.area.name}
          </span>
          <h3 className="mb-1 text-[15.5px] font-bold text-navy">{plan.locationName}</h3>
          <p className="mb-4 text-[13px] text-body-text">Gói {plan.planName} · /tháng</p>
          <Link
            href={`/tien-ich/tim-goi-phu-hop/${plan.locationSlug}/${plan.planKey}`}
            className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent transition-all duration-200 group-hover:gap-2.5"
          >
            Xem chi tiết
            <ArrowRightSmallIcon />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Thẻ 1 NHÓM gói (chế độ "Xem theo gói") — không có ảnh mặt tiền đại diện
 * vì 1 nhóm có thể gồm nhiều chi nhánh khác nhau, không có 1 ảnh nào đại
 * diện đúng cho cả nhóm; danh sách chi nhánh cụ thể xem ở trang chi tiết.
 */
function GroupCard({ group }: { group: PlanGroup }) {
  return (
    <Reveal y={20} duration={0.5} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-bold text-navy">Gói {group.planName}</h3>
            <p className="mt-1 font-mono text-[22px] font-bold text-primary">
              {formatVoPrice(group.price)}
              <span className="text-[12px] font-sans font-medium text-body-text"> /tháng</span>
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-tint px-3 py-1 text-[12px] font-bold whitespace-nowrap text-primary">
            {group.locations.length} chi nhánh
          </span>
        </div>
        <p className="mb-4 line-clamp-2 text-[12.5px] text-body-text">
          {group.locations.map((l) => l.name.split(",")[0]).join(", ")}
        </p>
        <Link
          href={`/tien-ich/tim-goi-phu-hop/goi/${group.groupKey}`}
          className="group mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent"
        >
          Xem chi tiết
          <ArrowRightSmallIcon className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </Reveal>
  );
}

/** Điểm giữa 1 khoảng ngân sách, kẹp trong [rangeMin, rangeMax] thực tế của
 * dữ liệu gói — băng cuối "Trên 900K" có max: Infinity nên dùng rangeMax
 * thay thế; băng đầu "Dưới 400K" có min: 0 nên điểm giữa thô (200K) có thể
 * thấp hơn giá gói rẻ nhất thực tế, cần kẹp lại về rangeMin. Dùng khi bấm 1
 * trong 4 nút nhanh để thanh trượt tự nhảy về đúng vị trí tương ứng. */
function bandMidpoint(band: { min: number; max: number }, rangeMin: number, rangeMax: number): number {
  const hi = band.max === Infinity ? rangeMax : band.max;
  const raw = (band.min + hi) / 2;
  return Math.round(Math.min(rangeMax, Math.max(rangeMin, raw)));
}

/**
 * Thanh trượt ngân sách 1 điểm kéo — track nền + track đã tô màu (2 lớp div
 * tuyệt đối) đặt DƯỚI 1 <input type="range"> trong suốt để input lo toàn bộ
 * việc kéo/gõ phím/chạm (accessibility, mobile) còn 2 div lo phần hiển thị,
 * tránh phải tự viết lại xử lý con trỏ chuột/chạm vốn native input đã có.
 */
function BudgetSlider({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className="relative flex h-3 items-center">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-line" aria-hidden />
      <div
        className="absolute h-1.5 rounded-full bg-[#3B9EFF]"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-labelledby="pf-budget-label"
        aria-valuetext={formatVoPrice(value)}
        className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#3B9EFF] [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.28)] [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#3B9EFF] [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.28)]"
      />
    </div>
  );
}

export default function PlanFinderTool() {
  const allPlans = useMemo(() => getAllOfferedPlans(), []);
  const groupedPlans = useMemo(() => getGroupedPlans(), []);
  const [viewMode, setViewMode] = useState<"area" | "group">("area");
  const [areaSlug, setAreaSlug] = useState<string>("all");
  // `budgetKey` là nguồn sự thật DUY NHẤT cho logic lọc/gợi ý bên dưới, dù
  // khách chọn bằng thanh trượt hay 4 nút nhanh — cả 2 cách đều cập nhật nó
  // ngay khi tương tác, nên "Tìm gói phù hợp" luôn dùng đúng lựa chọn gần
  // nhất mà không cần thêm nhánh xử lý riêng. `budgetValue` chỉ phục vụ hiển
  // thị số tiền cụ thể trên thanh trượt; `budgetSource` chỉ phục vụ việc
  // sáng/tắt trạng thái "đang chọn" của 4 nút nhanh.
  const [budgetKey, setBudgetKey] = useState<BudgetBandKey>("400k-600k");
  const [budgetValue, setBudgetValue] = useState<number>(500_000);
  const [budgetSource, setBudgetSource] = useState<"quick" | "slider">("quick");
  const [submitted, setSubmitted] = useState(false);

  // Khoảng giá trị thanh trượt LẤY ĐỘNG từ giá thấp nhất/cao nhất thực tế
  // trong toàn bộ dữ liệu gói — không hardcode, tự đúng khi có gói giá khác.
  const priceRange = useMemo(() => {
    const prices = allPlans.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allPlans]);

  const handleQuickBudget = (key: BudgetBandKey) => {
    const band = BUDGET_BANDS.find((b) => b.key === key)!;
    setBudgetKey(key);
    setBudgetValue(bandMidpoint(band, priceRange.min, priceRange.max));
    setBudgetSource("quick");
    setSubmitted(false);
  };

  const handleSliderBudget = (value: number) => {
    setBudgetValue(value);
    setBudgetKey(bandForPrice(value));
    setBudgetSource("slider");
    setSubmitted(false);
  };

  const areaName = areaSlug === "all" ? null : AREAS.find((a) => a.slug === areaSlug)?.name;

  const filteredByArea = useMemo(
    () => (areaSlug === "all" ? allPlans : allPlans.filter((p) => p.area.slug === areaSlug)),
    [allPlans, areaSlug]
  );

  const exactMatches = useMemo(
    () => [...filteredByArea].filter((p) => isPriceInBand(p.price, budgetKey)).sort((a, b) => a.price - b.price),
    [filteredByArea, budgetKey]
  );

  const nearestInArea = useMemo(
    () => (exactMatches.length === 0 ? findNearestPlans(filteredByArea, budgetKey, 3) : []),
    [exactMatches.length, filteredByArea, budgetKey]
  );

  const otherAreaCandidates = useMemo(() => {
    if (exactMatches.length > 0 || areaSlug === "all") return [];
    return findNearestPlans(
      allPlans.filter((p) => p.area.slug !== areaSlug),
      budgetKey,
      3
    );
  }, [exactMatches.length, areaSlug, allPlans, budgetKey]);

  const bestAreaDistance = nearestInArea.length ? distanceToBand(nearestInArea[0].price, budgetKey) : Infinity;
  const bestOtherDistance = otherAreaCandidates.length
    ? distanceToBand(otherAreaCandidates[0].price, budgetKey)
    : Infinity;
  const showOtherAreaSuggestions = bestOtherDistance < bestAreaDistance;

  const handleReset = () => setSubmitted(false);

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ miễn phí"
          title="Tìm VPA theo nhu cầu"
          description="Chọn khu vực và ngân sách mong muốn — công cụ sẽ gợi ý ngay các gói văn phòng ảo phù hợp nhất trong hệ thống 23 chi nhánh MAX OFFICE."
        />

        {/* Toggle chế độ xem — độc lập với luồng lọc khu vực/ngân sách bên dưới. */}
        <div role="tablist" aria-label="Chế độ xem" className="mx-auto mb-8 flex max-w-[420px] rounded-full border border-line bg-white p-1">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "area"}
            onClick={() => setViewMode("area")}
            className={`flex-1 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
              viewMode === "area" ? "bg-primary text-white shadow-[0_4px_12px_rgba(21,101,192,0.28)]" : "text-body-text hover:text-primary"
            }`}
          >
            Xem theo khu vực
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "group"}
            onClick={() => setViewMode("group")}
            className={`flex-1 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
              viewMode === "group" ? "bg-primary text-white shadow-[0_4px_12px_rgba(21,101,192,0.28)]" : "text-body-text hover:text-primary"
            }`}
          >
            Xem theo gói
          </button>
        </div>

        {viewMode === "group" ? (
          <div>
            <p className="mb-6 text-center text-[14.5px] text-body-text">
              <strong className="text-navy">{groupedPlans.length} nhóm gói</strong> khác nhau trong toàn hệ
              thống — các chi nhánh có cùng tên gói, cùng giá và cùng tính năng được gộp chung 1 nhóm,
              sắp xếp theo giá tăng dần.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groupedPlans.map((g) => (
                <GroupCard key={g.groupKey} group={g} />
              ))}
            </div>
          </div>
        ) : (
        <>
        <Reveal className="mx-auto max-w-[720px] rounded-2xl border border-line bg-white p-7 sm:p-9">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="pf-area" className={labelClass}>
                Khu vực bạn quan tâm
              </label>
              <select
                id="pf-area"
                value={areaSlug}
                onChange={(e) => {
                  setAreaSlug(e.target.value);
                  setSubmitted(false);
                }}
                className={inputClass}
              >
                <option value="all">Tất cả khu vực</option>
                {AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* Thanh trượt ngân sách — lấp khoảng trống cột trái (vốn chỉ có
                  1 dropdown, thấp hơn hẳn cột phải) để 2 cột cao bằng nhau,
                  không đẩy tổng chiều cao cụm bộ lọc tăng lên. Là cách chọn
                  ngân sách THỨ 2 song song với 4 nút nhanh bên phải — xem
                  handleQuickBudget/handleSliderBudget để biết cách 2 nguồn
                  đồng bộ 2 chiều qua chung 1 `budgetKey`. */}
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-body-text">Hoặc kéo chọn mức cụ thể</span>
                  <span className="font-mono text-[13px] font-bold text-primary">{formatVoPrice(budgetValue)}</span>
                </div>
                <BudgetSlider
                  value={budgetValue}
                  min={priceRange.min}
                  max={priceRange.max}
                  onChange={handleSliderBudget}
                />
              </div>
            </div>
            <div>
              <label id="pf-budget-label" className={labelClass}>
                Ngân sách mong muốn/tháng
              </label>
              <div role="group" aria-labelledby="pf-budget-label" className="flex flex-wrap gap-2">
                {BUDGET_BANDS.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    aria-pressed={budgetSource === "quick" && budgetKey === b.key}
                    onClick={() => handleQuickBudget(b.key)}
                    className={pillClass(budgetSource === "quick" && budgetKey === b.key)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(220,53,48,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark"
          >
            Tìm gói phù hợp
          </button>
        </Reveal>

        {submitted && (
          <div className="mt-10">
            {exactMatches.length > 0 ? (
              <>
                <p className="mb-6 text-center text-[14.5px] text-body-text">
                  Tìm thấy <strong className="text-navy">{exactMatches.length} gói</strong> phù hợp
                  {areaName && (
                    <>
                      {" "}
                      tại <strong className="text-navy">{areaName}</strong>
                    </>
                  )}
                  , sắp xếp theo giá tăng dần.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {exactMatches.map((p) => (
                    <PlanCard key={`${p.locationSlug}-${p.planKey}`} plan={p} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <Reveal className="mx-auto max-w-[640px] rounded-2xl border-2 border-amber/40 bg-amber/8 p-6 text-center">
                  <p className="text-[15px] font-bold text-navy">
                    Chưa có gói khớp chính xác ngân sách bạn chọn tại {areaName ?? "khu vực này"}
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-body-text">
                    Dưới đây là các gói gần với ngân sách của bạn nhất.
                  </p>
                </Reveal>

                <p className="mt-9 mb-5 text-center text-[12.5px] font-bold tracking-[0.1em] text-body-text uppercase">
                  Gợi ý gần nhất{areaName && ` tại ${areaName}`}
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {nearestInArea.map((p) => (
                    <PlanCard key={`${p.locationSlug}-${p.planKey}`} plan={p} />
                  ))}
                </div>

                {showOtherAreaSuggestions && (
                  <>
                    <p className="mt-10 mb-5 text-center text-[12.5px] font-bold tracking-[0.1em] text-body-text uppercase">
                      Gợi ý tại khu vực khác gần ngân sách hơn
                    </p>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {otherAreaCandidates.map((p) => (
                        <PlanCard key={`${p.locationSlug}-${p.planKey}`} plan={p} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <div className="mt-9 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-[13px] font-bold text-body-text underline decoration-line underline-offset-4 hover:text-primary"
              >
                Tìm lại
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
}
