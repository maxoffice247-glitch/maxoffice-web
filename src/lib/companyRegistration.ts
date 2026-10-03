/**
 * Logic DÙNG CHUNG cho form "Hồ sơ thành lập doanh nghiệp" — client
 * (src/components/tools/CompanyRegistrationForm.tsx) và server
 * (src/app/api/submit-company-registration/route.ts) cùng import file này, để
 * validate/bản tóm tắt ở 2 phía không bao giờ lệch nhau. Server luôn validate
 * lại từ đầu (không tin client).
 */

export const REGISTRATION_TYPES = ["co-phan", "tnhh-2tv", "tnhh-1tv", "ho-kinh-doanh"] as const;
export type RegistrationType = (typeof REGISTRATION_TYPES)[number];

export function isRegistrationType(v: unknown): v is RegistrationType {
  return typeof v === "string" && (REGISTRATION_TYPES as readonly string[]).includes(v);
}

export type RegistrationTypeConfig = {
  key: RegistrationType;
  /** Tên loại hình — đúng cách viết đã chuẩn hoá, không viết tắt. */
  label: string;
  /** Dòng mô tả ngắn trên thẻ chọn loại hình. */
  shortDesc: string;
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  industryMainLabel: string;
  capitalLabel: string;
  hasWebsite: boolean;
  /** undefined = loại hình này không có ô "họ tên các cổ đông/thành viên". */
  membersLabel?: string;
  /** Nhãn ô người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ). */
  representativeLabel: string;
  /** Hộ kinh doanh không có ô chức danh. */
  hasTitle: boolean;
  /** Cho phép CÁCH THỨ HAI cung cấp giấy tờ: điền thông tin CCCD/VNeID vào form
   * thay vì gửi ảnh. CHỈ TNHH 1 thành viên và Hộ kinh doanh. */
  idForm: boolean;
  /** Tên nhóm ô thông tin giấy tờ (chỉ khi idForm). */
  idGroupTitle?: string;
  /** Nội dung khung lưu ý về ảnh VNeID (KHÔNG phải ô nhập). */
  vneidNote: string;
  /** Câu mô tả số người tối thiểu, dùng cho đoạn giới thiệu tĩnh trên trang. */
  introText: string;
};

