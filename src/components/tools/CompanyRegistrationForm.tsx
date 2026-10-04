"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import MoneyInput from "../MoneyInput";
import PrintPdfButton from "../PrintPdfButton";
import BrandIcon from "../BrandIcon";
import BranchAddressCombobox from "./BranchAddressCombobox";
import FormErrorBoundary from "./FormErrorBoundary";
import { markProgrammaticScroll } from "@/lib/programmaticScroll";
import MembersEditor from "./MembersEditor";
import IdentitySection, { EMPTY_IDENTITY_UI, EMPTY_IDENTITY_UI_FORM, effectivePlaceChoice, effectivePlaceText, type IdentityUiState } from "./IdentitySection";
import type { BranchAddressGroup } from "@/lib/branchAddress";
import { ArrowRightSmallIcon, BuildingIcon, CheckCircleIcon, HomeIcon, UserIcon, UsersIcon } from "../icons";
import { trackEvent } from "@/lib/gtag";
import {
  EMPTY_SHARED,
  EMPTY_VALUES,
  FIELD_MAX,
  PRINT_MEMBERS_MARKER,
  cleanMemberRows,
  emptyValuesFor,
  formatThousands,
  memberPercent,
  membersCapitalTotal,
  REGISTRATION_CONFIG,
  REGISTRATION_TYPES,
  buildRegistrationSummary,
  isRegistrationType,
  validateRegistration,
  type RegistrationClean,
  type RegistrationErrors,
  type RegistrationShared,
  type RegistrationType,
  type RegistrationValues,
} from "@/lib/companyRegistration";

const ZALO_URL = "https://zalo.me/0898082188";

/** Icon nhỏ cho từng loại hình (dùng bộ icon sẵn có của dự án). */
const TYPE_ICONS: Record<RegistrationType, (props: { className?: string }) => ReactNode> = {
  "co-phan": BuildingIcon,
  "tnhh-2tv": UsersIcon,
  "tnhh-1tv": UserIcon,
  "ho-kinh-doanh": HomeIcon,
};

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink transition-colors duration-200 placeholder:text-[14px] placeholder:italic placeholder:text-body-text/55 sm:placeholder:text-[14.5px] focus:border-primary focus:outline-none aria-[invalid=true]:border-accent sm:text-[14.5px] print:hidden";
const labelClass = "mb-1.5 block text-[13px] font-bold text-navy";
const actionBtnClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-all duration-300 hover:-translate-y-0.5 print:hidden";

/** ?loai= đọc qua useSyncExternalStore (snapshot phía server = null) thay vì
 * useSearchParams: trang giữ nguyên prerender tĩnh, không cần Suspense/CSR
 * bailout, 4 thẻ chọn loại hình vẫn nằm trong HTML server (không nhảy bố cục
 * sau hydrate); khách vào bằng link ?loai= thì client chuyển thẳng vào form. */
function subscribeNoop() {
  return () => {};
}
function readTypeFromUrl(): RegistrationType | null {
  const v = new URLSearchParams(window.location.search).get("loai");
  return isRegistrationType(v) ? v : null;
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="print:hidden">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <>
            <span className="text-accent" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (bắt buộc)</span>
          </>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] leading-relaxed text-body-text">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint: boolean, error: boolean): string | undefined {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ");
  return ids || undefined;
}

/** Bọc error boundary: lỗi JS trong form chỉ làm hiện khung "Zalo/hotline", không làm mất cả khối. */
export default function CompanyRegistrationForm(props: { branchGroups: BranchAddressGroup[] }) {
  return (
    <FormErrorBoundary>
      <CompanyRegistrationFormInner {...props} />
    </FormErrorBoundary>
  );
}

