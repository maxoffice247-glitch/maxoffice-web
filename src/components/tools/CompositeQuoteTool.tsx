"use client";

import { useId, useMemo, useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import { PlusIcon, CloseIcon, DownloadIcon, ShareIcon, SpinnerIcon, PhoneIcon } from "../icons";
import { shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";
import { getAllOfferedPlans, formatVoPrice, type OfferedPlan } from "@/lib/planFinder";
import {
  resolveCompositeQuoteItem,
  getGpkdTierOptions,
  getAccountingGroupOptions,
  getAccountingRangeOptions,
  getCustomServiceReferencePrice,
  getChuKySoTierOptions,
  getHoaDonDienTuTierOptions,
  buildCompositeQuoteFilename,
  CUSTOM_SERVICE_META,
  MONTH_OPTIONS,
  type CompositeQuoteItem,
  type CustomServiceSlug,
  type MonthOption,
} from "@/lib/compositeQuote";
import type { QuoteLang } from "@/lib/quoteImageDictionary";
import {
  VIETQR_ACCOUNT_KEYS,
  DEFAULT_VIETQR_ACCOUNT_KEY,
  vietQrAccountLabel,
  buildQrNote,
  type VietQrAccountKey,
} from "@/lib/vietQr";

function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + "đ";
}

/**
 * Form "Tạo báo giá tổng hợp" — cho phép gộp NHIỀU dịch vụ khác nhau (VD:
 * Văn phòng ảo 1 chi nhánh + Thành lập doanh nghiệp) vào CÙNG 1 ảnh báo giá
 * PNG duy nhất, xuất qua POST /api/quote-image/tong-hop (xem route.tsx —
 * server tự tra giá lại từ key gửi lên, KHÔNG tin giá do form này hiển thị,
 * xem chú thích trong compositeQuote.ts).
 *
 * Thông tin khách hàng (tên/SĐT/tên công ty dự kiến) CHỈ tồn tại trong React
 * state của trang này — không có bất kỳ lệnh gọi API lead/CRM nào ở đây,
 * khác hẳn BookingFormLayout/ContactForm (submit thành lead thật). Đây là
 * điểm khác biệt cố ý, không phải thiếu sót.
 */

type ServiceTypeKey =
  | "van-phong-ao"
  | "thanh-lap-doanh-nghiep"
  | "ke-toan-thue"
  | "chu-ky-so"
  | "hoa-don-dien-tu"
  | CustomServiceSlug;

const SERVICE_TYPE_OPTIONS: { value: ServiceTypeKey; label: string }[] = [
  { value: "van-phong-ao", label: "Văn phòng ảo" },
  { value: "thanh-lap-doanh-nghiep", label: "Thành lập doanh nghiệp" },
  { value: "ke-toan-thue", label: "Kế toán & thuế" },
  { value: "chu-ky-so", label: "Chữ ký số" },
  { value: "hoa-don-dien-tu", label: "Hoá đơn điện tử" },
  { value: "van-phong-tron-goi", label: "Văn phòng trọn gói" },
  { value: "cho-ngoi-linh-dong", label: "Chỗ ngồi linh động" },
  { value: "phong-hop", label: "Phòng họp theo giờ" },
  { value: "khac", label: "Dịch vụ khác (tự nhập)" },
];

const MAX_ROWS = 12;

// Trivial, đọc thẳng từ servicesData.ts (2 gói GPKD, 3 nhóm + 9 mức kế toán,
// 3 mốc Chữ ký số + 10 mốc Hoá đơn điện tử) — không cần useMemo như
// getAllOfferedPlans() (lặp qua toàn bộ chi nhánh, xem bên dưới), gọi 1 lần
// ở module scope là đủ.
const GPKD_TIERS = getGpkdTierOptions();
const ACCOUNTING_GROUPS = getAccountingGroupOptions();
const ACCOUNTING_RANGES = getAccountingRangeOptions();
const CHU_KY_SO_TIERS = getChuKySoTierOptions();
const HOA_DON_DIEN_TU_TIERS = getHoaDonDienTuTierOptions();

let rowIdCounter = 0;
function nextRowId(): string {
  rowIdCounter += 1;
  return `row-${rowIdCounter}`;
}

type QuoteRow = {
  id: string;
  serviceType: ServiceTypeKey | "";
  locationSlug: string;
  planKey: string;
  /** Chỉ dùng cho Văn phòng ảo — kỳ hạn hợp đồng, quyết định "Tạm tính" (=
   * đơn giá × số tháng) và có tự động kèm ưu đãi dài hạn hay không (xem
   * compositeQuote.ts). Mặc định 12 — kỳ hạn phổ biến nhất khi tư vấn. */
  months: MonthOption;
  tier: "goi-1" | "goi-2";
  group: "A" | "B" | "C";
  rangeIndex: number;
  customLabel: string;
  customPrice: string;
  /** % VAT CHỈ dùng cho loại "custom" (tự nhập) — nhân viên tự chọn đúng
   * mức áp dụng thay vì mặc định cứng 10% như trước (xem compositeQuote.ts,
   * CompositeQuoteItem["custom"].vatRatePercent). */
  customVat: number;
  /** key trong CHU_KY_SO_TIERS/HOA_DON_DIEN_TU_TIERS — rỗng khi chưa chọn
   * loại dịch vụ tương ứng. */
  chuKySoTierKey: string;
  hoaDonTierKey: string;
};

function createEmptyRow(): QuoteRow {
  return {
    id: nextRowId(),
    serviceType: "",
    locationSlug: "",
    planKey: "",
    months: 12,
    tier: "goi-1",
    group: "A",
    rangeIndex: 0,
    customLabel: "",
    customPrice: "",
    customVat: 10,
    chuKySoTierKey: "",
    hoaDonTierKey: "",
  };
}

function firstPlanAt(allPlans: OfferedPlan[], locationSlug: string): string {
  return allPlans.find((p) => p.locationSlug === locationSlug)?.planKey ?? "";
}

/** Gán sẵn 1 lựa chọn hợp lệ ngay khi đổi loại dịch vụ của 1 dòng — để dòng
 * luôn sẵn sàng tạo báo giá được ngay, không rơi vào trạng thái nội bộ
 * "chưa chọn gì" dù select đã hiện giá trị đầu tiên. */
function applyServiceTypeDefaults(row: QuoteRow, type: ServiceTypeKey, firstLocationSlug: string, allPlans: OfferedPlan[]): QuoteRow {
  if (type === "van-phong-ao") {
    return {
      ...row,
      serviceType: type,
      locationSlug: firstLocationSlug,
      planKey: firstPlanAt(allPlans, firstLocationSlug),
      months: 12,
    };
  }
  if (type === "thanh-lap-doanh-nghiep") {
    return { ...row, serviceType: type, tier: "goi-1" };
  }
  if (type === "ke-toan-thue") {
    return { ...row, serviceType: type, group: "A", rangeIndex: 0 };
  }
  if (type === "chu-ky-so") {
    return { ...row, serviceType: type, chuKySoTierKey: CHU_KY_SO_TIERS[0]?.key ?? "" };
  }
  if (type === "hoa-don-dien-tu") {
    return { ...row, serviceType: type, hoaDonTierKey: HOA_DON_DIEN_TU_TIERS[0]?.key ?? "" };
  }
  return {
    ...row,
    serviceType: type,
    customLabel: "",
    customPrice: getCustomServiceReferencePrice(type),
    customVat: CUSTOM_SERVICE_META[type].vatRatePercent,
  };
}

function rowToItem(row: QuoteRow): CompositeQuoteItem | null {
  switch (row.serviceType) {
    case "van-phong-ao":
      return row.locationSlug && row.planKey
        ? { type: "van-phong-ao", locationSlug: row.locationSlug, planKey: row.planKey, months: row.months }
        : null;
    case "thanh-lap-doanh-nghiep":
      return { type: "thanh-lap-doanh-nghiep", tier: row.tier };
    case "ke-toan-thue":
      return { type: "ke-toan-thue", group: row.group, rangeIndex: row.rangeIndex };
    case "chu-ky-so":
      return row.chuKySoTierKey ? { type: "chu-ky-so", tierKey: row.chuKySoTierKey } : null;
    case "hoa-don-dien-tu":
      return row.hoaDonTierKey ? { type: "hoa-don-dien-tu", tierKey: row.hoaDonTierKey } : null;
    case "van-phong-tron-goi":
    case "cho-ngoi-linh-dong":
    case "phong-hop":
    case "khac":
      return row.customPrice.trim()
        ? {
            type: "custom",
            serviceSlug: row.serviceType,
            label: row.customLabel,
            price: row.customPrice,
            vatRatePercent: row.customVat,
          }
        : null;
    default:
      return null;
  }
}

const selectClass =
  "w-full appearance-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-navy transition-colors duration-200 focus:border-primary focus:outline-none";
const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";
const labelClass = "mb-1.5 block text-[12px] font-bold text-body-text";

export default function CompositeQuoteTool() {
  // getAllOfferedPlans() lặp qua toàn bộ chi nhánh + 7 hệ giá để dựng
  // danh sách gói đầy đủ — cùng hàm "nặng" đã có sẵn ở PlanFinderTool.tsx,
  // gọi qua useMemo(..., []) giống hệt cách đó thay vì module scope, để
  // không tính lại mỗi lần re-render.
  const allVoPlans = useMemo(() => getAllOfferedPlans(), []);
  const voLocations = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of allVoPlans) if (!seen.has(p.locationSlug)) seen.set(p.locationSlug, p.locationName);
    return Array.from(seen.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [allVoPlans]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  // Mặc định TẮT theo đúng yêu cầu — QR chuyển khoản là tuỳ chọn thêm vào
  // ảnh, không phải mặc định của mọi báo giá.
  const [showQr, setShowQr] = useState(false);
  // Mặc định đúng tài khoản đã dùng TRƯỚC khi có tính năng chọn nhiều tài
  // khoản — không đổi hành vi cũ nếu nhân viên không chủ động đổi lựa chọn.
  const [qrAccountKey, setQrAccountKey] = useState<VietQrAccountKey>(DEFAULT_VIETQR_ACCOUNT_KEY);
  // Nội dung chuyển khoản — null nghĩa là "chưa sửa tay", khi đó LUÔN hiện
  // đúng gợi ý tự sinh (cập nhật theo thông tin khách hàng mới nhất). Ngay
  // khi nhân viên gõ bất kỳ gì vào ô này (kể cả xoá trắng), chuyển sang chuỗi
  // thật và KHÔNG tự động ghi đè nữa — đúng yêu cầu "prefill gợi ý, sửa đè
  // được". CHỈ áp dụng cho QR "Dịch vụ MAX OFFICE" (xem route.tsx) — QR thu
  // hộ (Chữ ký số/Hoá đơn điện tử) luôn tự sinh, không có ô sửa riêng.
  const [qrNoteManual, setQrNoteManual] = useState<string | null>(null);
  // Ngôn ngữ của ẢNH XUẤT RA — mặc định "vi" (hành vi y hệt trước khi có
  // tính năng song ngữ nếu nhân viên không chủ động đổi). CHỈ ảnh hưởng ảnh
  // PNG cuối cùng, KHÔNG đổi ngôn ngữ form nhập liệu này (luôn tiếng Việt)
  // và KHÔNG đổi bản xem trước từng dòng bên dưới (preview luôn tiếng Việt).
  const [lang, setLang] = useState<QuoteLang>("vi");
  const [rows, setRows] = useState<QuoteRow[]>(() => [createEmptyRow()]);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canShare = useCanShareFiles();

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, createEmptyRow()]);
  };
  const removeRow = (id: string) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  };
  const updateRow = (id: string, patch: Partial<QuoteRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const changeServiceType = (id: string, type: ServiceTypeKey) => {
    const firstLocationSlug = voLocations[0]?.slug ?? "";
    setRows((prev) =>
      prev.map((r) => (r.id === id ? applyServiceTypeDefaults(r, type, firstLocationSlug, allVoPlans) : r))
    );
  };

  const items = useMemo(
    () => rows.map(rowToItem).filter((it): it is CompositeQuoteItem => it !== null),
    [rows]
  );
  const canSubmit = items.length > 0 && status !== "generating";

  // Gợi ý tự sinh — CÙNG logic ưu tiên Tên công ty > Tên khách > SĐT > mặc
  // định đang dùng ở server (buildQrNote() trong vietQr.ts, import thẳng từ
  // đó để không lặp lại logic ở 2 nơi dễ lệch nhau).
  const autoQrNote = useMemo(
    () => buildQrNote({ name: customerName, phone: customerPhone, companyName: customerCompany }),
    [customerName, customerPhone, customerCompany]
  );
  const qrNote = qrNoteManual ?? autoQrNote;

  const handleGenerate = async () => {
    if (items.length === 0) return;
    setStatus("generating");
    setErrorDetail(null);
    try {
      const customer = {
        name: customerName.trim() || undefined,
        phone: customerPhone.trim() || undefined,
        companyName: customerCompany.trim() || undefined,
      };
      const res = await fetch("/api/quote-image/tong-hop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, showQr, qrAccountKey, qrNote: qrNote.trim() || undefined, lang }),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Server trả về lỗi ${res.status} khi tạo ảnh báo giá.`);
      }
      const blob = await res.blob();
      const filename = buildCompositeQuoteFilename(customer);
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
      if (canShare && (await shareQuotePng(blob, filename, "Báo giá tổng hợp MAX OFFICE"))) {
        setStatus("idle");
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      link.click();
      // Trì hoãn revoke — thu hồi ngay có thể huỷ tải trên vài trình duyệt
      // (đặc biệt Safari) nếu việc tải chưa kịp bắt đầu đọc blob. Cùng kỹ
      // thuật đã dùng ở PlanDetailActions.tsx.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      setStatus("idle");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Công cụ nội bộ"
          title="Tạo báo giá tổng hợp"
          description="Chọn nhiều dịch vụ khác nhau, xuất ra 1 ảnh báo giá duy nhất để gửi khách hàng."
        />

        <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="mb-1 text-[15px] font-bold text-navy">Thông tin khách hàng (không bắt buộc)</h3>
            <p className="mb-4 text-[12.5px] text-body-text">
              Chỉ hiển thị trên ảnh báo giá xuất ra — KHÔNG được lưu vào hệ thống hay gửi thành lead.
            </p>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Tên khách hàng</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Số điện thoại</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="VD: 0901 234 567"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tên công ty dự kiến</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  placeholder="VD: Công ty TNHH ABC"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <h3 className="text-[15px] font-bold text-navy">Danh sách dịch vụ</h3>
            {rows.map((row, index) => (
              <QuoteRowEditor
                key={row.id}
                row={row}
                index={index}
                allVoPlans={allVoPlans}
                voLocations={voLocations}
                canRemove={rows.length > 1}
                onRemove={() => removeRow(row.id)}
                onChangeServiceType={(type) => changeServiceType(row.id, type)}
                onUpdate={(patch) => updateRow(row.id, patch)}
              />
            ))}
            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= MAX_ROWS}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-3 text-[13.5px] font-bold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary-tint disabled:pointer-events-none disabled:opacity-40"
            >
              <PlusIcon className="h-4 w-4" />
              Thêm dịch vụ
            </button>
            {rows.length >= MAX_ROWS && (
              <p className="text-center text-[12px] text-body-text">Đã đạt tối đa {MAX_ROWS} dòng dịch vụ.</p>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-line bg-bg-tint p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={showQr}
                onChange={(e) => setShowQr(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <span>
                <span className="block text-[13.5px] font-bold text-navy">Hiện mã QR chuyển khoản</span>
                <span className="block text-[12px] text-body-text">
                  Tắt mặc định. Khi bật, ảnh báo giá có thêm mã QR VietQR chuyển khoản, số tiền gợi ý điền sẵn là
                  tổng cộng tất cả dịch vụ đã tra được giá trong báo giá. Nếu báo giá có Chữ ký số/Hoá đơn điện tử,
                  ảnh sẽ tự thêm 1 mã QR thứ 2 riêng (tài khoản thu hộ cố định) — xem mục &ldquo;Chữ ký
                  số&rdquo;/&ldquo;Hoá đơn điện tử&rdquo; bên dưới.
                </span>
              </span>
            </label>
            {showQr && (
              <div className="mt-3.5 border-t border-line pt-3.5">
                <span className="mb-2 block text-[12px] font-bold text-body-text">
                  Chọn tài khoản nhận — chỉ chọn từ danh sách, không tự nhập được
                </span>
                <div className="flex flex-wrap gap-2">
                  {VIETQR_ACCOUNT_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={qrAccountKey === key}
                      onClick={() => setQrAccountKey(key)}
                      className={`rounded-full border-[1.5px] px-3.5 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                        qrAccountKey === key
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-white text-body-text hover:border-primary/40"
                      }`}
                    >
                      {vietQrAccountLabel(key)}
                    </button>
                  ))}
                </div>
                <div className="mt-3.5">
                  <label className={labelClass}>
                    Nội dung chuyển khoản — tự động gợi ý theo thông tin khách hàng, có thể sửa đè (VD khi khách đang
                    làm GPKD, chưa có tên công ty)
                  </label>
                  <input
                    type="text"
                    value={qrNote}
                    onChange={(e) => setQrNoteManual(e.target.value)}
                    className={`${inputClass} bg-white`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-line bg-bg-tint p-4">
            <span className="mb-2 block text-[12px] font-bold text-body-text">Ngôn ngữ xuất báo giá</span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "vi", label: "Tiếng Việt" },
                  { value: "en", label: "English" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={lang === opt.value}
                  onClick={() => setLang(opt.value)}
                  className={`rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                    lang === opt.value
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-body-text hover:border-primary/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(220,53,48,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-50"
          >
            {status === "generating" ? (
              <SpinnerIcon className="h-4 w-4" />
            ) : canShare ? (
              <ShareIcon className="h-4 w-4" />
            ) : (
              <DownloadIcon className="h-4 w-4" />
            )}
            {status === "generating" ? "Đang tạo báo giá..." : canShare ? "Tạo & chia sẻ báo giá" : "Tạo báo giá"}
          </button>
          {items.length === 0 && (
            <p className="mt-3 text-center text-[12.5px] text-body-text">
              Chọn ít nhất 1 dịch vụ hợp lệ để tạo báo giá.
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-center text-[12.5px] text-accent">
              Không tạo được ảnh báo giá, vui lòng thử lại.
              {errorDetail && <span className="block break-words text-[11px] text-body-text">({errorDetail})</span>}
            </p>
          )}
          {previewUrl && (
            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <p className="bg-bg-tint px-3 py-1.5 text-[11px] font-semibold text-body-text">Xem trước ảnh vừa tạo</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Xem trước báo giá tổng hợp vừa tạo" className="w-full" />
            </div>
          )}
        </Reveal>

        <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-body-text">
          <PhoneIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Cần hỗ trợ thêm về giá dịch vụ? Gọi hotline 089 8082 188.
        </p>
      </div>
    </section>
  );
}

function QuoteRowEditor({
  row,
  index,
  allVoPlans,
  voLocations,
  canRemove,
  onRemove,
  onChangeServiceType,
  onUpdate,
}: {
  row: QuoteRow;
  index: number;
  allVoPlans: OfferedPlan[];
  voLocations: { slug: string; name: string }[];
  canRemove: boolean;
  onRemove: () => void;
  onChangeServiceType: (type: ServiceTypeKey) => void;
  onUpdate: (patch: Partial<QuoteRow>) => void;
}) {
  const uid = useId();
  const preview = useMemo(() => {
    const item = rowToItem(row);
    if (!item) return null;
    const result = resolveCompositeQuoteItem(item);
    return "error" in result ? null : result;
  }, [row]);

  const plansAtLocation = useMemo(
    () => allVoPlans.filter((p) => p.locationSlug === row.locationSlug),
    [allVoPlans, row.locationSlug]
  );

  return (
    <div className="rounded-xl border border-line bg-bg-tint p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold text-body-text">Dịch vụ {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Xoá dòng dịch vụ này"
            className="flex h-7 w-7 items-center justify-center rounded-full text-body-text transition-colors duration-200 hover:bg-white hover:text-accent"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div>
        <label htmlFor={`${uid}-type`} className={labelClass}>
          Loại dịch vụ
        </label>
        <select
          id={`${uid}-type`}
          value={row.serviceType}
          onChange={(e) => onChangeServiceType(e.target.value as ServiceTypeKey)}
          className={`${selectClass} bg-white`}
        >
          <option value="" disabled>
            — Chọn loại dịch vụ —
          </option>
          {SERVICE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {row.serviceType === "van-phong-ao" && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-loc`} className={labelClass}>
              Chi nhánh
            </label>
            <select
              id={`${uid}-loc`}
              value={row.locationSlug}
              onChange={(e) => {
                const locationSlug = e.target.value;
                onUpdate({ locationSlug, planKey: firstPlanAt(allVoPlans, locationSlug) });
              }}
              className={`${selectClass} bg-white`}
            >
              {voLocations.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-plan`} className={labelClass}>
              Gói
            </label>
            <select
              id={`${uid}-plan`}
              value={row.planKey}
              onChange={(e) => onUpdate({ planKey: e.target.value })}
              className={`${selectClass} bg-white`}
            >
              {plansAtLocation.map((plan) => (
                <option key={plan.planKey} value={plan.planKey}>
                  {plan.planName} — {formatVoPrice(plan.price)}/tháng
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Số tháng ký hợp đồng</label>
            <div className="flex flex-wrap gap-2">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={row.months === m}
                  onClick={() => onUpdate({ months: m })}
                  className={`rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                    row.months === m
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-body-text hover:border-primary/40"
                  }`}
                >
                  {m} tháng
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {row.serviceType === "thanh-lap-doanh-nghiep" && (
        <div className="mt-3">
          <label className={labelClass}>Gói</label>
          <div className="flex flex-wrap gap-2">
            {GPKD_TIERS.map((t) => (
              <button
                key={t.tier}
                type="button"
                aria-pressed={row.tier === t.tier}
                onClick={() => onUpdate({ tier: t.tier })}
                className={`rounded-full border-[1.5px] px-3.5 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                  row.tier === t.tier
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-body-text hover:border-primary/40"
                }`}
              >
                {t.name} — {t.price}
              </button>
            ))}
          </div>
        </div>
      )}

      {row.serviceType === "ke-toan-thue" && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-group`} className={labelClass}>
              Nhóm loại hình
            </label>
            <select
              id={`${uid}-group`}
              value={row.group}
              onChange={(e) => onUpdate({ group: e.target.value as "A" | "B" | "C" })}
              className={`${selectClass} bg-white`}
            >
              {ACCOUNTING_GROUPS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-range`} className={labelClass}>
              Số hoá đơn/quý
            </label>
            <select
              id={`${uid}-range`}
              value={row.rangeIndex}
              onChange={(e) => onUpdate({ rangeIndex: Number(e.target.value) })}
              className={`${selectClass} bg-white`}
            >
              {ACCOUNTING_RANGES.map((r, i) => (
                <option key={r.range} value={i}>
                  {r.range} ({r.prices[row.group]}/tháng)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {row.serviceType === "chu-ky-so" && (
        <div className="mt-3">
          <label className={labelClass}>Thời hạn</label>
          <div className="flex flex-wrap gap-2">
            {CHU_KY_SO_TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={row.chuKySoTierKey === t.key}
                onClick={() => onUpdate({ chuKySoTierKey: t.key })}
                className={`rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                  row.chuKySoTierKey === t.key
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-body-text hover:border-primary/40"
                }`}
              >
                {t.duration} — {t.price}
              </button>
            ))}
          </div>
        </div>
      )}

      {row.serviceType === "hoa-don-dien-tu" && (
        <div className="mt-3">
          <label htmlFor={`${uid}-hddt`} className={labelClass}>
            Số lượng hoá đơn
          </label>
          <select
            id={`${uid}-hddt`}
            value={row.hoaDonTierKey}
            onChange={(e) => onUpdate({ hoaDonTierKey: e.target.value })}
            className={`${selectClass} bg-white`}
          >
            {HOA_DON_DIEN_TU_TIERS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.quantity} — {t.price}
              </option>
            ))}
          </select>
        </div>
      )}

      {(row.serviceType === "van-phong-tron-goi" ||
        row.serviceType === "cho-ngoi-linh-dong" ||
        row.serviceType === "phong-hop" ||
        row.serviceType === "khac") && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-label`} className={labelClass}>
              {row.serviceType === "khac" ? "Tên dịch vụ" : "Mô tả (không bắt buộc)"}
            </label>
            <input
              id={`${uid}-label`}
              type="text"
              value={row.customLabel}
              onChange={(e) => onUpdate({ customLabel: e.target.value })}
              placeholder={
                row.serviceType === "khac" ? "VD: Dịch vụ phiên dịch tại văn phòng" : CUSTOM_SERVICE_META[row.serviceType].name
              }
              className={`${inputClass} bg-white`}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-price`} className={labelClass}>
              Giá{CUSTOM_SERVICE_META[row.serviceType].unitLabel ? ` ${CUSTOM_SERVICE_META[row.serviceType].unitLabel}` : ""} —
              chưa có bảng giá cố định, tự nhập
            </label>
            <input
              id={`${uid}-price`}
              type="text"
              value={row.customPrice}
              onChange={(e) => onUpdate({ customPrice: e.target.value })}
              placeholder="VD: 4.500.000đ"
              className={`${inputClass} bg-white`}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-vat`} className={labelClass}>
              VAT (%) — tự chọn đúng mức áp dụng cho dịch vụ này
            </label>
            <input
              id={`${uid}-vat`}
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={row.customVat}
              onChange={(e) => onUpdate({ customVat: Number(e.target.value) })}
              className={`${inputClass} bg-white`}
            />
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-3 rounded-lg bg-white px-3.5 py-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-body-text">
              {preview.title}
              {preview.subtitle ? ` · ${preview.subtitle}` : ""}
            </span>
            <span className="font-mono font-bold text-primary">
              {preview.breakdown ? formatVnd(preview.breakdown.total) : preview.fallbackLabel}
            </span>
          </div>
          {preview.breakdown && (
            <div className="mt-1 text-[11.5px] text-body-text">
              Tạm tính {formatVnd(preview.breakdown.subtotal)} + VAT {preview.breakdown.vatRatePercent}% (
              {formatVnd(preview.breakdown.vatAmount)})
              {preview.breakdown.promo && <span className="text-amber-600"> · 🎁 tặng {preview.breakdown.promo.extraMonths} tháng</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
