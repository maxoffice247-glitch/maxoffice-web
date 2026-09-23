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
 * nhận (chi nhánh, gói)/(gói)/(nhóm, khoảng hoá đơn) rồi tự tra giá thật ở
 * server qua resolveCompositeQuoteItem() (xem compositeQuote.ts). Chỉ loại
 * "custom" (Văn phòng trọn gói/Chỗ ngồi linh động/Phòng họp — chưa có bảng
 * giá cấu trúc để tra) mới nhận giá tự do do nhân viên gõ tay.
 *
 * KHÔNG đọc ảnh mặt tiền chi nhánh (khác route [slug]/[plan]) — báo giá
 * tổng hợp tập trung vào liệt kê dịch vụ + giá, không giới thiệu 1 chi
 * nhánh cụ thể. Toàn bộ readFile() trong quoteImageShared.tsx dùng đường
 * dẫn TĨNH (font, logo) nên không cần khai báo thêm trong
 * outputFileTracingIncludes như route [slug]/[plan] (đọc ảnh theo `slug`
 * runtime).
 */
export const runtime = "nodejs";

const ROW_H = 78;
const ROW_GAP = 12;
const SECTION_HEADER_H = 34;
const SECTION_TOP_MARGIN = 32;
const TOTAL_ROW_H = 60;
const HEADER_H = 148;
const FOOTER_H = 176;
const CUSTOMER_ROW_H = 26;

const BUCKET_META: Record<QuoteBucket, { title: string; icon: string; totalLabel?: string }> = {
  thang: { title: "Chi phí hàng tháng", icon: "📅", totalLabel: "Tổng chi phí hàng tháng" },
  "mot-lan": { title: "Chi phí một lần", icon: "📄" },
  gio: { title: "Chi phí theo giờ", icon: "🕐" },
};
const BUCKET_ORDER: QuoteBucket[] = ["thang", "mot-lan", "gio"];

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
      return isNonEmptyString(it.locationSlug) && isNonEmptyString(it.planKey);
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

function ItemRow({ line }: { line: ResolvedQuoteLine }) {
  const secondLine = line.subtitle ? `${line.category} · ${line.subtitle}` : line.category;
  // Dòng "custom" khi bỏ trống mô tả có title === category (xem
  // compositeQuote.ts) — ẩn hẳn dòng phụ trong trường hợp đó thay vì hiện
  // lặp lại y hệt tiêu đề ngay bên dưới.
  const showSecondLine = secondLine !== line.title;
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
        <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: QUOTE_COLOR.navy }}>
          {line.title}
        </div>
        {showSecondLine && (
          <div style={{ display: "flex", marginTop: 4, fontSize: 14, color: QUOTE_COLOR.bodyText }}>
            {secondLine}
          </div>
        )}
      </div>
      <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: QUOTE_COLOR.accent, flexShrink: 0 }}>
        {line.priceLabel}
      </div>
    </div>
  );
}

function Section({ bucket, lines }: { bucket: QuoteBucket; lines: ResolvedQuoteLine[] }) {
  if (lines.length === 0) return null;
  const meta = BUCKET_META[bucket];
  const allSummable = lines.every((l) => l.rawAmount != null);
  const total = allSummable ? lines.reduce((sum, l) => sum + (l.rawAmount ?? 0), 0) : null;
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
      {meta.totalLabel && total != null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
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
      )}
    </div>
  );
}

function sectionHeight(lineCount: number, hasTotal: boolean): number {
  if (lineCount === 0) return 0;
  const rowsHeight = lineCount * ROW_H + (lineCount - 1) * ROW_GAP;
  const totalHeight = hasTotal ? TOTAL_ROW_H + 16 : 0;
  return SECTION_TOP_MARGIN + SECTION_HEADER_H + 16 + rowsHeight + totalHeight;
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

  const [fonts, logoSrc] = await Promise.all([loadQuoteImageFonts(), loadQuoteImageLogo()]);

  const dateLabel = `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`;

  const customerBlockH =
    customerRows.length > 0 ? 24 + 40 + 30 + customerRows.length * CUSTOMER_ROW_H : 0;

  const monthlyLines = byBucket.get("thang")!;
  const oneTimeLines = byBucket.get("mot-lan")!;
  const hourlyLines = byBucket.get("gio")!;
  const monthlyHasTotal = monthlyLines.length > 0 && monthlyLines.every((l) => l.rawAmount != null);

  const height =
    HEADER_H +
    customerBlockH +
    sectionHeight(monthlyLines.length, monthlyHasTotal) +
    sectionHeight(oneTimeLines.length, false) +
    sectionHeight(hourlyLines.length, false) +
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

        <Section bucket="thang" lines={monthlyLines} />
        <Section bucket="mot-lan" lines={oneTimeLines} />
        <Section bucket="gio" lines={hourlyLines} />

        {/* Không có dòng "Tổng cộng" gộp cả 3 khối — cố ý, vì đơn vị tính
            khác nhau (đ/tháng, đ một lần, đ/giờ) không thể cộng chung thành
            1 con số có ý nghĩa. Chỉ khối "Hàng tháng" có tổng riêng vì cùng
            đơn vị. */}

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