function CompanyRegistrationFormInner({ branchGroups }: { branchGroups: BranchAddressGroup[] }) {
  const uid = useId();
  const urlType = useSyncExternalStore(subscribeNoop, readTypeFromUrl, () => null);

  // `picked`/`committedPick` chỉ có giá trị SAU khi khách thao tác; chưa thao
  // tác thì rơi về loại hình từ ?loai= (nếu có).
  const [picked, setPicked] = useState<RegistrationType | null>(null);
  const [committedPick, setCommittedPick] = useState<boolean | null>(null);
  const choice = picked ?? urlType;
  const committed = committedPick ?? urlType !== null;

  // Mỗi loại hình giữ bộ ô riêng (đổi qua lại không mất dữ liệu); các ô dùng
  // chung (họ tên, SĐT, email, website, đồng ý) nằm ở `shared`.
  // Cổ phần hiện sẵn 3 dòng cổ đông, TNHH 2 thành viên trở lên 2 dòng (emptyValuesFor).
  const [values, setValues] = useState<Record<RegistrationType, RegistrationValues>>({
    "co-phan": emptyValuesFor("co-phan"),
    "tnhh-2tv": emptyValuesFor("tnhh-2tv"),
    "tnhh-1tv": emptyValuesFor("tnhh-1tv"),
    "ho-kinh-doanh": emptyValuesFor("ho-kinh-doanh"),
  });
  const [shared, setShared] = useState<RegistrationShared>(EMPTY_SHARED);
  // Thông tin giấy tờ — mỗi loại hình nhớ riêng (đổi qua lại giữa "điền form" và "gửi Zalo" hay đổi
  // loại hình không mất dữ liệu). TNHH 1 thành viên / Hộ kinh doanh MẶC ĐỊNH là điền vào form.
  // CHỈ nằm trong state trang này: không storage/cookie/URL/analytics/log (xem IdentitySection.tsx).
  const [idStates, setIdStates] = useState<Record<RegistrationType, IdentityUiState>>({
    "co-phan": EMPTY_IDENTITY_UI,
    "tnhh-2tv": EMPTY_IDENTITY_UI,
    "tnhh-1tv": EMPTY_IDENTITY_UI_FORM,
    "ho-kinh-doanh": EMPTY_IDENTITY_UI_FORM,
  });
  const [fax, setFax] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");

  const sendingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const radioRefs = useRef<Partial<Record<RegistrationType, HTMLInputElement | null>>>({});
  const focusHeadingPending = useRef(false);
  const focusRadioPending = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // true trong đúng lượt sự kiện của phím mũi tên: trình duyệt bắn click lên radio khi mũi tên đổi lựa chọn
  // — click đó KHÔNG được coi là "xác nhận chọn loại hình" (chỉ Enter/Space/chạm/chuột mới xác nhận).
  const arrowNavRef = useRef(false);
  const scrolledFromUrlRef = useRef(false);

  useEffect(() => {
    if (focusHeadingPending.current && committed && headingRef.current) {
      focusHeadingPending.current = false;
      // preventScroll + scrollIntoView tường minh: tiêu đề form có scroll-mt nên không bị header cố định che,
      // chạy giống nhau trên iOS Safari (focus() tự cuộn khác nhau giữa các trình duyệt).
      headingRef.current.focus({ preventScroll: true });
      headingRef.current.scrollIntoView({ block: "start" });
    }
    if (focusRadioPending.current && !committed && choice && radioRefs.current[choice]) {
      focusRadioPending.current = false;
      radioRefs.current[choice]?.focus();
    }
  }, [committed, choice]);

  // Vào thẳng bằng link ?loai= HỢP LỆ (urlType khác null): cuộn tới đầu form MỘT lần. Chỉ chạy SAU sự kiện load và
  // khi trình duyệt rảnh (requestIdleCallback, dự phòng setTimeout) để không cộng vào Total Blocking Time. Không
  // cuộn nếu ?loai= sai/không có (urlType = null), nếu khách đã chọn thẻ/đổi loại hình (committedPick khác null →
  // effect bị huỷ), hoặc nếu trang đang không ở đầu (trình duyệt khôi phục vị trí cuộn / khách đã tự cuộn).
  useEffect(() => {
    if (!urlType || committedPick !== null || scrolledFromUrlRef.current) return;
    let cancelled = false;
    let idleHandle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      const heading = headingRef.current;
      if (cancelled || scrolledFromUrlRef.current || !heading || window.scrollY > 100) return;
      scrolledFromUrlRef.current = true;
      // prefers-reduced-motion: cuộn tức thì (html có scroll-behavior: smooth nên tắt tạm khi gọi).
      const html = document.documentElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const prev = html.style.scrollBehavior;
      if (reduce) html.style.scrollBehavior = "auto";
      // Cuộn do code: không được tính là "tương tác đầu tiên" (sẽ tải sớm Tidio/GA → tăng TBT). 1,6s phủ cả cuộn mượt.
      markProgrammaticScroll(reduce ? 400 : 1600);
      heading.scrollIntoView({ block: "start" });
      if (reduce) html.style.scrollBehavior = prev;
    };
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === "function") idleHandle = window.requestIdleCallback(run, { timeout: 2000 });
      else timer = setTimeout(run, 300);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [urlType, committedPick]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );

  const cfg = choice ? REGISTRATION_CONFIG[choice] : null;
  const cur = choice ? values[choice] : EMPTY_VALUES;

  function commit(type: RegistrationType) {
    setPicked(type);
    setCommittedPick(true);
    focusHeadingPending.current = true;
    setAnnounce(`Đã chọn ${REGISTRATION_CONFIG[type].label}. Form điền thông tin hiển thị bên dưới.`);
  }

  function changeType() {
    setPicked(choice);
    setCommittedPick(false);
    focusRadioPending.current = true;
    setStatus("idle");
    setErrorMsg("");
    setAnnounce("Chọn lại loại hình doanh nghiệp.");
  }

  function onRadioKeyDown(e: KeyboardEvent<HTMLInputElement>, type: RegistrationType) {
    // Mũi tên di chuyển + chọn radio (hành vi gốc của trình duyệt, giữ focus
    // trong nhóm để duyệt tiếp được). Enter/Space mới "xác nhận" và đưa focus
    // sang form.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(type);
    }
  }

  function setValue<K extends keyof RegistrationValues>(key: K, v: RegistrationValues[K]) {
    if (!choice) return;
    setValues((all) => ({ ...all, [choice]: { ...all[choice], [key]: v } }));
  }
  function setSharedValue<K extends keyof RegistrationShared>(key: K, v: RegistrationShared[K]) {
    setShared((s) => ({ ...s, [key]: v }));
  }

  const useBranch = shared.loaiDiaChi === "max-office";
  const selectedBranch = useBranch
    ? (branchGroups.flatMap((g) => g.options).find((o) => o.slug === shared.chiNhanh) ?? null)
    : null;

  // Địa chỉ gửi đi: chế độ MAX OFFICE lấy ĐÚNG địa chỉ chuẩn của chi nhánh đã
  // chọn (server đối chiếu lại); chế độ tự nhập lấy chữ khách gõ. Phần chữ đã
  // gõ (cur.diaChi) không bị xoá khi chuyển chế độ qua lại.
  const repName = shared.nguoiDaiDien.trim();
  const idState = choice ? idStates[choice] : EMPTY_IDENTITY_UI;
  const useIdForm = !!cfg?.idForm && idState.method === "form";
  // Họ tên trên giấy tờ: Hộ kinh doanh = chủ hộ; TNHH 1 thành viên = trùng người đại diện hoặc ô riêng.
  const ownerName = choice === "ho-kinh-doanh" || idState.sameAsRep ? repName : idState.info.hoTen.trim();

  // "Khác (tự nhập)" mà để trống → báo lỗi ở client (server không thể phân biệt với "để trống"
  // nên sẽ tự điền theo ngày cấp).
  const placeError =
    useIdForm && effectivePlaceChoice(idState) === "khac" && !idState.placeOther.trim() ? "Vui lòng nhập nơi cấp." : undefined;

  const current: RegistrationClean | null = choice
    ? {
        loai: choice,
        ...cur,
        diaChi: useBranch ? (selectedBranch?.address ?? "") : cur.diaChi,
        // Tích "người liên hệ là người đại diện": họ tên liên hệ = họ tên người đại diện (ô liên hệ bị ẩn,
        // phần khách đã gõ riêng vẫn giữ trong state để bỏ tích là hiện lại).
        tenLienHe: shared.lienHeLaDaiDien ? repName : shared.tenLienHe.trim(),
        lienHeLaDaiDien: shared.lienHeLaDaiDien,
        sdt: shared.sdt.trim(),
        email: shared.email.trim(),
        website: shared.website.trim(),
        consent: shared.consent,
        loaiDiaChi: shared.loaiDiaChi,
        chiNhanh: useBranch ? (selectedBranch?.slug ?? "") : "",
        nguoiDaiDien: repName,
        chucDanh: cfg?.hasTitle ? shared.chucDanh.trim() : "",
        hinhThucGiayTo: useIdForm ? "form" : "zalo",
        giayTo: useIdForm ? { ...idState.info, hoTen: ownerName, noiCap: effectivePlaceText(idState) } : undefined,
      }
    : null;

  const validation = current ? validateRegistration({ ...current }) : null;
  const errors: RegistrationErrors = showErrors && validation && !validation.ok ? validation.errors : {};
  // Sao chép: đầy đủ. Bản in/PDF: số CCCD che (4 số cuối).
  const summaryText = current ? buildRegistrationSummary(current, selectedBranch?.name) : "";
  const printText = current ? buildRegistrationSummary(current, selectedBranch?.name, "print") : "";
  // Bản in: tách tại dòng đánh dấu để chèn BẢNG cổ đông/thành viên (STT, họ tên, vốn góp, tỷ lệ) vào giữa.
  const printParts = printText.split("\n").slice(2).join("\n").split(PRINT_MEMBERS_MARKER);
  const printMembers = current && cfg?.membersLabel ? cleanMemberRows(current.thanhVien) : [];
  const printTotal = membersCapitalTotal(printMembers);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sendingRef.current || !current || !validation) return;
    setShowErrors(true);
    if (!validation.ok || placeError) {
      const ve: RegistrationErrors = validation.ok ? {} : validation.errors;
      const idErrs: Record<string, string | undefined> = { ...(ve.giayTo ?? {}), ...(placeError ? { noiCap: placeError } : {}) };
      // Thứ tự theo bố cục trang: thông tin đơn vị → người đại diện → liên hệ → nhóm giấy tờ → ô đồng ý (duy nhất).
      const order = ["tenDonVi", "diaChi", "nganhNghe", "nganhChinh", "von", "thanhVien", "nguoiDaiDien", "chucDanh", "tenLienHe", "sdt", "email", "website"] as const;
      const first = order.find((k) => ve[k] || (k === "thanhVien" && ve.thanhVienRows));
      if (first === "thanhVien") {
        const rowIdx = ve.thanhVienRows ? Number(Object.keys(ve.thanhVienRows)[0]) : 0;
        const fld = ve.thanhVienRows?.[rowIdx]?.von && !ve.thanhVienRows?.[rowIdx]?.ten ? "von" : "ten";
        document.getElementById(`${uid}-tv-${rowIdx}-${fld}`)?.focus();
      } else if (first) document.getElementById(`${uid}-${first}`)?.focus();
      else if (Object.keys(idErrs).length) {
        const idOrder = ["hoTen", "ngaySinh", "soCccd", "ngayCap", "noiCap", "diaChiLienHe"] as const;
        const k = idOrder.find((x) => idErrs[x]);
        if (k) document.getElementById(`${uid}-gt-${k}`)?.focus();
      } else if (ve.consent) document.getElementById(`${uid}-consent`)?.focus();
      return;
    }
    sendingRef.current = true;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit-company-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, fax }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMsg(j?.error || "Không gửi được hồ sơ lúc này.");
        setStatus("error");
        return;
      }
      setStatus("success");
      trackEvent("form_submit", { form_type: "checklist-thanh-lap", service: `Thành lập doanh nghiệp - ${REGISTRATION_CONFIG[validation.data.loai].label}` });
    } catch {
      setErrorMsg("Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.");
      setStatus("error");
    } finally {
      sendingRef.current = false;
    }
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = summaryText;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2500);
  }

  const handoffButtons = (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={copySummary}
        className={`${actionBtnClass} border-[1.5px] border-line bg-white text-navy hover:border-primary hover:text-primary`}
      >
        {copied ? "Đã sao chép" : "Sao chép nội dung"}
      </button>
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener"
        className={`${actionBtnClass} bg-[#0068FF] text-white hover:shadow-[0_10px_24px_rgba(0,104,255,0.3)]`}
      >
        <BrandIcon type="zalo" className="h-6 w-6" />
        Mở Zalo gửi ảnh VNeID
      </a>
    </div>
  );

  const idOf = (k: string) => `${uid}-${k}`;

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>

      {!committed && (
        <div role="radiogroup" aria-labelledby={`${uid}-legend`} aria-describedby={`${uid}-guide`}>
          <h3 id={`${uid}-legend`} className="text-center text-[17px] font-bold text-navy sm:text-[18px]">
            Bạn muốn thành lập loại hình nào?
          </h3>
          <p id={`${uid}-guide`} className="mx-auto mt-1.5 max-w-[520px] text-center text-[14px] leading-relaxed text-body-text">
            Hãy chọn loại hình doanh nghiệp của bạn để xem chi tiết hồ sơ cần chuẩn bị
          </p>
          {/* Mũi tên chỉ xuống nhấp nhô nhẹ — chỉ trang trí (aria-hidden, không nhận focus);
              reduced-motion: đứng yên. Khung cao cố định nên không gây CLS. */}
          <div className="flex h-10 items-center justify-center" aria-hidden="true">
            <svg
              className="animate-type-hint h-7 w-7 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <path d="M12 4v15M5.5 13l6.5 6.5 6.5-6.5" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {REGISTRATION_TYPES.map((t) => {
              const c = REGISTRATION_CONFIG[t];
              const Icon = TYPE_ICONS[t];
              const selected = choice === t;
              return (
                <label key={t} className="block cursor-pointer">
                  <input
                    ref={(el) => {
                      radioRefs.current[t] = el;
                    }}
                    type="radio"
                    name={`${uid}-loai-hinh`}
                    value={t}
                    checked={selected}
                    onChange={() => setPicked(t)}
                    onClick={() => {
                      // KHÔNG dựa vào e.detail: Safari/iOS (WebKit) gửi click chuyển tiếp từ <label> lên radio với
                      // detail = 0 nên form không bao giờ mở khi chạm vào thẻ. Chỉ bỏ qua click do phím mũi tên.
                      if (arrowNavRef.current) return;
                      commit(t);
                    }}
                    onKeyDown={(e) => {
                      if (e.key.startsWith("Arrow")) {
                        arrowNavRef.current = true;
                        // Click của mũi tên được bắn đồng bộ trong cùng lượt keydown → tới timeout 0 thì tắt cờ.
                        setTimeout(() => {
                          arrowNavRef.current = false;
                        }, 0);
                      }
                      onRadioKeyDown(e, t);
                    }}
                    className="peer sr-only"
                  />
                  <span className="relative flex h-full min-h-[44px] flex-col rounded-3xl border-2 border-primary/25 bg-white p-4 shadow-[0_4px_14px_rgba(21,101,192,0.10)] transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_14px_30px_rgba(220,53,48,0.18)] active:-translate-y-0.5 active:border-accent active:shadow-[0_10px_22px_rgba(220,53,48,0.16)] peer-checked:border-primary peer-checked:bg-primary-tint peer-checked:hover:border-primary peer-focus-visible:-translate-y-1 peer-focus-visible:border-accent peer-focus-visible:shadow-[0_14px_30px_rgba(220,53,48,0.18)] peer-focus-visible:ring-[3px] peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 motion-reduce:peer-focus-visible:translate-y-0 sm:p-5">
                    <span className="mb-3 flex items-start justify-between">
                      <span
                        aria-hidden="true"
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-primary ${selected ? "bg-white" : "bg-primary-tint"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {selected && (
                        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                      )}
                    </span>
                    <span className="text-[14.5px] font-bold leading-snug text-navy">{c.label}</span>
                    <span className="mt-1.5 text-[12.5px] leading-snug text-body-text">{c.shortDesc}</span>
                    <span aria-hidden="true" className="mt-auto flex items-center justify-end gap-1 pt-3 text-[12.5px] font-semibold text-primary">
                      {selected ? "Đã chọn" : "Bấm để chọn"}
                      <ArrowRightSmallIcon className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[12.5px] text-body-text">
            Dùng phím mũi tên để chọn, nhấn Enter để tiếp tục.
          </p>
          <p className="mt-1 text-center text-[12.5px] text-body-text">
            Không chọn được hoặc form không hiện? Nhắn Zalo hoặc gọi 089 8082 188, MAX OFFICE sẽ hỗ trợ ngay.
          </p>
        </div>
      )}

      {committed && cfg && current && status !== "success" && (
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-[19px] font-bold leading-snug text-navy focus:outline-none">
              {cfg.title}
            </h3>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                type="button"
                onClick={changeType}
                className="rounded-full border-[1.5px] border-line bg-white px-4 py-2 text-[13.5px] font-bold text-navy transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                Đổi loại hình
              </button>
            </div>
          </div>

          {/* Bản IN: chỉ hiện khi in/Tải PDF — dựng từ đúng dữ liệu đã điền (cùng
              hàm với "Sao chép nội dung", bỏ 2 dòng đầu vì tiêu đề form đã hiện sẵn), thay vì in các ô nhập (in ô nhập
              trống sẽ ra placeholder xám, không "sạch"). */}
          {printParts.map((part, idx) =>
            idx === 0 ? (
              <pre key="p0" className="hidden whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink print:block">
                {part}
              </pre>
            ) : (
              <div key={`p${idx}`} className="hidden print:block">
                {printMembers.length > 0 && cfg.membersLabel && (
                  <table className="my-2 w-full border-collapse text-[13px] text-ink">
                    <caption className="mb-1 text-left font-bold">{cfg.membersLabel}</caption>
                    <thead>
                      <tr>
                        <th className="border border-black/40 px-2 py-1 text-left">STT</th>
                        <th className="border border-black/40 px-2 py-1 text-left">Họ và tên</th>
                        <th className="border border-black/40 px-2 py-1 text-right">Vốn góp (đồng)</th>
                        <th className="border border-black/40 px-2 py-1 text-right">Tỷ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printMembers.map((m, k) => (
                        <tr key={k}>
                          <td className="border border-black/40 px-2 py-1">{k + 1}</td>
                          <td className="border border-black/40 px-2 py-1">{m.ten || "(chưa nhập họ tên)"}</td>
                          <td className="border border-black/40 px-2 py-1 text-right">{m.von ? formatThousands(m.von) : "—"}</td>
                          <td className="border border-black/40 px-2 py-1 text-right">{memberPercent(m.von, current.von) || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                    {printTotal > 0 && (
                      <tfoot>
                        <tr>
                          <td colSpan={2} className="border border-black/40 px-2 py-1 font-bold">
                            Tổng vốn góp
                          </td>
                          <td className="border border-black/40 px-2 py-1 text-right font-bold">{formatThousands(String(printTotal))}</td>
                          <td className="border border-black/40 px-2 py-1 text-right">
                            {current.von && Number(current.von) > 0 && printTotal !== Number(current.von)
                              ? "chưa bằng vốn điều lệ"
                              : ""}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                )}
                <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink">{part}</pre>
              </div>
            )
          )}

          <form noValidate onSubmit={onSubmit} className="space-y-6 print:hidden">
            <div className="space-y-4">
              <Field id={idOf("tenDonVi")} label={cfg.nameLabel} error={errors.tenDonVi}>
                <input
                  id={idOf("tenDonVi")}
                  type="text"
                  value={cur.tenDonVi}
                  onChange={(e) => setValue("tenDonVi", e.target.value)}
                  placeholder={cfg.namePlaceholder}
                  maxLength={FIELD_MAX.tenDonVi}
                  autoComplete="organization"
                  aria-invalid={!!errors.tenDonVi}
                  aria-describedby={describedBy(idOf("tenDonVi"), false, !!errors.tenDonVi)}
                  className={inputClass}
                />
              </Field>

              <Field
                id={idOf("diaChi")}
                label="Địa chỉ"
                error={errors.diaChi}
                hint={
                  useBranch ? (
                    <>
                      Địa chỉ MAX OFFICE đi kèm dịch vụ văn phòng ảo, nhân viên sẽ tư vấn gói phù hợp.{" "}
                      <Link href="/bang-gia" target="_blank" className="font-semibold text-primary underline underline-offset-2">
                        Xem bảng giá
                      </Link>
                    </>
                  ) : (
                    <>
                      Chưa có địa chỉ trụ sở?{" "}
                      <Link href="/dia-diem" target="_blank" className="font-semibold text-primary underline underline-offset-2">
                        Xem địa chỉ văn phòng ảo MAX OFFICE
                      </Link>
                    </>
                  )
                }
              >
                <div role="radiogroup" aria-label="Cách cung cấp địa chỉ" className="mb-3 flex flex-col gap-2 sm:flex-row">
                  {(
                    [
                      ["max-office", "Dùng địa chỉ MAX OFFICE"],
                      ["khac", "Tự nhập địa chỉ khác"],
                    ] as const
                  ).map(([val, text]) => (
                    <label key={val} className="block flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`${uid}-loai-dia-chi`}
                        value={val}
                        checked={shared.loaiDiaChi === val}
                        onChange={() => setSharedValue("loaiDiaChi", val)}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-[44px] items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-4 py-2.5 text-[14px] font-semibold text-navy transition-colors duration-200 hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary-tint peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                        <span
                          aria-hidden="true"
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                            shared.loaiDiaChi === val ? "border-primary" : "border-line"
                          }`}
                        >
                          {shared.loaiDiaChi === val && <span className="h-2 w-2 rounded-full bg-primary" />}
                        </span>
                        {text}
                      </span>
                    </label>
                  ))}
                </div>
                {useBranch ? (
                  <BranchAddressCombobox
                    id={idOf("diaChi")}
                    groups={branchGroups}
                    value={shared.chiNhanh}
                    onChange={(slug) => setSharedValue("chiNhanh", slug)}
                    invalid={!!errors.diaChi}
                    describedBy={describedBy(idOf("diaChi"), true, !!errors.diaChi)}
                  />
                ) : (
                  <textarea
                    id={idOf("diaChi")}
                    rows={2}
                    value={cur.diaChi}
                    onChange={(e) => setValue("diaChi", e.target.value)}
                    placeholder="Ví dụ: Số 10 Sông Thao, Phường Tân Sơn Hoà, Tp. Hồ Chí Minh, Việt Nam"
                    maxLength={FIELD_MAX.diaChi}
                    autoComplete="street-address"
                    aria-invalid={!!errors.diaChi}
                    aria-describedby={describedBy(idOf("diaChi"), true, !!errors.diaChi)}
                    className={inputClass}
                  />
                )}
              </Field>

              <Field id={idOf("nganhNghe")} label="Ngành nghề kinh doanh" error={errors.nganhNghe}>
                <textarea
                  id={idOf("nganhNghe")}
                  rows={3}
                  value={cur.nganhNghe}
                  onChange={(e) => setValue("nganhNghe", e.target.value)}
                  placeholder="Ví dụ: Bán buôn thực phẩm; Dịch vụ quảng cáo; Tư vấn quản lý"
                  maxLength={FIELD_MAX.nganhNghe}
                  aria-invalid={!!errors.nganhNghe}
                  aria-describedby={describedBy(idOf("nganhNghe"), false, !!errors.nganhNghe)}
                  className={inputClass}
                />
              </Field>

              <Field id={idOf("nganhChinh")} label={cfg.industryMainLabel} error={errors.nganhChinh}>
                <input
                  id={idOf("nganhChinh")}
                  type="text"
                  value={cur.nganhChinh}
                  onChange={(e) => setValue("nganhChinh", e.target.value)}
                  placeholder="Chọn 1 trong các ngành ở trên"
                  maxLength={FIELD_MAX.nganhChinh}
                  aria-invalid={!!errors.nganhChinh}
                  aria-describedby={describedBy(idOf("nganhChinh"), false, !!errors.nganhChinh)}
                  className={inputClass}
                />
              </Field>

              <Field id={idOf("von")} label={cfg.capitalLabel} error={errors.von}>
                <div className="relative">
                  <MoneyInput
                    id={idOf("von")}
                    value={cur.von}
                    onChange={(raw) => setValue("von", raw.slice(0, FIELD_MAX.von))}
                    placeholder="Ví dụ: 1.000.000.000 đồng"
                    aria-invalid={!!errors.von}
                    aria-describedby={describedBy(idOf("von"), false, !!errors.von)}
                    className={`${inputClass} pr-16`}
                  />
                  {cur.von && (
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13.5px] text-body-text">
                      đồng
                    </span>
                  )}
                </div>
              </Field>

              {cfg.membersLabel && (
                <MembersEditor
                  uid={uid}
                  cfg={cfg}
                  rows={cur.thanhVien}
                  onChange={(rows) => setValue("thanhVien", rows)}
                  vonDieuLe={cur.von}
                  error={errors.thanhVien}
                  rowErrors={errors.thanhVienRows}
                />
              )}
            </div>

            {/* Người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ) — đứng TRƯỚC nhóm liên hệ; ô tích
                "người liên hệ chính là người đại diện" nằm ở nhóm liên hệ ngay bên dưới. */}
            <div className="space-y-4">
              <Field
                id={idOf("nguoiDaiDien")}
                label={cfg.representativeLabel}
                required={shared.lienHeLaDaiDien}
                error={errors.nguoiDaiDien}
                hint="Thông tin này cần để soạn hồ sơ."
              >
                <input
                  id={idOf("nguoiDaiDien")}
                  type="text"
                  value={shared.nguoiDaiDien}
                  onChange={(e) => setSharedValue("nguoiDaiDien", e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  maxLength={FIELD_MAX.nguoiDaiDien}
                  autoComplete="off"
                  aria-required={shared.lienHeLaDaiDien}
                  aria-invalid={!!errors.nguoiDaiDien}
                  aria-describedby={describedBy(idOf("nguoiDaiDien"), true, !!errors.nguoiDaiDien)}
                  className={inputClass}
                />
              </Field>

              {cfg.hasTitle && (
                <Field id={idOf("chucDanh")} label="Chức danh (tuỳ chọn)" error={errors.chucDanh}>
                  {/* Ô gõ tự do + gợi ý (datalist) — KHÔNG phải danh sách chọn cố định, và không nêu quy
                      định pháp lý nào vì chức danh cho phép khác nhau theo loại hình. */}
                  <input
                    id={idOf("chucDanh")}
                    type="text"
                    list={`${idOf("chucDanh")}-goi-y`}
                    value={shared.chucDanh}
                    onChange={(e) => setSharedValue("chucDanh", e.target.value)}
                    placeholder="Ví dụ: Giám đốc"
                    maxLength={FIELD_MAX.chucDanh}
                    autoComplete="off"
                    aria-invalid={!!errors.chucDanh}
                    aria-describedby={describedBy(idOf("chucDanh"), false, !!errors.chucDanh)}
                    className={inputClass}
                  />
                  <datalist id={`${idOf("chucDanh")}-goi-y`}>
                    <option value="Giám đốc" />
                    <option value="Tổng giám đốc" />
                  </datalist>
                </Field>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-ink">
                <input
                  id={idOf("lienHeLaDaiDien")}
                  type="checkbox"
                  checked={shared.lienHeLaDaiDien}
                  onChange={(e) => setSharedValue("lienHeLaDaiDien", e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                    shared.lienHeLaDaiDien ? "border-primary bg-primary text-white" : "border-line text-transparent"
                  }`}
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                <span>
                  {cfg.hasTitle
                    ? "Người liên hệ chính là người đại diện (không cần điền lại)"
                    : "Người liên hệ chính là chủ hộ kinh doanh (không cần điền lại)"}
                </span>
              </label>

              {!shared.lienHeLaDaiDien && (
                <Field id={idOf("tenLienHe")} label="Họ tên người liên hệ" required error={errors.tenLienHe}>
                  <input
                    id={idOf("tenLienHe")}
                    type="text"
                    value={shared.tenLienHe}
                    onChange={(e) => setSharedValue("tenLienHe", e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    maxLength={FIELD_MAX.tenLienHe}
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!errors.tenLienHe}
                    aria-describedby={describedBy(idOf("tenLienHe"), false, !!errors.tenLienHe)}
                    className={inputClass}
                  />
                </Field>
              )}

              <Field id={idOf("sdt")} label="SĐT đăng ký" required error={errors.sdt}>
                <input
                  id={idOf("sdt")}
                  type="tel"
                  inputMode="tel"
                  value={shared.sdt}
                  onChange={(e) => setSharedValue("sdt", e.target.value)}
                  placeholder="Ví dụ: 0901 234 567"
                  maxLength={FIELD_MAX.sdt}
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={!!errors.sdt}
                  aria-describedby={describedBy(idOf("sdt"), false, !!errors.sdt)}
                  className={inputClass}
                />
              </Field>

              <Field id={idOf("email")} label="Email (nếu có)" error={errors.email}>
                <input
                  id={idOf("email")}
                  type="email"
                  inputMode="email"
                  value={shared.email}
                  onChange={(e) => setSharedValue("email", e.target.value)}
                  placeholder="Ví dụ: tencongty@gmail.com"
                  maxLength={FIELD_MAX.email}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy(idOf("email"), false, !!errors.email)}
                  className={inputClass}
                />
              </Field>

              {cfg.hasWebsite && (
                <Field id={idOf("website")} label="Website (nếu có)" error={errors.website}>
                  <input
                    id={idOf("website")}
                    type="text"
                    inputMode="url"
                    value={shared.website}
                    onChange={(e) => setSharedValue("website", e.target.value)}
                    placeholder="Ví dụ: www.tencongty.com"
                    maxLength={FIELD_MAX.website}
                    autoComplete="url"
                    aria-invalid={!!errors.website}
                    aria-describedby={describedBy(idOf("website"), false, !!errors.website)}
                    className={inputClass}
                  />
                </Field>
              )}
            </div>

            {/* Khung giấy tờ tuỳ thân (VNeID) — đặt SAU khối người đại diện (họ tên chủ hộ/chủ sở hữu
                lấy từ khối đó) và trước ô đồng ý duy nhất ở cuối form. */}
            <IdentitySection
              uid={uid}
              cfg={cfg}
              isHousehold={choice === "ho-kinh-doanh"}
              state={idState}
              onChange={(next) => choice && setIdStates((all) => ({ ...all, [choice]: next }))}
              repName={repName}
              errors={{ ...(errors.giayTo ?? {}), ...(showErrors && placeError ? { noiCap: placeError } : {}) }}
              methodError={errors.hinhThucGiayTo}
            />

            {/* Honeypot: người thật không thấy/không điền; bot tự điền mọi ô → server bỏ qua lặng lẽ. */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={idOf("fax")}>Fax</label>
              <input
                id={idOf("fax")}
                type="text"
                name="fax"
                tabIndex={-1}
                autoComplete="off"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
              />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-ink">
                <input
                  id={idOf("consent")}
                  type="checkbox"
                  checked={shared.consent}
                  onChange={(e) => setSharedValue("consent", e.target.checked)}
                  aria-required="true"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${idOf("consent")}-err` : undefined}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                    shared.consent ? "border-primary bg-primary text-white" : errors.consent ? "border-accent text-transparent" : "border-line text-transparent"
                  }`}
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                <span>
                  {/* Ô đồng ý DUY NHẤT: đang điền thông tin giấy tờ vào form thì câu chữ nêu rõ giấy tờ tuỳ thân. */}
                  {useIdForm
                    ? "Tôi đồng ý để MAX OFFICE sử dụng thông tin này, kể cả thông tin giấy tờ tuỳ thân tôi cung cấp, để liên hệ và soạn hồ sơ thành lập"
                    : "Tôi đồng ý để MAX OFFICE sử dụng thông tin này để liên hệ và soạn hồ sơ thành lập"}{" "}
                  <Link href="/chinh-sach-bao-mat" target="_blank" className="font-semibold text-primary underline underline-offset-2">
                    (Chính sách bảo mật)
                  </Link>
                  <span className="text-accent" aria-hidden="true">
                    {" "}
                    *
                  </span>
                  <span className="sr-only"> (bắt buộc)</span>
                </span>
              </label>
              {errors.consent && (
                <p id={`${idOf("consent")}-err`} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
                  {errors.consent}
                </p>
              )}
            </div>

            {status === "error" && (
              <div role="alert" className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13.5px] leading-relaxed text-ink">
                <p className="font-bold text-accent">Chưa gửi được hồ sơ.</p>
                <p className="mt-1">
                  {errorMsg}{" "}
                  Bạn có thể bấm &ldquo;Gửi hồ sơ&rdquo; thử lại, hoặc dùng 2 nút bên dưới để gửi trực tiếp qua Zalo.
                </p>
              </div>
            )}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className={`${actionBtnClass} bg-primary text-white hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60`}
              >
                {status === "sending" ? "Đang gửi..." : "Gửi hồ sơ"}
              </button>
              <PrintPdfButton />
            </div>

            {status === "error" && <div className="border-t border-line pt-5">{handoffButtons}</div>}
          </form>
        </div>
      )}

      {committed && status === "success" && (
        <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-8 text-center sm:p-10">
          <Image
            src="/images/mascot/linh-vat-max-thich-qua.png"
            alt=""
            width={140}
            height={140}
            className="mb-4 h-[120px] w-auto object-contain"
          />
          <h3 ref={successRef} tabIndex={-1} className="mb-2.5 text-[20px] font-bold text-navy focus:outline-none">
            Cảm ơn bạn! MAX OFFICE đã nhận được hồ sơ.
          </h3>
          <p className="mb-6 max-w-[460px] text-[14.5px] leading-relaxed text-body-text">
            Bước cuối: gửi ảnh VNeID qua Zalo để MAX OFFICE lên hồ sơ. Bạn cũng có thể sao chép nội dung vừa điền để gửi kèm.
          </p>
          {handoffButtons}
        </div>
      )}
    </div>
  );
}
