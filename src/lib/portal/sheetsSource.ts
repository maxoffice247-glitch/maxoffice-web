import type { ContractLink, ContractRecord } from "./types";
import { statusFromMocGia, statusFromTruSoChinh } from "./contractStatus";
import { normalizeMst } from "./normalize";

/** 3 sheet nguồn — ID + tên tab đã XÁC NHẬN THẬT bằng cách mở trực tiếp
    (xem lịch sử trao đổi), KHÔNG phải đoán. Cả 3 đều chia sẻ ở chế độ
    "Bất kỳ ai có đường liên kết đều có thể xem" — đọc qua Sheets API v4
    CHỈ CẦN 1 API key (không cần OAuth/service account), đơn giản hơn hẳn
    cho việc thiết lập ban đầu. */
export const SHEET_SOURCES = {
  mocGia: {
    spreadsheetId: "1zymSx5-KifJtcs58rmfct4UJBMvdsOQPUgyMshrNeRQ",
    sheetName: "DU_LIEU",
    // Cột đã xác nhận: C Tên công ty, D Số hợp đồng, E MST, F Tòa nhà thuê,
    // H Từ ngày, I Đến ngày, Q Tổng giá trị (đã gồm VAT), T Thanh toán,
    // X Link hợp đồng. Đã rà TOÀN BỘ cột A-Z (header thật): sheet này KHÔNG
    // có cột SĐT/email nào — khách nguồn Mộc Gia không có cách xác minh
    // qua OTP. Dùng 1 MẬT KHẨU DÙNG CHUNG cho cả nhóm (biến môi trường
    // PORTAL_MOC_GIA_SHARED_PASSWORD, xem search/route.ts) thay vì đọc
    // mật khẩu riêng từng dòng — KHÔNG cần thêm cột nào vào Sheets.
    range: "DU_LIEU!A3:X",
  },
  truSoChinh: {
    spreadsheetId: "1iTDwrraikciwP0k-5dXhlMb1qPfH1cebYhekpFgPc54",
    sheetName: "DANH SÁCH KHÁCH HÀNG",
    // Cột đã xác nhận: C Tên công ty, D Chi nhánh, E Số hợp đồng, F MST,
    // G SĐT, K Ngày bắt đầu, L Ngày kết thúc, O Thành tiền, P Trạng thái.
    range: "DANH SÁCH KHÁCH HÀNG!A3:S",
  },
  hopDongThue: {
    spreadsheetId: "1PnnrjH1CGpaa5I6U2nGPKNh5v_z3cnvRYgCGMFVJNVM",
    sheetName: "HĐ THUÊ",
    // Cột đã xác nhận: B Số HĐ, J SĐT, K Email, L MST, Z Link HĐ (docx),
    // AA Link PDF.
    range: "HĐ THUÊ!A2:AA",
  },
  phuLucHd: {
    spreadsheetId: "1PnnrjH1CGpaa5I6U2nGPKNh5v_z3cnvRYgCGMFVJNVM",
    sheetName: "PHU LUC HĐ",
    // Cột đã xác nhận: B Số HĐ gốc, C Số PLGH, I SĐT, J Email, K MST,
    // Z Link PDF.
    range: "PHU LUC HĐ!A2:Z",
  },
} as const;

/** "23/07/2027" -> "2027-07-23". Trả null nếu không đúng định dạng dd/mm/yyyy
    (ô trống, lỗi nhập liệu...) — KHÔNG throw, để 1 dòng lỗi không làm hỏng
    toàn bộ việc đọc sheet. */
