/**
 * Logic DÙNG CHUNG cho form "Hồ sơ thành lập doanh nghiệp" — client
 * (src/components/tools/CompanyRegistrationForm.tsx) và server
 * (src/app/api/submit-company-registration/route.ts) cùng import file này, để
 * validate/bản tóm tắt ở 2 phía không bao giờ lệch nhau. Server luôn validate
 * lại từ đầu (không tin client).
 */

import { dateKey, parseVnDate, todayVnKey } from "./vnDate";
import { suggestIssuePlace } from "./issuePlace";

/** THỨ TỰ HIỂN THỊ: TNHH 1 thành viên, TNHH 2 thành viên trở lên, Cổ phần, Hộ kinh doanh — quyết định thứ tự
 * 4 thẻ (lưới 2x2: hàng trên 2 loại TNHH), phím mũi tên, đoạn giới thiệu tĩnh và ảnh OG. Giá trị (slug) dùng làm
 * ?loai= và body API KHÔNG đổi. */
export const REGISTRATION_TYPES = ["tnhh-1tv", "tnhh-2tv", "co-phan", "ho-kinh-doanh"] as const;
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
  /** undefined = loại hình này không có danh sách cổ đông/thành viên. Nhãn dòng đầu danh sách trong email/bản sao. */
  membersLabel?: string;
  /** "Cổ đông" / "Thành viên" — dùng cho nhãn từng dòng và nút thêm. */
  memberWord?: string;
  /** Số dòng hiện sẵn (cũng là số tối thiểu: dòng vượt quá mới xoá được). Không chặn gửi. */
  membersMin?: number;
  /** Nhãn ô người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ). */
  representativeLabel: string;
  /** Hộ kinh doanh không có ô chức danh. */
  hasTitle: boolean;
  /** Cho phép điền thông tin CCCD/VNeID vào form (CÁCH MẶC ĐỊNH) thay vì gửi ảnh
   * VNeID qua Zalo. CHỈ TNHH 1 thành viên và Hộ kinh doanh. */
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
    membersLabel: "Danh sách cổ đông",
    memberWord: "Cổ đông",
    membersMin: 3,
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
    membersLabel: "Danh sách thành viên",
    memberWord: "Thành viên",
    membersMin: 2,
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
    introText: "Công ty TNHH 1 thành viên: 1 chủ sở hữu (điền thông tin CCCD vào form hoặc gửi ảnh VNeID)",
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
    introText: "Hộ kinh doanh: do cá nhân hoặc hộ gia đình đăng ký (điền thông tin CCCD vào form hoặc gửi ảnh VNeID)",
  },
};

/** Một dòng cổ đông/thành viên: họ tên + vốn góp (chỉ chữ số, đơn vị đồng). Cả hai tuỳ chọn. */
export type MemberRow = { ten: string; von: string };

export const MEMBERS_MAX_ROWS = 30;
export const MEMBER_NAME_MAX = 120;
/** Vốn góp tối đa mỗi dòng: 1.000 tỷ đồng. */
export const MEMBER_CAPITAL_MAX = 1_000_000_000_000;

/** Các ô RIÊNG của từng loại hình (khác loại hình thì giữ giá trị riêng). */
export type RegistrationValues = {
  tenDonVi: string;
  diaChi: string;
  nganhNghe: string;
  nganhChinh: string;
  /** Chỉ chứa chữ số (không dấu chấm) — dấu phân cách chỉ là trình bày. */
  von: string;
  thanhVien: MemberRow[];
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
   * loại hình — là 1 con người, không phụ thuộc loại hình. */
  nguoiDaiDien: string;
  /** Khách tích "Người liên hệ chính là người đại diện": họ tên người liên hệ = họ tên
   * người đại diện (server tự suy ra, không tin `tenLienHe` client gửi kèm). */
  lienHeLaDaiDien: boolean;
  /** Chức danh gõ tự do (không áp dụng Hộ kinh doanh). */
  chucDanh: string;
};

export const EMPTY_VALUES: RegistrationValues = {
  tenDonVi: "",
  diaChi: "",
  nganhNghe: "",
  nganhChinh: "",
  von: "",
  thanhVien: [],
};

