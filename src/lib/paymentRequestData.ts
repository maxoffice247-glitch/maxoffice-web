/**
 * Logic dữ liệu DÙNG CHUNG giữa API route tạo ảnh "Đề nghị thanh toán"
 * (src/app/api/payment-request-image/route.tsx, chạy server) VÀ công cụ nhập
 * liệu phía client (src/components/tools/PaymentRequestTool.tsx) — cùng kiểu
 * tách riêng như compositeQuote.ts, để preview ở form và ảnh PNG thật không
 * bao giờ lệch nhau.
 *
 * ĐÂY LÀ CÔNG CỤ NỘI BỘ, KHÔNG CÔNG KHAI — dùng để lập "Đề nghị thanh toán"
 * gửi 5 khách thuê SÀN/PHÒNG THẬT tại MAX Office (khác hẳn Văn phòng ảo),
 * thay thế quy trình nhập tay trên Google Sheets. Vì dropdown chọn công ty lộ
 * MST/SĐT/số hợp đồng của 5 công ty thuê THẬT (nhạy cảm hơn hẳn
 * CompositeQuoteTool — công cụ đó chỉ hiện giá/tài khoản CỦA MAX OFFICE,
 * không phải bí mật của bên thứ ba), trang này CỐ Ý KHÔNG đăng ký vào
 * toolsData.ts (không lên menu công khai/trang /tien-ich/trang chủ
 * tool/sitemap) — chỉ truy cập được qua đúng URL trực tiếp.
 *
 * NGUỒN DỮ LIỆU: khảo sát trực tiếp Google Sheet "Đề nghị thanh toán" (đọc
 * FORMULA, không chỉ giá trị hiển thị) — xem báo cáo khảo sát đầy đủ đã gửi
 * trước khi xây công cụ này. 3 LỖI đã xác nhận trong sheet gốc và được SỬA
 * THEO ĐÚNG Ý ĐỊNH BAN ĐẦU ở đây (không giữ nguyên hành vi lỗi):
 * 1. "Mô tả công nợ đầu kỳ" trong sheet gốc đọc NHẦM ô nhãn (cột B) thay vì ô
 *    nhập liệu thật (cột D) — công cụ này đọc đúng field input thật.
 * 2. Nội dung chuyển khoản MTK bị lỗi chính tả "MINH THANH KHANH" (thiếu chữ
 *    G) — sửa thành "MINH THANH KHANG".
 * 3. Đoạn văn giới thiệu của QE Agency bị lặp 2 lần cụm "Kính gửi:" giữa
 *    câu — bỏ phần lặp, chỉ còn đúng 1 câu tự nhiên.
 *
 * 2 ĐIỂM KHÔNG NHẤT QUÁN CÒN LẠI TRONG DỮ LIỆU GỐC — CỐ Ý GIỮ NGUYÊN (không
 * tự "sửa" vì không có cơ sở xác định số nào đúng, chỉ có thể đoán):
 * - Tây Bắc và CUL dùng CHUNG 1 số hợp đồng "S101-10ST/082024/HĐKT" (nhiều
 *   khả năng là lỗi copy-paste giữa 2 công ty khác nhau trong sheet gốc).
 * - KOOLOG: đoạn tiếng Việt ghi số hợp đồng "S101-10ST/082024/HĐKT" nhưng
 *   đoạn tiếng Anh TRONG CÙNG Ô ghi "S102-10ST/2024/HDKT" (tự mâu thuẫn song
 *   ngữ trong chính sheet gốc).
 * Nếu sau này xác nhận được số đúng, chỉ cần sửa `contractParagraph` của
 * công ty tương ứng bên dưới.
 *
 * ĐƠN GIẢN HOÁ CÓ CHỦ ĐÍCH so với layout sheet gốc: sheet gốc có 1 dòng "Tiền
 * thuê" (A) rồi 1 dòng "Cộng tiền văn phòng" (mirror y hệt giá trị dòng A,
 * trừ KOOLOG nhân thêm ×3) — dòng mirror này LUÔN thừa (không bao giờ khác
 * dòng gốc ngoại trừ phép nhân đã áp dụng ngay trong dòng gốc), nên công cụ
 * này GỘP LẠI còn 1 dòng duy nhất mỗi loại phí, đánh số 1/2/3 tuần tự thay vì
 * cách đánh A/B/C/E lẫn lộn của sheet gốc.
 */
