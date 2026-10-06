/**
 * Dictionary nhãn CỐ ĐỊNH cho ảnh "Báo giá tổng hợp" song ngữ
 * (src/app/api/quote-image/tong-hop/route.tsx + quoteImageShared.tsx) —
 * KHÔNG dùng cho bất kỳ trang/route nào khác trong site (2 route ảnh báo
 * giá 1 gói hiện có vẫn thuần tiếng Việt, không đổi).
 *
 * TOÀN BỘ bản tiếng Anh dưới đây là Claude TỰ ĐỀ XUẤT (bản dịch tạm) — CẦN
 * CHỦ SITE RÀ SOÁT VÀ SỬA LẠI trước khi coi là bản chính thức gửi khách
 * thật, vì đây là nội dung xuất hiện trực tiếp trên ảnh báo giá gửi cho
 * khách hàng. Xem báo cáo đầy đủ kèm theo (liệt kê lại toàn bộ bản dịch ở
 * 1 chỗ) để rà soát nhanh hơn thay vì phải mở từng file.
 *
 * CỐ Ý KHÔNG dịch: tên chi nhánh, địa chỉ (theo đúng yêu cầu — địa chỉ
 * không dịch), và dòng "Bằng chữ" (không có quy ước tiếng Anh tương đương
 * trên hoá đơn, OMIT hẳn ở bản tiếng Anh — đây chỉ là cách TRÌNH BÀY lại
 * đúng con số đã hiện, bỏ không mất thông tin).
 *
 * Nhãn ưu đãi ký hợp đồng dài hạn (`breakdown.promo.label`) KHÔNG nằm trong
 * dictionary này — câu tiếng Việt ghép động nhiều biến số (số tháng/loại ưu
 * đãi) nên được dịch trực tiếp tại nơi tạo ra nó, xem `monthPromo()` trong
 * compositeQuote.ts. Khác "Bằng chữ", đây LÀ thông tin giá trị thực (khách
 * được tặng tháng/miễn phí đổi GPKD khi ký dài hạn) nên PHẢI dịch, KHÔNG
 * được bỏ ở bản tiếng Anh — quyết định này đã sửa lại sau khi chủ site rà
 * soát bản nháp ban đầu (trước đó Claude tự ý omit, là quyết định SAI).
 */

export type QuoteLang = "vi" | "en";

