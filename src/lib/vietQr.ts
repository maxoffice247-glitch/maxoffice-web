/**
 * Mã QR chuyển khoản VietQR nhúng vào ảnh báo giá tổng hợp — TÙY CHỌN, tắt
 * mặc định (xem CompositeQuoteTool.tsx). Dùng API ảnh công khai
 * img.vietqr.io (không cần khoá API, được nhiều app ngân hàng/ví điện tử
 * Việt Nam hỗ trợ) — KHÔNG có SDK/thư viện VietQR nào trong repo này để tái
 * sử dụng, đây là lần đầu tích hợp.
 *
 * Tài khoản nhận CỐ ĐỊNH của công ty — nhân viên/khách chỉ được CHỌN 1
 * trong các tài khoản khai báo sẵn ở đây, KHÔNG được tự gõ số tài khoản
 * bất kỳ trên form, tránh rủi ro chuyển QR nhận tiền sai tài khoản. Thêm
 * tài khoản mới: chỉ thêm 1 entry vào VIETQR_ACCOUNTS, không cần sửa gì
 * thêm ở route.tsx/CompositeQuoteTool.tsx (cả 2 đều đọc động từ đây).
 */
export type VietQrAccountKey = "1117777888" | "16868889";

export const VIETQR_ACCOUNTS: Record<
  VietQrAccountKey,
  { bankCode: string; accountNumber: string; accountName: string }
> = {
  "1117777888": { bankCode: "TCB", accountNumber: "1117777888", accountName: "CTY MAX OFFICE" },
  // Tên ĐẦY ĐỦ "CÔNG TY TNHH MAX OFFICE" (khác tài khoản 1 dùng tên rút
  // gọn) — áp dụng THỐNG NHẤT cho CẢ 2 công cụ dùng chung registry này
  // (CompositeQuoteTool VÀ PaymentRequestTool), theo đúng xác nhận khi
  // thêm ô chọn tài khoản cho công cụ Đề nghị thanh toán.
  "16868889": { bankCode: "TCB", accountNumber: "16868889", accountName: "CÔNG TY TNHH MAX OFFICE" },
};

/** Tài khoản mặc định khi bật QR mà không đổi lựa chọn — GIỮ NGUYÊN tài
 * khoản đã dùng trước khi có tính năng chọn nhiều tài khoản này, để không
 * đổi hành vi mặc định đã có. */
export const DEFAULT_VIETQR_ACCOUNT_KEY: VietQrAccountKey = "1117777888";

/** Thứ tự hiển thị trên form — liệt kê TƯỜNG MINH thay vì
 * `Object.keys(VIETQR_ACCOUNTS)`: cả 2 key hiện tại đều là chuỗi toàn chữ
 * số ("1117777888"/"16868889"), mà JS tự sắp xếp key kiểu này theo thứ tự
 * SỐ TĂNG DẦN bất kể thứ tự khai báo trong object literal (đã xác nhận:
 * Object.keys({"1117777888":1,"16868889":2}) -> ["16868889",
 * "1117777888"]) — dựa vào Object.keys() sẽ vô tình đẩy tài khoản mặc định
 * xuống vị trí 2, gây hiểu nhầm khi hiển thị. */
export const VIETQR_ACCOUNT_KEYS: VietQrAccountKey[] = ["1117777888", "16868889"];

export function isVietQrAccountKey(value: unknown): value is VietQrAccountKey {
  return typeof value === "string" && Object.hasOwn(VIETQR_ACCOUNTS, value);
}