export const REGISTRATION_CONFIG: Record<RegistrationType, RegistrationTypeConfig> = {
  "co-phan": {
    key: "co-phan",
    representativeLabel: "Họ tên người đại diện theo pháp luật",
    hasTitle: true,
    idForm: false,
    label: "Công ty Cổ phần",
    shortDesc: "Tối thiểu 3 cổ đông",
    title: "Hồ sơ thành lập Công ty Cổ phần",
    nameLabel: "Tên công ty",
    namePlaceholder: "Ví dụ: CÔNG TY CỔ PHẦN [TÊN RIÊNG]",
    industryMainLabel: "Ngành chính",
    capitalLabel: "Vốn điều lệ",
    hasWebsite: true,
    membersLabel: "Họ tên các cổ đông",
    vneidNote:
      "Ảnh VNeID của các cổ đông (tối thiểu 3, chụp thấy rõ ngày cấp CCCD; bao gồm người đại diện theo pháp luật nếu người đó không nằm trong danh sách cổ đông): gửi qua Zalo sau khi bấm Gửi hồ sơ.",
    introText: "Công ty Cổ phần: tối thiểu 3 cổ đông",
  },
  "tnhh-2tv": {
    key: "tnhh-2tv",
    representativeLabel: "Họ tên người đại diện theo pháp luật",
    hasTitle: true,
    idForm: false,
    label: "Công ty TNHH 2 thành viên trở lên",
    shortDesc: "Tối thiểu 2 thành viên",
    title: "Hồ sơ thành lập Công ty TNHH 2 thành viên trở lên",
    nameLabel: "Tên công ty",
    namePlaceholder: "Ví dụ: CÔNG TY TNHH [TÊN RIÊNG]",
    industryMainLabel: "Ngành chính",
    capitalLabel: "Vốn điều lệ",
    hasWebsite: true,
    membersLabel: "Họ tên các thành viên",
    vneidNote:
      "Ảnh VNeID của các thành viên (tối thiểu 2, chụp thấy rõ ngày cấp CCCD; bao gồm người đại diện theo pháp luật nếu người đó không nằm trong danh sách thành viên): gửi qua Zalo sau khi bấm Gửi hồ sơ.",
    introText: "Công ty TNHH 2 thành viên trở lên: tối thiểu 2 thành viên",
  },
  "tnhh-1tv": {
    key: "tnhh-1tv",
    representativeLabel: "Họ tên người đại diện theo pháp luật",
    hasTitle: true,
    idForm: true,
    idGroupTitle: "Thông tin chủ sở hữu",
    label: "Công ty TNHH 1 thành viên",
    shortDesc: "Chỉ 1 chủ sở hữu",
    title: "Hồ sơ thành lập Công ty TNHH 1 thành viên",
    nameLabel: "Tên công ty",
    namePlaceholder: "Ví dụ: CÔNG TY TNHH [TÊN RIÊNG]",
    industryMainLabel: "Ngành nghề kinh doanh chính",
    capitalLabel: "Vốn điều lệ",
    hasWebsite: true,
    vneidNote:
      "Ảnh VNeID (chụp thấy rõ ngày cấp CCCD; bao gồm người đại diện theo pháp luật nếu người đó không phải chủ sở hữu): gửi qua Zalo sau khi bấm Gửi hồ sơ.",
    introText: "Công ty TNHH 1 thành viên: 1 chủ sở hữu (gửi ảnh VNeID hoặc điền thông tin CCCD vào form)",
  },
  "ho-kinh-doanh": {
    key: "ho-kinh-doanh",
    representativeLabel: "Họ tên chủ hộ kinh doanh",
    hasTitle: false,
    idForm: true,
    idGroupTitle: "Thông tin chủ hộ",
    label: "Hộ kinh doanh",
    shortDesc: "Cá nhân hoặc hộ gia đình",
    title: "Hồ sơ thành lập Hộ kinh doanh",
    nameLabel: "Tên hộ kinh doanh",
    namePlaceholder: "Ví dụ: HỘ KINH DOANH [TÊN CỬA HÀNG]",
    industryMainLabel: "Ngành nghề kinh doanh chính",
    capitalLabel: "Vốn kinh doanh",
    hasWebsite: false,
    vneidNote: "Ảnh VNeID: gửi qua Zalo sau khi bấm Gửi hồ sơ.",
    introText: "Hộ kinh doanh: do cá nhân hoặc hộ gia đình đăng ký (gửi ảnh VNeID hoặc điền thông tin CCCD vào form)",
  },
};

/** Các ô RIÊNG của từng loại hình (khác loại hình thì giữ giá trị riêng). */
export type RegistrationValues = {
  tenDonVi: string;
  diaChi: string;
  nganhNghe: string;
  nganhChinh: string;
  /** Chỉ chứa chữ số (không dấu chấm) — dấu phân cách chỉ là trình bày. */
  von: string;
  thanhVien: string;
};

export const ADDRESS_TYPES = ["max-office", "khac"] as const;
export type AddressType = (typeof ADDRESS_TYPES)[number];

/** Các ô DÙNG CHUNG — giữ nguyên khi khách đổi loại hình. `loaiDiaChi`/
 * `chiNhanh` (khách dùng địa chỉ MAX OFFICE hay tự nhập) cũng dùng chung vì
 * địa chỉ chi nhánh không phụ thuộc loại hình doanh nghiệp. */
export type RegistrationShared = {
  tenLienHe: string;
  sdt: string;
  email: string;
  website: string;
  consent: boolean;
  loaiDiaChi: AddressType;
  /** Slug chi nhánh khi loaiDiaChi = "max-office", ngược lại luôn rỗng. */
  chiNhanh: string;
  /** Người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ). Dùng chung giữa các
   * loại hình — là 1 con người, không phụ thuộc loại hình. Khi khách tích
   * "trùng người liên hệ", form gửi lên đúng họ tên người liên hệ ở đây. */
  nguoiDaiDien: string;
  /** Chức danh gõ tự do (không áp dụng Hộ kinh doanh). */
  chucDanh: string;
};