/** Giá trị khởi tạo theo loại hình: Cổ phần hiện sẵn 3 dòng cổ đông, TNHH 2 thành viên trở lên hiện sẵn 2 dòng. */
export function emptyValuesFor(type: RegistrationType): RegistrationValues {
  const n = REGISTRATION_CONFIG[type].membersMin ?? 0;
  return { ...EMPTY_VALUES, thanhVien: Array.from({ length: n }, () => ({ ten: "", von: "" })) };
}

export const EMPTY_SHARED: RegistrationShared = {
  tenLienHe: "",
  sdt: "",
  email: "",
  website: "",
  consent: false,
  loaiDiaChi: "khac",
  chiNhanh: "",
  nguoiDaiDien: "",
  lienHeLaDaiDien: false,
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
  /** Địa chỉ liên hệ của chủ sở hữu/chủ hộ (một ô duy nhất; nhập theo địa giới hành chính mới). */
  diaChiLienHe: string;
};

export const EMPTY_IDENTITY: IdentityInfo = {
  hoTen: "",
  gioiTinh: "",
  ngaySinh: "",
  soCccd: "",
  ngayCap: "",
  noiCap: "",
  diaChiLienHe: "",
};

/** Body gửi lên API. `fax` là honeypot (ô ẩn, người thật không bao giờ điền). Server bỏ qua mọi
 * trường không có trong kiểu này (vd. quốc tịch/dân tộc/địa chỉ thường trú của bản cũ). */
export type RegistrationSubmission = RegistrationValues &
  RegistrationShared & {
    loai: RegistrationType;
    fax?: string;
    /** "form": điền thông tin CCCD vào form (chỉ idForm; form web mặc định chọn cách này).
     * "zalo": gửi ảnh VNeID qua Zalo riêng (giá trị mặc định khi API không nhận được gì). */
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
  /** Độ dài tối đa của chuỗi nhiều dòng KIỂU CŨ (client chưa tải lại trong lúc deploy). */
  thanhVienLegacy: 1500,
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
  diaChiLienHe: 300,
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
// Không dùng lookbehind (?<!\d): Safari/iOS < 16.4 và WebView cũ (trình duyệt trong Zalo) báo lỗi cú pháp
// làm hỏng cả chunk JS. `(?:^|\D)` + lookahead tương đương hoàn toàn khi dùng với .test().
const ID_NUMBER_PATTERN = /(?:^|\D)(?:\d{9}|\d{12})(?!\d)/;

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
  addressContact: "Vui lòng nhập địa chỉ liên hệ.",
  repForContact: "Vui lòng nhập họ tên người đại diện (đang dùng làm người liên hệ).",
  cccd: "Số CCCD gồm đúng 12 chữ số.",
  dateFormat: "Nhập đúng ngày theo dd/mm/yyyy, ví dụ 25/12/1990.",
  birthFuture: "Ngày sinh không được ở tương lai.",
  issueFuture: "Ngày cấp không được ở tương lai.",
  issueBeforeBirth: "Ngày cấp phải sau ngày sinh.",
  ownerNameFromAbove: "Vui lòng nhập họ tên chủ hộ kinh doanh ở phía trên.",
} as const;

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
  /** Lỗi theo chỉ số dòng cổ đông/thành viên (chỉ số trong mảng client gửi lên). */
  thanhVienRows?: Record<number, { ten?: string; von?: string }>;
  hinhThucGiayTo?: string;
  giayTo?: Partial<Record<keyof IdentityInfo, string>>;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

const ERR_MEMBERS = {
  tooMany: `Tối đa ${MEMBERS_MAX_ROWS} dòng.`,
  invalid: "Danh sách không hợp lệ.",
  nameLong: `Họ tên tối đa ${MEMBER_NAME_MAX} ký tự.`,
  capital: "Vốn góp phải là số nguyên không âm (đồng), tối đa 1.000 tỷ đồng.",
} as const;

/** Làm sạch danh sách cổ đông/thành viên từ body: nhận MẢNG [{ten, von}] (kiểu mới) hoặc CHUỖI nhiều dòng
 * (kiểu cũ của client chưa tải lại trong lúc deploy → mỗi dòng là một họ tên, chưa có vốn góp). Từ chối sai
 * định dạng; dòng trống hoàn toàn thì bỏ qua. */
