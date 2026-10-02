import { ImageResponse } from "next/og";
import {
  CARD_WIDTH,
  MARGIN_X,
  QUOTE_COLOR,
  loadQuoteImageFonts,
  loadQuoteImageLogo,
  QuoteHeaderRow,
  QuoteFooterRow,
} from "@/lib/quoteImageShared";
import {
  resolvePaymentRequest,
  type PaymentRequestInput,
  type PaymentRequestLineItem,
  type PaymentRequestDebt,
  type PaymentRequestCompanyKey,
} from "@/lib/paymentRequestData";
import { amountToVietnameseWords } from "@/lib/numberToWords";
import { buildVietQrImageUrl, vietQrAccountLabel, detectImageMimeType } from "@/lib/vietQr";

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

const TITLE_BLOCK_H = 70;
const DIA_DIEM_H = 36;
const RECIPIENT_TOP_MARGIN = 20;
const RECIPIENT_LABEL_H = 18;
const RECIPIENT_NAME_LINE_H = 24;
const RECIPIENT_CONTACT_H = 24;
// Ngưỡng ký tự ước lượng số dòng xuống hàng cho tên công ty (fontSize 17,
// bold) và đoạn văn hợp đồng/giới thiệu (fontSize 14, thường) — HIỆU CHỈNH
// bằng pixel thật qua render test (xem báo cáo cuối phiên), theo đúng
// phương pháp đã dùng cho MERGED_TITLE_WRAP_THRESHOLD ở route quote-image
// tổng hợp.
const NAME_CHARS_PER_LINE = 62;
const PARAGRAPH_CHARS_PER_LINE = 98;
const PARAGRAPH_LINE_H = 21;
const PARAGRAPH_BLOCK_GAP = 6;
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

function recipientBlockHeight(companyName: string): number {
  const nameLines = estimateLines(companyName, NAME_CHARS_PER_LINE);
  return RECIPIENT_TOP_MARGIN + RECIPIENT_LABEL_H + nameLines * RECIPIENT_NAME_LINE_H + RECIPIENT_CONTACT_H;
}

function debtRowHeight(debt: PaymentRequestDebt | null): number {
  if (!debt) return 0;
  const lines = estimateLines(debt.description, 50);
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
      isFiniteNumber(b.congNoDauKy) &&
      typeof b.moTaCongNo === "string" &&
      isFiniteNumber(b.soXe) &&
      isFiniteNumber(b.chiSoDau) &&
      isFiniteNumber(b.chiSoCuoi) &&
      isFiniteNumber(b.donGiaDien) &&
      (b.type === "qe-agency" || isFiniteNumber(b.tienThue))
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: `0 ${MARGIN_X}px`, marginTop: 8 }}>
      <div style={{ display: "flex", fontSize: 26, fontWeight: 800, letterSpacing: 0.5, color: QUOTE_COLOR.navy }}>
        ĐỀ NGHỊ THANH TOÁN
      </div>
      <div style={{ display: "flex", marginTop: 6, fontSize: 14, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
        {subjectLine}
      </div>
    </div>
  );
}

function RecipientBlock({ companyName, mst, phone }: { companyName: string; mst: string; phone: string }) {
  const contactLine = [mst && `MST: ${mst}`, phone && `SĐT: ${phone}`].filter(Boolean).join("   •   ");
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: RECIPIENT_TOP_MARGIN }}>
      <div style={{ display: "flex", fontSize: 13, color: QUOTE_COLOR.bodyText }}>Kính gửi:</div>
      <div style={{ display: "flex", marginTop: 2, fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.navy }}>{companyName}</div>
      {contactLine && (
        <div style={{ display: "flex", marginTop: 6, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{contactLine}</div>
      )}
    </div>
  );
}

function ParagraphBlock({ lines, topMargin }: { lines: string[]; topMargin: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: `0 ${MARGIN_X}px`, marginTop: topMargin, gap: PARAGRAPH_BLOCK_GAP }}>
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
        margin: `0 ${MARGIN_X}px`,
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

const COL = {
  stt: 40,
  service: 4,
  amount: 1.4,
  vat: 0.9,
  vatAmount: 1.2,
  total: 1.4,
};

function TableHeader() {
  const cell: React.CSSProperties = { display: "flex", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: `0 ${MARGIN_X}px`,
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
        margin: `0 ${MARGIN_X}px`,
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
    <div style={{ display: "flex", justifyContent: "flex-end", margin: `0 ${MARGIN_X}px`, marginTop: GRAND_TOTAL_TOP_MARGIN }}>
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
        margin: `0 ${MARGIN_X}px`,
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
        margin: `0 ${MARGIN_X}px`,
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", margin: `0 ${MARGIN_X}px`, marginTop: 24 }}>
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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Nội dung request không phải JSON hợp lệ.", { status: 400 });
  }

  if (!isValidRequestShape(body)) {
    return new Response("Dữ liệu request không hợp lệ.", { status: 400 });
  }
  if (body.type !== "khac" && !KNOWN_COMPANY_KEYS.includes(body.type)) {
    return new Response("Loại công ty không hợp lệ.", { status: 400 });
  }

  const result = resolvePaymentRequest(body);
  if ("error" in result) {
    return new Response(result.error, { status: 400 });
  }

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);
  const qrDataUri = await fetchQrDataUri(buildVietQrImageUrl(result.qrAccountKey, result.grandTotal, result.qrNote));

  const height =
    HEADER_H +
    TITLE_BLOCK_H +
    (result.diaDiem ? DIA_DIEM_H : 0) +
    recipientBlockHeight(result.companyName) +
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

  return new ImageResponse(
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
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel="Đề nghị thanh toán" dateLabel={result.issueDateLabel} />
        <TitleBlock subjectLine={result.subjectLine} />
        {result.diaDiem && (
          <div style={{ display: "flex", margin: `0 ${MARGIN_X}px`, marginTop: 16, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
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
        {qrDataUri && <QrBlock dataUri={qrDataUri} accountLabel={vietQrAccountLabel(result.qrAccountKey)} amount={result.grandTotal} />}
        <SignatureBlock />
        <QuoteFooterRow />
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
}