export const QUOTE_DICT = {
  badgeLabel: { vi: "Báo giá tổng hợp", en: "Composite Quote" },
  dateLabelPrefix: { vi: "Ngày tạo", en: "Date issued" },
  customerInfoTitle: { vi: "Thông tin khách hàng", en: "Customer Information" },
  customerNameLabel: { vi: "Khách hàng", en: "Customer" },
  customerPhoneLabel: { vi: "Điện thoại", en: "Phone" },
  customerCompanyLabel: { vi: "Tên công ty dự kiến", en: "Company Name (planned)" },
  unitPriceLabel: { vi: "Đơn giá", en: "Unit Price" },
  subtotalLabel: { vi: "Tạm tính (chưa VAT)", en: "Subtotal (excl. VAT)" },
  totalLabel: { vi: "Thành tiền", en: "Total" },
  // Dòng "Tiền thuê" khi thẻ Văn phòng ảo có thêm phụ phí thu một lần (tách riêng khỏi dòng phụ phí để "Tạm tính" gồm cả hai).
  rentSubtotalLabel: { vi: "Tiền thuê", en: "Rent" },
  monthsUnit: { vi: "tháng", en: "months" },
  scanToPayTitle: { vi: "Quét mã để chuyển khoản", en: "Scan to Pay" },
  suggestedAmountLabel: { vi: "Số tiền gợi ý", en: "Suggested amount" },
  hotlineLabel: { vi: "Hotline", en: "Hotline" },
  contactNowLabel: { vi: "Liên hệ tư vấn ngay", en: "Contact us now" },
  // 4 bucket (QuoteBucket trong compositeQuote.ts) x 2 nhãn (tiêu đề khối / tiêu đề dòng tổng).
  bucketVpaTitle: { vi: "Chi phí thuê Văn phòng ảo", en: "Virtual Office Rental Cost" },
  bucketVpaTotal: { vi: "Tổng chi phí thuê Văn phòng ảo", en: "Total Virtual Office Rental Cost" },
  bucketThangTitle: { vi: "Chi phí dịch vụ hàng tháng khác", en: "Other Monthly Service Costs" },
  bucketThangTotal: { vi: "Tổng chi phí dịch vụ hàng tháng khác", en: "Total Other Monthly Service Costs" },
  bucketMotLanTitle: { vi: "Chi phí một lần", en: "One-time Cost" },
  bucketMotLanTotal: { vi: "Tổng chi phí một lần", en: "Total One-time Cost" },
  bucketGioTitle: { vi: "Chi phí theo giờ", en: "Hourly Cost" },
  bucketGioTotal: { vi: "Tổng chi phí theo giờ", en: "Total Hourly Cost" },
  // 3 category chính dùng trong resolveCompositeQuoteItem() (compositeQuote.ts).
  categoryVanPhongAo: { vi: "Văn phòng ảo", en: "Virtual Office" },
  categoryThanhLapDoanhNghiep: { vi: "Thành lập doanh nghiệp", en: "Business Registration" },
  categoryKeToanThue: { vi: "Kế toán & thuế", en: "Accounting & Tax" },
  // Nhóm "Dịch vụ pháp lý sửa đổi" (loại "sua-doi" trong compositeQuote.ts) — tên 13 dịch vụ ở AMENDMENT_SERVICE_NAMES_EN
  // bên dưới, thời gian dịch qua translateAmendmentDuration().
  categoryPhapLySuaDoi: { vi: "Dịch vụ pháp lý sửa đổi", en: "Legal Amendment Services" },
  // Dạng ảnh "Bảng giá đầy đủ 13 dịch vụ" (loại "sua-doi-bang-gia") — liệt kê giá, KHÔNG tính tổng/combo/QR.
  priceListTitle: { vi: "Bảng giá dịch vụ pháp lý sửa đổi", en: "Legal Amendment Services Price List" },
  priceListColService: { vi: "Dịch vụ", en: "Service" },
  priceListColDuration: { vi: "Thời gian", en: "Duration" },
  priceListColExcl: { vi: "Giá chưa VAT", en: "Price (excl. VAT)" },
  amendmentOriginalTotalLabel: { vi: "Tổng giá gốc", en: "List price total" },
  amendmentComboSubtotalLabel: { vi: "Tạm tính sau combo (chưa VAT)", en: "After combo (excl. VAT)" },
  // Ghi chú ưu đãi combo — dựng từ hằng số ở setupFees.ts nên số tiền luôn khớp; câu cố định ở hàm
  // amendmentComboNote() bên dưới (khác các nhãn tĩnh ở đây vì chèn số tiền).
  // Từ "Gói" đứng trước tên gói VPA (VD "Gói LITE" -> "LITE Package") — đặt
  // SAU tên gói ở bản tiếng Anh cho đúng thứ tự tự nhiên, xem cách dùng ở
  // compositeQuote.ts (khác cấu trúc template nên tách riêng, không chung
  // 1 khoá "goiPrefix" rồi nối trước/sau).
  // 3 dịch vụ "custom" (CUSTOM_SERVICE_META trong compositeQuote.ts).
  customVanPhongTronGoi: { vi: "Văn phòng trọn gói", en: "Serviced Office" },
  customChoNgoiLinhDong: { vi: "Chỗ ngồi linh động", en: "Flexible Seating" },
  customPhongHop: { vi: "Phòng họp theo giờ", en: "Meeting Room (hourly)" },
  // Dịch vụ "custom" thứ 4 — tự nhập hoàn toàn (tên + giá), dùng khi khách
  // cần 1 dịch vụ chưa có trên web/chưa có bảng giá cấu trúc nào ở trên.
  customKhac: { vi: "Dịch vụ khác", en: "Other Service" },
  // 3 hậu tố đơn vị gắn sau giá/baseLabel (compositeQuote.ts) — dùng CHUNG
  // cho cả 2 ngôn ngữ qua qt() thay vì hardcode riêng từng nơi.
  perMonthSuffix: { vi: "/tháng", en: "/month" },
  perHourSuffix: { vi: "/giờ", en: "/hour" },
  perQuarterSuffix: { vi: "/quý", en: "/quarter" },
  // Tổng cộng toàn bộ báo giá (gộp mọi khối/đơn vị tính phí) — hiện khi báo
  // giá có từ 2 dòng tra được giá trở lên, xem route.tsx.
  grandTotalLabel: { vi: "TỔNG CỘNG TOÀN BỘ BÁO GIÁ", en: "GRAND TOTAL" },
  grandTotalExcludedNote: {
    vi: "* Chưa gồm các dịch vụ báo giá riêng ở trên (chưa tách được số cụ thể)",
    en: "* Excludes custom-quoted items above (no fixed amount yet)",
  },
  // Khi báo giá có CẢ 2 nhóm (MAX OFFICE + thu hộ), CHỈ có 1 ô tổng GỘP CẢ 2 khoản với nhãn này (số tiền bằng chữ nằm ngay trong ô, bản tiếng Việt); 2 dòng chú thích nhỏ
  // dưới ô tách số tiền theo tài khoản nhận — xem overallBreakdownText() ở cuối file. (Bản tiếng Anh vốn không có "Bằng chữ".)
  overallTotalLabel: {
    vi: "Tổng toàn bộ báo giá MAX OFFICE và thu hộ",
    en: "Grand total, MAX OFFICE and collected-on-behalf services",
  },
  // 2 category "thu hộ" — tiền 2 dịch vụ này KHÔNG vào tài khoản MAX OFFICE
  // (xem THU_HO_ACCOUNT trong vietQr.ts).
  categoryChuKySo: { vi: "Chữ ký số", en: "Digital Signature" },
  categoryHoaDonDienTu: { vi: "Hoá đơn điện tử", en: "E-Invoice" },
  // Bucket "thu-ho" thứ 5 (QuoteBucket trong compositeQuote.ts) — gộp chung
  // Chữ ký số + Hoá đơn điện tử vào 1 khối riêng, tách khỏi 4 khối "Dịch vụ
  // MAX OFFICE" hiện có.
  bucketThuHoTitle: {
    vi: "Dịch vụ thu hộ (Chữ ký số & Hoá đơn điện tử)",
    en: "Pass-through Services (Digital Signature & E-Invoice)",
  },
  bucketThuHoTotal: { vi: "Tổng dịch vụ thu hộ", en: "Total Pass-through Services" },
  // Nhãn NGẮN cho tiêu đề mỗi cột khi 2 mã QR xếp NGANG cạnh nhau (không lặp
  // lại "Quét mã để chuyển khoản" trong từng cột — dòng đó dùng CHUNG 1 lần
  // phía trên 2 cột, qua chính "scanToPayTitle"). Khi chỉ có 1 mã QR (không
  // đổi hành vi cũ), vẫn dùng đúng "scanToPayTitle" làm tiêu đề duy nhất.
  scanToPayMaxOfficeTitle: { vi: "Dịch vụ MAX OFFICE", en: "MAX OFFICE Services" },
  scanToPayThuHoTitle: { vi: "Dịch vụ thu hộ", en: "Pass-through Services" },
  // Cảnh báo LUÔN hiện dưới QR thu hộ (dù chỉ 1 hay cả 2 QR) — tài khoản CÁ
  // NHÂN của đơn vị cung cấp, không phải tài khoản MAX OFFICE.
  thuHoQrNote: {
    vi: "Chuyển vào TK đơn vị cung cấp Chữ ký số/Hoá đơn điện tử, KHÔNG phải TK MAX OFFICE",
    en: "Pay to the Digital Signature/E-Invoice provider's account, NOT a MAX OFFICE account",
  },
} as const satisfies Record<string, Record<QuoteLang, string>>;

