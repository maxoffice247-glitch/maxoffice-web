import { ImageResponse } from "next/og";
import {
  CARD_WIDTH,
  QUOTE_COLOR,
  loadQuoteImageFonts,
  loadQuoteImageLogo,
  QuoteHeaderRow,
  QuoteFooterRow,
} from "@/lib/quoteImageShared";
import {
  resolvePaymentRequest,
  buildPaymentRequestFilename,
  type PaymentRequestInput,
  type PaymentRequestLineItem,
  type PaymentRequestDebt,
  type PaymentRequestCompanyKey,
} from "@/lib/paymentRequestData";
import { amountToVietnameseWords } from "@/lib/numberToWords";
import { buildVietQrImageUrl, vietQrAccountLabel, detectImageMimeType, isVietQrAccountKey } from "@/lib/vietQr";
import { isPaymentRequestAuthed } from "@/lib/paymentRequestAuthServer";
import { pngBufferToSinglePagePdf } from "@/lib/pdfFromImage";
import { getPaymentRequestCompanies } from "@/lib/paymentRequestCompanySheet";
import { savePaymentRequestHistory } from "@/lib/paymentRequestHistory";

/**
 * Ảnh "Đề nghị thanh toán" — công cụ NỘI BỘ cho 5 khách thuê SÀN/PHÒNG THẬT
 * tại MAX Office (khác hẳn Văn phòng ảo) + 1 mẫu tự do "Dịch vụ khác", xem
 * chú thích đầy đủ ở paymentRequestData.ts (nguồn dữ liệu, 3 lỗi đã sửa, 2
 * điểm không nhất quán cố ý giữ nguyên).
 *
 * KHÔNG dùng chung component JSX với route quote-image/tong-hop (bố cục
 * hoá đơn khác hẳn — hoá đơn 1 khách/1 kỳ với bảng chi tiết, không phải
 * "gộp nhiều dịch vụ") — chỉ tái dùng phần CHUNG THẬT SỰ (màu, load
 * font/logo, header/footer) từ quoteImageShared.tsx.
 *
 * AN TOÀN SỐ LIỆU: với 5 công ty có tên, route này tự tra lại TOÀN BỘ văn
 * bản cố định (tên công ty/MST/SĐT/địa điểm/đoạn hợp đồng) từ
 * PAYMENT_REQUEST_COMPANIES theo đúng `companyKey` — KHÔNG BAO GIỜ nhận các
 * field này từ client cho 5 công ty đã có hồ sơ (client chỉ gửi số liệu
 * biến đổi theo kỳ: tiền thuê/công nợ/số xe/chỉ số điện...). Chỉ "Dịch vụ
 * khác" mới nhận tên/địa chỉ/MST/SĐT tự do từ client, đúng bản chất mẫu tự
 * nhập hoàn toàn.
 */
export const runtime = "nodejs";

// Lề 2 bên RIÊNG của tool Đề nghị thanh toán — CỐ Ý không đụng tới MARGIN_X
// dùng chung ở quoteImageShared.tsx (dùng chung với route quote-image/tong-hop
// của CompositeQuoteTool). Rộng hơn MARGIN_X=56 gốc khoảng 2.5 lần → vùng nội
// dung (PR_CONTENT_WIDTH) thu hẹp từ 968px còn 800px, giảm ~17.4% — đúng
// khoảng 15-20% theo yêu cầu. QuoteHeaderRow/QuoteFooterRow (2 component DÙNG
// CHUNG) nhận lề này qua prop `marginX` tuỳ chọn, mặc định vẫn là MARGIN_X gốc
// nên route quote-image/tong-hop không bị ảnh hưởng gì.
const PR_MARGIN_X = 140;