import { parseVndAmount } from "./compositeQuote";
import type { VietQrAccountKey } from "./vietQr";

export type PaymentRequestCompanyKey = "mtk" | "tay-bac" | "cul" | "koolog" | "qe-agency";

export const PARKING_FEE_PER_CAR = 150_000;
export const RENT_VAT_PERCENT = 10;
/** VAT tiền xe gửi VÀ điện sinh hoạt/điện khoán — CÙNG 1 mức, khác VAT tiền
 * thuê. Xác nhận trực tiếp từ nhân viên (không lấy từ cột "VAT %" vestigial
 * trong DANH_MUC_CONG_TY — cột đó không công thức nào trong sheet thật sự
 * đọc, xem báo cáo khảo sát). */
export const OTHER_VAT_PERCENT = 8;
export const DEFAULT_ELECTRICITY_PRICE_PER_KWH = 4500;
/** Tiền thuê CỐ ĐỊNH của QE Agency, MỌI THÁNG — giống cách xử lý flat-rate
 * của Tây Bắc/CUL (không có công thức động nào theo ngày/tháng). ĐÃ BỎ HẲN
 * công thức prorating theo số ngày trong tháng dùng trước đây (hiểu sai yêu
 * cầu ban đầu — QE Agency chỉ khác các công ty khác ở CÁCH GHI CHU KỲ trên
 * phiếu "10/MM - 10/MM+1", không phải ở cách tính tiền). Chỉ dùng làm giá
 * trị MẶC ĐỊNH gợi ý trong form — vẫn cho sửa tay, nhất quán với Tiền thuê
 * của Minh Thành Khang/Tây Bắc/CUL (đều là ô nhập tự do, không khoá cứng). */
export const QE_AGENCY_DEFAULT_RENT = 8_500_000;
/** Ngày bắt đầu chu kỳ thuê ghi trên phiếu QE Agency (chỉ còn dùng cho NHÃN
 * hiển thị "10/MM - 10/MM+1", không còn liên quan gì tới cách tính tiền). */
export const QE_AGENCY_RENT_START_DAY = 10;

function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")}đ`;
}

/** Số ngày thật của 1 tháng/năm cụ thể — dùng `new Date(year, month, 0)`
 * (ngày 0 của tháng SAU = ngày cuối tháng hiện tại), TỰ ĐỘNG đúng cho tháng
 * 2 (28 hoặc 29 ngày năm nhuận) mà không cần bảng tra tháng hardcode nào.
 * CHỈ còn dùng cho nhãn hiển thị của MTK ("01/MM - ngày cuối tháng/MM/YYYY")
 * — KHÔNG còn liên quan gì tới tiền thuê QE Agency (đã bỏ công thức
 * prorating theo số ngày). */
export function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function prevMonth(month: number, year: number): { month: number; year: number } {
  return month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
}

/** Tháng/năm kế tiếp — dùng cho nhãn chu kỳ thuê QE Agency ("10/MM -
 * 10/MM+1"), tự xử lý đúng khi qua năm (tháng 12 -> tháng 1 năm sau). */
function nextMonth(month: number, year: number): { month: number; year: number } {
  return month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };
}

type CompanyStaticInfo = {
  key: PaymentRequestCompanyKey;
  name: string;
  mst: string;
  phone: string;
  diaDiem: string;
  /** 1 dòng (hầu hết công ty) hoặc 2 dòng VI+EN (chỉ KOOLOG — tab gốc duy
   * nhất có đoạn giới thiệu song ngữ). */
  contractParagraph: string[];
  requestParagraph: string[];
  qrNoteBase: string;
};

const QR_ACCOUNT_NAMED_COMPANY: VietQrAccountKey = "1117777888";
const QR_ACCOUNT_KHAC: VietQrAccountKey = "16868889";

