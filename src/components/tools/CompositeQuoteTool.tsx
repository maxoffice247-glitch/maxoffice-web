"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import MoneyInput from "../MoneyInput";
import { PlusIcon, CloseIcon, DownloadIcon, ShareIcon, SpinnerIcon, PhoneIcon } from "../icons";
import { shareQuotePng, useCanShareFiles } from "@/lib/waitForImages";
import { AMENDMENT_SERVICES, AMENDMENT_VAT_PERCENT, calculateAmendmentCombo, formatAmendmentVnd } from "@/lib/setupFees";
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
  maxOfficeGroupTotal,
  resolveInstallment,
  INSTALLMENT_QR_SUFFIX,
  CUSTOM_SERVICE_META,
  MONTH_OPTIONS,
  type CompositeQuoteItem,
  type CustomServiceSlug,
  type MonthOption,
  type InstallmentStage,
} from "@/lib/compositeQuote";
import {
  oneTimeFeeCheckboxLabel,
  paymentScheduleText,
  DEPOSIT_LABEL,
  DEFAULT_BALANCE_CONDITION,
  BALANCE_CONDITION_MAX,
  type QuoteLang,
} from "@/lib/quoteImageDictionary";
import {
  VIETQR_ACCOUNT_KEYS,
  DEFAULT_VIETQR_ACCOUNT_KEY,
  vietQrAccountLabel,
  buildQrNote,
  buildInstallmentQrNote,
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
  | "sua-doi"
  | "ke-toan-thue"
  | "chu-ky-so"
  | "hoa-don-dien-tu"
  | CustomServiceSlug;

const SERVICE_TYPE_OPTIONS: { value: ServiceTypeKey; label: string }[] = [
  { value: "van-phong-ao", label: "Văn phòng ảo" },
  { value: "thanh-lap-doanh-nghiep", label: "Thành lập doanh nghiệp" },
  { value: "sua-doi", label: "Dịch vụ pháp lý sửa đổi" },
  { value: "ke-toan-thue", label: "Kế toán & thuế" },
  { value: "chu-ky-so", label: "Chữ ký số" },
  { value: "hoa-don-dien-tu", label: "Hoá đơn điện tử" },
  { value: "van-phong-tron-goi", label: "Văn phòng trọn gói" },
  { value: "cho-ngoi-linh-dong", label: "Chỗ ngồi linh động" },
  { value: "phong-hop", label: "Phòng họp theo giờ" },
  { value: "khac", label: "Dịch vụ khác (tự nhập)" },
];

const MAX_ROWS = 12;

/** ?loai= hợp lệ duy nhất cho công cụ này — link từ 2 trang bảng "Dịch vụ pháp lý sửa đổi" chọn sẵn loại dịch vụ. Giá trị
 * khác bị bỏ qua. Đọc qua useSyncExternalStore (snapshot server = null) để trang vẫn prerender tĩnh, như form Checklist. */
const LOAI_PRESETS = ["sua-doi"] as const;
type LoaiPreset = (typeof LOAI_PRESETS)[number];
function subscribeNoop() {
  return () => {};
}
function readLoaiPreset(): LoaiPreset | null {
  const v = new URLSearchParams(window.location.search).get("loai");
  return (LOAI_PRESETS as readonly string[]).includes(v ?? "") ? (v as LoaiPreset) : null;
}

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
  /** Chỉ dùng cho Văn phòng ảo khi GÓI có phụ phí thu một lần (addOn, VD "Bảng hiệu công ty" gói LITE): có thu khoản này không. MẶC ĐỊNH TÍCH (true) — bỏ
   * tích khi khách gia hạn hoặc đã có bảng hiệu. Đổi chi nhánh/gói thì đặt lại true. Gói không có phụ phí: bỏ qua. */
  voSignage: boolean;
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
  /** Slug các dịch vụ pháp lý sửa đổi đang tích (loại "sua-doi") — tick nhiều, combo tính ở server. */
  amendSlugs: string[];
  /** Ưu đãi combo cho nhóm sửa đổi — MẶC ĐỊNH TẮT (báo giá thực tế gần như luôn tính giá gốc). */
  amendCombo: boolean;
  /** Dạng ảnh của loại "sua-doi": "chon" = báo giá theo dịch vụ đã chọn (mặc định); "bang-gia" = bảng giá đầy đủ 13 dịch vụ. */
  amendMode: "chon" | "bang-gia";
};

