"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../Reveal";
import { PlusIcon, CloseIcon, DownloadIcon, SpinnerIcon } from "../icons";
import {
  resolvePaymentRequest,
  buildPaymentRequestFilename,
  PAYMENT_REQUEST_COMPANY_OPTIONS,
  DEFAULT_ELECTRICITY_PRICE_PER_KWH,
  QE_AGENCY_DEFAULT_RENT,
  type PaymentRequestCompanyKey,
  type PaymentRequestInput,
} from "@/lib/paymentRequestData";
import { VIETQR_ACCOUNT_KEYS, DEFAULT_VIETQR_ACCOUNT_KEY, vietQrAccountLabel, type VietQrAccountKey } from "@/lib/vietQr";

/**
 * Form nội bộ "Đề nghị thanh toán" — lập phiếu thanh toán cho 5 khách thuê
 * SÀN/PHÒNG THẬT tại MAX Office + 1 mẫu tự do "Dịch vụ khác", thay quy trình
 * nhập tay Google Sheets. KHÔNG đăng ký công khai (xem comment đầu
 * paymentRequestData.ts) — chỉ truy cập qua đúng URL.
 *
 * Mỗi lần chỉ lập 1 phiếu cho 1 công ty (khác CompositeQuoteTool — công cụ
 * đó gộp NHIỀU dịch vụ/dòng vào 1 báo giá) — chọn công ty ở dropdown hiện
 * đúng bộ field của công ty đó, giống cách VPA/GPKD/Kế toán đổi field theo
 * loại dịch vụ ở CompositeQuoteTool.
 */

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();
const CURRENT_DAY = now.getDate();
const CURRENT_QUARTER = (Math.floor((CURRENT_MONTH - 1) / 3) + 1) as 1 | 2 | 3 | 4;

// LƯU Ý: mỗi loại công ty có discriminant RIÊNG (không gộp "mtk" | "qe-agency"
// hay "tay-bac" | "cul" chung 1 member) dù vài loại có field giống hệt nhau —
// TypeScript chỉ tự thu hẹp (narrow) đúng discriminated union khi mỗi thành
// viên có `type` là 1 literal DUY NHẤT; gộp 2 literal vào chung 1 member từng
// khiến formToInput() bên dưới không thu hẹp được, gây lỗi "property does not
// exist" ở toàn bộ các nhánh còn lại (đã xác nhận qua tsc thật).
type FormState =
  | {
      type: "mtk";
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      tienThue: string;
      congNoDauKy: string;
      moTaCongNo: string;
      soXe: string;
      chiSoDau: string;
      chiSoCuoi: string;
      donGiaDien: string;
    }
  | {
      type: "qe-agency";
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      /** Tiền thuê CỐ ĐỊNH nhưng VẪN NHẬP TAY (như MTK/Tây Bắc/CUL) —
       * KHÔNG còn tự tính theo ngày trong tháng (đã bỏ công thức prorating,
       * hiểu sai yêu cầu ban đầu). Mặc định gợi ý QE_AGENCY_DEFAULT_RENT. */
      tienThue: string;
      congNoDauKy: string;
      moTaCongNo: string;
      soXe: string;
      chiSoDau: string;
      chiSoCuoi: string;
      donGiaDien: string;
    }
  | {
      type: "tay-bac";
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      tienThue: string;
      congNoDauKy: string;
      soXe: string;
    }
  | {
      type: "cul";
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      tienThue: string;
      congNoDauKy: string;
      soXe: string;
    }
  | {
      type: "koolog";
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      quy: 1 | 2 | 3 | 4;
      tienThueThang: string;
      congNoDauKy: string;
      moTaCongNo: string;
      soXeCaQuy: string;
      dienKhoanCaQuy: string;
    }
  | {
      type: "khac";
      tenKhachHang: string;
      diaChi: string;
      mst: string;
      sdt: string;
      /** Chuỗi THÔ (không phải number) — cho phép gõ/xoá tự do, không bị tự
       * động pad/ép định dạng giữa lúc gõ (lỗi đã gặp với input type="number"
       * trước đây). Chỉ pad số 0 lúc hiển thị RA ẢNH/PDF cuối cùng, xem
       * issueDateLabel() trong paymentRequestData.ts. */
      ngayLap: string;
      thang: number;
      nam: number;
      noiDungVv: string;
      noiDungCk: string;
      items: { tenDichVu: string; soTien: string; thueSuat: string }[];
    };