function parseMembers(raw: unknown, errors: RegistrationErrors): MemberRow[] {
  if (raw === undefined || raw === null || raw === "") return [];
  const rowsErr: NonNullable<RegistrationErrors["thanhVienRows"]> = {};
  const out: MemberRow[] = [];
  const note = (i: number, k: "ten" | "von", msg: string) => {
    rowsErr[i] = { ...rowsErr[i], [k]: msg };
  };
  const checkName = (i: number, ten: string) => {
    if (ten.length > MEMBER_NAME_MAX) note(i, "ten", ERR_MEMBERS.nameLong);
    else if (ID_NUMBER_PATTERN.test(ten)) note(i, "ten", ERR.idNumber);
  };

  if (typeof raw === "string") {
    if (raw.length > FIELD_MAX.thanhVienLegacy) {
      errors.thanhVien = ERR.tooLong;
      return [];
    }
    const lines = raw.split(/\r?\n/);
    if (lines.length > MEMBERS_MAX_ROWS * 4) {
      errors.thanhVien = ERR_MEMBERS.tooMany;
      return [];
    }
    lines.forEach((line, i) => {
      const ten = line.trim();
      if (!ten) return;
      checkName(i, ten);
      out.push({ ten, von: "" });
    });
  } else if (Array.isArray(raw)) {
    if (raw.length > MEMBERS_MAX_ROWS) {
      errors.thanhVien = ERR_MEMBERS.tooMany;
      return [];
    }
    raw.forEach((item, i) => {
      if (!item || typeof item !== "object") {
        note(i, "ten", ERR_MEMBERS.invalid);
        return;
      }
      const r = item as Record<string, unknown>;
      if (r.ten !== undefined && r.ten !== null && typeof r.ten !== "string") note(i, "ten", ERR_MEMBERS.invalid);
      const ten = typeof r.ten === "string" ? r.ten.trim() : "";
      let von = "";
      if (typeof r.von === "number") {
        if (Number.isInteger(r.von) && r.von >= 0 && r.von <= MEMBER_CAPITAL_MAX) von = String(r.von);
        else note(i, "von", ERR_MEMBERS.capital);
      } else if (typeof r.von === "string") {
        const v = r.von.trim();
        if (v === "") von = "";
        else if (/^\d{1,13}$/.test(v) && Number(v) <= MEMBER_CAPITAL_MAX) von = String(Number(v));
        else note(i, "von", ERR_MEMBERS.capital);
      } else if (r.von !== undefined && r.von !== null) {
        note(i, "von", ERR_MEMBERS.capital);
      }
      checkName(i, ten);
      if (ten === "" && von === "") return; // dòng trống: bỏ qua
      out.push({ ten, von });
    });
  } else {
    errors.thanhVien = ERR_MEMBERS.invalid;
    return [];
  }
  if (Object.keys(rowsErr).length) errors.thanhVienRows = rowsErr;
  return out;
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
    thanhVien: [],
    // Tích "người liên hệ là người đại diện": người liên hệ = người đại diện (không tin tenLienHe client gửi).
    tenLienHe: b.lienHeLaDaiDien === true ? str(b.nguoiDaiDien) : str(b.tenLienHe),
    sdt: str(b.sdt),
    email: str(b.email),
    website: cfg.hasWebsite ? str(b.website) : "",
    consent: b.consent === true,
    loaiDiaChi: b.loaiDiaChi === "max-office" ? "max-office" : "khac",
    chiNhanh: b.loaiDiaChi === "max-office" ? str(b.chiNhanh) : "",
    nguoiDaiDien: str(b.nguoiDaiDien),
    lienHeLaDaiDien: b.lienHeLaDaiDien === true,
    // Hộ kinh doanh không có chức danh — bỏ hẳn dữ liệu thừa từ client.
    chucDanh: cfg.hasTitle ? str(b.chucDanh) : "",
    hinhThucGiayTo: b.hinhThucGiayTo === "form" && cfg.idForm ? "form" : "zalo",
  };

  // Loại hình không có danh sách cổ đông/thành viên thì bỏ hẳn, không nhận dữ liệu thừa từ client.
  if (cfg.membersLabel) data.thanhVien = parseMembers(b.thanhVien, errors);

  for (const k of ["tenDonVi", "diaChi", "nganhNghe", "nganhChinh", "von", "tenLienHe", "sdt", "email", "website", "nguoiDaiDien", "chucDanh"] as const) {
    if (data[k].length > FIELD_MAX[k]) errors[k] = ERR.tooLong;
  }
  for (const k of ["tenDonVi", "diaChi", "nganhNghe", "nganhChinh", "tenLienHe", "nguoiDaiDien", "chucDanh"] as const) {
    if (!errors[k] && ID_NUMBER_PATTERN.test(data[k])) errors[k] = ERR.idNumber;
  }

  if (data.lienHeLaDaiDien) {
    if (!data.nguoiDaiDien) errors.nguoiDaiDien = ERR.repForContact;
  } else if (!data.tenLienHe) errors.tenLienHe = ERR.required;
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
      diaChiLienHe: str(g.diaChiLienHe),
    };
    if (gender && gender !== "nam" && gender !== "nu") idErr.gioiTinh = "Giới tính không hợp lệ.";

    for (const k of ["hoTen", "noiCap", "diaChiLienHe"] as const) {
      if (info[k].length > IDENTITY_MAX[k]) idErr[k] = ERR.tooLong;
      // Quy tắc chặn 9/12 chữ số liền nhau áp dụng cho MỌI ô văn bản — chỉ riêng ô Số CCCD được phép.
      else if (ID_NUMBER_PATTERN.test(info[k])) idErr[k] = ERR.idNumber;
    }
    if (!info.hoTen) idErr.hoTen = data.loai === "ho-kinh-doanh" ? ERR.ownerNameFromAbove : ERR.required;
    if (!info.diaChiLienHe && !idErr.diaChiLienHe) idErr.diaChiLienHe = ERR.addressContact;

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

    // Nơi cấp: để trống mà ngày cấp hợp lệ thì SERVER tự điền theo cùng quy tắc với client
    // (không tin client hoàn toàn). Khách đã nhập giá trị (2 lựa chọn cố định hoặc chuỗi
    // tự nhập) thì giữ nguyên — đã qua kiểm tra độ dài + chặn 9/12 chữ số ở trên.
    if (!info.noiCap && !idErr.ngayCap && !idErr.ngaySinh) {
      info.noiCap = suggestIssuePlace(info.ngayCap, info.ngaySinh);
    }

    if (Object.keys(idErr).length) errors.giayTo = idErr;
    else data.giayTo = info;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const NONE = "(chưa cung cấp)";

