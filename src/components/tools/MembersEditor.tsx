"use client";

import { useEffect, useRef } from "react";
import MoneyInput from "../MoneyInput";
import { CheckCircleIcon } from "../icons";
import {
  MEMBERS_MAX_ROWS,
  MEMBER_CAPITAL_MAX,
  MEMBER_NAME_MAX,
  cleanMemberRows,
  formatThousands,
  membersCapitalTotal,
  type MemberRow,
  type RegistrationErrors,
  type RegistrationTypeConfig,
} from "@/lib/companyRegistration";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink transition-colors duration-200 placeholder:text-[14px] placeholder:italic placeholder:text-body-text/55 sm:placeholder:text-[14.5px] focus:border-primary focus:outline-none aria-[invalid=true]:border-accent sm:text-[14.5px] print:hidden";
const labelClass = "mb-1.5 block text-[13px] font-bold text-navy";

/** Chuỗi chữ số vốn góp: bỏ số 0 đầu, chặn quá 1.000 tỷ (MoneyInput đã loại mọi ký tự không phải chữ số). */
function normalizeCapital(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (digits.length > 13 || Number(digits) > MEMBER_CAPITAL_MAX) return String(MEMBER_CAPITAL_MAX);
  return digits;
}

/**
 * Danh sách cổ đông / thành viên có cấu trúc (chỉ Công ty Cổ phần và TNHH 2 thành viên trở lên): mỗi dòng
 * "Họ và tên" + "Vốn góp (đồng)" (tái dùng MoneyInput). Mọi ô đều TUỲ CHỌN và không chặn gửi; "Tổng vốn góp"
 * tự cộng, lệch vốn điều lệ chỉ cảnh báo nhẹ. Không nêu quy định pháp lý nào về tỷ lệ vốn góp.
 */
export default function MembersEditor({
  uid,
  cfg,
  rows,
  onChange,
  vonDieuLe,
  error,
  rowErrors,
}: {
  uid: string;
  cfg: RegistrationTypeConfig;
  rows: MemberRow[];
  onChange: (rows: MemberRow[]) => void;
  /** Vốn điều lệ khách đã nhập (chuỗi chữ số, "" nếu chưa nhập). */
  vonDieuLe: string;
  error?: string;
  rowErrors?: RegistrationErrors["thanhVienRows"];
}) {
  const word = cfg.memberWord ?? "Thành viên";
  const wordLower = word.toLowerCase();
  const min = cfg.membersMin ?? 0;
  const addRef = useRef<HTMLButtonElement>(null);
  const focusIndex = useRef<number | null>(null);
  const focusAdd = useRef(false);

  useEffect(() => {
    if (focusIndex.current !== null) {
      document.getElementById(`${uid}-tv-${focusIndex.current}-ten`)?.focus();
      focusIndex.current = null;
    } else if (focusAdd.current) {
      addRef.current?.focus();
      focusAdd.current = false;
    }
  }, [rows.length, uid]);

  const setRow = (i: number, patch: Partial<MemberRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const total = membersCapitalTotal(cleanMemberRows(rows));
  const vdl = vonDieuLe ? Number(vonDieuLe) : 0;
  const matches = vdl > 0 && total === vdl;
  const mismatch = vdl > 0 && total > 0 && total !== vdl;

  return (
    <div role="group" aria-labelledby={`${uid}-tv-title`} className="print:hidden">
      <p id={`${uid}-tv-title`} className={labelClass}>
        {cfg.membersLabel} (tuỳ chọn)
      </p>
      <p className="-mt-0.5 mb-3 text-[12.5px] leading-relaxed text-body-text">
        Tối thiểu {min} {wordLower}. Các ô đều không bắt buộc; dòng để trống sẽ được bỏ qua.
      </p>
      {error && (
        <p role="alert" className="mb-2 text-[12.5px] font-semibold text-accent">
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const e = rowErrors?.[i];
          const nameId = `${uid}-tv-${i}-ten`;
          const capId = `${uid}-tv-${i}-von`;
          return (
            <li key={i} className="rounded-xl border border-line bg-white p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[13px] font-bold text-primary">
                  {word} {i + 1}
                </p>
                {i >= min && (
                  <button
                    type="button"
                    onClick={() => {
                      focusAdd.current = true;
                      onChange(rows.filter((_, idx) => idx !== i));
                    }}
                    aria-label={`Xoá ${wordLower} ${i + 1}`}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 text-[13px] font-semibold text-accent transition-colors duration-200 hover:bg-accent/5"
                  >
                    Xoá
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,220px)]">
                <div>
                  <label htmlFor={nameId} className="mb-1.5 block text-[12.5px] font-semibold text-body-text">
                    Họ và tên<span className="sr-only"> {wordLower} {i + 1}</span>
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    value={r.ten}
                    onChange={(ev) => setRow(i, { ten: ev.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    maxLength={MEMBER_NAME_MAX}
                    autoComplete="off"
                    aria-invalid={!!e?.ten}
                    aria-describedby={e?.ten ? `${nameId}-err` : undefined}
                    className={inputClass}
                  />
                  {e?.ten && (
                    <p id={`${nameId}-err`} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
                      {e.ten}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={capId} className="mb-1.5 block text-[12.5px] font-semibold text-body-text">
                    Vốn góp (đồng)<span className="sr-only"> của {wordLower} {i + 1}</span>
                  </label>
                  <div className="relative">
                    <MoneyInput
                      id={capId}
                      value={r.von}
                      onChange={(raw) => setRow(i, { von: normalizeCapital(raw) })}
                      placeholder="Ví dụ: 500.000.000"
                      aria-invalid={!!e?.von}
                      aria-describedby={e?.von ? `${capId}-err` : undefined}
                      className={`${inputClass} pr-16`}
                    />
                    {r.von && (
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13.5px] text-body-text">
                        đồng
                      </span>
                    )}
                  </div>
                  {e?.von && (
                    <p id={`${capId}-err`} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-accent">
                      {e.von}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          ref={addRef}
          type="button"
          disabled={rows.length >= MEMBERS_MAX_ROWS}
          onClick={() => {
            focusIndex.current = rows.length;
            onChange([...rows, { ten: "", von: "" }]);
          }}
          className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-primary/40 bg-white px-5 text-[14px] font-bold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary-tint disabled:pointer-events-none disabled:opacity-50"
        >
          + Thêm {wordLower}
        </button>
        <span className="text-[12.5px] text-body-text">
          {rows.length >= MEMBERS_MAX_ROWS ? `Đã đủ ${MEMBERS_MAX_ROWS} dòng.` : "Vốn góp tối đa 1.000 tỷ đồng mỗi dòng."}
        </span>
      </div>

      {total > 0 && (
        <div aria-live="polite" className="mt-3 space-y-2">
          <p className="text-[14px] font-bold text-navy">Tổng vốn góp: {formatThousands(String(total))} đồng</p>
          {matches && (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-green-700">
              <CheckCircleIcon className="h-4 w-4 shrink-0" />
              Khớp với vốn điều lệ
            </p>
          )}
          {mismatch && (
            <p role="status" className="rounded-lg bg-amber/12 px-3.5 py-2.5 text-[13px] leading-relaxed font-semibold text-amber-dark">
              Tổng vốn góp ({formatThousands(String(total))} đồng) chưa bằng vốn điều lệ ({formatThousands(vonDieuLe)} đồng). Bạn kiểm tra lại giúp nhé.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