/**
 * Tài khoản THU HỘ — CỐ ĐỊNH, KHÔNG cho nhân viên/khách chọn như
 * VIETQR_ACCOUNTS ở trên (2 tài khoản CÔNG TY). MAX OFFICE chỉ THU HỘ cho
 * đơn vị cung cấp Chữ ký số/Hoá đơn điện tử (xem compositeQuote.ts,
 * servicesData.ts CHU_KY_SO_TIERS/HOA_DON_DIEN_TU_TIERS) — tiền 2 dịch vụ
 * này PHẢI vào tài khoản CÁ NHÂN này, tuyệt đối không gộp chung/đổi sang tài
 * khoản công ty, nên khai báo tách biệt hẳn khỏi VIETQR_ACCOUNTS thay vì
 * thêm 1 key nữa vào đó (tránh nhầm lẫn khi liệt kê tài khoản "chọn được").
 */
export const THU_HO_ACCOUNT = {
  bankCode: "TCB",
  accountNumber: "5555668899",
  accountName: "DUONG MANH HUNG",
} as const;

export function thuHoAccountLabel(): string {
  return `${THU_HO_ACCOUNT.bankCode} — ${THU_HO_ACCOUNT.accountNumber} — ${THU_HO_ACCOUNT.accountName}`;
}

/** Bỏ dấu tiếng Việt cho nội dung chuyển khoản (`addInfo`) — 1 số app ngân
 * hàng hiển thị lỗi font hoặc cắt bớt nội dung có dấu trong QR chuyển
 * khoản, bỏ dấu để đảm bảo hiển thị đúng trên mọi app. */