const TITLE_BLOCK_H = 70;
const DIA_DIEM_H = 36;
const RECIPIENT_TOP_MARGIN = 20;
const RECIPIENT_LINE_H = 24;
// Ngưỡng ký tự ước lượng số dòng xuống hàng — HIỆU CHỈNH bằng pixel thật qua
// render test (xem báo cáo cuối phiên), theo đúng phương pháp đã dùng cho
// MERGED_TITLE_WRAP_THRESHOLD ở route quote-image tổng hợp. Đã tính lại theo
// tỉ lệ PR_CONTENT_WIDTH/968 (≈0.826) so với ngưỡng cũ khi còn dùng lề chung,
// rồi hiệu chỉnh thêm sau khi đo pixel thật.
const RECIPIENT_CHARS_PER_LINE = 66; // dòng "Kính gửi: Tên — MST: x — SĐT: y" gộp, fontSize 15
const PARAGRAPH_CHARS_PER_LINE = 81;
const PARAGRAPH_LINE_H = 21;
const PARAGRAPH_BLOCK_GAP = 6;
const DEBT_CHARS_PER_LINE = 41;
const TABLE_TOP_MARGIN = 24;
const TABLE_HEADER_H = 38;
const ITEM_ROW_BASE_H = 46;
const ITEM_ROW_EXTRA_LINE_H = 17;
const GRAND_TOTAL_TOP_MARGIN = 24;
const GRAND_TOTAL_BOX_H = 88;
const WORDS_H = 28;
const QR_BLOCK_H = 232;
const SIGNATURE_H = 90;
const HEADER_H = 148; // giống hệt QuoteHeaderRow ở route quote-image/tong-hop (cùng component)
const FOOTER_H = 140; // giống hệt QuoteFooterRow ở route quote-image/tong-hop (cùng component)

function formatVnd(n: number): string {
  return `${n.toLocaleString("vi-VN")}đ`;
}