export type QuoteDictKey = keyof typeof QUOTE_DICT;

export function qt(key: QuoteDictKey, lang: QuoteLang): string {
  return QUOTE_DICT[key][lang];
}

/** `6.586.800đ` (vi) hoặc `6,586,800 VND` (en) — cùng 1 số, khác quy ước
    phân cách hàng nghìn + hậu tố tiền tệ theo ngôn ngữ. */
export function formatQuoteCurrency(n: number, lang: QuoteLang): string {
  return lang === "en" ? `${n.toLocaleString("en-US")} VND` : `${n.toLocaleString("vi-VN")}đ`;
}

/** Nhãn VAT có số % chèn giữa — giữ nguyên định dạng "VAT 10%" ở cả 2 ngôn
    ngữ (quy ước quốc tế cũng viết "VAT" + số %, không cần dịch riêng). */
export function vatLabel(ratePercent: number): string {
  return `VAT ${ratePercent}%`;
}

/**
 * Tên tiếng Anh của 13 dịch vụ pháp lý sửa đổi (AMENDMENT_SERVICES trong setupFees.ts) — Claude TỰ ĐỀ XUẤT, CẦN RÀ
 * SOÁT trước khi gửi khách. Chú ý "cùng cơ sở"/"khác cơ sở" dịch là "within/outside the same jurisdiction" theo cách hiểu
 * "cùng/khác phạm vi quản lý của cơ quan đăng ký" — cần xác nhận đúng nghĩa nghiệp vụ.
 */
