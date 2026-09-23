import { ImageResponse } from "next/og";
import {
  CARD_WIDTH,
  MARGIN_X,
  CONTENT_WIDTH,
  QUOTE_COLOR,
  loadQuoteImageFonts,
  loadQuoteImageLogo,
  QuoteHeaderRow,
  QuoteFooterRow,
} from "@/lib/quoteImageShared";
import {
  resolveCompositeQuoteItem,
  type CompositeQuoteRequestBody,
  type CompositeQuoteItem,
  type ResolvedQuoteLine,
  type QuoteBucket,
} from "@/lib/compositeQuote";
import { amountToVietnameseWords } from "@/lib/numberToWords";
import { buildVietQrImageUrl, buildQrNote, vietQrAccountLabel, detectImageMimeType } from "@/lib/vietQr";

/**
 * Ảnh "Báo giá tổng hợp" — 1 ảnh PNG gộp NHIỀU dịch vụ khác nhau (VD: gói
 * Văn phòng ảo tại 1 chi nhánh + gói Thành lập doanh nghiệp) do nhân viên
 * tự chọn ở /tien-ich/tao-bao-gia-tong-hop (CompositeQuoteTool.tsx), khác
 * với 2 route quote-image hiện có (báo giá 1 gói Văn phòng ảo tại 1 hoặc
 * nhiều chi nhánh CÙNG loại gói).
 *
 * POST thay vì GET như 2 route kia: input là tổ hợp TỰ DO nhiều dòng dịch
 * vụ + thông tin khách hàng, không thể nhét vừa vào URL path dạng
 * [slug]/[plan]. Không có bước lưu trữ nào — request vào, ảnh PNG ra, hết.
 *
 * AN TOÀN GIÁ: route này KHÔNG bao giờ tin giá do client gửi cho 3 loại dịch
 * vụ đã có cấu trúc (van-phong-ao/thanh-lap-doanh-nghiep/ke-toan-thue) — chỉ
 * nhận (chi nhánh, gói, số tháng)/(gói)/(nhóm, khoảng hoá đơn) rồi tự tra
 * giá thật ở server qua resolveCompositeQuoteItem() (xem compositeQuote.ts).
 * Chỉ loại "custom" (Văn phòng trọn gói/Chỗ ngồi linh động/Phòng họp — chưa
 * có bảng giá cấu trúc để tra) mới nhận giá tự do do nhân viên gõ tay.
 *
 * KHÔNG đọc ảnh mặt tiền chi nhánh (khác route [slug]/[plan]) — báo giá
 * tổng hợp tập trung vào liệt kê dịch vụ + giá, không giới thiệu 1 chi
 * nhánh cụ thể.
 */
export const runtime = "nodejs";

const ROW_PADDING_Y = 40; // "20px 22px" -> 40 tổng theo chiều dọc
const TITLE_H = 26;
const SUBTITLE_H = 22;
const PROMO_BADGE_H = 44; // đủ cho 1 dòng text dài (~90 ký tự) ở 940px rộng
const BREAKDOWN_LINE_H = 24;
const BREAKDOWN_TOP_MARGIN = 10;
const TOTAL_ROW_H = 56; // khối "Thành tiền" viền trên
const FALLBACK_ROW_H = 78; // dòng "custom" không tách được số (giữ như thiết kế cũ)
const ROW_GAP = 14;

const SECTION_HEADER_H = 34;
const SECTION_TOP_MARGIN = 32;
const SECTION_TOTAL_BOX_H = 60;
const SECTION_WORDS_H = 26; // dòng "Bằng chữ" dưới khối tổng
const INLINE_WORDS_H = 22; // dòng "Bằng chữ" gắn ngay dưới 1 dòng đơn lẻ (không box)

const HEADER_H = 148;
const FOOTER_H = 176;
const CUSTOMER_ROW_H = 26;
const QR_BLOCK_H = 232;

const BUCKET_META: Record<QuoteBucket, { title: string; icon: string; totalLabel: string }> = {
  "thue-vpa": { title: "Chi phí thuê Văn phòng ảo", icon: "🏢", totalLabel: "Tổng chi phí thuê Văn phòng ảo" },
  thang: { title: "Chi phí dịch vụ hàng tháng khác", icon: "📅", totalLabel: "Tổng chi phí dịch vụ hàng tháng khác" },
  "mot-lan": { title: "Chi phí một lần", icon: "📄", totalLabel: "Tổng chi phí một lần" },
  gio: { title: "Chi phí theo giờ", icon: "🕐", totalLabel: "Tổng chi phí theo giờ" },
};
const BUCKET_ORDER: QuoteBucket[] = ["thue-vpa", "thang", "mot-lan", "gio"];

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Kiểm tra hình dạng cơ bản của 1 item trước khi đưa vào
 * resolveCompositeQuoteItem() — chặn sớm request rác/thiếu field thay vì
 * để lỗi runtime khó hiểu ở bước tra giá. */