/** Bỏ dòng trống hoàn toàn, cắt khoảng trắng, chỉ giữ chữ số ở vốn góp (dùng được cho cả dữ liệu thô từ form). */
export function cleanMemberRows(rows: readonly MemberRow[]): MemberRow[] {
  return rows
    .map((r) => ({ ten: (r.ten ?? "").trim(), von: (r.von ?? "").replace(/\D/g, "") }))
    .filter((r) => r.ten !== "" || r.von !== "");
}

export function membersCapitalTotal(rows: readonly MemberRow[]): number {
  return rows.reduce((sum, r) => sum + (r.von ? Number(r.von) : 0), 0);
}

/** Tỷ lệ % theo vốn điều lệ, làm tròn tối đa 2 chữ số thập phân, dấu phẩy kiểu Việt ("33,33%"). "" nếu thiếu dữ liệu. */
export function memberPercent(von: string, vonDieuLe: string): string {
  const v = Number(von);
  const total = Number(vonDieuLe);
  if (!von || !vonDieuLe || !(total > 0) || !Number.isFinite(v)) return "";
  const pct = Math.round((v * 10000) / total) / 100;
  return `${String(pct).replace(".", ",")}%`;
}

/** Nội dung danh sách cổ đông/thành viên (KHÔNG gồm dòng tiêu đề): đánh số, vốn góp, % theo vốn điều lệ (nếu đã
 * nhập), cuối cùng là tổng vốn góp (+ lưu ý nếu khác vốn điều lệ). Rỗng nếu không có dòng nào. */
