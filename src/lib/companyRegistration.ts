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
    introText: "Công ty TNHH 1 thành viên: 1 chủ sở hữu",
  },
  "ho-kinh-doanh": {
    key: "ho-kinh-doanh",
    representativeLabel: "Họ tên chủ hộ kinh doanh",
    hasTitle: false,
    label: "Hộ kinh doanh",
    shortDesc: "Cá nhân hoặc hộ gia đình",
    title: "Hồ sơ thành lập Hộ kinh doanh",
    nameLabel: "Tên hộ kinh doanh",
    namePlaceholder: "Ví dụ: HỘ KINH DOANH [TÊN CỬA HÀNG]",
    industryMainLabel: "Ngành nghề kinh doanh chính",
    capitalLabel: "Vốn kinh doanh",
    hasWebsite: false,
    vneidNote: "Ảnh VNeID: gửi qua Zalo sau khi bấm Gửi hồ sơ.",
    introText: "Hộ kinh doanh: do cá nhân hoặc hộ gia đình đăng ký",
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

/** Body gửi lên API. `fax` là honeypot (ô ẩn, người thật không bao giờ điền). */
export type RegistrationSubmission = RegistrationValues &
  RegistrationShared & {
    loai: RegistrationType;
    fax?: string;
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
} as const;

export type RegistrationErrors = Partial<Record<keyof RegistrationValues | keyof RegistrationShared, string>>;

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

/** Bản tóm tắt dạng văn bản — dùng cho nút "Sao chép nội dung", khối in, và
 * nội dung email (server dựng lại từ dữ liệu đã validate, không nhận từ client).
 * `branchName` = tên chi nhánh khi khách dùng địa chỉ MAX OFFICE. */
export function buildRegistrationSummary(d: RegistrationClean, branchName?: string): string {
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
  lines.push(cfg.vneidNote.replace(": gửi qua Zalo sau khi bấm Gửi hồ sơ.", ": sẽ gửi qua Zalo."));
  return lines.join("\n");
}