function estimateLines(text: string, charsPerLine: number): number {
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

function paragraphBlockHeight(lines: string[] | undefined, topMargin: number): number {
  if (!lines || lines.length === 0) return 0;
  const textLines = lines.reduce((sum, l) => sum + estimateLines(l, PARAGRAPH_CHARS_PER_LINE), 0);
  return topMargin + textLines * PARAGRAPH_LINE_H + (lines.length - 1) * PARAGRAPH_BLOCK_GAP;
}

/** "Kính gửi: Tên — MST: x — SĐT: y" GỘP CHUNG 1 khối văn bản chảy tự nhiên
 * (xem RecipientBlock) — ước lượng số dòng theo TỔNG độ dài chuỗi gộp, không
 * còn tách riêng "tên công ty" như trước (đã gộp label+tên+liên hệ thành 1
 * đoạn duy nhất nên phải đếm chung). */
function recipientBlockHeight(companyName: string, mst: string, phone: string): number {
  const contactSuffix = [mst && `MST: ${mst}`, phone && `SĐT: ${phone}`].filter(Boolean).join("  —  ");
  const fullText = `Kính gửi: ${companyName}${contactSuffix ? `  —  ${contactSuffix}` : ""}`;
  const lines = estimateLines(fullText, RECIPIENT_CHARS_PER_LINE);
  return RECIPIENT_TOP_MARGIN + lines * RECIPIENT_LINE_H;
}

function debtRowHeight(debt: PaymentRequestDebt | null): number {
  if (!debt) return 0;
  const lines = estimateLines(debt.description, DEBT_CHARS_PER_LINE);
  return 20 + 28 + lines * 20;
}

function itemRowHeight(item: PaymentRequestLineItem): number {
  const extraLines = (item.detail ? 1 : 0) + (item.labelEn ? 1 : 0);
  return ITEM_ROW_BASE_H + extraLines * ITEM_ROW_EXTRA_LINE_H;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

const KNOWN_COMPANY_KEYS: PaymentRequestCompanyKey[] = ["mtk", "tay-bac", "cul", "koolog", "qe-agency"];

/** Kiểm tra hình dạng request cơ bản trước khi đưa vào resolvePaymentRequest()
 * — cùng nguyên tắc "chặn sớm request rác" đã áp dụng ở route quote-image
 * tổng hợp (isValidItemShape ở đó). */
function isValidRequestShape(body: unknown): body is PaymentRequestInput {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.type === "mtk" || b.type === "qe-agency") {
    return (
      isFiniteNumber(b.ngayLap) &&
      isFiniteNumber(b.thang) &&
      isFiniteNumber(b.nam) &&
      isFiniteNumber(b.tienThue) &&
      isFiniteNumber(b.congNoDauKy) &&
      typeof b.moTaCongNo === "string" &&
      isFiniteNumber(b.soXe) &&
      isFiniteNumber(b.chiSoDau) &&
      isFiniteNumber(b.chiSoCuoi) &&
      isFiniteNumber(b.donGiaDien)
    );
  }
  if (b.type === "tay-bac" || b.type === "cul") {
    return (
      isFiniteNumber(b.ngayLap) &&
      isFiniteNumber(b.thang) &&
      isFiniteNumber(b.nam) &&
      isFiniteNumber(b.tienThue) &&
      isFiniteNumber(b.congNoDauKy) &&
      isFiniteNumber(b.soXe)
    );
  }
  if (b.type === "koolog") {
    return (
      isFiniteNumber(b.ngayLap) &&
      isFiniteNumber(b.thang) &&
      isFiniteNumber(b.nam) &&
      (b.quy === 1 || b.quy === 2 || b.quy === 3 || b.quy === 4) &&
      isFiniteNumber(b.tienThueThang) &&
      isFiniteNumber(b.congNoDauKy) &&
      typeof b.moTaCongNo === "string" &&
      isFiniteNumber(b.soXeCaQuy) &&
      isFiniteNumber(b.dienKhoanCaQuy)
    );
  }
  if (b.type === "khac") {
    return (
      isNonEmptyString(b.tenKhachHang) &&
      typeof b.diaChi === "string" &&
      typeof b.mst === "string" &&
      typeof b.sdt === "string" &&
      isFiniteNumber(b.ngayLap) &&
      isFiniteNumber(b.thang) &&
      isFiniteNumber(b.nam) &&
      typeof b.noiDungVv === "string" &&
      typeof b.noiDungCk === "string" &&
      Array.isArray(b.items) &&
      b.items.every(
        (it) =>
          it &&
          typeof it === "object" &&
          typeof (it as Record<string, unknown>).tenDichVu === "string" &&
          typeof (it as Record<string, unknown>).soTien === "string" &&
          isFiniteNumber((it as Record<string, unknown>).thueSuat)
      )
    );
  }
  return false;
}

function TitleBlock({ subjectLine }: { subjectLine: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: `0 ${PR_MARGIN_X}px`, marginTop: 8 }}>
      <div style={{ display: "flex", fontSize: 26, fontWeight: 800, letterSpacing: 0.5, color: QUOTE_COLOR.navy }}>
        ĐỀ NGHỊ THANH TOÁN
      </div>
      <div style={{ display: "flex", marginTop: 6, fontSize: 14, fontStyle: "italic", color: QUOTE_COLOR.bodyText, textAlign: "center" }}>
        {subjectLine}
      </div>
    </div>
  );
}