export function registrationMembersBody(d: Pick<RegistrationClean, "thanhVien" | "von">): string[] {
  const rows = cleanMemberRows(d.thanhVien);
  if (!rows.length) return [];
  const lines = rows.map((r, i) => {
    const pct = memberPercent(r.von, d.von);
    const cap = r.von ? `${formatThousands(r.von)} đồng${pct ? ` (${pct})` : ""}` : "(chưa nhập)";
    return `${i + 1}. ${r.ten || "(chưa nhập họ tên)"} - vốn góp: ${cap}`;
  });
  if (rows.some((r) => r.von)) {
    const total = membersCapitalTotal(rows);
    const vdl = d.von ? Number(d.von) : 0;
    let line = `Tổng vốn góp: ${formatThousands(String(total))} đồng`;
    if (vdl > 0 && total !== vdl) line += ` (lưu ý: chưa bằng vốn điều lệ ${formatThousands(d.von)} đồng)`;
    lines.push(line);
  }
  return lines;
}

/** Dòng đánh dấu chỗ chèn BẢNG cổ đông/thành viên khi dựng bản in (mode "print"); form tách chuỗi theo dòng này. */
export const PRINT_MEMBERS_MARKER = "@@DANH_SACH_THANH_VIEN@@";

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

/** Dòng người đại diện theo pháp luật (Hộ kinh doanh: chủ hộ) — đặt TRƯỚC nhóm thông tin
 * liên hệ ở mọi nơi (form, email, sheet, bản sao, bản in). */
export function registrationRepresentative(d: RegistrationClean): { label: string; value: string } {
  const cfg = REGISTRATION_CONFIG[d.loai];
  const label = cfg.hasTitle ? "Người đại diện theo pháp luật" : "Chủ hộ kinh doanh";
  if (!d.nguoiDaiDien) return { label, value: NONE };
  let value = d.nguoiDaiDien;
  if (cfg.hasTitle && d.chucDanh) value += ` (${d.chucDanh})`;
  return { label, value };
}

/** Dòng người liên hệ: tích "chính là người đại diện" thì ghi "trùng ..." thay vì lặp họ tên. */
export function registrationContact(d: RegistrationClean): { label: string; value: string } {
  if (d.lienHeLaDaiDien) {
    return { label: "Người liên hệ", value: `trùng ${REGISTRATION_CONFIG[d.loai].hasTitle ? "người đại diện" : "chủ hộ kinh doanh"}` };
  }
  return { label: "Họ tên người liên hệ", value: d.tenLienHe || NONE };
}

/** "full" = đầy đủ (nút Sao chép, nội dung email nội bộ); "print" = bản in/PDF (số CCCD che,
 * chỉ 4 số cuối); "sheet" = dòng ghi Google Sheet (KHÔNG có ngày sinh/ngày cấp/địa chỉ
 * liên hệ, CCCD che — chi tiết đầy đủ chỉ nằm trong email). */
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
    lines.push(`Địa chỉ liên hệ: ${g.diaChiLienHe || NONE}`);
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
  const rep = registrationRepresentative(d);
  lines.push(`${rep.label}: ${rep.value}`);
  const contact = registrationContact(d);
  lines.push(`${contact.label}: ${contact.value}`);
  lines.push(`SĐT đăng ký: ${d.sdt || NONE}`);
  lines.push(`Email: ${d.email || NONE}`);
  if (cfg.hasWebsite) lines.push(`Website: ${d.website || NONE}`);
  lines.push("");
  lines.push(`${cfg.nameLabel}: ${d.tenDonVi || NONE}`);
  lines.push(`Ngành nghề kinh doanh: ${d.nganhNghe || NONE}`);
  lines.push(`${cfg.industryMainLabel}: ${d.nganhChinh || NONE}`);
  lines.push(`${cfg.capitalLabel}: ${d.von ? `${formatThousands(d.von)} đồng` : NONE}`);
  if (cfg.membersLabel) {
    const body = registrationMembersBody(d);
    if (mode === "print" && body.length) lines.push(PRINT_MEMBERS_MARKER);
    else lines.push(body.length ? `${cfg.membersLabel}:\n${body.join("\n")}` : `${cfg.membersLabel}: ${NONE}`);
  }
  lines.push("");
  lines.push(...identitySectionLines(d, mode));
  return lines.join("\n");
}