function isValidItemShape(item: unknown): item is CompositeQuoteItem {
  if (!item || typeof item !== "object") return false;
  const it = item as Record<string, unknown>;
  switch (it.type) {
    case "van-phong-ao":
      return (
        isNonEmptyString(it.locationSlug) &&
        isNonEmptyString(it.planKey) &&
        (it.months === 6 || it.months === 12 || it.months === 24)
      );
    case "thanh-lap-doanh-nghiep":
      return it.tier === "goi-1" || it.tier === "goi-2";
    case "ke-toan-thue":
      return (
        (it.group === "A" || it.group === "B" || it.group === "C") &&
        typeof it.rangeIndex === "number"
      );
    case "custom":
      return (
        (it.serviceSlug === "van-phong-tron-goi" ||
          it.serviceSlug === "cho-ngoi-linh-dong" ||
          it.serviceSlug === "phong-hop") &&
        typeof it.label === "string" &&
        isNonEmptyString(it.price)
      );
    default:
      return false;
  }
}

function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + "đ";
}

/** Ước lượng chiều cao 1 dòng dịch vụ — PHẢI khớp đúng với JSX của
 * ItemRow() bên dưới (từng khối cộng thêm ở đây cũng phải tồn tại tương
 * ứng trong render), theo đúng nguyên tắc đã áp dụng ở 2 route quote-image
 * hiện có: tính trước bằng công thức vì Satori cần height cố định. */
function estimateRowHeight(line: ResolvedQuoteLine): number {
  if (!line.breakdown) return FALLBACK_ROW_H;
  const showSubtotalLine = line.breakdown.months != null;
  const breakdownLineCount = 1 /* Đơn giá */ + (showSubtotalLine ? 1 : 0) /* Tạm tính */ + 1; /* VAT */
  return (
    ROW_PADDING_Y +
    TITLE_H +
    SUBTITLE_H +
    (line.breakdown.promo ? PROMO_BADGE_H : 0) +
    BREAKDOWN_TOP_MARGIN +
    breakdownLineCount * BREAKDOWN_LINE_H +
    TOTAL_ROW_H
  );
}

function BreakdownLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <div style={{ display: "flex", color: QUOTE_COLOR.bodyText }}>{label}</div>
      <div style={{ display: "flex", fontWeight: strong ? 700 : 400, color: strong ? QUOTE_COLOR.ink : QUOTE_COLOR.bodyText }}>
        {value}
      </div>
    </div>
  );
}

function ItemRow({ line }: { line: ResolvedQuoteLine }) {
  const secondLine = line.subtitle ? `${line.category} · ${line.subtitle}` : line.category;
  // Dòng "custom" khi bỏ trống mô tả có title === category (xem
  // compositeQuote.ts) — ẩn hẳn dòng phụ trong trường hợp đó thay vì hiện
  // lặp lại y hệt tiêu đề ngay bên dưới.
  const showSecondLine = secondLine !== line.title;

  if (!line.breakdown) {
    // Giá tự nhập không tách được số cụ thể — giữ nguyên bố cục đơn giản
    // cũ (1 dòng title/category bên trái, giá nguyên văn bên phải).
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 14,
          border: `1px solid ${QUOTE_COLOR.line}`,
          backgroundColor: "#ffffff",
          padding: "16px 22px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: QUOTE_COLOR.navy }}>{line.title}</div>
          {showSecondLine && (
            <div style={{ display: "flex", marginTop: 4, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{secondLine}</div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.accent, flexShrink: 0 }}>
          {line.fallbackLabel}
        </div>
      </div>
    );
  }

  const { breakdown } = line;
  const showSubtotalLine = breakdown.months != null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        border: `1px solid ${QUOTE_COLOR.line}`,
        backgroundColor: "#ffffff",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: QUOTE_COLOR.navy }}>{line.title}</div>
      {showSecondLine && (
        <div style={{ display: "flex", marginTop: 4, fontSize: 14, color: QUOTE_COLOR.bodyText }}>{secondLine}</div>
      )}

      {breakdown.promo && (
        <div
          style={{
            display: "flex",
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: "#fff7e6",
            border: "1px solid #f5cd7e",
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: "#b45309",
          }}
        >
          🎁 {breakdown.promo.label}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", marginTop: BREAKDOWN_TOP_MARGIN, gap: 4 }}>
        <BreakdownLine
          label="Đơn giá"
          value={showSubtotalLine ? `${breakdown.baseLabel} × ${breakdown.months} tháng` : breakdown.baseLabel}
        />
        {showSubtotalLine && <BreakdownLine label="Tạm tính (chưa VAT)" value={formatVnd(breakdown.subtotal)} />}
        <BreakdownLine label={`VAT ${breakdown.vatRatePercent}%`} value={formatVnd(breakdown.vatAmount)} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          borderTop: `1px solid ${QUOTE_COLOR.line}`,
          paddingTop: 12,
        }}
      >
        <div style={{ display: "flex", fontSize: 15, fontWeight: 700, color: QUOTE_COLOR.navy }}>Thành tiền</div>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.accent }}>
          {formatVnd(breakdown.total)}
        </div>
      </div>
    </div>
  );
}

