/** Kiểu dữ liệu dùng chung cho cổng thông tin khách hàng (portal) — Phase 1:
    tra cứu hợp đồng 2 bước (fuzzy search + OTP email). Xem chú thích chi
    tiết từng nguồn trong sheetsSource.ts. */

export type ContractStatus = "active" | "expired" | "pending_payment";

export type ContractLink = {
  /** Nhãn hiển thị cho khách, VD "Hợp đồng (PDF)", "Phụ lục gia hạn lần 1". */
  label: string;
  url: string;
};

/** 1 bản ghi hợp đồng đã chuẩn hoá — gộp từ 1 trong 2 nguồn (Mộc Gia/trụ sở
    chính), đã JOIN sẵn link hợp đồng (trụ sở chính) nếu có. */
export type ContractRecord = {
  source: "moc-gia" | "tru-so-chinh";
  companyName: string;
  /** Chỉ giữ chữ số — dùng để so khớp, KHÔNG dùng để hiển thị (hiển thị
      dùng mstDisplay giữ nguyên bản gốc, có thể có số 0 đầu bị Sheets cắt
      hay dấu nháy đơn còn sót). */
  mst: string;
  mstDisplay: string;
  contractNumber: string;
  branch: string;
  startDate: string | null; // ISO yyyy-MM-dd, null nếu không đọc được
  endDate: string | null;
  totalValue: number | null;
  status: ContractStatus;
  /** Giá trị gốc chưa chuẩn hoá của cột trạng thái/thanh toán — giữ lại để
      debug/đối chiếu khi cần, KHÔNG hiển thị thẳng cho khách. */
  statusRaw: string;
  email: string | null;
  phone: string | null;
  links: ContractLink[];
};

export type LookupSession = {
  mst: string;
  contractNumber: string;
  companyNameMasked: string;
  email: string;
  emailMasked: string;
  attempts: number;
  createdAt: number;
};

export type SearchOutcome =
  | { type: "not_found" }
  | { type: "ambiguous" }
  | { type: "found"; record: ContractRecord };