export const EMPTY_VALUES: RegistrationValues = {
  tenDonVi: "",
  diaChi: "",
  nganhNghe: "",
  nganhChinh: "",
  von: "",
  thanhVien: "",
};

export const EMPTY_SHARED: RegistrationShared = {
  tenLienHe: "",
  sdt: "",
  email: "",
  website: "",
  consent: false,
  loaiDiaChi: "khac",
  chiNhanh: "",
  nguoiDaiDien: "",
  chucDanh: "",
};

export const ID_METHODS = ["zalo", "form"] as const;
export type IdMethod = (typeof ID_METHODS)[number];

/** Thông tin trên CCCD/VNeID khi khách chọn điền vào form (chỉ TNHH 1 thành viên /
 * Hộ kinh doanh). NHẠY CẢM: chỉ tồn tại trong state trang + 1 lần POST + email nội
 * bộ; không bao giờ vào storage/analytics/log/sheet đầy đủ. */
export type IdentityInfo = {
  hoTen: string;
  gioiTinh: "" | "nam" | "nu";
  /** dd/mm/yyyy */
  ngaySinh: string;
  /** Sau khi validate: đúng 12 chữ số, không khoảng trắng. */
  soCccd: string;
  ngayCap: string;
  noiCap: string;
  quocTich: string;
  danToc: string;
  thuongTru: string;
  lienLac: string;
  /** Ô đồng ý riêng cho việc cung cấp giấy tờ tuỳ thân. */
  consent: boolean;
};

export const EMPTY_IDENTITY: IdentityInfo = {
  hoTen: "",
  gioiTinh: "",
  ngaySinh: "",
  soCccd: "",
  ngayCap: "",
  noiCap: "",
  quocTich: "Việt Nam",
  danToc: "",
  thuongTru: "",
  lienLac: "",
  consent: false,
};

/** Body gửi lên API. `fax` là honeypot (ô ẩn, người thật không bao giờ điền). */
export type RegistrationSubmission = RegistrationValues &
  RegistrationShared & {
    loai: RegistrationType;
    fax?: string;
    /** "zalo" (mặc định): gửi ảnh VNeID qua Zalo. "form": điền vào form (chỉ idForm). */
    hinhThucGiayTo: IdMethod;
    /** Chỉ có khi hinhThucGiayTo = "form". */
    giayTo?: IdentityInfo;
  };

export type RegistrationClean = Omit<RegistrationSubmission, "fax">;

export const FIELD_MAX = {
  tenDonVi: 200,
  diaChi: 300,
  nganhNghe: 2000,
  nganhChinh: 300,
  von: 18,
  thanhVien: 1500,
  tenLienHe: 120,
  sdt: 20,
  email: 150,
  website: 200,
  chiNhanh: 80,
  nguoiDaiDien: 120,
  chucDanh: 80,
} as const;

export const IDENTITY_MAX = {
  hoTen: 120,
  noiCap: 120,
  quocTich: 60,
  danToc: 60,
  thuongTru: 300,
  lienLac: 300,
  soCccd: 20, // cho phép gõ khoảng trắng trước khi bỏ
  ngay: 10,
} as const;

/** Bỏ khoảng trắng/dấu chấm/gạch/ngoặc, đổi đầu số +84/84 thành 0. */
export function normalizeVnPhone(raw: string): string {
  const s = raw.replace(/[\s.\-()]/g, "");
  if (s.startsWith("+84")) return `0${s.slice(3)}`;
  if (s.startsWith("84") && s.length >= 11) return `0${s.slice(2)}`;
  return s;
}

/** Di động 10 số (03/05/07/08/09) hoặc máy bàn có mã vùng 02x (11 số). */
export function isValidVnPhone(raw: string): boolean {
  return /^0(?:[35789]\d{8}|2\d{9})$/.test(normalizeVnPhone(raw));
}