/** "Kính gửi:" + tên công ty + MST/SĐT GỘP CHUNG 1 DÒNG VĂN BẢN THUẦN (1 div,
 * 1 chuỗi string duy nhất, KHÔNG dùng <span> lồng bên trong).
 *
 * ĐÃ THỬ cách lồng <span> in đậm cho riêng tên công ty bên trong cùng div
 * trước đó — RENDER THẬT (xem ảnh test mtk.png/khac-long.png) cho thấy Satori
 * KHÔNG áp dụng word-wrap xuyên suốt nội dung hỗn hợp text+span như trình
 * duyệt thật: toàn bộ nội dung bị ép tràn trên 1 dòng vật lý, phần text sau
 * <span> ĐÈ CHỒNG (overlap) lên cuối tên công ty thay vì xuống dòng. Chỉ 1
 * CHUỖI STRING THUẦN trong 1 div mới được Satori wrap đúng theo từng từ (đã
 * xác nhận qua chính ParagraphBlock bên dưới — các đoạn contractParagraph
 * dài vẫn luôn wrap đúng vì là string thuần, không lồng phần tử con nào).
 * Hệ quả: hy sinh việc tô đậm RIÊNG tên công ty (khác nhãn/liên hệ) — cả dòng
 * dùng chung 1 kiểu chữ (đậm, màu navy) để vẫn nổi bật, đổi lại đảm bảo wrap
 * tự nhiên đúng yêu cầu, không bao giờ ép xuống dòng ngay sau "Kính gửi:". */
function RecipientBlock({ companyName, mst, phone }: { companyName: string; mst: string; phone: string }) {
  const contactSuffix = [mst && `MST: ${mst}`, phone && `SĐT: ${phone}`].filter(Boolean).join("  —  ");
  const fullText = `Kính gửi: ${companyName}${contactSuffix ? `  —  ${contactSuffix}` : ""}`;
  return (
    <div
      style={{
        display: "flex",
        margin: `0 ${PR_MARGIN_X}px`,
        marginTop: RECIPIENT_TOP_MARGIN,
        fontSize: 15,
        fontWeight: 700,
        lineHeight: 1.6,
        color: QUOTE_COLOR.navy,
      }}
    >
      {fullText}
    </div>
  );
}