export const AMENDMENT_SERVICE_NAMES_EN: Record<string, string> = {
  "doi-ten-cong-ty": "Change of company name",
  "doi-dia-chi-cung-co-so": "Change of address - within the same jurisdiction",
  "doi-dia-chi-khac-co-so": "Change of address - to a different jurisdiction",
  "doi-dai-dien-phap-luat": "Change of legal representative",
  "doi-dai-dien-va-chu-so-huu": "Change of legal representative + owner",
  "tang-von-1-thanh-vien": "Charter capital increase - single-member company",
  "tang-von-2-thanh-vien": "Charter capital increase - multi-member LLC & joint-stock company",
  "bo-sung-nganh-nghe": "Add business lines (1-15 lines)",
  "doi-so-dien-thoai": "Add/change phone number",
  "cap-nhat-cccd": "Update citizen ID card (CCCD)",
  "them-ten-viet-tat": "Add abbreviated/foreign company name",
  "chuyen-doi-loai-hinh": "Conversion of business type",
  "cap-nhat-dia-gioi-hanh-chinh": "Update administrative boundaries - identify beneficial owner",
};

/** "5-7 ngày" -> "5-7 days" (dữ liệu gốc luôn có dạng "N ngày"/"N-M ngày"); chuỗi lạ giữ nguyên. */
export function translateAmendmentDuration(duration: string, lang: QuoteLang): string {
  if (lang === "vi") return duration;
  const m = duration.match(/^(\d+(?:-\d+)?)\s*ngày$/);
  return m ? `${m[1]} days` : duration;
}

/** Câu chú thích ưu đãi combo trên ảnh báo giá — CỐ Ý ngắn để vừa MỘT dòng nhỏ (chữ 12px) ở cả 2 ngôn ngữ. Số tiền truyền
 * vào từ hằng số setupFees.ts nên luôn khớp quy tắc tính. */
export function amendmentComboNote(
  lang: QuoteLang,
  p: { threshold: number; high: number; low: number }
): string {
  const f = (n: number) => formatQuoteCurrency(n, lang);
  return lang === "en"
    ? `Combo discount: highest-priced service in full; others ${f(p.high)} (list price > ${f(p.threshold)}) or ${f(p.low)} (≤ ${f(p.threshold)}).`
    : `Ưu đãi combo: dịch vụ giá cao nhất tính đủ; còn lại tính ${f(p.high)} (giá gốc > ${f(p.threshold)}) hoặc ${f(p.low)} (giá gốc ≤ ${f(p.threshold)}).`;
}