export function formatThousands(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Chuỗi 9 hoặc 12 chữ số LIỀN NHAU (CMND/CCCD) trong ô văn bản tự do — form
 * này chủ động KHÔNG thu số CCCD, nên chặn luôn thay vì để lọt vào email/sheet. */
const ID_NUMBER_PATTERN = /(?<!\d)(?:\d{9}|\d{12})(?!\d)/;

const ERR = {
  required: "Vui lòng nhập thông tin này.",
  tooLong: "Nội dung quá dài.",
  phone: "Số điện thoại chưa hợp lệ. Ví dụ: 0901 234 567 hoặc +84 901 234 567.",
  email: "Email chưa đúng định dạng.",
  website: "Website chưa đúng định dạng.",
  consent: "Vui lòng đồng ý để MAX OFFICE liên hệ và soạn hồ sơ.",
  branch: "Vui lòng chọn chi nhánh MAX OFFICE, hoặc chuyển sang \"Tự nhập địa chỉ khác\".",
  idNumber: "Vui lòng không nhập số CCCD/CMND vào form này — gửi ảnh VNeID qua Zalo.",
  idMethodNotAllowed: "Loại hình này không hỗ trợ điền thông tin giấy tờ vào form — vui lòng gửi ảnh VNeID qua Zalo.",
  idConsent: "Vui lòng đồng ý cung cấp thông tin giấy tờ tuỳ thân để MAX OFFICE soạn hồ sơ thành lập.",
  cccd: "Số CCCD gồm đúng 12 chữ số.",
  dateFormat: "Nhập đúng ngày theo dd/mm/yyyy, ví dụ 25/12/1990.",
  birthFuture: "Ngày sinh không được ở tương lai.",
  issueFuture: "Ngày cấp không được ở tương lai.",
  issueBeforeBirth: "Ngày cấp phải sau ngày sinh.",
  ownerNameFromAbove: "Vui lòng nhập họ tên chủ hộ kinh doanh ở phía trên.",
} as const;

/** dd/mm/yyyy (cho phép 1 chữ số ngày/tháng) → ngày có THẬT hay không (31/02 → null). */
export function parseVnDate(raw: string): { d: number; m: number; y: number; text: string } | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw.trim());
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  if (y < 1900) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { d, m: mo, y, text: `${String(d).padStart(2, "0")}/${String(mo).padStart(2, "0")}/${y}` };
}

const dateKey = (x: { d: number; m: number; y: number }) => x.y * 10000 + x.m * 100 + x.d;

/** Ngày hôm nay theo giờ Việt Nam (UTC+7) — server chạy UTC nên không dùng ngày UTC thô
 * (khách ở VN lúc rạng sáng sẽ bị coi nhầm là "ngày mai"). */
function todayVnKey(): number {
  const t = new Date(Date.now() + 7 * 3600 * 1000);
  return t.getUTCFullYear() * 10000 + (t.getUTCMonth() + 1) * 100 + t.getUTCDate();
}

/** Gõ tới đâu tự chèn "/" tới đó: chỉ giữ chữ số (tối đa 8) và dựng dd/mm/yyyy. */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function maskCccd(cccd: string): string {
  const digits = cccd.replace(/\D/g, "");
  return digits.length >= 4 ? `${"*".repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}` : "****";
}