export function parseVnDate(raw: string): string | null {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

/** "6.586.800" hoặc "6586800" -> 6586800. Trả null nếu rỗng/không phải số. */
export function parseVnNumber(raw: string): number | null {
  const digitsOnly = raw.trim().replace(/[^0-9]/g, "");
  if (digitsOnly.length === 0) return null;
  const value = Number(digitsOnly);
  return Number.isFinite(value) ? value : null;
}

function cell(row: string[], index: number): string {
  return (row[index] ?? "").toString().trim();
}

type DataFormLink = { mst: string; email: string | null; phone: string | null; link: ContractLink | null };

/** Tab "HĐ THUÊ" của DATA_FORM_NHAP — 1 dòng = 1 hợp đồng gốc. */
export function mapHopDongThueRow(row: string[]): DataFormLink | null {
  const mst = normalizeMst(cell(row, 11)); // L
  if (!mst) return null;
  const phone = cell(row, 9) || null; // J
  const email = cell(row, 10) || null; // K
  const linkDocx = cell(row, 25); // Z
  const linkPdf = cell(row, 26); // AA
  const link: ContractLink | null = linkPdf
    ? { label: "Hợp đồng thuê (PDF)", url: linkPdf }
    : linkDocx
      ? { label: "Hợp đồng thuê (Doc)", url: linkDocx }
      : null;
  return { mst, email, phone, link };
}

/** Tab "PHU LUC HĐ" của DATA_FORM_NHAP — 1 dòng = 1 lần gia hạn. Có thể có
    NHIỀU dòng cùng MST (gia hạn nhiều lần) — hàm gọi (buildContractRecords)
    gộp thành mảng link, không ghi đè. */
export function mapPhuLucRow(row: string[]): DataFormLink | null {
  const mst = normalizeMst(cell(row, 10)); // K
  if (!mst) return null;
  const phone = cell(row, 8) || null; // I
  const email = cell(row, 9) || null; // J
  const soPlgh = cell(row, 2); // C — dùng làm nhãn cho rõ lần gia hạn nào
  const linkPdf = cell(row, 25); // Z
  const link: ContractLink | null = linkPdf
    ? { label: soPlgh ? `Phụ lục gia hạn ${soPlgh} (PDF)` : "Phụ lục gia hạn (PDF)", url: linkPdf }
    : null;
  return { mst, email, phone, link };
}

/** Tab "DU_LIEU" (Mộc Gia) — nguồn TỰ CHỨA link hợp đồng, không cần JOIN. */
export function mapMocGiaRow(row: string[], today: Date): ContractRecord | null {
  const companyName = cell(row, 2); // C
  if (!companyName) return null;
  const contractNumber = cell(row, 3); // D
  const mstDisplay = cell(row, 4); // E
  const mst = normalizeMst(mstDisplay);
  const branch = cell(row, 5); // F
  const startDate = parseVnDate(cell(row, 7)); // H
  const endDate = parseVnDate(cell(row, 8)); // I
  const totalValue = parseVnNumber(cell(row, 16)); // Q
  const paymentStatusRaw = cell(row, 19); // T
  const linkUrl = cell(row, 23); // X

  return {
    source: "moc-gia",
    companyName,
    mst,
    mstDisplay,
    contractNumber,
    branch,
    startDate,
    endDate,
    totalValue,
    status: statusFromMocGia(paymentStatusRaw, endDate, today),
    statusRaw: paymentStatusRaw,
    email: null, // sheet Mộc Gia không có cột email
    phone: null, // không có cột SĐT ở DU_LIEU
    links: linkUrl ? [{ label: "Hợp đồng (PDF)", url: linkUrl }] : [],
  };
}

/** Tab "DANH SÁCH KHÁCH HÀNG" (trụ sở chính) — CHƯA có link/email/phone
    đầy đủ, cần JOIN thêm bằng `dataFormLinksByMst` (xem buildContractRecords). */
export function mapTruSoChinhRow(row: string[], today: Date): ContractRecord | null {
  const companyName = cell(row, 2); // C
  if (!companyName) return null;
  const branch = cell(row, 3); // D
  const contractNumber = cell(row, 4); // E
  const mstDisplay = cell(row, 5); // F
  const mst = normalizeMst(mstDisplay);
  const phone = cell(row, 6) || null; // G
  const startDate = parseVnDate(cell(row, 10)); // K
  const endDate = parseVnDate(cell(row, 11)); // L
  const totalValue = parseVnNumber(cell(row, 14)); // O
  const statusRaw = cell(row, 15); // P

  return {
    source: "tru-so-chinh",
    companyName,
    mst,
    mstDisplay,
    contractNumber,
    branch,
    startDate,
    endDate,
    totalValue,
    status: statusFromTruSoChinh(statusRaw, endDate, today),
    statusRaw,
    email: null, // điền sau khi JOIN
    phone,
    links: [], // điền sau khi JOIN
  };
}

/** Gộp toàn bộ 4 nguồn thành 1 mảng ContractRecord duy nhất — THUẦN, nhận
    dữ liệu thô đã đọc sẵn (không tự fetch), để test được đầy đủ logic gộp
    +JOIN mà không cần gọi Sheets API thật. `today` truyền vào để test xác
    định (xem contractStatus.ts). */
export function buildContractRecords(
  raw: {
    mocGiaRows: string[][];
    truSoChinhRows: string[][];
    hopDongThueRows: string[][];
    phuLucHdRows: string[][];
  },
  today: Date
): ContractRecord[] {
  const dataFormByMst = new Map<string, { email: string | null; phone: string | null; links: ContractLink[] }>();

  function mergeDataFormLink(entry: DataFormLink | null) {
    if (!entry) return;
    const existing = dataFormByMst.get(entry.mst) ?? { email: null, phone: null, links: [] };
    if (entry.link) existing.links.push(entry.link);
    // Email/SĐT: giữ giá trị ĐẦU TIÊN tìm thấy cho MST đó (hiếm khi có
    // nhiều dòng cùng MST với 2 email khác nhau; nếu có, ưu tiên dòng gặp
    // trước theo thứ tự đọc — HĐ THUÊ trước PHỤ LỤC HĐ, xem thứ tự gọi
    // hàm này bên dưới).
    if (!existing.email && entry.email) existing.email = entry.email;
    if (!existing.phone && entry.phone) existing.phone = entry.phone;
    dataFormByMst.set(entry.mst, existing);
  }

  for (const row of raw.hopDongThueRows) mergeDataFormLink(mapHopDongThueRow(row));
  for (const row of raw.phuLucHdRows) mergeDataFormLink(mapPhuLucRow(row));

  const mocGia = raw.mocGiaRows.map((row) => mapMocGiaRow(row, today)).filter((r): r is ContractRecord => r !== null);

  const truSoChinh = raw.truSoChinhRows
    .map((row) => mapTruSoChinhRow(row, today))
    .filter((r): r is ContractRecord => r !== null)
    .map((record) => {
      const joined = dataFormByMst.get(record.mst);
      if (!joined) return record;
      return {
        ...record,
        email: record.email ?? joined.email,
        phone: record.phone ?? joined.phone,
        links: joined.links,
      };
    });

  return [...mocGia, ...truSoChinh];
}

/** Gọi Google Sheets API v4 (values.get) cho 1 range — CHỈ dùng API key
    (không OAuth) vì cả 3 sheet đều ở chế độ "Bất kỳ ai có link đều xem
    được". CHƯA kiểm thử được với API key thật trong phiên làm việc này
    (sandbox không có key) — xem báo cáo kèm theo. */
async function fetchSheetValues(spreadsheetId: string, range: string, apiKey: string): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Sheets API lỗi ${res.status} cho range "${range}": ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { values?: string[][] };
  return json.values ?? [];
}

export async function fetchAllContractRecords(today: Date = new Date()): Promise<ContractRecord[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) throw new Error("Thiếu GOOGLE_SHEETS_API_KEY — xem .env.example.");

  const [mocGiaRows, truSoChinhRows, hopDongThueRows, phuLucHdRows] = await Promise.all([
    fetchSheetValues(SHEET_SOURCES.mocGia.spreadsheetId, SHEET_SOURCES.mocGia.range, apiKey),
    fetchSheetValues(SHEET_SOURCES.truSoChinh.spreadsheetId, SHEET_SOURCES.truSoChinh.range, apiKey),
    fetchSheetValues(SHEET_SOURCES.hopDongThue.spreadsheetId, SHEET_SOURCES.hopDongThue.range, apiKey),
    fetchSheetValues(SHEET_SOURCES.phuLucHd.spreadsheetId, SHEET_SOURCES.phuLucHd.range, apiKey),
  ]);

  return buildContractRecords({ mocGiaRows, truSoChinhRows, hopDongThueRows, phuLucHdRows }, today);
}