function createDefaultForm(type: PaymentRequestCompanyKey | "khac"): FormState {
  const base = { ngayLap: String(CURRENT_DAY), thang: CURRENT_MONTH, nam: CURRENT_YEAR };
  if (type === "mtk") {
    return {
      type,
      ...base,
      tienThue: "",
      congNoDauKy: "0",
      moTaCongNo: "",
      soXe: "0",
      chiSoDau: "0",
      chiSoCuoi: "0",
      donGiaDien: String(DEFAULT_ELECTRICITY_PRICE_PER_KWH),
    };
  }
  if (type === "qe-agency") {
    return {
      type,
      ...base,
      tienThue: String(QE_AGENCY_DEFAULT_RENT),
      congNoDauKy: "0",
      moTaCongNo: "",
      soXe: "0",
      chiSoDau: "0",
      chiSoCuoi: "0",
      donGiaDien: String(DEFAULT_ELECTRICITY_PRICE_PER_KWH),
    };
  }
  if (type === "tay-bac" || type === "cul") {
    return { type, ...base, tienThue: "", congNoDauKy: "0", soXe: "0" };
  }
  if (type === "koolog") {
    return {
      type,
      ...base,
      quy: CURRENT_QUARTER,
      tienThueThang: "",
      congNoDauKy: "0",
      moTaCongNo: "",
      soXeCaQuy: "0",
      dienKhoanCaQuy: "0",
    };
  }
  return {
    type: "khac",
    tenKhachHang: "",
    diaChi: "",
    mst: "",
    sdt: "",
    ...base,
    noiDungVv: "",
    noiDungCk: "",
    items: [{ tenDichVu: "", soTien: "", thueSuat: "10" }],
  };
}

/** Số nguyên (tiền/số lượng) — bỏ MỌI ký tự không phải chữ số (chấp nhận cả
 * "36.300.000" lẫn "36300000" đều ra đúng 36300000, theo quy ước phân cách
 * hàng nghìn kiểu Việt Nam). Rỗng -> 0 (coi như chưa phát sinh, không chặn
 * preview). KHÔNG dùng cho chỉ số điện (có thể có phần thập phân thật, xem
 * toDecimal()). */