/** "3 dịch vụ" / "3 services" ("1 service" ở số ít) — đếm số dịch vụ sửa đổi trong dòng tiêu đề thẻ trên ảnh. */
export function amendmentServiceCount(n: number, lang: QuoteLang): string {
  return lang === "en" ? `${n} ${n === 1 ? "service" : "services"}` : `${n} dịch vụ`;
}

/** Tiêu đề cột "Giá đã gồm VAT 8%" / "Price (incl. 8% VAT)" — số % truyền từ AMENDMENT_VAT_PERCENT. */
export function priceListColIncl(lang: QuoteLang, vatPercent: number): string {
  return lang === "en" ? `Price (incl. ${vatPercent}% VAT)` : `Giá đã gồm VAT ${vatPercent}%`;
}

/** Câu phạm vi áp dụng (bản tiếng Anh) — bản tiếng Việt lấy từ AMENDMENT_SCOPE_NOTE (setupFees.ts) cho khớp đúng chữ trên web. */
export const AMENDMENT_SCOPE_NOTE_EN =
  "Applies equally to household businesses, limited liability companies and joint-stock companies — regardless of business type.";

/** Ghi chú VAT dưới bảng giá đầy đủ. */
export function priceListVatNote(lang: QuoteLang, vatPercent: number): string {
  return lang === "en"
    ? `Listed prices exclude VAT; the VAT-inclusive price adds ${vatPercent}% VAT.`
    : `Giá chưa bao gồm VAT ${vatPercent}%; giá đã gồm VAT là giá cộng thêm VAT ${vatPercent}%.`;
}

/* ---------------------------------------------------------------------- */
/* Phụ phí THU MỘT LẦN của gói Văn phòng ảo (addOn trong                    */
/* virtualOfficePlans.ts, hiện: "Bảng hiệu công ty" của gói LITE). Chữ lấy  */
/* từ label/note trong DỮ LIỆU GÓI — chỉ khung câu nằm ở đây. Bản tiếng    */
/* Anh là Claude tự đề xuất, CẦN RÀ SOÁT.                                    */
/* ---------------------------------------------------------------------- */

type OneTimeFeeText = { label: string; labelEn: string; price: number; note: string; noteEn: string };

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** "Phí bảng hiệu công ty" / "Company signage fee". */
export function oneTimeFeeName(lang: QuoteLang, fee: Pick<OneTimeFeeText, "label" | "labelEn">): string {
  return lang === "en" ? `${fee.labelEn} fee` : `Phí ${lowerFirst(fee.label)}`;
}

/** Dòng phụ gọn trong thẻ Văn phòng ảo của báo giá tổng hợp (không kèm số tiền): "Phí bảng hiệu công ty (thu 1 lần)" / "Company signage fee (one-time)". */
export function oneTimeFeeShortLabel(lang: QuoteLang, fee: Pick<OneTimeFeeText, "label" | "labelEn">): string {
  return `${oneTimeFeeName(lang, fee)} ${lang === "en" ? "(one-time)" : "(thu 1 lần)"}`;
}

/** Câu đầy đủ dưới dòng giá thuê ở ảnh báo giá TỪNG GÓI/NHÓM GÓI (chỉ tiếng Việt): "+ Phí bảng hiệu công ty 500.000đ (thu duy nhất 1 lần khi làm …)". */
export function oneTimeFeePlanLine(fee: OneTimeFeeText): string {
  return `+ ${oneTimeFeeName("vi", fee)} ${formatQuoteCurrency(fee.price, "vi")} (${lowerFirst(fee.note)})`;
}

/** Nhãn ô tích ở form (chỉ tiếng Việt): "Có làm bảng hiệu công ty (thu 500.000đ một lần)". */
export function oneTimeFeeCheckboxLabel(fee: OneTimeFeeText): string {
  return `Có làm ${lowerFirst(fee.label)} (thu ${formatQuoteCurrency(fee.price, "vi")} một lần)`;
}

