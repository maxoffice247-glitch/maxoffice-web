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
  /** Mật khẩu tra cứu riêng — CHỈ áp dụng cho nguồn "moc-gia" (cột "Mật
      khẩu tra cứu" tự thêm trong sheet DU_LIEU, nhân viên điền tay khi
      khách không có SĐT/email để xác minh qua OTP). Luôn null với nguồn
      "tru-so-chinh" (không có cột này). Null/rỗng nếu nhân viên chưa điền
      — khi đó, nếu record cũng không có phone/email, Mức 1 báo CSKH như
      trước, KHÔNG tự đoán/tạo mật khẩu. */
  lookupPassword: string | null;
  links: ContractLink[];
};

/** Phiên tra cứu — nối 3 mức hiển thị:
      Mức 1 (search): tạo phiên, chỉ có các trường *Masked + *Full (server
        dùng *Full để so khớp Mức 2, KHÔNG BAO GIỜ gửi *Full cho client).
      Mức 2 (confirm): khách nhập lại SĐT/email ĐẦY ĐỦ, so với *Full — khớp
        thì `confirmed=true` + tự gửi OTP tới `emailFull` (nếu có).
      Mức 3 (verify-otp): CHỈ cho kiểm OTP khi `confirmed=true` (phòng thủ
        thêm — thực tế OTP cũng chưa tồn tại trong Redis nếu chưa qua Mức
        2, nhưng chặn tường minh ở đây rõ ràng hơn). */
export type LookupSession = {
  mst: string;
  contractNumber: string;
  companyName: string;
  phoneFull: string | null;
  phoneMasked: string | null;
  emailFull: string | null;
  emailMasked: string | null;
  /** Mật khẩu tra cứu ĐẦY ĐỦ (từ record.lookupPassword) — CHỈ khác null
      khi record KHÔNG có cả phone lẫn email (xem search/route.ts: nhánh
      "password" của Mức 1). Không bao giờ vừa có contact vừa có giá trị
      này — 2 cơ chế xác minh loại trừ nhau theo đúng dữ liệu record. */
  lookupPasswordFull: string | null;
  confirmed: boolean;
  confirmAttempts: number;
  otpAttempts: number;
  createdAt: number;
};

export type SearchOutcome =
  | { type: "not_found" }
  | { type: "ambiguous" }
  | { type: "found"; record: ContractRecord };

/** Đơn đăng ký mới (Phase 2, Luồng B) — xem order.ts. */
export type PendingOrderStatus = "pending" | "paid";

export type PendingOrder = {
  orderCode: string;
  status: PendingOrderStatus;
  customerName: string;
  mst: string | null;
  phone: string;
  email: string | null;
  locationSlug: string;
  locationName: string;
  planKey: string;
  planName: string;
  price: number;
  createdAt: number;
  paidAt: number | null;
};
