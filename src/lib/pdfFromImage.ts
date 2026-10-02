import { PDFDocument } from "pdf-lib";

/**
 * Nhúng 1 ảnh PNG (buffer) làm toàn bộ nội dung của 1 trang PDF DUY NHẤT —
 * dùng cho nút "Tải xuống PDF" của công cụ "Đề nghị thanh toán"
 * (api/payment-request-image/route.tsx). Trang PDF co theo ĐÚNG tỉ lệ khung
 * hình ảnh gốc, bề rộng cố định bằng khổ A4 — ảnh phủ kín cả trang (không
 * viền trắng thừa), vì ảnh "card" hiện có không có tỉ lệ khung hình giống
 * 1 tờ A4 thật.
 *
 * CỐ Ý tái dùng NGUYÊN ảnh PNG đã render qua Satori (không dựng lại layout
 * bằng 1 thư viện PDF riêng như @react-pdf/renderer) — đảm bảo bản PDF tải
 * về LUÔN khớp pixel-for-pixel với bản xem trước PNG, không có rủi ro lệch
 * nội dung giữa 2 nơi code khác nhau. pdf-lib là thư viện thuần JS, không
 * cần trình duyệt headless/binary ngoài — cùng lý do đã chọn Satori/next/og
 * cho PNG thay vì Puppeteer trước đây, chạy nhẹ và ổn định trên Vercel
 * serverless function.
 */
const A4_WIDTH_PT = 595.28;

export async function pngBufferToSinglePagePdf(pngBuffer: Buffer, pixelWidth: number, pixelHeight: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBuffer);
  const pageWidth = A4_WIDTH_PT;
  const pageHeight = pageWidth * (pixelHeight / pixelWidth);
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  page.drawImage(pngImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  return pdfDoc.save();
}