function AmountInWords({ amount }: { amount: number }) {
  const words = amountToVietnameseWords(amount);
  if (!words) return null;
  return (
    <div style={{ display: "flex", fontSize: 13, fontStyle: "italic", color: QUOTE_COLOR.bodyText }}>
      Bằng chữ: {words}
    </div>
  );
}

function Section({ bucket, lines }: { bucket: QuoteBucket; lines: ResolvedQuoteLine[] }) {
  if (lines.length === 0) return null;
  const meta = BUCKET_META[bucket];
  const summable = lines.filter((l) => l.breakdown != null);
  const allSummable = summable.length === lines.length && summable.length > 0;
  const total = allSummable ? summable.reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0) : null;
  const showBoxedTotal = allSummable && lines.length >= 2 && total != null;
  const showInlineWords = allSummable && lines.length === 1 && total != null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: `0 ${MARGIN_X}px`,
        marginTop: SECTION_TOP_MARGIN,
      }}
    >
      <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: QUOTE_COLOR.navy, marginBottom: 16 }}>
        {meta.icon} {meta.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP }}>
        {lines.map((line, i) => (
          <ItemRow key={i} line={line} />
        ))}
      </div>
      {showInlineWords && total != null && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <AmountInWords amount={total} />
        </div>
      )}
      {showBoxedTotal && total != null && (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 14,
              backgroundColor: QUOTE_COLOR.bgTint,
              padding: "16px 22px",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: QUOTE_COLOR.navy }}>
              {meta.totalLabel}
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: QUOTE_COLOR.primary }}>
              {formatVnd(total)}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 8, paddingLeft: 4 }}>
            <AmountInWords amount={total} />
          </div>
        </div>
      )}
    </div>
  );
}

function sectionHeight(lines: ResolvedQuoteLine[]): number {
  if (lines.length === 0) return 0;
  const rowsHeight = lines.reduce((sum, l) => sum + estimateRowHeight(l), 0) + (lines.length - 1) * ROW_GAP;
  const summable = lines.filter((l) => l.breakdown != null);
  const allSummable = summable.length === lines.length && summable.length > 0;
  const extra =
    allSummable && lines.length >= 2
      ? 16 + SECTION_TOTAL_BOX_H + 8 + SECTION_WORDS_H
      : allSummable && lines.length === 1
        ? 8 + INLINE_WORDS_H
        : 0;
  return SECTION_TOP_MARGIN + SECTION_HEADER_H + 16 + rowsHeight + extra;
}