/* ---------------------------------------------------------------------- */
/* Thanh toán theo đợt (đặt cọc) — cọc CHỈ tính trên nhóm "Dịch vụ MAX      */
/* OFFICE". Đợt 1: Đặt cọc D + Còn lại G - D. Đợt 2 chọn 1 trong 2: 100%    */
/* tổng báo giá G ("full") hoặc phần còn lại sau cọc G - D ("remaining").    */
/* Ảnh/form/FAQ KHÔNG nói gì về việc hoàn tiền cọc (tránh khách hiểu nhầm).   */
/* Bản tiếng Anh là Claude tự đề xuất, CẦN RÀ SOÁT.                          */
/* ---------------------------------------------------------------------- */

/** Nhãn khoản tiền trả trước — ĐỔI Ở ĐÂY là đổi toàn bộ chữ (form lẫn ảnh): vd "Tạm ứng" / "Advance". Hậu tố tên file (-COC / -DOT2 / -CON-LAI) và nội dung
 * chuyển khoản (" dat coc" / " thanh toan con lai") là quy ước cố định riêng, không theo nhãn này. */
export const DEPOSIT_LABEL: Record<QuoteLang, string> = { vi: "Đặt cọc", en: "Deposit" };

/** "Thời điểm thanh toán phần còn lại" mặc định — nhân viên sửa tự do ở form. Ảnh tiếng Anh chỉ dịch được ĐÚNG câu mặc định này; câu tự gõ giữ nguyên chữ đã nhập. */
export const DEFAULT_BALANCE_TIMING: Record<QuoteLang, string> = {
  vi: "khi nhận kết quả hồ sơ",
  en: "upon receipt of the application results",
};
export const BALANCE_TIMING_MAX = 120;

/** Văn bản nhân viên có thể sửa: đúng câu mặc định tiếng Việt thì dịch sang tiếng Anh khi ảnh là English; câu tự gõ giữ nguyên. */
export function defaultAwareText(text: string, defaults: Record<QuoteLang, string>, lang: QuoteLang): string {
  return lang === "en" && text === defaults.vi ? defaults.en : text;
}

/** Hai dòng chú thích nhỏ dưới ô "Tổng cộng toàn bộ báo giá" khi báo giá có CẢ nhóm MAX OFFICE lẫn nhóm thu hộ (mỗi dòng: nhãn + số tiền đã gồm VAT). */
export function overallBreakdownText(lang: QuoteLang) {
  return lang === "en"
    ? { company: "Of which: transfer to company account", thuHo: "Transfer to collection account (digital signature / e-invoice)" }
    : { company: "Trong đó: chuyển tài khoản công ty", thuHo: "Chuyển tài khoản thu hộ (Chữ ký số / Hoá đơn điện tử)" };
}

/** Khung câu của khối "Lịch thanh toán" trên ảnh (`title`..`splitNote`) và phần tóm tắt ở form (`form*`). */
export function paymentScheduleText(lang: QuoteLang) {
  const dep = DEPOSIT_LABEL[lang];
  const depLower = `${dep.charAt(0).toLowerCase()}${dep.slice(1)}`;
  return lang === "en"
    ? {
        title: "Payment Schedule",
        depositStage1: `${dep} (installment 1)`,
        balanceTiming: (timing: string) => `Remaining balance (${timing})`,
        balance: "Remaining balance",
        payment2: "Payment, installment 2",
        depositPaid: `${dep} paid`,
        amountDue: "Balance due",
        splitNote: (company: string, collection: string) => `incl. company account (${company}) and collection account (${collection})`,
        formTotal: "Total, all services (incl. VAT)",
        formDeposit: dep,
        formBalance: "Remaining balance",
        formPayment2Full: "Installment 2 payment (100% of the total)",
        formPayment2Remaining: "Installment 2 payment (balance after deposit)",
      }
    : {
        title: "Lịch thanh toán",
        depositStage1: `${dep} (đợt 1)`,
        balanceTiming: (timing: string) => `Còn lại (${timing})`,
        balance: "Còn lại",
        payment2: "Thanh toán đợt 2",
        depositPaid: `Đã ${depLower}`,
        amountDue: "Còn phải thanh toán",
        splitNote: (company: string, collection: string) => `gồm tài khoản công ty (${company}) và tài khoản thu hộ (${collection})`,
        formTotal: "Tổng toàn bộ (đã gồm VAT)",
        formDeposit: dep,
        formBalance: "Còn lại",
        formPayment2Full: "Thanh toán đợt 2 (100% tổng báo giá)",
        formPayment2Remaining: "Thanh toán đợt 2 (phần còn lại sau cọc)",
      };
}