function toInt(s: string): number {
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

/** Số thập phân — CHỈ dùng cho chỉ số điện đầu/cuối kỳ (QE Agency có số lẻ
 * thật, VD "163.1") — khác toInt(), ở đây dấu "." là DẤU THẬP PHÂN thật,
 * không phải phân cách hàng nghìn. */
function toDecimal(s: string): number {
  const trimmed = s.trim().replace(",", ".");
  if (!trimmed) return 0;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

/** Chuyển FormState (toàn chuỗi, để input gõ tự do không bị ép số giữa
 * chừng) sang PaymentRequestInput (số thật) cho resolvePaymentRequest() —
 * trả null nếu field tiền THUÊ bắt buộc còn rỗng (chưa đủ điều kiện tính) —
 * các field khác (công nợ/xe/điện) rỗng coi như 0, không chặn preview. */
function formToInput(form: FormState): PaymentRequestInput | null {
  // "Ngày lập phiếu" rỗng/không hợp lệ -> chặn preview (giống field tiền
  // thuê bắt buộc) — số thật được parse Ở ĐÂY (không phải lúc gõ), đúng field
  // này chung cho mọi loại công ty nên check 1 lần trước khi tách nhánh.
  if (!form.ngayLap.trim()) return null;
  const ngayLap = Number(form.ngayLap);
  if (!Number.isInteger(ngayLap)) return null;

  if (form.type === "mtk" || form.type === "qe-agency") {
    if (!form.tienThue.trim()) return null;
    const tienThue = toInt(form.tienThue);
    const congNoDauKy = toInt(form.congNoDauKy);
    const soXe = toInt(form.soXe);
    const chiSoDau = toDecimal(form.chiSoDau);
    const chiSoCuoi = toDecimal(form.chiSoCuoi);
    const donGiaDien = toInt(form.donGiaDien);
    if ([chiSoDau, chiSoCuoi].some(Number.isNaN)) return null;
    if (form.type === "mtk") {
      return { type: "mtk", ngayLap, thang: form.thang, nam: form.nam, tienThue, congNoDauKy, moTaCongNo: form.moTaCongNo, soXe, chiSoDau, chiSoCuoi, donGiaDien };
    }
    return { type: "qe-agency", ngayLap, thang: form.thang, nam: form.nam, tienThue, congNoDauKy, moTaCongNo: form.moTaCongNo, soXe, chiSoDau, chiSoCuoi, donGiaDien };
  } else if (form.type === "tay-bac" || form.type === "cul") {
    if (!form.tienThue.trim()) return null;
    const tienThue = toInt(form.tienThue);
    const congNoDauKy = toInt(form.congNoDauKy);
    const soXe = toInt(form.soXe);
    return { type: form.type, ngayLap, thang: form.thang, nam: form.nam, tienThue, congNoDauKy, soXe };
  } else if (form.type === "koolog") {
    if (!form.tienThueThang.trim()) return null;
    const tienThueThang = toInt(form.tienThueThang);
    const congNoDauKy = toInt(form.congNoDauKy);
    const soXeCaQuy = toInt(form.soXeCaQuy);
    const dienKhoanCaQuy = toInt(form.dienKhoanCaQuy);
    return {
      type: "koolog",
      ngayLap,
      thang: form.thang,
      nam: form.nam,
      quy: form.quy,
      tienThueThang,
      congNoDauKy,
      moTaCongNo: form.moTaCongNo,
      soXeCaQuy,
      dienKhoanCaQuy,
    };
  } else {
    // khac
    if (!form.tenKhachHang.trim()) return null;
    if (form.items.some((it) => !it.soTien.trim())) return null;
    const items = form.items.map((it) => ({ tenDichVu: it.tenDichVu, soTien: it.soTien, thueSuat: toInt(it.thueSuat) }));
    return {
      type: "khac",
      tenKhachHang: form.tenKhachHang,
      diaChi: form.diaChi,
      mst: form.mst,
      sdt: form.sdt,
      ngayLap,
      thang: form.thang,
      nam: form.nam,
      noiDungVv: form.noiDungVv,
      noiDungCk: form.noiDungCk,
      items,
    };
  }
}

function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")}đ`;
}

/** Chèn dấu "." phân cách hàng nghìn CHỈ ĐỂ HIỂN THỊ (VD "36.300.000") —
 * không đổi giá trị thật, chỉ đổi cách trình bày trong ô nhập, giúp phát
 * hiện ngay khi gõ nhầm thiếu/thừa số 0 ở số tiền lớn (VD 10.000.000 vs
 * 100.000.000). State/tính toán vẫn luôn là chuỗi số thuần (toInt() ở trên
 * tự strip dấu "." nên không cần đổi gì ở logic tính). */
function formatThousands(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Ô nhập tiền có dấu phân cách hàng nghìn tự động — tự giữ đúng vị trí con
 * trỏ khi gõ/xoá GIỮA CHỪNG số (không chỉ gõ nối ở cuối), vì format lại
 * toàn bộ chuỗi mỗi lần gõ sẽ tự đẩy con trỏ ra cuối nếu không tính lại thủ
 * công — đếm số CHỮ SỐ (không tính dấu chấm) đứng trước con trỏ ở giá trị
 * cũ, rồi đặt lại con trỏ ở đúng vị trí có cùng số chữ số đứng trước trong
 * chuỗi đã format mới. */
function MoneyInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPos = el.selectionStart ?? el.value.length;
    const digitsBeforeCursor = el.value.slice(0, cursorPos).replace(/\D/g, "").length;
    const rawDigits = el.value.replace(/\D/g, "");
    onChange(rawDigits);
    requestAnimationFrame(() => {
      const input = ref.current;
      if (!input) return;
      const formatted = formatThousands(rawDigits);
      let seen = 0;
      let newPos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen === digitsBeforeCursor) {
          newPos = i + 1;
          break;
        }
      }
      if (digitsBeforeCursor === 0) newPos = 0;
      input.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={formatThousands(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

const selectClass =
  "w-full appearance-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-navy transition-colors duration-200 focus:border-primary focus:outline-none";
const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-body-text/60 transition-colors duration-200 focus:border-primary focus:outline-none";
const labelClass = "mb-1.5 block text-[12px] font-bold text-body-text";

export default function PaymentRequestTool() {
  const [form, setForm] = useState<FormState>(() => createDefaultForm("mtk"));
  // "previewing"/"downloading" tách riêng (không dùng chung 1 "generating")
  // vì giờ đây là 2 lệnh gọi API riêng biệt (xem comment handlePreview/
  // handleDownloadPdf) — tránh vô tình disable nhầm nút kia khi 1 nút đang
  // chạy.
  const [status, setStatus] = useState<"idle" | "previewing" | "downloading" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Chụp lại ĐÚNG input đã dùng để tạo previewUrl hiện tại — nút "Tải xuống
  // PDF" LUÔN gửi lại input này (không phải input mới nhất của form), đảm
  // bảo file PDF tải về khớp 100% với ảnh đang hiện trên màn hình kể cả khi
  // nhân viên đã sửa tiếp form sau khi xem trước mà CHƯA bấm xem trước lại.
  const [previewInput, setPreviewInput] = useState<PaymentRequestInput | null>(null);
  // Tài khoản QR nhân viên TỰ CHỌN — mặc định hợp lý theo loại công ty
  // (5 công ty đặt tên: tài khoản 1117777888 như trước đây; "Dịch vụ khác":
  // tài khoản 16868889, đúng quy ước MẪU DỊCH VỤ KHÁC gốc) — sửa đổi tự do.
  const [qrAccountKey, setQrAccountKey] = useState<VietQrAccountKey>(DEFAULT_VIETQR_ACCOUNT_KEY);
  // Snapshot tài khoản ĐÃ DÙNG lúc xem trước — nút "Tải xuống PDF" luôn gửi
  // lại đúng tài khoản này (không phải lựa chọn mới nhất trên form), cùng
  // nguyên tắc với previewInput (đảm bảo PDF khớp đúng ảnh đang hiển thị).
  const [previewQrAccountKey, setPreviewQrAccountKey] = useState<VietQrAccountKey>(DEFAULT_VIETQR_ACCOUNT_KEY);
  const uid = useId();

  const changeCompany = (type: PaymentRequestCompanyKey | "khac") => {
    setForm(createDefaultForm(type));
    setQrAccountKey(type === "khac" ? "16868889" : "1117777888");
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setPreviewInput(null);
  };
  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }) as FormState);

  const input = useMemo(() => formToInput(form), [form]);
  const preview = useMemo(() => (input ? resolvePaymentRequest(input) : null), [input]);
  const previewResult = preview && !("error" in preview) ? preview : null;
  const previewError = preview && "error" in preview ? preview.error : null;

  const canSubmit = previewResult != null && status === "idle";

  /** XEM TRƯỚC — giữ nguyên hành vi cũ: gọi API, nhận PNG, hiện ảnh ngay
   * trên trang — KHÔNG tự tải file xuống (khác luồng cũ) để nhân viên xem
   * lại cho đúng trước khi tải PDF chính thức ở nút riêng bên dưới. */
  const handlePreview = async () => {
    if (!input) return;
    setStatus("previewing");
    setErrorDetail(null);
    try {
      const res = await fetch("/api/payment-request-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, format: "png", qrAccountKey }),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Server trả về lỗi ${res.status} khi tạo ảnh.`);
      }
      const blob = await res.blob();
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
      setPreviewInput(input);
      setPreviewQrAccountKey(qrAccountKey);
      setStatus("idle");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  /** TẢI PDF — gọi LẠI API với format:"pdf" (server dựng PDF từ ĐÚNG ảnh
   * PNG vừa xem, xem pdfFromImage.ts) rồi mới tải file — dùng `previewInput`
   * (snapshot lúc xem trước), KHÔNG dùng `input` hiện tại, để đảm bảo PDF
   * luôn khớp đúng ảnh đang hiển thị dù form có bị sửa tiếp sau đó. */
  const handleDownloadPdf = async () => {
    if (!previewInput) return;
    setStatus("downloading");
    setErrorDetail(null);
    try {
      const res = await fetch("/api/payment-request-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...previewInput, format: "pdf", qrAccountKey: previewQrAccountKey }),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Server trả về lỗi ${res.status} khi tạo PDF.`);
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = buildPaymentRequestFilename(previewInput);
      link.href = blobUrl;
      link.click();
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
          eyebrow="Công cụ nội bộ — không công khai"
          title="Đề nghị thanh toán"
          description="Lập phiếu đề nghị thanh toán cho khách thuê sàn/phòng tại MAX Office."
        />

        <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <div className="mb-6">
            <label htmlFor={`${uid}-company`} className={labelClass}>
              Công ty
            </label>
            <select
              id={`${uid}-company`}
              value={form.type}
              onChange={(e) => changeCompany(e.target.value as PaymentRequestCompanyKey | "khac")}
              className={selectClass}
            >
              {PAYMENT_REQUEST_COMPANY_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.name}
                </option>
              ))}
              <option value="khac">Dịch vụ khác (tự nhập)</option>
            </select>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Ngày lập phiếu</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.ngayLap}
                onChange={(e) => update({ ngayLap: e.target.value.replace(/\D/g, "") })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tháng thanh toán</label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.thang}
                onChange={(e) => update({ thang: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Năm thanh toán</label>
              <input
                type="number"
                min={2020}
                max={2100}
                value={form.nam}
                onChange={(e) => update({ nam: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>

          {form.type === "koolog" && (
            <div className="mb-6">
              <label className={labelClass}>Quý số</label>
              <div className="flex flex-wrap gap-2">
                {([1, 2, 3, 4] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    aria-pressed={form.quy === q}
                    onClick={() => update({ quy: q })}
                    className={`rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-all duration-200 ${
                      form.quy === q ? "border-primary bg-primary text-white" : "border-line bg-white text-body-text hover:border-primary/40"
                    }`}
                  >
                    Quý {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(form.type === "mtk" || form.type === "qe-agency") && (
            <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tiền thuê (chưa VAT)</label>
                <MoneyInput
                  value={form.tienThue}
                  onChange={(raw) => update({ tienThue: raw })}
                  placeholder={form.type === "mtk" ? "VD: 36.300.000" : `VD: ${formatVnd(QE_AGENCY_DEFAULT_RENT).replace("đ", "")}`}
                  className={inputClass}
                />
                {form.type === "qe-agency" && (
                  <p className="mt-1 text-[11px] text-body-text">
                    Phiếu sẽ ghi chu kỳ thuê &ldquo;từ ngày 10/{form.thang}/{form.nam} - 10/
                    {form.thang === 12 ? 1 : form.thang + 1}/{form.thang === 12 ? form.nam + 1 : form.nam}&rdquo; —
                    tiền thuê cố định theo tháng, không tính theo số ngày.
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Số lượng xe gửi tháng trước</label>
                <input type="text" inputMode="numeric" value={form.soXe} onChange={(e) => update({ soXe: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Chỉ số điện đầu kỳ</label>
                <input type="text" inputMode="decimal" value={form.chiSoDau} onChange={(e) => update({ chiSoDau: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Chỉ số điện cuối kỳ</label>
                <input type="text" inputMode="decimal" value={form.chiSoCuoi} onChange={(e) => update({ chiSoCuoi: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Đơn giá điện (đ/kWh)</label>
                <MoneyInput value={form.donGiaDien} onChange={(raw) => update({ donGiaDien: raw })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Công nợ đầu kỳ</label>
                <MoneyInput value={form.congNoDauKy} onChange={(raw) => update({ congNoDauKy: raw })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Mô tả công nợ đầu kỳ (chỉ hiện khi công nợ &gt; 0)</label>
                <input type="text" value={form.moTaCongNo} onChange={(e) => update({ moTaCongNo: e.target.value })} placeholder="VD: Tiền thuê còn thiếu tháng trước" className={inputClass} />
              </div>
            </div>
          )}

          {(form.type === "tay-bac" || form.type === "cul") && (
            <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tiền thuê (chưa VAT)</label>
                <MoneyInput value={form.tienThue} onChange={(raw) => update({ tienThue: raw })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Số lượng xe gửi tháng trước</label>
                <input type="text" inputMode="numeric" value={form.soXe} onChange={(e) => update({ soXe: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Công nợ đầu kỳ</label>
                <MoneyInput value={form.congNoDauKy} onChange={(raw) => update({ congNoDauKy: raw })} className={inputClass} />
              </div>
            </div>
          )}

          {form.type === "koolog" && (
            <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tiền thuê / tháng (chưa VAT) — tự nhân 3 cho cả quý</label>
                <MoneyInput value={form.tienThueThang} onChange={(raw) => update({ tienThueThang: raw })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Số lượng xe (cả quý) — nhập thẳng tổng, không nhân</label>
                <input type="text" inputMode="numeric" value={form.soXeCaQuy} onChange={(e) => update({ soXeCaQuy: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Điện khoán (cả quý, chưa VAT) — nhập thẳng tổng, không nhân</label>
                <MoneyInput value={form.dienKhoanCaQuy} onChange={(raw) => update({ dienKhoanCaQuy: raw })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Công nợ đầu kỳ</label>
                <MoneyInput value={form.congNoDauKy} onChange={(raw) => update({ congNoDauKy: raw })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Mô tả công nợ đầu kỳ (chỉ hiện khi công nợ &gt; 0)</label>
                <input type="text" value={form.moTaCongNo} onChange={(e) => update({ moTaCongNo: e.target.value })} className={inputClass} />
              </div>
            </div>
          )}

          {form.type === "khac" && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Kính gửi (tên khách hàng)</label>
                  <input type="text" value={form.tenKhachHang} onChange={(e) => update({ tenKhachHang: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Địa chỉ</label>
                  <input type="text" value={form.diaChi} onChange={(e) => update({ diaChi: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>MST</label>
                  <input type="text" value={form.mst} onChange={(e) => update({ mst: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <input type="text" value={form.sdt} onChange={(e) => update({ sdt: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Nội dung (V/v)</label>
                  <input type="text" value={form.noiDungVv} onChange={(e) => update({ noiDungVv: e.target.value })} placeholder="VD: V/v thanh toán phí đăng ký địa chỉ kinh doanh" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Nội dung chuyển khoản</label>
                  <input type="text" value={form.noiDungCk} onChange={(e) => update({ noiDungCk: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-[13.5px] font-bold text-navy">Danh sách dịch vụ</h3>
                <div className="space-y-3">
                  {form.items.map((row, i) => (
                    <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-line bg-bg-tint p-3 sm:grid-cols-[1fr_1fr_100px_32px]">
                      <input
                        type="text"
                        placeholder="Tên dịch vụ"
                        value={row.tenDichVu}
                        onChange={(e) =>
                          update({ items: form.items.map((it, idx) => (idx === i ? { ...it, tenDichVu: e.target.value } : it)) } as Partial<FormState>)
                        }
                        className={`${inputClass} bg-white`}
                      />
                      <MoneyInput
                        placeholder="Số tiền chưa VAT"
                        value={row.soTien}
                        onChange={(raw) =>
                          update({ items: form.items.map((it, idx) => (idx === i ? { ...it, soTien: raw } : it)) } as Partial<FormState>)
                        }
                        className={`${inputClass} bg-white`}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="VAT %"
                        value={row.thueSuat}
                        onChange={(e) =>
                          update({ items: form.items.map((it, idx) => (idx === i ? { ...it, thueSuat: e.target.value } : it)) } as Partial<FormState>)
                        }
                        className={`${inputClass} bg-white`}
                      />
                      <button
                        type="button"
                        onClick={() => update({ items: form.items.filter((_, idx) => idx !== i) } as Partial<FormState>)}
                        disabled={form.items.length <= 1}
                        aria-label="Xoá dòng dịch vụ này"
                        className="flex h-full w-full items-center justify-center rounded-lg text-body-text transition-colors duration-200 hover:bg-white hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update({ items: [...form.items, { tenDichVu: "", soTien: "", thueSuat: "10" }] } as Partial<FormState>)
                  }
                  disabled={form.items.length >= 20}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-2.5 text-[13px] font-bold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary-tint disabled:pointer-events-none disabled:opacity-40"
                >
                  <PlusIcon className="h-4 w-4" />
                  Thêm dòng dịch vụ
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 rounded-xl border border-line bg-bg-tint p-4">
            <span className="mb-2 block text-[12px] font-bold text-body-text">
              Tài khoản nhận tiền QR — chỉ chọn từ danh sách, không tự nhập được
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
          </div>

          {previewResult && (
            <div className="mb-6 rounded-xl bg-bg-tint px-4 py-3.5 text-[13px]">
              <div className="mb-1.5 font-bold text-navy">Xem trước</div>
              {previewResult.debt && (
                <div className="flex items-center justify-between text-amber-700">
                  <span>{previewResult.debt.description}</span>
                  <span className="font-mono font-bold">{formatVnd(previewResult.debt.amount)}</span>
                </div>
              )}
              {previewResult.items.map((it) => (
                <div key={it.stt} className="flex items-center justify-between text-body-text">
                  <span>
                    {it.label}
                    {it.detail ? ` (${it.detail})` : ""}
                  </span>
                  <span className="font-mono">
                    {formatVnd(it.amount)} + VAT {it.vatPercent}% = {formatVnd(it.total)}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2 font-bold text-navy">
                <span>Tổng cộng</span>
                <span className="font-mono text-primary">{formatVnd(previewResult.grandTotal)}</span>
              </div>
            </div>
          )}
          {previewError && <p className="mb-6 text-[12.5px] text-accent">{previewError}</p>}

          <button
            type="button"
            onClick={handlePreview}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(21,101,192,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-50"
          >
            {status === "previewing" && <SpinnerIcon className="h-4 w-4" />}
            {status === "previewing" ? "Đang tạo bản xem trước..." : previewUrl ? "Tạo lại bản xem trước" : "Xem trước phiếu"}
          </button>
          {status === "error" && (
            <p className="mt-2 text-center text-[12.5px] text-accent">
              Không thực hiện được, vui lòng thử lại.
              {errorDetail && <span className="block break-words text-[11px] text-body-text">({errorDetail})</span>}
            </p>
          )}
          {previewUrl && (
            <>
              <div className="mt-5 overflow-hidden rounded-xl border border-line">
                <p className="bg-bg-tint px-3 py-1.5 text-[11px] font-semibold text-body-text">Xem trước phiếu</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Xem trước phiếu đề nghị thanh toán vừa tạo" className="w-full" />
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={status !== "idle"}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(220,53,48,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-50"
              >
                {status === "downloading" ? <SpinnerIcon className="h-4 w-4" /> : <DownloadIcon className="h-4 w-4" />}
                {status === "downloading" ? "Đang tạo PDF..." : "Tải xuống PDF"}
              </button>
              <p className="mt-2 text-center text-[11.5px] text-body-text">
                File PDF tải xuống luôn khớp đúng bản xem trước phía trên — nếu vừa sửa thông tin ở form, bấm &ldquo;Tạo lại bản xem trước&rdquo; để cập nhật trước khi tải.
              </p>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