export const PAYMENT_REQUEST_COMPANIES: Record<PaymentRequestCompanyKey, CompanyStaticInfo> = {
  mtk: {
    key: "mtk",
    name: "CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ MINH THÀNH KHANG",
    mst: "0302779329",
    phone: "0915 781 111",
    diaDiem: "Tầng trệt số 10 Sông Thao, Phường Tân Sơn Hoà, TP.HCM",
    contractParagraph: [
      "Căn cứ vào hợp đồng thoả thuận thuê dịch vụ số 2026F1/HĐTVP/MX-MTK, ký ngày 18/05/2026 giữa CÔNG TY TNHH MAX OFFICE và CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ MINH THÀNH KHANG.",
    ],
    requestParagraph: [
      "Công ty chúng tôi kính đề nghị CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ MINH THÀNH KHANG thanh toán các khoản sau:",
    ],
    // Sửa lỗi chính tả "MINH THANH KHANH" (thiếu G) trong sheet gốc.
    qrNoteBase: "MINH THANH KHANG",
  },
  "tay-bac": {
    key: "tay-bac",
    name: "CÔNG TY TNHH KHÁM PHÁ DU LỊCH TÂY BẮC",
    mst: "0318634061",
    phone: "0975 038 502",
    diaDiem: "Phòng P702, Số 10 Sông Thao, Phường Tân Sơn Hoà, TP.HCM",
    // Số hợp đồng GIỐNG HỆT CUL trong sheet gốc — khả năng cao là lỗi
    // copy-paste của 2 công ty khác nhau, nhưng không có cơ sở để tự sửa
    // thành số nào khác nên giữ nguyên, xem comment đầu file.
    contractParagraph: [
      "Căn cứ vào hợp đồng thoả thuận thuê dịch vụ số S101-10ST/082024/HĐKT, ký ngày 01/08/2024 giữa CÔNG TY TNHH MAX OFFICE và CÔNG TY TNHH KHÁM PHÁ DU LỊCH TÂY BẮC.",
    ],
    requestParagraph: ["Công ty chúng tôi kính đề nghị CÔNG TY TNHH KHÁM PHÁ DU LỊCH TÂY BẮC thanh toán các khoản sau:"],
    qrNoteBase: "CTY TAY BAC",
  },
  cul: {
    key: "cul",
    name: "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ CUL",
    mst: "4401103899",
    phone: "0396 998 477",
    diaDiem: "Phòng P702A, Số 10 Sông Thao, Phường Tân Sơn Hoà, TP.HCM",
    contractParagraph: [
      "Căn cứ vào hợp đồng thoả thuận thuê dịch vụ số S101-10ST/082024/HĐKT, ký ngày 01/08/2024 giữa CÔNG TY TNHH MAX OFFICE và CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ CUL.",
    ],
    requestParagraph: ["Công ty chúng tôi kính đề nghị CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ CUL thanh toán các khoản sau:"],
    qrNoteBase: "CTY CUL",
  },
  koolog: {
    key: "koolog",
    name: "CÔNG TY TNHH KOOLOG INTERNATIONAL",
    mst: "2301265243",
    phone: "024 3201 3660",
    diaDiem: "Phòng P701, Số 10 Sông Thao, Phường Tân Sơn Hoà, TP.HCM",
    // Số hợp đồng VI/EN TỰ MÂU THUẪN ngay trong sheet gốc (S101 vs S102) —
    // giữ nguyên nội dung gốc, không tự chọn 1 trong 2 số, xem comment đầu
    // file.
    contractParagraph: [
      "Căn cứ vào hợp đồng thoả thuận thuê dịch vụ số S101-10ST/082024/HĐKT, ký ngày 21/05/2024 giữa CÔNG TY TNHH MAX OFFICE và CÔNG TY TNHH KOOLOG INTERNATIONAL.",
      "Based on the service rental agreement contract No. S102-10ST/2024/HDKT, signed on May 21, 2024 between MAX OFICE CO., LTD. and KOOLOG INTERNATIONAL CO., LTD.",
    ],
    requestParagraph: [
      "Công ty chúng tôi kính đề nghị CÔNG TY TNHH KOOLOG INTERNATIONAL thanh toán các khoản sau:",
      "Our company respectfully requests KOOLOG INTERNATIONAL COMPANY LIMITED to pay the following amounts:",
    ],
    qrNoteBase: "CTY KOOLOG",
  },
  "qe-agency": {
    key: "qe-agency",
    name: "CÔNG TY TNHH QE AGENCY",
    mst: "0318734806",
    phone: "0901 890 811",
    diaDiem: "Phòng P704, Số 10 Sông Thao, Phường Tân Sơn Hoà, TP.HCM",
    contractParagraph: [
      "Căn cứ vào hợp đồng thoả thuận thuê dịch vụ số LN260707/HĐKT, ký ngày 10/08/2026 giữa CÔNG TY TNHH MAX OFFICE và CÔNG TY TNHH QE AGENCY.",
    ],
    // Sửa lỗi lặp "Kính gửi:" giữa câu trong sheet gốc.
    requestParagraph: ["Công ty chúng tôi kính đề nghị CÔNG TY TNHH QE AGENCY thanh toán các khoản sau:"],
    qrNoteBase: "CTY QE AGENCY",
  },
};