export type RegistrationErrors = Partial<Record<keyof RegistrationValues | keyof RegistrationShared, string>> & {
  hinhThucGiayTo?: string;
  giayTo?: Partial<Record<keyof IdentityInfo, string>>;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Validate + làm sạch. Dùng được cho input chưa rõ kiểu (body request). */
export function validateRegistration(
  input: unknown
): { ok: true; data: RegistrationClean } | { ok: false; errors: RegistrationErrors } {
  const b = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const errors: RegistrationErrors = {};

  if (!isRegistrationType(b.loai)) {
    return { ok: false, errors: { tenDonVi: "Loại hình không hợp lệ." } };
  }
  const cfg = REGISTRATION_CONFIG[b.loai];

  const data: RegistrationClean = {
    loai: b.loai,
    tenDonVi: str(b.tenDonVi),
    diaChi: str(b.diaChi),
    nganhNghe: str(b.nganhNghe),
    nganhChinh: str(b.nganhChinh),
    von: str(b.von).replace(/\D/g, ""),
    // Loại hình không có ô thành viên thì bỏ hẳn, không nhận dữ liệu thừa từ client.
    thanhVien: cfg.membersLabel ? str(b.thanhVien) : "",
    tenLienHe: str(b.tenLienHe),
    sdt: str(b.sdt),
    email: str(b.email),
    website: cfg.hasWebsite ? str(b.website) : "",
    consent: b.consent === true,
    loaiDiaChi: b.loaiDiaChi === "max-office" ? "max-office" : "khac",
    chiNhanh: b.loaiDiaChi === "max-office" ? str(b.chiNhanh) : "",
    nguoiDaiDien: str(b.nguoiDaiDien),
    // Hộ kinh doanh không có chức danh — bỏ hẳn dữ liệu thừa từ client.
    chucDanh: cfg.hasTitle ? str(b.chucDanh) : "",
    hinhThucGiayTo: b.hinhThucGiayTo === "form" && cfg.idForm ? "form" : "zalo",
  };

  for (const k of ["tenDonVi", "diaChi", "nganhNghe", "nganhChinh", "von", "thanhVien", "tenLienHe", "sdt", "email", "website", "nguoiDaiDien", "chucDanh"] as const) {
    if (data[k].length > FIELD_MAX[k]) errors[k] = ERR.tooLong;
  }
  for (const k of ["tenDonVi", "diaChi", "nganhNghe", "nganhChinh", "thanhVien", "tenLienHe", "nguoiDaiDien", "chucDanh"] as const) {
    if (!errors[k] && ID_NUMBER_PATTERN.test(data[k])) errors[k] = ERR.idNumber;
  }

  if (!data.tenLienHe) errors.tenLienHe = ERR.required;
  if (!data.sdt) errors.sdt = ERR.required;
  else if (!errors.sdt && !isValidVnPhone(data.sdt)) errors.sdt = ERR.phone;
  if (data.email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = ERR.email;
  if (
    data.website &&
    !errors.website &&
    !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(data.website)
  ) {
    errors.website = ERR.website;
  }
  if (!data.consent) errors.consent = ERR.consent;
  if (data.loaiDiaChi === "max-office") {
    // Chỉ kiểm tra HÌNH DẠNG ở đây (client dùng chung hàm này); việc slug có
    // thật và địa chỉ có khớp địa chỉ chuẩn của chi nhánh do API route kiểm
    // tra bằng dữ liệu chi nhánh (không tin giá trị client gửi).
    if (!data.chiNhanh || data.chiNhanh.length > FIELD_MAX.chiNhanh || !data.diaChi) errors.diaChi = ERR.branch;
  }

  // ---- Thông tin giấy tờ điền vào form (CHỈ idForm: TNHH 1 thành viên / Hộ kinh doanh) ----
  const rawId = b.giayTo && typeof b.giayTo === "object" ? (b.giayTo as Record<string, unknown>) : null;
  if ((b.hinhThucGiayTo === "form" || rawId) && !cfg.idForm) {
    errors.hinhThucGiayTo = ERR.idMethodNotAllowed;
  }
  if (data.hinhThucGiayTo === "form") {
    const g = rawId ?? {};
    const idErr: NonNullable<RegistrationErrors["giayTo"]> = {};
    const gender = str(g.gioiTinh);
    const info: IdentityInfo = {
      // Hộ kinh doanh: họ tên chủ hộ LẤY từ ô chủ hộ (không tin giá trị client gửi riêng).
      hoTen: data.loai === "ho-kinh-doanh" ? data.nguoiDaiDien : str(g.hoTen),
      gioiTinh: gender === "nam" || gender === "nu" ? gender : "",
      ngaySinh: str(g.ngaySinh),
      soCccd: str(g.soCccd),
      ngayCap: str(g.ngayCap),
      noiCap: str(g.noiCap),
      quocTich: str(g.quocTich),
      danToc: str(g.danToc),
      thuongTru: str(g.thuongTru),
      lienLac: str(g.lienLac),
      consent: g.consent === true,
    };
    if (gender && gender !== "nam" && gender !== "nu") idErr.gioiTinh = "Giới tính không hợp lệ.";

    for (const k of ["hoTen", "noiCap", "quocTich", "danToc", "thuongTru", "lienLac"] as const) {
      if (info[k].length > IDENTITY_MAX[k]) idErr[k] = ERR.tooLong;
      // Quy tắc chặn 9/12 chữ số liền nhau áp dụng cho MỌI ô văn bản — chỉ riêng ô Số CCCD được phép.
      else if (ID_NUMBER_PATTERN.test(info[k])) idErr[k] = ERR.idNumber;
    }
    if (!info.hoTen) idErr.hoTen = data.loai === "ho-kinh-doanh" ? ERR.ownerNameFromAbove : ERR.required;
    if (!info.thuongTru) idErr.thuongTru = ERR.required;

    // Số CCCD: chỉ cho phép chữ số và khoảng trắng, sau khi bỏ khoảng trắng phải ĐÚNG 12 chữ số.
    const cccd = info.soCccd.replace(/\s/g, "");
    if (info.soCccd.length > IDENTITY_MAX.soCccd || !/^\d{12}$/.test(cccd)) idErr.soCccd = ERR.cccd;
    else info.soCccd = cccd;

    const birth = info.ngaySinh.length <= IDENTITY_MAX.ngay + 2 ? parseVnDate(info.ngaySinh) : null;
    const issue = info.ngayCap.length <= IDENTITY_MAX.ngay + 2 ? parseVnDate(info.ngayCap) : null;
    const today = todayVnKey();
    if (!info.ngaySinh) idErr.ngaySinh = ERR.required;
    else if (!birth) idErr.ngaySinh = ERR.dateFormat;
    else if (dateKey(birth) > today) idErr.ngaySinh = ERR.birthFuture;
    else info.ngaySinh = birth.text;
    if (!info.ngayCap) idErr.ngayCap = ERR.required;
    else if (!issue) idErr.ngayCap = ERR.dateFormat;
    else if (dateKey(issue) > today) idErr.ngayCap = ERR.issueFuture;
    else if (birth && dateKey(issue) <= dateKey(birth)) idErr.ngayCap = ERR.issueBeforeBirth;
    else info.ngayCap = issue.text;

    if (!info.consent) idErr.consent = ERR.idConsent;

    if (Object.keys(idErr).length) errors.giayTo = idErr;
    else data.giayTo = info;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const NONE = "(chưa cung cấp)";

/** Dòng địa chỉ — LUÔN đứng đầu phần thông tin (email, sheet, bản sao, bản in)
 * để nhân viên nhận ra ngay khách cần cả địa chỉ MAX OFFICE (văn phòng ảo). */
export function registrationAddressLine(d: RegistrationClean, branchName?: string): string {
  if (d.loaiDiaChi === "max-office") {
    return `Địa chỉ: ${d.diaChi || NONE} (chi nhánh MAX OFFICE: ${branchName || d.chiNhanh})`;
  }
  return `Địa chỉ khách tự cung cấp: ${d.diaChi || NONE}`;
}

function sameName(a: string, b: string): boolean {
  const n = (x: string) => x.trim().replace(/\s+/g, " ").toLowerCase();
  return n(a) !== "" && n(a) === n(b);
}

/** Dòng người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ) — đặt ngay dưới
 * nhóm thông tin liên hệ ở mọi nơi (email, sheet, bản sao, bản in). "Trùng người
 * liên hệ" được SUY RA từ việc 2 họ tên giống nhau (không cần cờ riêng gửi lên). */
export function registrationRepresentative(d: RegistrationClean): { label: string; value: string } {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const label = cfg.hasTitle ? "Người đại diện theo pháp luật" : "Chủ hộ kinh doanh";
  if (!d.nguoiDaiDien) return { label, value: NONE };
  let value = d.nguoiDaiDien;
  if (cfg.hasTitle && d.chucDanh) value += ` (${d.chucDanh})`;
  if (sameName(d.nguoiDaiDien, d.tenLienHe)) value += " (trùng người liên hệ)";
  return { label, value };
}

/** "full" = đầy đủ (nút Sao chép, nội dung email nội bộ); "print" = bản in/PDF (số CCCD che,
 * chỉ 4 số cuối); "sheet" = dòng ghi Google Sheet (KHÔNG có ngày sinh/ngày cấp/địa chỉ
 * thường trú, CCCD che — chi tiết đầy đủ chỉ nằm trong email). */
export type SummaryMode = "full" | "print" | "sheet";

const GENDER_TEXT = { nam: "Nam", nu: "Nữ" } as const;

/** Các dòng cuối bản tóm tắt: khối giấy tờ tuỳ thân (khi khách điền vào form) hoặc dòng
 * nhắc ảnh VNeID gửi qua Zalo (mặc định). */
export function identitySectionLines(d: RegistrationClean, mode: SummaryMode): string[] {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const g = d.giayTo;
  if (d.hinhThucGiayTo !== "form" || !g) {
    return [cfg.vneidNote.replace(": gửi qua Zalo sau khi bấm Gửi hồ sơ.", ": sẽ gửi qua Zalo.")];
  }
  const owner = d.loai === "ho-kinh-doanh" ? "chủ hộ" : "chủ sở hữu";
  const lines: string[] = [];
  if (mode === "sheet") {
    lines.push("Hình thức cung cấp giấy tờ: điền vào form (xem email)");
    lines.push(`Số CCCD: ${maskCccd(g.soCccd)}`);
  } else {
    lines.push(`THÔNG TIN GIẤY TỜ TUỲ THÂN (${owner})`);
    lines.push(`Họ và tên: ${g.hoTen || NONE}`);
    lines.push(`Giới tính: ${g.gioiTinh ? GENDER_TEXT[g.gioiTinh] : NONE}`);
    lines.push(`Ngày sinh: ${g.ngaySinh || NONE}`);
    lines.push(`Số CCCD: ${mode === "print" ? maskCccd(g.soCccd) : g.soCccd}`);
    lines.push(`Ngày cấp: ${g.ngayCap || NONE}`);
    lines.push(`Nơi cấp: ${g.noiCap || NONE}`);
    lines.push(`Quốc tịch: ${g.quocTich || NONE}`);
    lines.push(`Dân tộc: ${g.danToc || NONE}`);
    lines.push(`Địa chỉ thường trú: ${g.thuongTru || NONE}`);
    lines.push(`Địa chỉ liên lạc: ${g.lienLac || NONE}`);
  }
  lines.push("");
  if (d.loai === "tnhh-1tv" && !sameName(d.nguoiDaiDien, g.hoTen)) {
    lines.push("Ảnh VNeID của người đại diện theo pháp luật: sẽ gửi qua Zalo.");
  } else {
    lines.push("Ảnh VNeID: không cần gửi (đã điền thông tin giấy tờ vào form).");
  }
  return lines;
}

/** Bản tóm tắt dạng văn bản — dùng cho nút "Sao chép nội dung", khối in, nội dung email
 * nội bộ và ghi chú dòng sheet (server dựng lại từ dữ liệu đã validate, không nhận từ client).
 * `branchName` = tên chi nhánh khi khách dùng địa chỉ MAX OFFICE. */
export function buildRegistrationSummary(d: RegistrationClean, branchName?: string, mode: SummaryMode = "full"): string {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const lines: string[] = [cfg.title.toUpperCase(), ""];
  lines.push(registrationAddressLine(d, branchName));
  lines.push("");
  lines.push(`Họ tên người liên hệ: ${d.tenLienHe || NONE}`);
  lines.push(`SĐT đăng ký: ${d.sdt || NONE}`);
  lines.push(`Email: ${d.email || NONE}`);
  if (cfg.hasWebsite) lines.push(`Website: ${d.website || NONE}`);
  const rep = registrationRepresentative(d);
  lines.push(`${rep.label}: ${rep.value}`);
  lines.push("");
  lines.push(`${cfg.nameLabel}: ${d.tenDonVi || NONE}`);
  lines.push(`Ngành nghề kinh doanh: ${d.nganhNghe || NONE}`);
  lines.push(`${cfg.industryMainLabel}: ${d.nganhChinh || NONE}`);
  lines.push(`${cfg.capitalLabel}: ${d.von ? `${formatThousands(d.von)} đồng` : NONE}`);
  if (cfg.membersLabel) lines.push(d.thanhVien ? `${cfg.membersLabel}:\n${d.thanhVien}` : `${cfg.membersLabel}: ${NONE}`);
  lines.push("");
  lines.push(...identitySectionLines(d, mode));
  return lines.join("\n");
}
