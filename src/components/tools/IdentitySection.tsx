"use client";

import type { ReactNode } from "react";
import { CheckCircleIcon, ChevronDownIcon } from "../icons";
import {
  IDENTITY_MAX,
  formatDateInput,
  type IdMethod,
  type IdentityInfo,
  type RegistrationTypeConfig,
} from "@/lib/companyRegistration";
import { ISSUE_PLACE_BCA, ISSUE_PLACE_CSQLHC, choiceFromPlace, placeFromChoice, suggestIssuePlace, type PlaceChoice } from "@/lib/issuePlace";

/**
 * Khung "giấy tờ tuỳ thân" của form Hồ sơ thành lập doanh nghiệp.
 *
 * - Loại hình thường (Cổ phần, TNHH 2 thành viên trở lên): khung lưu ý VNeID (gửi ảnh qua Zalo).
 * - CHỈ TNHH 1 thành viên / Hộ kinh doanh (cfg.idForm): MẶC ĐỊNH là điền thông tin trên
 *   CCCD/VNeID trực tiếp vào form (nhóm ô bên dưới); lựa chọn thay thế là gửi ảnh VNeID qua
 *   Zalo riêng (ẩn nhóm ô, không bắt buộc gì thêm). Đồng ý sử dụng thông tin nằm ở ô đồng ý
 *   DUY NHẤT cuối form (CompanyRegistrationForm), không còn ô đồng ý riêng ở đây.
 *
 * BẢO MẬT: component này KHÔNG giữ giá trị nào — mọi giá trị nằm trong state của form
 * cha (chỉ trong bộ nhớ trang). Không localStorage/sessionStorage/cookie/URL, không
 * analytics, không console. Mọi ô tắt autocomplete để trình duyệt không lưu/gợi ý lại.
 */
export type IdentityUiState = {
  method: IdMethod;
  info: IdentityInfo;
  /** TNHH 1 thành viên: chủ sở hữu trùng người đại diện theo pháp luật. */
  sameAsRep: boolean;
  /** Khách đã TỰ đổi ô "Nơi cấp" — khi đó KHÔNG ghi đè theo ngày cấp nữa (cho tới khi bấm "Đặt lại theo ngày cấp"). */
  placeManual: boolean;
  /** Lựa chọn của khách (chỉ có nghĩa khi placeManual = true). */
  placeChoice: PlaceChoice;
  /** Nội dung gõ tay khi chọn "Khác (tự nhập)" — giữ lại kể cả khi đổi lựa chọn. */
  placeOther: string;
};

/** Lựa chọn nơi cấp ĐANG HIỆU LỰC: khách đã tự đổi thì theo khách, ngược lại tự suy ra từ ngày cấp
 * (tính lại mỗi lần render, không cần effect/state phụ). */
export function effectivePlaceChoice(state: IdentityUiState): PlaceChoice {
  return state.placeManual ? state.placeChoice : choiceFromPlace(suggestIssuePlace(state.info.ngayCap, state.info.ngaySinh));
}

/** Chuỗi "Nơi cấp" sẽ gửi đi. */
export function effectivePlaceText(state: IdentityUiState): string {
  return placeFromChoice(effectivePlaceChoice(state), state.placeOther);
}

export const EMPTY_IDENTITY_UI: IdentityUiState = {
  method: "zalo",
  info: {
    hoTen: "",
    gioiTinh: "",
    ngaySinh: "",
    soCccd: "",
    ngayCap: "",
    noiCap: "",
    diaChiLienHe: "",
  },
  sameAsRep: false,
  placeManual: false,
  placeChoice: "",
  placeOther: "",
};

/** Trạng thái ban đầu của loại hình có `idForm`: mặc định điền thông tin vào form. */
export const EMPTY_IDENTITY_UI_FORM: IdentityUiState = { ...EMPTY_IDENTITY_UI, method: "form" };

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink transition-colors duration-200 placeholder:text-[14px] placeholder:italic placeholder:text-body-text/55 sm:placeholder:text-[14.5px] focus:border-primary focus:outline-none aria-[invalid=true]:border-accent read-only:bg-bg-tint read-only:text-body-text sm:text-[14.5px] print:hidden";
const labelClass = "mb-1.5 block text-[13px] font-bold text-navy";

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

