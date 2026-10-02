import { PAYMENT_REQUEST_COMPANIES, type CompanyStaticInfo, type PaymentRequestCompanyKey } from "./paymentRequestData";

/**
 * Đọc thông tin TĨNH của 5 công ty (tên đầy đủ/MST/SĐT/địa chỉ thuê/số HĐ/
 * ngày ký...) từ tab "⚙️ DANH_MUC_CONG_TY" trong Sheet DNTT_MAX_OFFICE —
 * GHI ĐÈ dần lên dữ liệu hardcode trong paymentRequestData.ts, để sau này
 * hết hạn thuê/đổi khách/sửa SĐT-địa chỉ chỉ cần sửa TRỰC TIẾP trên Google
 * Sheets (quen thuộc, không cần Claude Code) — công cụ tự đọc đúng dữ liệu
 * mới ở lần tạo phiếu kế tiếp.
 *
 * TẠI THỜI ĐIỂM VIẾT FILE NÀY, tab ⚙️ DANH_MUC_CONG_TY CHƯA CÓ các cột cần
 * thiết (tab đó hiện chỉ chứa cấu hình TRỎ Ô cho tab "DATA NHẬP" — Mã/Tên
 * công ty hiển thị/VAT%(vestigial)/Có điện/Định kỳ/Kích hoạt/Ô Ngày lập/Ô
 * Tiền thuê/.../Ô Điện khoán — HOÀN TOÀN không có MST/SĐT/địa chỉ/số HĐ/
 * ngày ký, xem báo cáo đã gửi kèm theo thay đổi này). Hàm bên dưới ĐỌC AN
 * TOÀN theo TÊN CỘT (không theo vị trí): cột nào CHƯA TỒN TẠI hoặc Ô nào
 * CÒN TRỐNG thì GIỮ NGUYÊN giá trị hardcode tương ứng — không có gì "biến
 * mất" ở trạng thái hiện tại, và MỘT KHI chủ site tự thêm đủ cột + điền dữ
 * liệu (đúng tên cột đã liệt kê trong báo cáo), công cụ TỰ ĐỘNG đọc đúng,
 * KHÔNG cần sửa code thêm lần nào.
 *
 * KHÔNG tự "phát hiện công ty mới": chỉ 5 mã ở SHEET_CODE_TO_KEY được nhận
 * diện — 1 dòng "Mã" lạ (công ty thật sự mới) sẽ bị bỏ qua hoàn toàn, xem
 * comment SHEET_CODE_TO_KEY để biết lý do (loại hình tính phí quyết định cả
 * bộ field form lẫn công thức tính, không suy ra được chỉ từ dữ liệu tĩnh).
 *
 * AN TOÀN KHI SHEETS LỖI: gọi API lỗi bất kỳ lý do gì (mất mạng, đổi quyền
 * chia sẻ, sai key...) đều rơi về NGUYÊN VẸN dữ liệu hardcode — đây là 1
 * nguồn dữ liệu PHỤ (tăng tiện lợi khi cập nhật), không phải phụ thuộc
 * cứng mà thiếu nó công cụ không hoạt động được.
 */

const SHEET_ID = "1FpERe4O0ckFTnXivWgOMqfqcAcj8DOUTWJzdnHpUT_U";
const TAB_NAME = "⚙️ DANH_MUC_CONG_TY";

const SHEET_CODE_TO_KEY: Record<string, PaymentRequestCompanyKey> = {
  MTK: "mtk",
  TB: "tay-bac",
  CUL: "cul",
  KL: "koolog",
  CTY213835: "qe-agency",
};

/** Field nào đọc từ cột nào (TÊN HEADER ở dòng 1 tab, không phải vị trí) —
 * đây chính là danh sách cột cần chủ site tự thêm vào tab ⚙️
 * DANH_MUC_CONG_TY (xem báo cáo đầy đủ). */
const HEADER_MAP: Record<
  "name" | "nameEn" | "mst" | "phone" | "diaDiem" | "areaLabel" | "contractNumber" | "contractDate" | "contractNumberEn" | "contractDateEn" | "qrNoteBase",
  string
> = {
  name: "Tên công ty đầy đủ",
  nameEn: "Tên công ty tiếng Anh",
  mst: "MST",
  phone: "SĐT",
  diaDiem: "Địa chỉ thuê",
  areaLabel: "Khu vực thuê",
  contractNumber: "Số hợp đồng",
  contractDate: "Ngày ký hợp đồng",
  contractNumberEn: "Số hợp đồng (tiếng Anh)",
  contractDateEn: "Ngày ký hợp đồng (tiếng Anh)",
  qrNoteBase: "Mã định danh nội dung CK",
};

async function fetchSheetRows(): Promise<string[][] | null> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return null;
  try {
    const range = `${TAB_NAME}!A1:Z30`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { values?: string[][] };
    return json.values ?? null;
  } catch {
    return null;
  }
}

/** Trả về company registry ĐÃ MERGE dữ liệu Sheets (nếu đọc được) lên trên
 * hardcode — KHÔNG BAO GIỜ throw, luôn trả về 1 registry dùng được (tệ nhất
 * là y hệt PAYMENT_REQUEST_COMPANIES gốc). */
export async function getPaymentRequestCompanies(): Promise<Record<PaymentRequestCompanyKey, CompanyStaticInfo>> {
  const rows = await fetchSheetRows();
  if (!rows || rows.length < 2) return PAYMENT_REQUEST_COMPANIES;

  const header = rows[0].map((h) => h.trim());
  const maIdx = header.findIndex((h) => h === "Mã");
  if (maIdx === -1) return PAYMENT_REQUEST_COMPANIES;

  const colIndex = (headerName: string) => header.findIndex((h) => h === headerName);
  const fieldIndex = Object.fromEntries(
    (Object.keys(HEADER_MAP) as (keyof typeof HEADER_MAP)[]).map((field) => [field, colIndex(HEADER_MAP[field])])
  ) as Record<keyof typeof HEADER_MAP, number>;

  const result = { ...PAYMENT_REQUEST_COMPANIES };
  for (const row of rows.slice(1)) {
    const code = (row[maIdx] ?? "").trim();
    const key = SHEET_CODE_TO_KEY[code];
    if (!key) continue;

    const next: CompanyStaticInfo = { ...result[key] };
    for (const field of Object.keys(HEADER_MAP) as (keyof typeof HEADER_MAP)[]) {
      const idx = fieldIndex[field];
      if (idx === -1) continue; // cột chưa tồn tại trên Sheets -> giữ hardcode
      const value = (row[idx] ?? "").trim();
      if (!value) continue; // ô trống -> giữ hardcode, không ghi đè bằng rỗng
      (next as Record<string, string>)[field] = value;
    }
    result[key] = next;
  }
  return result;
}