function ParagraphBlock({ lines, topMargin }: { lines: string[]; topMargin: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${PR_MARGIN_X}px`, marginTop: topMargin, gap: PARAGRAPH_BLOCK_GAP }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", fontSize: 14, lineHeight: 1.5, color: QUOTE_COLOR.ink }}>
          {line}
        </div>
      ))}
    </div>
  );
}

function DebtRow({ debt }: { debt: PaymentRequestDebt }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: `0 ${PR_MARGIN_X}px`,
        marginTop: 20,
        borderRadius: 12,
        backgroundColor: "#fff7e6",
        border: "1px solid #f5cd7e",
        padding: "14px 20px",
      }}
    >
      <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: "#b45309" }}>{debt.description}</div>
      <div style={{ display: "flex", fontSize: 16, fontWeight: 800, color: "#b45309", flexShrink: 0, marginLeft: 16 }}>
        {formatVnd(debt.amount)}
      </div>
    </div>
  );
}

// Tỉ lệ flex các cột — ĐÃ TÁI CÂN BẰNG cho vùng nội dung hẹp hơn (xem
// PR_CONTENT_WIDTH): tăng tỉ trọng "service" (tên dịch vụ, cần nhiều chỗ nhất
// — đặc biệt nhãn thuê QE Agency dài), giảm "vat" (chỉ có "10%"/"8%", rất
// ngắn, dư chỗ) để bù lại — độ rộng tuyệt đối cột "service" sau khi tái cân
// bằng gần tương đương trước khi thu hẹp lề (đã đo thật, xem báo cáo cuối
// phiên).
const COL = {
  stt: 40,
  service: 5,
  amount: 1.3,
  vat: 0.7,
  vatAmount: 1.1,
  total: 1.3,
};

function TableHeader() {
  const cell: React.CSSProperties = { display: "flex", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: `0 ${PR_MARGIN_X}px`,
        marginTop: TABLE_TOP_MARGIN,
        backgroundColor: QUOTE_COLOR.navy,
        borderRadius: "10px 10px 0 0",
        padding: "11px 16px",
      }}
    >
      <div style={{ ...cell, width: COL.stt, flexShrink: 0 }}>STT</div>
      <div style={{ ...cell, flex: COL.service }}>Tên dịch vụ</div>
      <div style={{ ...cell, flex: COL.amount, justifyContent: "flex-end" }}>Số tiền</div>
      <div style={{ ...cell, flex: COL.vat, justifyContent: "center" }}>VAT</div>
      <div style={{ ...cell, flex: COL.vatAmount, justifyContent: "flex-end" }}>Tiền VAT</div>
      <div style={{ ...cell, flex: COL.total, justifyContent: "flex-end" }}>Tổng</div>
    </div>
  );
}

function TableRow({ item, isLast }: { item: PaymentRequestLineItem; isLast: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: `0 ${PR_MARGIN_X}px`,
        backgroundColor: "#ffffff",
        borderLeft: `1px solid ${QUOTE_COLOR.line}`,
        borderRight: `1px solid ${QUOTE_COLOR.line}`,
        borderBottom: `1px solid ${QUOTE_COLOR.line}`,
        borderRadius: isLast ? "0 0 10px 10px" : 0,
        padding: "12px 16px",
      }}
    >
      <div style={{ display: "flex", width: COL.stt, flexShrink: 0, fontSize: 13, color: QUOTE_COLOR.bodyText }}>{item.stt}</div>
      <div style={{ display: "flex", flex: COL.service, flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: QUOTE_COLOR.ink }}>{item.label}</div>
        {item.labelEn && (
          <div style={{ display: "flex", marginTop: 2, fontSize: 12, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
            {item.labelEn}
          </div>
        )}
        {item.detail && (
          <div style={{ display: "flex", marginTop: 2, fontSize: 11, color: QUOTE_COLOR.bodyText }}>{item.detail}</div>
        )}
      </div>
      <div style={{ display: "flex", flex: COL.amount, justifyContent: "flex-end", fontSize: 13, color: QUOTE_COLOR.ink }}>
        {formatVnd(item.amount)}
      </div>
      <div style={{ display: "flex", flex: COL.vat, justifyContent: "center", fontSize: 13, color: QUOTE_COLOR.bodyText }}>
        {item.vatPercent}%
      </div>
      <div style={{ display: "flex", flex: COL.vatAmount, justifyContent: "flex-end", fontSize: 13, color: QUOTE_COLOR.bodyText }}>
        {formatVnd(item.vatAmount)}
      </div>
      <div style={{ display: "flex", flex: COL.total, justifyContent: "flex-end", fontSize: 14, fontWeight: 700, color: QUOTE_COLOR.ink }}>
        {formatVnd(item.total)}
      </div>
    </div>
  );
}

function GrandTotalBox({ amount }: { amount: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", margin: `0 ${PR_MARGIN_X}px`, marginTop: GRAND_TOTAL_TOP_MARGIN }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderRadius: 14,
          backgroundColor: QUOTE_COLOR.navy,
          padding: "16px 24px",
        }}
      >
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: "#fff" }}>TỔNG CỘNG THANH TOÁN</div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: "#ffd34d" }}>{formatVnd(amount)}</div>
      </div>
    </div>
  );
}

function AmountInWords({ amount }: { amount: number }) {
  const words = amountToVietnameseWords(amount);
  if (!words) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: `0 ${PR_MARGIN_X}px`,
        marginTop: 8,
        fontSize: 13,
        fontStyle: "italic",
        color: QUOTE_COLOR.bodyText,
      }}
    >
      Bằng chữ: {words}
    </div>
  );
}

function QrBlock({ dataUri, accountLabel, amount }: { dataUri: string; accountLabel: string; amount: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        margin: `0 ${PR_MARGIN_X}px`,
        marginTop: 24,
        borderRadius: 16,
        backgroundColor: QUOTE_COLOR.bgTint,
        padding: 24,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUri} alt="" width={160} height={160} style={{ borderRadius: 8, backgroundColor: "#fff" }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.navy }}>Quét mã để chuyển khoản</div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{accountLabel}</div>
        <div style={{ display: "flex", marginTop: 2, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
          Số tiền: {formatVnd(amount)}
        </div>
      </div>
    </div>
  );
}

function SignatureBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", margin: `0 ${PR_MARGIN_X}px`, marginTop: 24 }}>
      <div style={{ display: "flex", fontSize: 14, fontWeight: 600, color: QUOTE_COLOR.ink }}>Trân trọng cảm ơn!</div>
      <div style={{ display: "flex", marginTop: 32, fontSize: 15, fontWeight: 800, color: QUOTE_COLOR.navy }}>
        CÔNG TY TNHH MAX OFFICE
      </div>
    </div>
  );
}

async function fetchQrDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const contentType = detectImageMimeType(buf);
    return `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  // Chặn gọi THẲNG API này mà không qua trang (lớp mật khẩu ở page.tsx chỉ
  // chặn được UI, không chặn ai biết URL API gọi trực tiếp bằng tay/script)
  // — xem paymentRequestAuth.ts.
  if (!(await isPaymentRequestAuthed())) {
    return new Response("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập — vui lòng tải lại trang và nhập lại mật khẩu.", {
      status: 401,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Nội dung request không phải JSON hợp lệ.", { status: 400 });
  }

  // `format`/`qrAccountKey` là field RIÊNG của request (không thuộc
  // PaymentRequestInput) — đọc trước khi narrow type, isValidRequestShape()
  // bỏ qua field thừa này nên không ảnh hưởng gì tới kiểm tra hình dạng bên
  // dưới. `qrAccountKey` KHÔNG tin trực tiếp — chỉ chấp nhận khi khớp đúng 1
  // trong 2 tài khoản đã khai báo sẵn (isVietQrAccountKey), nhân viên không
  // tự gõ số tài khoản bất kỳ được — cùng nguyên tắc an toàn đã áp dụng ở
  // CompositeQuoteTool/route.tsx.
  const format = body && typeof body === "object" && (body as Record<string, unknown>).format === "pdf" ? "pdf" : "png";
  const requestedQrAccountKey = body && typeof body === "object" ? (body as Record<string, unknown>).qrAccountKey : undefined;

  if (!isValidRequestShape(body)) {
    return new Response("Dữ liệu request không hợp lệ.", { status: 400 });
  }
  if (body.type !== "khac" && !KNOWN_COMPANY_KEYS.includes(body.type)) {
    return new Response("Loại công ty không hợp lệ.", { status: 400 });
  }

  // Đọc dữ liệu công ty MỚI NHẤT từ Google Sheets (có fallback về hardcode
  // nếu Sheets lỗi/chưa đủ cột — xem paymentRequestCompanySheet.ts) — đây
  // là bước DUY NHẤT cần dữ liệu công ty luôn mới nhất (ảnh/PDF xuất ra là
  // kết quả cuối cùng gửi khách), khác bản xem trước nhanh phía client
  // (PaymentRequestTool.tsx) vẫn dùng hardcode cho preview tức thì.
  const companies = await getPaymentRequestCompanies();
  const result = resolvePaymentRequest(body, companies);
  if ("error" in result) {
    return new Response(result.error, { status: 400 });
  }

  // "NHỚ" chỉ số điện cuối kỳ + số lượng xe VỪA DÙNG — SAU KHI tạo phiếu
  // thành công (xem trước PNG hoặc tải PDF đều tính, cả 2 cùng gọi route
  // này), để lần lập phiếu TIẾP THEO cho ĐÚNG công ty này tự điền sẵn (xem
  // api/payment-request-history/route.tsx). KHÔNG áp dụng cho "Dịch vụ
  // khác" (không có danh tính công ty cố định để gắn lịch sử). Lỗi Redis
  // (nếu có) đã tự nuốt bên trong savePaymentRequestHistory(), không ảnh
  // hưởng gì tới việc trả ảnh/PDF.
  if (body.type === "mtk" || body.type === "qe-agency") {
    await savePaymentRequestHistory(body.type, { soXe: body.soXe, chiSoCuoi: body.chiSoCuoi });
  } else if (body.type === "tay-bac" || body.type === "cul") {
    await savePaymentRequestHistory(body.type, { soXe: body.soXe });
  } else if (body.type === "koolog") {
    await savePaymentRequestHistory("koolog", { soXe: body.soXeCaQuy });
  }

  // Tài khoản QR nhân viên TỰ CHỌN trên form (nếu gửi hợp lệ) ghi đè tài
  // khoản mặc định theo loại công ty (result.qrAccountKey) — xem comment ở
  // chỗ đọc requestedQrAccountKey phía trên.
  const qrAccountKey = isVietQrAccountKey(requestedQrAccountKey) ? requestedQrAccountKey : result.qrAccountKey;

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);
  const qrDataUri = await fetchQrDataUri(buildVietQrImageUrl(qrAccountKey, result.grandTotal, result.qrNote));

  const height =
    HEADER_H +
    TITLE_BLOCK_H +
    (result.diaDiem ? DIA_DIEM_H : 0) +
    recipientBlockHeight(result.companyName, result.mst, result.phone) +
    paragraphBlockHeight(result.contractParagraph, 16) +
    paragraphBlockHeight(result.requestParagraph, 12) +
    debtRowHeight(result.debt) +
    TABLE_TOP_MARGIN +
    TABLE_HEADER_H +
    result.items.reduce((sum, it) => sum + itemRowHeight(it), 0) +
    GRAND_TOTAL_BOX_H +
    WORDS_H +
    (qrDataUri ? QR_BLOCK_H : 0) +
    SIGNATURE_H +
    FOOTER_H;

  const pngResponse = new ImageResponse(
    (
      <div
        style={{
          width: CARD_WIDTH,
          height,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel="Đề nghị thanh toán" dateLabel={result.issueDateLabel} marginX={PR_MARGIN_X} />
        <TitleBlock subjectLine={result.subjectLine} />
        {result.diaDiem && (
          <div style={{ display: "flex", margin: `0 ${PR_MARGIN_X}px`, marginTop: 16, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
            Địa điểm: {result.diaDiem}
          </div>
        )}
        <RecipientBlock companyName={result.companyName} mst={result.mst} phone={result.phone} />
        {result.contractParagraph && <ParagraphBlock lines={result.contractParagraph} topMargin={16} />}
        {result.requestParagraph && <ParagraphBlock lines={result.requestParagraph} topMargin={12} />}
        {result.debt && <DebtRow debt={result.debt} />}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <TableHeader />
          {result.items.map((item, i) => (
            <TableRow key={item.stt} item={item} isLast={i === result.items.length - 1} />
          ))}
        </div>

        <GrandTotalBox amount={result.grandTotal} />
        <AmountInWords amount={result.grandTotal} />
        {qrDataUri && <QrBlock dataUri={qrDataUri} accountLabel={vietQrAccountLabel(qrAccountKey)} amount={result.grandTotal} />}
        <SignatureBlock />
        <QuoteFooterRow marginX={PR_MARGIN_X} />
      </div>
    ),
    {
      width: CARD_WIDTH,
      height,
      fonts,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );

  // Xem trước trên trang LUÔN là PNG (giữ nguyên hành vi cũ, không đổi) —
  // chỉ khi client xin rõ `format:"pdf"` (nút "Tải xuống PDF") mới đóng gói
  // lại thành PDF, dùng ĐÚNG byte PNG vừa render ở trên (xem pdfFromImage.ts
  // — đảm bảo PDF khớp pixel-for-pixel với bản xem trước, không dựng lại
  // layout lần 2 bằng thư viện khác).
  if (format !== "pdf") return pngResponse;

  const pngBuffer = Buffer.from(await pngResponse.arrayBuffer());
  const pdfBytes = await pngBufferToSinglePagePdf(pngBuffer, CARD_WIDTH, height);
  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildPaymentRequestFilename(body)}"`,
      "Cache-Control": "no-store",
    },
  });
}