export async function POST(req: Request) {
  let body: CompositeQuoteRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Nội dung request không phải JSON hợp lệ.", { status: 400 });
  }

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return new Response("Cần chọn ít nhất 1 dịch vụ để tạo báo giá.", { status: 400 });
  }
  if (body.items.length > 12) {
    return new Response("Chỉ hỗ trợ tối đa 12 dòng dịch vụ trong 1 báo giá.", { status: 400 });
  }

  const resolvedLines: ResolvedQuoteLine[] = [];
  for (const item of body.items) {
    if (!isValidItemShape(item)) {
      return new Response("Có dòng dịch vụ với dữ liệu không hợp lệ trong request.", { status: 400 });
    }
    const result = resolveCompositeQuoteItem(item);
    if ("error" in result) {
      return new Response(result.error, { status: 400 });
    }
    resolvedLines.push(result);
  }

  const customer = body.customer;
  const customerRows: { label: string; value: string }[] = [];
  if (customer) {
    if (isNonEmptyString(customer.name)) customerRows.push({ label: "Khách hàng", value: customer.name.trim() });
    if (isNonEmptyString(customer.phone)) customerRows.push({ label: "Điện thoại", value: customer.phone.trim() });
    if (isNonEmptyString(customer.companyName))
      customerRows.push({ label: "Tên công ty dự kiến", value: customer.companyName.trim() });
  }

  const byBucket = new Map<QuoteBucket, ResolvedQuoteLine[]>();
  for (const bucket of BUCKET_ORDER) byBucket.set(bucket, []);
  for (const line of resolvedLines) byBucket.get(line.bucket)!.push(line);

  // Số tiền gợi ý điền trên QR (nếu bật) — khối TỔNG LỚN NHẤT trong các
  // khối đang có (mỗi khối 1 đơn vị/thời điểm thanh toán khác nhau, không
  // gộp được thành 1 con số chung nên chọn khối lớn nhất làm đại diện, xem
  // báo cáo cuối phiên làm việc để biết lý do chọn cách này).
  let qrAmount: number | null = null;
  for (const bucket of BUCKET_ORDER) {
    const lines = byBucket.get(bucket)!;
    if (lines.length === 0) continue;
    const summable = lines.filter((l) => l.breakdown != null);
    if (summable.length !== lines.length) continue;
    const total = summable.reduce((sum, l) => sum + (l.breakdown?.total ?? 0), 0);
    if (qrAmount == null || total > qrAmount) qrAmount = total;
  }

  let qrDataUri: string | null = null;
  if (body.showQr) {
    try {
      const qrUrl = buildVietQrImageUrl(qrAmount, buildQrNote(customer));
      const qrRes = await fetch(qrUrl);
      if (qrRes.ok) {
        const buf = await qrRes.arrayBuffer();
        // QUAN TRỌNG: KHÔNG tin đuôi URL (".png") lẫn header Content-Type
        // của response — đã xác nhận bằng byte thật rằng img.vietqr.io khai
        // "image/png" nhưng dữ liệu THẬT SỰ là JPEG (magic bytes FF D8 FF).
        // Gán sai MIME vào data URI khiến Satori render ra ảnh trắng trơn,
        // im lặng không báo lỗi gì — phải tự dò magic bytes (xem vietQr.ts).
        const contentType = detectImageMimeType(buf);
        qrDataUri = `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
      }
      // qrRes không ok -> bỏ qua QR, không chặn tạo báo giá vì lỗi ở dịch
      // vụ ngoài (img.vietqr.io).
    } catch {
      qrDataUri = null;
    }
  }

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);

  const dateLabel = `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`;

  const customerBlockH =
    customerRows.length > 0 ? 24 + 40 + 30 + customerRows.length * CUSTOMER_ROW_H : 0;

  const height =
    HEADER_H +
    customerBlockH +
    BUCKET_ORDER.reduce((sum, bucket) => sum + sectionHeight(byBucket.get(bucket)!), 0) +
    (qrDataUri ? QR_BLOCK_H : 0) +
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
        <QuoteHeaderRow logoSrc={logoSrc} badgeLabel="Báo giá tổng hợp" dateLabel={dateLabel} />

        {customerRows.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: `0 ${MARGIN_X}px`,
              marginTop: 24,
              borderRadius: 16,
              backgroundColor: QUOTE_COLOR.bgTint,
              padding: "20px 28px",
              width: CONTENT_WIDTH - 56,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                color: QUOTE_COLOR.primary,
                textTransform: "uppercase",
              }}
            >
              Thông tin khách hàng
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 10, gap: 6 }}>
              {customerRows.map((row) => (
                <div key={row.label} style={{ display: "flex", fontSize: 16, color: QUOTE_COLOR.ink }}>
                  <span style={{ display: "flex", fontWeight: 700, marginRight: 6 }}>{row.label}:</span>
                  {row.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {BUCKET_ORDER.map((bucket) => (
          <Section key={bucket} bucket={bucket} lines={byBucket.get(bucket)!} />
        ))}

        {/* Không có dòng "Tổng cộng" gộp cả 4 khối — cố ý, vì đơn vị tính
            khác nhau (đ thuê VPA theo kỳ hạn đã chọn, đ/tháng, đ một lần,
            đ/giờ) không thể cộng chung thành 1 con số có ý nghĩa. */}

        {qrDataUri && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              margin: `0 ${MARGIN_X}px`,
              marginTop: 32,
              borderRadius: 16,
              backgroundColor: QUOTE_COLOR.bgTint,
              padding: 24,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUri} alt="" width={160} height={160} style={{ borderRadius: 8, backgroundColor: "#fff" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: QUOTE_COLOR.navy }}>
                Quét mã để chuyển khoản
              </div>
              <div style={{ display: "flex", marginTop: 6, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
                {vietQrAccountLabel()}
              </div>
              {qrAmount != null && (
                <div style={{ display: "flex", marginTop: 2, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
                  Số tiền gợi ý: {formatVnd(qrAmount)}
                </div>
              )}
            </div>
          </div>
        )}

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