export const PAYMENT_REQUEST_COMPANY_OPTIONS: { key: PaymentRequestCompanyKey; name: string }[] = [
  { key: "mtk", name: "Minh Thành Khang" },
  { key: "tay-bac", name: "Tây Bắc" },
  { key: "cul", name: "CUL" },
  { key: "koolog", name: "KOOLOG (hàng quý)" },
  { key: "qe-agency", name: "QE Agency" },
];

export type PaymentRequestLineItem = {
  stt: number;
  label: string;
  /** Dòng tiếng Anh thứ 2 — CHỈ KOOLOG dùng (song ngữ), các công ty khác
   * undefined. */
  labelEn?: string;
  /** Diễn giải cách tính ngắn gọn, hiện nhỏ dưới label (VD "5 xe ×
   * 150.000đ", "18.433 → 18.827 = 394 kWh × 4.500đ/kWh"). */
  detail?: string;
  amount: number;
  vatPercent: number;
  vatAmount: number;
  total: number;
};

function makeLine(params: { stt: number; label: string; labelEn?: string; detail?: string; amount: number; vatPercent: number }): PaymentRequestLineItem {
  const { stt, label, labelEn, detail, amount, vatPercent } = params;
  const vatAmount = Math.round((amount * vatPercent) / 100);
  return { stt, label, labelEn, detail, amount, vatPercent, vatAmount, total: amount + vatAmount };
}

export type PaymentRequestDebt = { description: string; amount: number };

export type PaymentRequestResult = {
  companyKey: PaymentRequestCompanyKey | "khac";
  companyName: string;
  mst: string;
  phone: string;
  /** undefined cho "Dịch vụ khác" — mẫu gốc không có dòng Địa điểm/Căn cứ
   * hợp đồng (là mẫu tự do, không gắn 1 hợp đồng thuê mặt bằng cụ thể). */
  diaDiem?: string;
  contractParagraph?: string[];
  requestParagraph?: string[];
  subjectLine: string;
  issueDateLabel: string;
  debt: PaymentRequestDebt | null;
  items: PaymentRequestLineItem[];
  grandTotal: number;
  qrAccountKey: VietQrAccountKey;
  qrNote: string;
};

export type PaymentRequestInputError = { error: string };