/* ---------------------------------------------------------------------- */
/* Kế toán & thuế: phụ phí trong báo giá + ảnh "Bảng giá đầy đủ".           */
/* Chữ tiếng Việt lấy từ servicesData.ts (cùng nguồn với trang web); phần   */
/* dưới là KHUNG CÂU + bản tiếng Anh — Claude tự đề xuất, CẦN RÀ SOÁT.      */
/* ---------------------------------------------------------------------- */

export function accountingText(lang: QuoteLang, vatPercent: number) {
  return lang === "en"
    ? {
        category: "Accounting & Tax",
        surchargeCardTitle: "Accounting & Tax Surcharges",
        mainFeeRow: "Accounting & tax fee",
        perMonth: "per month",
        priceListTitle: "Accounting & Tax Services Price List",
        priceListNote: "Average monthly fee by number of invoices/documents per quarter, shown for all 3 business types for easy comparison.",
        colRange: "Invoices & documents per quarter",
        surchargeHeading: "Additional fees (if applicable)",
        vatNote: `Listed prices exclude ${vatPercent}% VAT.`,
      }
    : {
        category: "Kế toán & thuế",
        surchargeCardTitle: "Phụ phí kế toán & thuế",
        mainFeeRow: "Phí kế toán & thuế",
        perMonth: "mỗi tháng",
        priceListTitle: "Bảng giá dịch vụ kế toán & thuế",
        priceListNote: "Mức phí trung bình/tháng theo số hoá đơn/quý, hiển thị đồng thời cả 3 nhóm loại hình để dễ so sánh.",
        colRange: "Số hoá đơn ra/vào, chứng từ mỗi quý",
        surchargeHeading: "Phí phát sinh thêm (nếu có)",
        vatNote: `Giá chưa bao gồm VAT ${vatPercent}%.`,
      };
}

/** "3 khoản" / "3 items" — số phụ phí trong thẻ phụ phí. */
export function accountingItemCount(n: number, lang: QuoteLang): string {
  return lang === "en" ? `${n} ${n === 1 ? "item" : "items"}` : `${n} khoản`;
}

/** Bản tiếng Anh của 3 nhóm phụ phí (khoá = AccountingSurcharge.key trong servicesData.ts; `rows` theo đúng thứ tự dòng dữ liệu). */
export const ACCOUNTING_SURCHARGE_EN: Record<
  string,
  { title: string; note?: string; rows: string[]; unitOne: string; unitMany: string; valueSuffix: string }
> = {
  "hai-quan": {
    title: "Customs declaration",
    rows: ["Group A", "Groups B & C: 1-100 pages", "Groups B & C: 100-200 pages"],
    unitOne: "declaration",
    unitMany: "declarations",
    valueSuffix: "",
  },
  "hoa-don-ho": {
    title: "Invoice issuance on behalf of the client",
    note: "Applies to all 3 business groups.",
    rows: ["1-30 invoices", "31-60 invoices", "61-100 invoices"],
    unitOne: "month",
    unitMany: "months",
    valueSuffix: "/month",
  },
  "bao-cao-tai-chinh": {
    title: "Financial statements",
    note: "Applies to all 3 business groups.",
    rows: ["No activity", "Revenue under VND 3 billion", "Revenue over VND 3 billion"],
    unitOne: "year",
    unitMany: "years",
    valueSuffix: "/year",
  },
};

/** Dòng "Nhóm A" của Tờ khai hải quan không có đơn giá số — hiển thị nguyên văn dữ liệu gốc (VI) / bản dịch này (EN). */
export const ACCOUNTING_CUSTOMS_GROUP_A_VALUE_EN = "100 pages + 1,000,000 VND";