const describe = (id: string, hint: boolean, error: boolean) =>
  [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

function RadioPill({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="block flex-1 cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex min-h-[44px] items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-4 py-2.5 text-[14px] font-semibold text-navy transition-colors duration-200 hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary-tint peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
        <span
          aria-hidden="true"
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-primary" : "border-line"}`}
        >
          {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
        </span>
        <span className="leading-snug">{children}</span>
      </span>
    </label>
  );
}

export default function IdentitySection({
  uid,
  cfg,
  isHousehold,
  state,
  onChange,
  repName,
  errors,
  methodError,
}: {
  uid: string;
  cfg: RegistrationTypeConfig;
  /** true = Hộ kinh doanh (họ tên lấy từ ô chủ hộ, chỉ đọc). */
  isHousehold: boolean;
  state: IdentityUiState;
  onChange: (next: IdentityUiState) => void;
  /** Họ tên người đại diện theo pháp luật / chủ hộ đang có ở phía trên (đã tính "trùng người liên hệ"). */
  repName: string;
  errors: Partial<Record<keyof IdentityInfo, string>>;
  methodError?: string;
}) {
  const id = (k: string) => `${uid}-gt-${k}`;
  const info = state.info;
  const set = <K extends keyof IdentityInfo>(key: K, v: IdentityInfo[K]) => onChange({ ...state, info: { ...info, [key]: v } });
  const useForm = cfg.idForm && state.method === "form";
  const ownerWord = isHousehold ? "chủ hộ" : "chủ sở hữu";
  const nameLocked = isHousehold || state.sameAsRep;
  const nameValue = nameLocked ? repName : info.hoTen;
  const methodName = `${uid}-id-method`;
  const placeChoice = effectivePlaceChoice(state);
  const suggestion = suggestIssuePlace(info.ngayCap, info.ngaySinh);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/25 bg-primary-tint p-4 text-[13.5px] leading-relaxed text-navy">
        {cfg.idForm ? (
          <>
            <p className="font-bold">Giấy tờ tuỳ thân: điền thông tin CCCD vào form hoặc gửi ảnh VNeID.</p>
            <div role="radiogroup" aria-label="Cách cung cấp giấy tờ tuỳ thân" className="mt-3 flex flex-col gap-2 sm:flex-row print:hidden">
              <RadioPill name={methodName} value="form" checked={state.method === "form"} onChange={() => onChange({ ...state, method: "form" })}>
                Điền thông tin trên CCCD/VNeID vào form
              </RadioPill>
              <RadioPill name={methodName} value="zalo" checked={state.method === "zalo"} onChange={() => onChange({ ...state, method: "zalo" })}>
                Tôi muốn gửi ảnh VNeID qua Zalo riêng (không điền thông tin)
              </RadioPill>
            </div>
            {methodError && (
              <p role="alert" className="mt-2 text-[12.5px] font-semibold text-accent">
                {methodError}
              </p>
            )}
            {state.method === "form" ? (
              <p className="mt-3 text-body-text">Thông tin bên dưới chỉ dùng để MAX OFFICE soạn hồ sơ thành lập — bạn không cần gửi ảnh VNeID của {ownerWord}.</p>
            ) : (
              <>
                <p className="mt-3 font-bold">{cfg.vneidNote}</p>
                <p className="mt-1.5 text-body-text">Vui lòng không nhập số CCCD vào form này.</p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="font-bold">{cfg.vneidNote}</p>
            <p className="mt-1.5 text-body-text">Vui lòng không nhập số CCCD vào form này.</p>
          </>
        )}
      </div>

      {useForm && (
        <div className="space-y-4 rounded-xl border border-line bg-white p-4 sm:p-5 print:hidden">
          <h4 className="text-[15px] font-bold text-navy">{cfg.idGroupTitle}</h4>

          {!isHousehold && (
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-ink">
              <input
                id={id("sameAsRep")}
                type="checkbox"
                checked={state.sameAsRep}
                onChange={(e) => onChange({ ...state, sameAsRep: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                  state.sameAsRep ? "border-primary bg-primary text-white" : "border-line text-transparent"
                }`}
              >
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </span>
              <span>Chủ sở hữu trùng người đại diện theo pháp luật</span>
            </label>
          )}

          <Field
            id={id("hoTen")}
            label={isHousehold ? "Họ và tên chủ hộ" : "Họ và tên chủ sở hữu"}
            required
            error={errors.hoTen}
            hint={isHousehold ? "Lấy từ ô \"Họ tên chủ hộ kinh doanh\" ở phía trên." : state.sameAsRep ? "Lấy từ ô họ tên người đại diện theo pháp luật ở phía trên." : undefined}
          >
            <input
              id={id("hoTen")}
              type="text"
              value={nameValue}
              readOnly={nameLocked}
              onChange={(e) => set("hoTen", e.target.value)}
              placeholder={nameLocked ? "Chưa có — nhập họ tên ở ô phía trên" : "Ví dụ: Nguyễn Văn A"}
              maxLength={IDENTITY_MAX.hoTen}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.hoTen}
              aria-describedby={describe(id("hoTen"), isHousehold || state.sameAsRep, !!errors.hoTen)}
              className={inputClass}
            />
          </Field>

          <div className="print:hidden">
            <p id={id("gioiTinh-label")} className={labelClass}>
              Giới tính (tuỳ chọn)
            </p>
            <div role="radiogroup" aria-labelledby={id("gioiTinh-label")} className="flex gap-2">
              <RadioPill name={`${uid}-gt-gioi`} value="nam" checked={info.gioiTinh === "nam"} onChange={() => set("gioiTinh", "nam")}>
                Nam
              </RadioPill>
              <RadioPill name={`${uid}-gt-gioi`} value="nu" checked={info.gioiTinh === "nu"} onChange={() => set("gioiTinh", "nu")}>
                Nữ
              </RadioPill>
            </div>
            {errors.gioiTinh && (
              <p role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
                {errors.gioiTinh}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("ngaySinh")} label="Ngày sinh" required error={errors.ngaySinh}>
              <input
                id={id("ngaySinh")}
                type="text"
                inputMode="numeric"
                value={info.ngaySinh}
                onChange={(e) => set("ngaySinh", formatDateInput(e.target.value))}
                placeholder="dd/mm/yyyy"
                maxLength={IDENTITY_MAX.ngay}
                autoComplete="off"
                aria-required="true"
                aria-invalid={!!errors.ngaySinh}
                aria-describedby={describe(id("ngaySinh"), false, !!errors.ngaySinh)}
                className={inputClass}
              />
            </Field>
            <Field id={id("soCccd")} label="Số CCCD (12 chữ số)" required error={errors.soCccd}>
              <input
                id={id("soCccd")}
                type="text"
                inputMode="numeric"
                value={info.soCccd}
                onChange={(e) => set("soCccd", e.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="12 chữ số"
                maxLength={IDENTITY_MAX.soCccd}
                autoComplete="off"
                spellCheck={false}
                aria-required="true"
                aria-invalid={!!errors.soCccd}
                aria-describedby={describe(id("soCccd"), false, !!errors.soCccd)}
                className={inputClass}
              />
            </Field>
            <Field id={id("ngayCap")} label="Ngày cấp CCCD" required error={errors.ngayCap}>
              <input
                id={id("ngayCap")}
                type="text"
                inputMode="numeric"
                value={info.ngayCap}
                onChange={(e) => set("ngayCap", formatDateInput(e.target.value))}
                placeholder="dd/mm/yyyy"
                maxLength={IDENTITY_MAX.ngay}
                autoComplete="off"
                aria-required="true"
                aria-invalid={!!errors.ngayCap}
                aria-describedby={describe(id("ngayCap"), false, !!errors.ngayCap)}
                className={inputClass}
              />
            </Field>
            <div className="print:hidden">
              <label htmlFor={id("noiCapSel")} className={labelClass}>
                Nơi cấp
              </label>
              <div className="relative">
                <select
                  id={id("noiCapSel")}
                  value={placeChoice}
                  onChange={(e) => onChange({ ...state, placeManual: true, placeChoice: e.target.value as PlaceChoice })}
                  aria-describedby={`${id("noiCapSel")}-hint`}
                  className={`${inputClass} min-h-[44px] appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Chưa chọn
                  </option>
                  <option value="bca">{ISSUE_PLACE_BCA}</option>
                  <option value="csqlhc">{ISSUE_PLACE_CSQLHC}</option>
                  <option value="khac">Khác (tự nhập)</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body-text" />
              </div>
              <p id={`${id("noiCapSel")}-hint`} className="mt-1.5 text-[12.5px] leading-relaxed text-body-text">
                {suggestion || state.placeManual
                  ? "Tự động chọn theo ngày cấp. Nếu thẻ của bạn ghi khác, hãy đổi hoặc chọn 'Khác'."
                  : "Sẽ tự điền sau khi bạn nhập ngày cấp"}
              </p>
              {state.placeManual && (
                <button
                  type="button"
                  onClick={() => onChange({ ...state, placeManual: false })}
                  className="mt-1.5 inline-flex min-h-[44px] items-center text-[13px] font-semibold text-primary underline underline-offset-2"
                >
                  Đặt lại theo ngày cấp
                </button>
              )}
            </div>
            {placeChoice === "khac" && (
              <Field id={id("noiCap")} label="Nơi cấp (nhập tay)" required error={errors.noiCap}>
                <input
                  id={id("noiCap")}
                  type="text"
                  value={state.placeOther}
                  onChange={(e) => onChange({ ...state, placeManual: true, placeChoice: "khac", placeOther: e.target.value })}
                  placeholder="Ví dụ: Công an tỉnh/thành phố ..."
                  maxLength={IDENTITY_MAX.noiCap}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={!!errors.noiCap}
                  aria-describedby={describe(id("noiCap"), false, !!errors.noiCap)}
                  className={inputClass}
                />
              </Field>
            )}
          </div>

          <Field
            id={id("diaChiLienHe")}
            label="Địa chỉ liên hệ"
            required
            error={errors.diaChiLienHe}
            hint="Lưu ý: nhập theo địa giới hành chính mới sau sáp nhập."
          >
            <textarea
              id={id("diaChiLienHe")}
              rows={2}
              value={info.diaChiLienHe}
              onChange={(e) => set("diaChiLienHe", e.target.value)}
              placeholder="Ví dụ: Số 10 Đường Sông Thao, Phường Tân Sơn Hoà, Thành phố Hồ Chí Minh"
              maxLength={IDENTITY_MAX.diaChiLienHe}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.diaChiLienHe}
              aria-describedby={describe(id("diaChiLienHe"), true, !!errors.diaChiLienHe)}
              className={inputClass}
            />
          </Field>

          {!isHousehold && !state.sameAsRep && (
            <p className="rounded-lg bg-bg-tint px-3.5 py-2.5 text-[12.5px] leading-relaxed text-body-text">
              Vui lòng gửi ảnh VNeID của người đại diện qua Zalo
            </p>
          )}
        </div>
      )}
    </div>
  );
}