function isFiniteNonNegative(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

function isValidMonth(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 12;
}

function isValidYear(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 2020 && n <= 2100;
}

function isValidDay(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 31;
}

/** Pad số 0 CHỈ ở bước hiển thị cuối cùng này (ngày 5 -> "05") — ô nhập liệu
 * phía client KHÔNG pad khi đang gõ (xem MoneyInput/ô Ngày lập phiếu ở
 * PaymentRequestTool.tsx), tránh lỗi tự chèn số 0 giữa lúc gõ đã gặp trước
 * đây. */
function issueDateLabel(ngayLap: number, thang: number, nam: number): string {
  return `TPHCM, Ngày ${String(ngayLap).padStart(2, "0")} tháng ${thang} năm ${nam}`;
}

function debtLine(congNoDauKy: number, moTa: string, periodLabel: string): PaymentRequestDebt | null {
  if (congNoDauKy <= 0) return null;
  const description = `${moTa.trim() || "Công nợ đầu kỳ"} ${periodLabel}`;
  return { description, amount: congNoDauKy };
}

export type PaymentRequestInput =
  | {
      type: "mtk";
      ngayLap: number;
      thang: number;
      nam: number;
      tienThue: number;
      congNoDauKy: number;
      moTaCongNo: string;
      soXe: number;
      chiSoDau: number;
      chiSoCuoi: number;
      donGiaDien: number;
    }
  | {
      type: "tay-bac" | "cul";
      ngayLap: number;
      thang: number;
      nam: number;
      tienThue: number;
      congNoDauKy: number;
      soXe: number;
    }
  | {
      type: "koolog";
      ngayLap: number;
      thang: number;
      nam: number;
      quy: 1 | 2 | 3 | 4;
      tienThueThang: number;
      congNoDauKy: number;
      moTaCongNo: string;
      soXeCaQuy: number;
      dienKhoanCaQuy: number;
    }
  | {
      type: "qe-agency";
      ngayLap: number;
      thang: number;
      nam: number;
      /** Tiền thuê CỐ ĐỊNH, nhập tay (không còn tự tính) — xem
       * QE_AGENCY_DEFAULT_RENT ở trên. */
      tienThue: number;
      congNoDauKy: number;
      moTaCongNo: string;
      soXe: number;
      chiSoDau: number;
      chiSoCuoi: number;
      donGiaDien: number;
    }
  | {
      type: "khac";
      tenKhachHang: string;
      diaChi: string;
      mst: string;
      sdt: string;
      ngayLap: number;
      thang: number;
      nam: number;
      noiDungVv: string;
      noiDungCk: string;
      items: { tenDichVu: string; soTien: string; thueSuat: number }[];
    };

function resolveMtkOrQe(
  input: Extract<PaymentRequestInput, { type: "mtk" | "qe-agency" }>
): PaymentRequestResult | PaymentRequestInputError {
  const { type, ngayLap, thang, nam, tienThue, congNoDauKy, moTaCongNo, soXe, chiSoDau, chiSoCuoi, donGiaDien } = input;
  if (!isValidDay(ngayLap) || !isValidMonth(thang) || !isValidYear(nam)) {
    return { error: "Ngày lập phiếu/Tháng/Năm thanh toán không hợp lệ." };
  }
  if (!isFiniteNonNegative(tienThue) || !isFiniteNonNegative(congNoDauKy) || !isFiniteNonNegative(soXe) || !isFiniteNonNegative(donGiaDien)) {
    return { error: "Tiền thuê/Công nợ đầu kỳ/Số lượng xe/Đơn giá điện phải là số không âm." };
  }
  if (!isFiniteNonNegative(chiSoDau) || !isFiniteNonNegative(chiSoCuoi) || chiSoCuoi < chiSoDau) {
    return { error: "Chỉ số điện cuối kỳ phải lớn hơn hoặc bằng chỉ số đầu kỳ." };
  }
  const company = PAYMENT_REQUEST_COMPANIES[type];
  const { month: prevM, year: prevY } = prevMonth(thang, nam);
  const lastDay = daysInMonth(thang, nam);
  const kwh = chiSoCuoi - chiSoDau;
  const dienAmount = Math.round(kwh * donGiaDien);

  // QE Agency: tiền thuê CỐ ĐỊNH nhập tay (không còn công thức prorating
  // theo ngày) — CHỈ khác MTK ở NHÃN chu kỳ thuê ghi trên phiếu ("10/MM -
  // 10/MM+1" thay vì "01/MM - ngày cuối tháng/MM"), tự qua năm đúng khi
  // tháng hiện tại là 12.
  const rentLabel =
    type === "qe-agency"
      ? (() => {
          const { month: nextM, year: nextY } = nextMonth(thang, nam);
          return `Phí thuê văn phòng từ ngày ${QE_AGENCY_RENT_START_DAY}/${thang}/${nam} - ${QE_AGENCY_RENT_START_DAY}/${nextM}/${nextY}`;
        })()
      : `Phí thuê tầng trệt từ ngày 01/${thang} - ${lastDay}/${thang}/${nam}`;
  const rentAmount = tienThue;

  // Dòng xe/điện ẨN HẲN khi giá trị THỰC TẾ của đúng tháng đang lập phiếu
  // bằng 0 (không hiện "0đ") — STT đánh lại LIÊN TỤC cho các dòng còn hiện
  // (đổi quyết định so với trước: trước đây luôn hiện cả 3 dòng kể cả 0đ).
  // Tiền thuê luôn hiện (không có khái niệm "thuê = 0").
  const items: PaymentRequestLineItem[] = [makeLine({ stt: 1, label: rentLabel, amount: rentAmount, vatPercent: RENT_VAT_PERCENT })];
  let stt = 2;
  if (soXe > 0) {
    items.push(
      makeLine({
        stt: stt++,
        label: `Phí gửi xe tháng ${prevM}/${prevY}`,
        detail: `${soXe} xe × ${formatVnd(PARKING_FEE_PER_CAR)}`,
        amount: soXe * PARKING_FEE_PER_CAR,
        vatPercent: OTHER_VAT_PERCENT,
      })
    );
  }
  if (kwh > 0) {
    items.push(
      makeLine({
        stt: stt++,
        label: `Điện sinh hoạt tháng ${prevM}/${prevY}`,
        detail: `${chiSoDau.toLocaleString("vi-VN")} → ${chiSoCuoi.toLocaleString("vi-VN")} = ${kwh.toLocaleString("vi-VN")} kWh × ${formatVnd(donGiaDien)}/kWh`,
        amount: dienAmount,
        vatPercent: OTHER_VAT_PERCENT,
      })
    );
  }

  const debt = debtLine(congNoDauKy, moTaCongNo, `tháng ${prevM}/${prevY}`);
  const grandTotal = items.reduce((sum, it) => sum + it.total, 0) + (debt?.amount ?? 0);

  return {
    companyKey: type,
    companyName: company.name,
    mst: company.mst,
    phone: company.phone,
    diaDiem: company.diaDiem,
    contractParagraph: company.contractParagraph,
    requestParagraph: company.requestParagraph,
    subjectLine: `(V/v Thanh toán tiền thuê văn phòng tháng ${thang}/${nam})`,
    issueDateLabel: issueDateLabel(ngayLap, thang, nam),
    debt,
    items,
    grandTotal,
    qrAccountKey: QR_ACCOUNT_NAMED_COMPANY,
    qrNote: `${company.qrNoteBase} THANH TOAN VP THANG ${thang}`,
  };
}

function resolveTayBacCul(
  input: Extract<PaymentRequestInput, { type: "tay-bac" | "cul" }>
): PaymentRequestResult | PaymentRequestInputError {
  const { type, ngayLap, thang, nam, tienThue, congNoDauKy, soXe } = input;
  if (!isValidDay(ngayLap) || !isValidMonth(thang) || !isValidYear(nam)) {
    return { error: "Ngày lập phiếu/Tháng/Năm thanh toán không hợp lệ." };
  }
  if (!isFiniteNonNegative(tienThue) || !isFiniteNonNegative(congNoDauKy) || !isFiniteNonNegative(soXe)) {
    return { error: "Tiền thuê/Công nợ đầu kỳ/Số lượng xe phải là số không âm." };
  }
  const company = PAYMENT_REQUEST_COMPANIES[type];
  const { month: prevM, year: prevY } = prevMonth(thang, nam);
  const roomLabel = company.diaDiem.split(",")[0];

  // TB/CUL KHÁC resolveMtkOrQe/resolveKoolog: 2 dòng thuê/xe LUÔN hiện đủ,
  // KHÔNG ẩn dòng xe dù soXe = 0 — xác nhận rõ ràng theo yêu cầu (2 công ty
  // này không có khái niệm "điện", giữ nguyên cấu trúc cố định 2 dòng).
  const items: PaymentRequestLineItem[] = [
    makeLine({ stt: 1, label: `Phí thuê ${roomLabel.charAt(0).toLowerCase()}${roomLabel.slice(1)} tháng ${thang}/${nam}`, amount: tienThue, vatPercent: RENT_VAT_PERCENT }),
    makeLine({
      stt: 2,
      label: `Phí gửi xe tháng ${prevM}/${prevY}`,
      detail: `${soXe} xe × ${formatVnd(PARKING_FEE_PER_CAR)}`,
      amount: soXe * PARKING_FEE_PER_CAR,
      vatPercent: OTHER_VAT_PERCENT,
    }),
  ];

  // TB/CUL không có field "mô tả" riêng trong sheet gốc — chỉ 1 nhãn chung.
  const debt = debtLine(congNoDauKy, "", "");
  const grandTotal = items.reduce((sum, it) => sum + it.total, 0) + (debt?.amount ?? 0);

  return {
    companyKey: type,
    companyName: company.name,
    mst: company.mst,
    phone: company.phone,
    diaDiem: company.diaDiem,
    contractParagraph: company.contractParagraph,
    requestParagraph: company.requestParagraph,
    subjectLine: `(V/v Thanh toán tiền thuê văn phòng tháng ${thang}/${nam})`,
    issueDateLabel: issueDateLabel(ngayLap, thang, nam),
    debt,
    items,
    grandTotal,
    qrAccountKey: QR_ACCOUNT_NAMED_COMPANY,
    qrNote: `${company.qrNoteBase} THANH TOAN VP THANG ${thang}`,
  };
}

function resolveKoolog(input: Extract<PaymentRequestInput, { type: "koolog" }>): PaymentRequestResult | PaymentRequestInputError {
  const { ngayLap, thang, nam, quy, tienThueThang, congNoDauKy, moTaCongNo, soXeCaQuy, dienKhoanCaQuy } = input;
  if (!isValidDay(ngayLap) || !isValidMonth(thang) || !isValidYear(nam)) {
    return { error: "Ngày lập phiếu/Tháng/Năm thanh toán không hợp lệ." };
  }
  if (quy !== 1 && quy !== 2 && quy !== 3 && quy !== 4) {
    return { error: "Quý số không hợp lệ — chỉ nhận 1, 2, 3 hoặc 4." };
  }
  if (
    !isFiniteNonNegative(tienThueThang) ||
    !isFiniteNonNegative(congNoDauKy) ||
    !isFiniteNonNegative(soXeCaQuy) ||
    !isFiniteNonNegative(dienKhoanCaQuy)
  ) {
    return { error: "Tiền thuê/Công nợ đầu kỳ/Số xe/Điện khoán phải là số không âm." };
  }
  const company = PAYMENT_REQUEST_COMPANIES.koolog;
  const periodLabel = `Quý ${quy}/${nam}`;
  const periodLabelEn = `Q${quy}/${nam}`;

  // Tiền thuê: GIỮ NGUYÊN logic ×3 cho cả quý — CHỈ field này còn nhân,
  // không đổi theo yêu cầu (khác xe/điện khoán, nay nhập thẳng tổng quý).
  // Dòng xe/điện khoán ẨN khi = 0 cho đúng quý đang lập — CÙNG quy tắc với
  // resolveMtkOrQe (KOOLOG có khái niệm "điện" nên xếp cùng nhóm với
  // MTK/QE, khác nhóm Tây Bắc/CUL không có điện).
  const rentQuarterAmount = tienThueThang * 3;
  const items: PaymentRequestLineItem[] = [
    makeLine({
      stt: 1,
      label: `Phí thuê phòng P701 ${periodLabel}`,
      labelEn: `Room P701 rental fee ${periodLabelEn}`,
      detail: `${formatVnd(tienThueThang)}/tháng × 3 tháng`,
      amount: rentQuarterAmount,
      vatPercent: RENT_VAT_PERCENT,
    }),
  ];
  let stt = 2;
  if (soXeCaQuy > 0) {
    items.push(
      makeLine({
        stt: stt++,
        label: `Phí gửi xe ${periodLabel}`,
        labelEn: `Parking fee ${periodLabelEn}`,
        detail: `${soXeCaQuy} xe (cả quý) × ${formatVnd(PARKING_FEE_PER_CAR)}`,
        amount: soXeCaQuy * PARKING_FEE_PER_CAR,
        vatPercent: OTHER_VAT_PERCENT,
      })
    );
  }
  if (dienKhoanCaQuy > 0) {
    items.push(
      makeLine({
        stt: stt++,
        label: `Phụ thu điện sinh hoạt ${periodLabel}`,
        labelEn: `Electricity surcharge ${periodLabelEn}`,
        amount: dienKhoanCaQuy,
        vatPercent: OTHER_VAT_PERCENT,
      })
    );
  }

  const debt = debtLine(congNoDauKy, moTaCongNo, periodLabel);
  const grandTotal = items.reduce((sum, it) => sum + it.total, 0) + (debt?.amount ?? 0);

  return {
    companyKey: "koolog",
    companyName: company.name,
    mst: company.mst,
    phone: company.phone,
    diaDiem: company.diaDiem,
    contractParagraph: company.contractParagraph,
    requestParagraph: company.requestParagraph,
    subjectLine: `(V/v Thanh toán tiền thuê văn phòng ${periodLabel})`,
    issueDateLabel: issueDateLabel(ngayLap, thang, nam),
    debt,
    items,
    grandTotal,
    qrAccountKey: QR_ACCOUNT_NAMED_COMPANY,
    qrNote: `${company.qrNoteBase} THANH TOAN PHI QUY ${quy} ${nam}`,
  };
}

function resolveKhac(input: Extract<PaymentRequestInput, { type: "khac" }>): PaymentRequestResult | PaymentRequestInputError {
  const { tenKhachHang, diaChi, mst, sdt, ngayLap, thang, nam, noiDungVv, noiDungCk, items: rawItems } = input;
  if (!tenKhachHang.trim()) return { error: "Vui lòng nhập tên khách hàng (Kính gửi)." };
  if (!isValidDay(ngayLap) || !isValidMonth(thang) || !isValidYear(nam)) {
    return { error: "Ngày lập phiếu/Tháng/Năm không hợp lệ." };
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "Cần ít nhất 1 dòng dịch vụ." };
  }
  if (rawItems.length > 20) {
    return { error: "Chỉ hỗ trợ tối đa 20 dòng dịch vụ." };
  }

  const items: PaymentRequestLineItem[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    const row = rawItems[i];
    if (!row.tenDichVu.trim()) return { error: `Dòng dịch vụ thứ ${i + 1} chưa có tên.` };
    const amount = parseVndAmount(row.soTien);
    if (amount == null) return { error: `Dòng "${row.tenDichVu}" chưa nhập số tiền hợp lệ.` };
    if (!Number.isFinite(row.thueSuat) || row.thueSuat < 0 || row.thueSuat > 100) {
      return { error: `Dòng "${row.tenDichVu}" có thuế suất không hợp lệ (0-100%).` };
    }
    items.push(makeLine({ stt: i + 1, label: row.tenDichVu.trim(), amount, vatPercent: row.thueSuat }));
  }

  const grandTotal = items.reduce((sum, it) => sum + it.total, 0);

  return {
    companyKey: "khac",
    companyName: tenKhachHang.trim(),
    mst: mst.trim(),
    phone: sdt.trim(),
    diaDiem: diaChi.trim() || undefined,
    subjectLine: noiDungVv.trim() || `(V/v Thanh toán dịch vụ tháng ${thang}/${nam})`,
    issueDateLabel: issueDateLabel(ngayLap, thang, nam),
    debt: null,
    items,
    grandTotal,
    qrAccountKey: QR_ACCOUNT_KHAC,
    qrNote: noiDungCk.trim() || `${tenKhachHang.trim() || "Khach hang MAX OFFICE"} thanh toan phi dich vu`,
  };
}

export function resolvePaymentRequest(input: PaymentRequestInput): PaymentRequestResult | PaymentRequestInputError {
  switch (input.type) {
    case "mtk":
    case "qe-agency":
      return resolveMtkOrQe(input);
    case "tay-bac":
    case "cul":
      return resolveTayBacCul(input);
    case "koolog":
      return resolveKoolog(input);
    case "khac":
      return resolveKhac(input);
  }
}