function createEmptyRow(): QuoteRow {
  return {
    id: nextRowId(),
    serviceType: "",
    locationSlug: "",
    planKey: "",
    months: 12,
    voSignage: true,
    tier: "goi-1",
    group: "A",
    rangeIndex: 0,
    customLabel: "",
    customPrice: "",
    customVat: 10,
    chuKySoTierKey: "",
    hoaDonTierKey: "",
    amendSlugs: [],
    amendCombo: false,
    amendMode: "chon",
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
      voSignage: true,
    };
  }
  if (type === "thanh-lap-doanh-nghiep") {
    return { ...row, serviceType: type, tier: "goi-1" };
  }
  if (type === "sua-doi") {
    return { ...row, serviceType: type, amendSlugs: [], amendCombo: false, amendMode: "chon" };
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
        ? {
            type: "van-phong-ao",
            locationSlug: row.locationSlug,
            planKey: row.planKey,
            months: row.months,
            // Chỉ gửi khi bỏ tích; tích (mặc định) thì để server tự theo dữ liệu gói. Gói không có phụ phí: server bỏ qua `false`.
            ...(row.voSignage ? null : { includeSurcharge: false }),
          }
        : null;
    case "thanh-lap-doanh-nghiep":
      return { type: "thanh-lap-doanh-nghiep", tier: row.tier };
    case "sua-doi":
      if (row.amendMode === "bang-gia") return { type: "sua-doi-bang-gia" };
      return row.amendSlugs.length > 0 ? { type: "sua-doi", serviceSlugs: row.amendSlugs, applyCombo: row.amendCombo } : null;
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
  // Thanh toán theo đợt (đặt cọc) — MẶC ĐỊNH TẮT. Chỉ áp dụng nhóm "Dịch vụ MAX OFFICE" (ẩn khi báo giá không có nhóm này).
  const [installOn, setInstallOn] = useState(false);
  const [depositRaw, setDepositRaw] = useState("");
  const [installStage, setInstallStage] = useState<InstallmentStage>("deposit");
  const [balanceCondition, setBalanceCondition] = useState<string>(DEFAULT_BALANCE_CONDITION.vi);
  // Ngôn ngữ của ẢNH XUẤT RA — mặc định "vi" (hành vi y hệt trước khi có
  // tính năng song ngữ nếu nhân viên không chủ động đổi). CHỈ ảnh hưởng ảnh
  // PNG cuối cùng, KHÔNG đổi ngôn ngữ form nhập liệu này (luôn tiếng Việt)
  // và KHÔNG đổi bản xem trước từng dòng bên dưới (preview luôn tiếng Việt).
  const [lang, setLang] = useState<QuoteLang>("vi");
  // Dòng dịch vụ: khách chưa thao tác thì lấy dòng mặc định (có thể chọn sẵn loại "sua-doi" theo ?loai=); sau thao tác đầu
  // tiên chuyển sang state riêng. Không dùng setState trong effect để đọc URL (tránh render dư và lệch hydration).
  const urlPreset = useSyncExternalStore(subscribeNoop, readLoaiPreset, () => null);
  const defaultRows = useMemo<QuoteRow[]>(() => {
    const empty = createEmptyRow();
    return [urlPreset === "sua-doi" ? { ...empty, serviceType: "sua-doi" } : empty];
  }, [urlPreset]);
  const [userRows, setUserRows] = useState<QuoteRow[] | null>(null);
  const rows = userRows ?? defaultRows;
  const setRows = (updater: (prev: QuoteRow[]) => QuoteRow[]) => setUserRows((prev) => updater(prev ?? defaultRows));
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

  // Tổng nhóm MAX OFFICE (đã gồm VAT) — tính bằng CÙNG hàm với server. null = không có nhóm này (chỉ thu hộ/rỗng) -> ẩn tuỳ chọn đặt cọc.
  const maxOfficeTotal = useMemo(() => {
    const lines = items.flatMap((it) => {
      const r = resolveCompositeQuoteItem(it);
      return "error" in r ? [] : [r];
    });
    return maxOfficeGroupTotal(lines);
  }, [items]);
  const installAvailable = maxOfficeTotal != null;
  const depositNum = depositRaw ? Number(depositRaw) : NaN;
  const installResult =
    installOn && installAvailable
      ? resolveInstallment({ depositAmount: depositNum, installmentStage: installStage, balanceCondition }, maxOfficeTotal)
      : null;
  const installment = installResult && !("error" in installResult) ? installResult : null;
  // Đang bật mà số tiền chưa hợp lệ -> chặn tạo ảnh (không âm thầm quay về tổng đầy đủ).
  const installBlocking = installOn && installAvailable && !installment;
  const installError = installResult && "error" in installResult ? installResult.error : null;
  const canSubmit = items.length > 0 && status !== "generating" && !installBlocking;

  // Gợi ý tự sinh — CÙNG logic ưu tiên Tên công ty > Tên khách > SĐT > mặc
  // định đang dùng ở server (buildQrNote() trong vietQr.ts, import thẳng từ
  // đó để không lặp lại logic ở 2 nơi dễ lệch nhau).
  // Thanh toán theo đợt: mặc định thêm " dat coc" / " thanh toan con lai" ở cuối (vẫn sửa đè được như mọi gợi ý).
  const autoQrNote = installment
    ? buildInstallmentQrNote(
        { name: customerName, phone: customerPhone, companyName: customerCompany },
        INSTALLMENT_QR_SUFFIX[installment.stage]
      )
    : buildQrNote({ name: customerName, phone: customerPhone, companyName: customerCompany });
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
        body: JSON.stringify({
          customer,
          items,
          showQr,
          qrAccountKey,
          qrNote: qrNote.trim() || undefined,
          lang,
          ...(installment
            ? {
                depositAmount: installment.deposit,
                installmentStage: installment.stage,
                balanceCondition: installment.condition,
              }
            : null),
        }),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Server trả về lỗi ${res.status} khi tạo ảnh báo giá.`);
      }
      const blob = await res.blob();
      // Ảnh "Bảng giá đầy đủ" là tài liệu chung nên có tên file riêng (BG-BANG-GIA-SUA-DOI-DDMMYY.png).
      const filename = buildCompositeQuoteFilename(
        customer,
        new Date(),
        items.some((it) => it.type === "sua-doi-bang-gia") ? "bang-gia-sua-doi" : undefined,
        installment?.stage
      );
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
                amendmentTakenElsewhere={row.serviceType !== "sua-doi" && rows.some((r) => r.serviceType === "sua-doi")}
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

          {installAvailable && (
            <div className="mb-6 rounded-xl border border-line bg-bg-tint p-4">
              <label
                htmlFor="install-on"
                className="flex min-h-[44px] cursor-pointer items-start gap-3"
              >
                <input
                  id="install-on"
                  type="checkbox"
                  checked={installOn}
                  onChange={(e) => setInstallOn(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                />
                <span>
                  <span className="block text-[13.5px] font-bold text-navy">
                    Khách thanh toán theo đợt ({DEPOSIT_LABEL.vi.toLowerCase()})
                  </span>
                  <span className="block text-[12px] text-body-text">
                    Tắt mặc định. Chỉ áp dụng cho nhóm Dịch vụ MAX OFFICE (đã gồm VAT); nhóm thu hộ Chữ ký số/Hoá đơn điện tử giữ nguyên số tiền và mã QR riêng.
                  </span>
                </span>
              </label>

              {installOn && (
                <div className="mt-3.5 space-y-3.5 border-t border-line pt-3.5">
                  <div>
                    <span className={labelClass}>Báo giá này dùng cho</span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "deposit", label: `${DEPOSIT_LABEL.vi} (đợt 1)` },
                          { value: "balance", label: "Thanh toán phần còn lại (đợt 2)" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={installStage === opt.value}
                          onClick={() => setInstallStage(opt.value)}
                          className={`inline-flex min-h-[44px] items-center rounded-full border-[1.5px] px-4 text-[12.5px] font-bold transition-all duration-200 ${
                            installStage === opt.value
                              ? "border-primary bg-primary text-white"
                              : "border-line bg-white text-body-text hover:border-primary/40"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="install-deposit" className={labelClass}>
                      {installStage === "balance"
                        ? `Số tiền đã ${DEPOSIT_LABEL.vi.toLowerCase()} (đợt 1)`
                        : `Số tiền ${DEPOSIT_LABEL.vi.toLowerCase()} (đợt 1)`}
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative min-w-[180px] flex-1">
                        <MoneyInput
                          id="install-deposit"
                          value={depositRaw}
                          onChange={(raw) => setDepositRaw(raw.replace(/^0+(?=\d)/, "").slice(0, 12))}
                          placeholder="Ví dụ: 2.000.000"
                          aria-invalid={!!installError}
                          aria-describedby={installError ? "install-error" : undefined}
                          className="min-h-[44px] w-full rounded-xl border border-line bg-white px-3.5 py-2.5 pr-14 text-[16px] text-ink placeholder:text-[14px] placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none aria-[invalid=true]:border-accent sm:text-[13.5px]"
                        />
                        {depositRaw && (
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-body-text">
                            đồng
                          </span>
                        )}
                      </div>
                      {[30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDepositRaw(String(Math.round((maxOfficeTotal * pct) / 100)))}
                          className="inline-flex min-h-[44px] min-w-[64px] items-center justify-center rounded-full border-[1.5px] border-primary/40 bg-white px-4 text-[13px] font-bold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary-tint"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[12px] text-body-text">
                      Nút 30% / 50% tính trên tổng nhóm MAX OFFICE ({formatVnd(maxOfficeTotal)}, đã gồm VAT), làm tròn đồng.
                    </p>
                    {installError && (
                      <p id="install-error" role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
                        {installError}
                      </p>
                    )}
                    {installBlocking && !installError && (
                      <p className="mt-1.5 text-[12.5px] font-semibold text-accent">
                        Nhập số tiền {DEPOSIT_LABEL.vi.toLowerCase()} để tạo báo giá theo đợt (hoặc bỏ tích ô trên).
                      </p>
                    )}
                  </div>

                  {installStage === "deposit" && (
                    <div>
                      <label htmlFor="install-condition" className={labelClass}>
                        Điều kiện thanh toán phần còn lại (tuỳ chọn)
                      </label>
                      <input
                        id="install-condition"
                        type="text"
                        value={balanceCondition}
                        maxLength={BALANCE_CONDITION_MAX}
                        onChange={(e) => setBalanceCondition(e.target.value)}
                        autoComplete="off"
                        className="min-h-[44px] w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[16px] text-ink placeholder:text-[14px] placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none sm:text-[13.5px]"
                      />
                    </div>
                  )}

                  {installment && (
                    <div aria-live="polite" className="rounded-lg bg-white px-3.5 py-3 text-[13px]">
                      {(() => {
                        const t = paymentScheduleText("vi");
                        const rows =
                          installment.stage === "deposit"
                            ? [
                                [t.total, installment.total, false],
                                [t.depositStage1, installment.deposit, true],
                                [t.remaining, installment.balance, false],
                              ]
                            : [
                                [t.total, installment.total, false],
                                [t.depositPaid, installment.deposit, false],
                                [t.balanceDue, installment.balance, true],
                              ];
                        return rows.map(([label, amount, strong]) => (
                          <div key={String(label)} className="flex items-center justify-between gap-3 py-0.5">
                            <span className={strong ? "font-bold text-navy" : "text-body-text"}>{label as string}</span>
                            <span className={`font-mono ${strong ? "font-bold text-accent" : "font-bold text-ink"}`}>
                              {formatVnd(amount as number)}
                            </span>
                          </div>
                        ));
                      })()}
                      {showQr && (
                        <div className="mt-1.5 text-[11.5px] text-body-text">
                          Mã QR nhóm MAX OFFICE sẽ điền sẵn số tiền{" "}
                          {installment.stage === "deposit" ? DEPOSIT_LABEL.vi.toLowerCase() : "còn lại"}.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
  amendmentTakenElsewhere,
  onRemove,
  onChangeServiceType,
  onUpdate,
}: {
  row: QuoteRow;
  index: number;
  allVoPlans: OfferedPlan[];
  voLocations: { slug: string; name: string }[];
  canRemove: boolean;
  /** Đã có dòng khác chọn "Dịch vụ pháp lý sửa đổi" — chỉ được 1 dòng loại này (combo tính trong 1 danh sách duy nhất). */
  amendmentTakenElsewhere: boolean;
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
  // Phụ phí thu một lần của gói đang chọn (từ dữ liệu gói) — có thì hiện ô tích "Có làm bảng hiệu…".
  const signageFee = plansAtLocation.find((p) => p.planKey === row.planKey)?.oneTimeFee;

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
          {SERVICE_TYPE_OPTIONS.map((opt) => {
            const taken = opt.value === "sua-doi" && amendmentTakenElsewhere;
            return (
              <option key={opt.value} value={opt.value} disabled={taken}>
                {opt.label}
                {taken ? " (đã chọn ở dòng khác)" : ""}
              </option>
            );
          })}
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
                onUpdate({ locationSlug, planKey: firstPlanAt(allVoPlans, locationSlug), voSignage: true });
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
              onChange={(e) => onUpdate({ planKey: e.target.value, voSignage: true })}
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
          {signageFee && (
            <div className="sm:col-span-2">
              <label
                htmlFor={`${uid}-signage`}
                className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border-[1.5px] px-3 py-2.5 transition-colors duration-200 ${
                  row.voSignage ? "border-accent/50 bg-accent/5" : "border-line bg-white hover:border-primary/40"
                }`}
              >
                <input
                  id={`${uid}-signage`}
                  type="checkbox"
                  checked={row.voSignage}
                  onChange={(e) => onUpdate({ voSignage: e.target.checked })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                />
                <span className="text-[13px] leading-snug font-semibold text-navy">
                  {oneTimeFeeCheckboxLabel(signageFee)}
                  <span className="mt-0.5 block text-[12px] font-normal text-body-text">
                    Bỏ tích nếu khách gia hạn hoặc đã có bảng hiệu. Không tính ưu đãi tặng tháng cho khoản này.
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      {row.serviceType === "sua-doi" && (
        <AmendmentPicker
          selected={row.amendSlugs}
          applyCombo={row.amendCombo}
          mode={row.amendMode}
          onChange={onUpdate}
        />
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
              Tạm tính {formatVnd(preview.breakdown.subtotal)}
              {preview.breakdown.surcharge && ` (gồm phí thu 1 lần ${formatVnd(preview.breakdown.surcharge.amount)})`}{" "}
              + VAT {preview.breakdown.vatRatePercent}% ({formatVnd(preview.breakdown.vatAmount)})
              {preview.breakdown.promo && <span className="text-amber-600"> · 🎁 tặng {preview.breakdown.promo.extraMonths} tháng</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Phần chọn của loại "Dịch vụ pháp lý sửa đổi". Hai dạng ảnh: (1) "Báo giá theo dịch vụ đã chọn" — danh sách 13 ô tích (đọc cùng
 * nguồn AMENDMENT_SERVICES với bảng web), ô "Áp dụng ưu đãi combo" MẶC ĐỊNH TẮT (tắt: mọi dịch vụ tính giá gốc), tổng bên dưới theo
 * trạng thái ô tích và gợi ý "Bật combo để giảm X đồng" khi đang tắt mà chọn từ 2 dịch vụ (calculateAmendmentCombo — cùng hàm server
 * dùng); (2) "Bảng giá đầy đủ 13 dịch vụ" — không cần chọn. Mọi nút/dòng cao >= 44px để dễ chạm trên điện thoại.
 */
function AmendmentPicker({
  selected,
  applyCombo,
  mode,
  onChange,
}: {
  selected: string[];
  applyCombo: boolean;
  mode: "chon" | "bang-gia";
  onChange: (patch: Partial<QuoteRow>) => void;
}) {
  const uid = useId();
  const allSlugs = useMemo(() => AMENDMENT_SERVICES.map((s) => s.slug), []);
  const result = useMemo(() => calculateAmendmentCombo(selected, applyCombo), [selected, applyCombo]);
  const withCombo = useMemo(() => calculateAmendmentCombo(selected, true), [selected]);
  const finalBySlug = useMemo(() => new Map(result.items.map((it) => [it.slug, it])), [result]);
  const originalTotal = result.items.reduce((sum, it) => sum + it.price, 0);
  const discount = originalTotal - result.total; // 0 khi combo tắt
  const possibleSaving = originalTotal - withCombo.total; // số tiền giảm nếu BẬT combo

  const toggle = (slug: string, checked: boolean) => {
    // Giữ thứ tự theo bảng để danh sách gửi lên ổn định, không phụ thuộc thứ tự khách tích.
    const next = new Set(selected);
    if (checked) next.add(slug);
    else next.delete(slug);
    onChange({ amendSlugs: AMENDMENT_SERVICES.filter((s) => next.has(s.slug)).map((s) => s.slug) });
  };

  const pill = (active: boolean) =>
    `flex min-h-[44px] flex-1 items-center justify-center rounded-xl border-[1.5px] px-3 py-2 text-center text-[12.5px] leading-snug font-bold transition-colors duration-200 ${
      active ? "border-primary bg-primary text-white" : "border-line bg-white text-body-text hover:border-primary/40"
    }`;
  const smallBtn =
    "inline-flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-line bg-white px-4 text-[12.5px] font-bold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary-tint disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="mt-3">
      <span className={labelClass}>Dạng ảnh</span>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row" role="group" aria-label="Dạng ảnh báo giá sửa đổi">
        <button type="button" aria-pressed={mode === "chon"} onClick={() => onChange({ amendMode: "chon" })} className={pill(mode === "chon")}>
          Báo giá theo dịch vụ đã chọn
        </button>
        <button
          type="button"
          aria-pressed={mode === "bang-gia"}
          onClick={() => onChange({ amendMode: "bang-gia" })}
          className={pill(mode === "bang-gia")}
        >
          Bảng giá đầy đủ 13 dịch vụ (không tính tổng)
        </button>
      </div>

      {mode === "bang-gia" ? (
        <p className="rounded-lg bg-white px-3.5 py-3 text-[12.5px] leading-relaxed text-body-text">
          Ảnh in đủ 13 dịch vụ (tên, thời gian, giá chưa VAT, giá đã gồm VAT {AMENDMENT_VAT_PERCENT}%) để gửi khách hỏi giá. Không có
          tổng, combo hay mã QR, nên không cần chọn dịch vụ.
        </p>
      ) : (
        <fieldset>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <legend className="text-[12px] font-bold text-body-text">Chọn các dịch vụ cần báo giá (tích được nhiều dịch vụ)</legend>
            <div className="flex gap-2">
              <button type="button" onClick={() => onChange({ amendSlugs: allSlugs })} disabled={selected.length === allSlugs.length} className={smallBtn}>
                Chọn tất cả
              </button>
              <button type="button" onClick={() => onChange({ amendSlugs: [] })} disabled={selected.length === 0} className={smallBtn}>
                Bỏ chọn tất cả
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {AMENDMENT_SERVICES.map((svc) => {
              const checked = selected.includes(svc.slug);
              const calc = finalBySlug.get(svc.slug);
              const showCombo = checked && !!calc?.discounted;
              const id = `${uid}-${svc.slug}`;
              return (
                <label
                  key={svc.slug}
                  htmlFor={id}
                  className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border-[1.5px] bg-white px-3 py-2.5 transition-colors duration-200 ${
                    checked ? "border-primary bg-primary-tint/50" : "border-line hover:border-primary/40"
                  }`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggle(svc.slug, e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] leading-snug font-semibold text-navy">{svc.name}</span>
                    <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[12.5px] text-body-text">
                      {showCombo && <s className="text-body-text/70">{formatAmendmentVnd(svc.price)}</s>}
                      <span className={`font-mono font-bold ${showCombo ? "text-accent" : "text-primary"}`}>
                        {formatAmendmentVnd(showCombo && calc ? calc.finalPrice : svc.price)}
                      </span>
                      <span>· {svc.duration}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <label
            htmlFor={`${uid}-combo`}
            className={`mt-3 flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border-[1.5px] px-3 py-2.5 transition-colors duration-200 ${
              applyCombo ? "border-accent/50 bg-accent/5" : "border-line bg-white hover:border-primary/40"
            }`}
          >
            <input
              id={`${uid}-combo`}
              type="checkbox"
              checked={applyCombo}
              onChange={(e) => onChange({ amendCombo: e.target.checked })}
              className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
            />
            <span className="text-[13px] leading-snug font-semibold text-navy">
              Áp dụng ưu đãi combo (khi khách làm nhiều dịch vụ cùng lúc)
            </span>
          </label>

          <div aria-live="polite" className="mt-3 rounded-lg bg-white px-3.5 py-3 text-[13px]">
            {selected.length === 0 ? (
              <span className="text-body-text">Tích ít nhất 1 dịch vụ để xem tổng tạm tính.</span>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-body-text">{applyCombo ? "Tạm tính sau combo (chưa VAT)" : "Tạm tính (chưa VAT)"}</span>
                  <span className="font-mono text-[15px] font-bold text-primary">{formatAmendmentVnd(result.total)}</span>
                </div>
                {applyCombo && discount > 0 && (
                  <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 text-[12.5px]">
                    <span className="text-body-text">Giảm so với giá gốc ({formatAmendmentVnd(originalTotal)})</span>
                    <span className="font-mono font-bold text-accent">−{formatAmendmentVnd(discount)}</span>
                  </div>
                )}
                {applyCombo && discount === 0 && (
                  <div className="mt-1 text-[12.5px] text-body-text">Chọn từ 2 dịch vụ trở lên để được ưu đãi combo.</div>
                )}
                {!applyCombo && selected.length >= 2 && possibleSaving > 0 && (
                  <div className="mt-1 text-[12.5px] font-semibold text-amber-dark">
                    Bật combo để giảm {formatAmendmentVnd(possibleSaving).replace("đ", "")} đồng
                  </div>
                )}
              </>
            )}
          </div>
        </fieldset>
      )}
    </div>
  );
}