function stripDiacritics(text: string): string {
  return text
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * `accountKey`: 1 trong các key khai báo ở VIETQR_ACCOUNTS — hàm LUÔN tự
 * tra cứu tài khoản thật từ đây theo key, KHÔNG BAO GIỜ nhận trực tiếp số
 * tài khoản/ngân hàng từ client (giữ đúng nguyên tắc an toàn đã áp dụng
 * cho các trường có cấu trúc khác trong compositeQuote.ts).
 * `amount`: số tiền gợi ý điền sẵn trên QR — null nếu không có tổng nào đủ
 * rõ ràng để điền (xem route.tsx: chọn khối tổng LỚN NHẤT trong các khối
 * đang có trên báo giá; null thì QR vẫn quét được, chỉ không tự điền số
 * tiền, người chuyển tự nhập tay).
 * `note`: nội dung chuyển khoản — bỏ dấu, giới hạn độ dài để tương thích
 * rộng với các app ngân hàng.
 */
type VietQrAccountInfo = { bankCode: string; accountNumber: string; accountName: string };

/** Phần dùng chung thật sự dựng URL ảnh QR — nhận thẳng 1 account object
 * thay vì key, để dùng được cho CẢ VIETQR_ACCOUNTS (tra qua key, xem hàm
 * buildVietQrImageUrl bên dưới) LẪN THU_HO_ACCOUNT (không có key, cố định
 * duy nhất 1 tài khoản, không nằm trong VIETQR_ACCOUNTS). */
export function buildVietQrImageUrlForAccount(account: VietQrAccountInfo, amount: number | null, note: string): string {
  const base = `https://img.vietqr.io/image/${account.bankCode}-${account.accountNumber}-qr_only.png`;
  const params = new URLSearchParams();
  if (amount != null && Number.isFinite(amount) && amount > 0) {
    params.set("amount", String(Math.round(amount)));
  }
  params.set("addInfo", stripDiacritics(note).slice(0, 50));
  params.set("accountName", account.accountName);
  return `${base}?${params.toString()}`;
}

export function buildVietQrImageUrl(accountKey: VietQrAccountKey, amount: number | null, note: string): string {
  return buildVietQrImageUrlForAccount(VIETQR_ACCOUNTS[accountKey], amount, note);
}

export function vietQrAccountLabel(accountKey: VietQrAccountKey): string {
  const account = VIETQR_ACCOUNTS[accountKey];
  return `${account.bankCode} — ${account.accountNumber} — ${account.accountName}`;
}

/**
 * Nội dung chuyển khoản (`addInfo`) —
 * "{tên công ty hoặc tên khách hoặc SĐT hoặc 'Khach hang MAX OFFICE'}
 * {purpose}" (mặc định "thanh toan phi dich vu" — KHÔNG kèm tên dịch vụ cụ
 * thể, quyết định rõ ràng, không phải thiếu sót). Ưu tiên TÊN CÔNG TY > tên
 * khách > SĐT > nhãn chung — vì đây là khoản thanh toán dịch vụ cho công ty,
 * tên công ty giúp đối chiếu đúng giao dịch rõ ràng hơn số điện thoại cá
 * nhân khi có nhiều đơn chuyển cùng lúc.
 *
 * `purpose` tuỳ chỉnh được — dùng cho QR THU HỘ (Chữ ký số/Hoá đơn điện tử,
 * xem route.tsx) với nội dung khác QR dịch vụ MAX OFFICE thường, dù vẫn
 * cùng 1 thứ tự ưu tiên định danh khách ở trên. QR dịch vụ MAX OFFICE còn
 * cho nhân viên SỬA ĐÈ lên toàn bộ chuỗi trả về của hàm này (xem
 * CompositeQuoteTool.tsx/body.qrNote ở route.tsx) — QR thu hộ thì KHÔNG,
 * luôn tự sinh qua hàm này để nhân viên không vô tình sửa sai nội dung
 * chuyển cho bên thứ ba.
 */
export function buildQrNote(
  customer?: { name?: string; phone?: string; companyName?: string },
  purpose: string = "thanh toan phi dich vu"
): string {
  const identifier =
    customer?.companyName?.trim() || customer?.name?.trim() || customer?.phone?.trim() || "Khach hang MAX OFFICE";
  return `${identifier} ${purpose}`;
}

/** img.vietqr.io CHỈ giữ 40 ký tự đầu của `addInfo` (đã đo: gửi 41-50 ký tự vẫn ra QR 40 ký tự) — dài hơn thì phần đuôi mất trong mã QR. */
export const VIETQR_NOTE_MAX_CHARS = 40;

/**
 * Nội dung chuyển khoản MẶC ĐỊNH cho thanh toán theo đợt: câu mặc định + hậu tố (" dat coc"/" thanh toan con lai"). Hậu tố nằm ở CUỐI nên nếu
 * cả câu vượt 40 ký tự (tên công ty dài) thì ngân hàng cắt mất đúng phần phân biệt đợt — khi đó bỏ "thanh toan phi dich vu" và rút gọn phần
 * tên khách để hậu tố luôn còn trong QR. Câu ngắn đủ chỗ thì giữ đúng dạng "… thanh toan phi dich vu dat coc".
 */
export function buildInstallmentQrNote(
  customer: { name?: string; phone?: string; companyName?: string } | undefined,
  suffix: string
): string {
  const full = `${buildQrNote(customer)}${suffix}`;
  if (stripDiacritics(full).length <= VIETQR_NOTE_MAX_CHARS) return full;
  const identifier = stripDiacritics(buildQrNote(customer, "")).trim();
  return `${identifier.slice(0, VIETQR_NOTE_MAX_CHARS - suffix.length).trimEnd()}${suffix}`;
}

/**
 * Tự nhận diện định dạng ảnh thật qua magic bytes — KHÔNG tin đuôi URL
 * (".png") lẫn header `Content-Type` của response. Đã xác nhận bằng byte
 * thật: img.vietqr.io trả về `content-type: image/png` nhưng dữ liệu THẬT
 * SỰ là JPEG (magic bytes `FF D8 FF`) — tin theo đuôi URL hoặc header sẽ
 * gán sai MIME vào data URI, khiến Satori render ra ảnh trắng trơn (im
 * lặng, không throw lỗi gì để phát hiện). Rơi về "image/jpeg" nếu không
 * khớp chữ ký nào đã biết, đúng với thực tế endpoint này đang trả về.
 */
export function detectImageMimeType(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return "image/jpeg";
}
