import fs from "node:fs";
import path from "node:path";

/**
 * Đọc chiều rộng/cao THẬT của 1 ảnh JPEG trong /public bằng cách đọc thẳng
 * marker SOF (Start Of Frame) trong header — không decode toàn bộ ảnh, chỉ
 * đọc vài chục byte đầu file, không cần thêm thư viện ngoài (mọi ảnh gallery
 * chi nhánh trên site đều là .jpg, không có .png/.webp nào lọt qua). Dùng
 * cho bố cục Masonry (LocationGallery.tsx) — mỗi ảnh cần biết đúng tỉ lệ
 * thật của nó để dựng khung `aspect-ratio` khớp chính xác, tránh crop.
 *
 * CHỈ được gọi từ Server Component (dùng fs.readFileSync, không chạy được
 * trong trình duyệt) — gọi ở LocationPageTemplate.tsx rồi truyền kết quả
 * (số thuần, serialize được) xuống LocationImagesSection/LocationGallery
 * (2 component "use client") qua props, không import trực tiếp file này ở
 * bất kỳ file "use client" nào.
 */
function readJpegDimensions(absolutePath: string): { width: number; height: number } | null {
  const buffer = fs.readFileSync(absolutePath);
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null; // not a JPEG (SOI marker)

  let offset = 2;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // SOFx markers (baseline/progressive/etc.) carry the real pixel
    // dimensions — exclude 0xC4 (DHT), 0xC8 (JPG ext, reserved), 0xCC (DAC),
    // which share the numeric range but aren't SOF markers.
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      if (offset + 9 > buffer.length) return null;
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2; // markers with no payload segment
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  return null;
}

const dimensionCache = new Map<string, { width: number; height: number } | null>();

/**
 * `publicPath` bắt đầu bằng "/" (VD "/images/dia-diem-yen-the-le-tan.jpg"),
 * đúng định dạng src đang dùng trong locationsData.ts. Trả về null nếu file
 * không tồn tại/không đọc được — nơi gọi tự fallback (VD tỉ lệ 4:3 mặc định)
 * thay vì crash cả trang build vì 1 ảnh lỗi.
 */
export function getPublicJpegDimensions(publicPath: string): { width: number; height: number } | null {
  if (dimensionCache.has(publicPath)) return dimensionCache.get(publicPath)!;
  let result: { width: number; height: number } | null = null;
  try {
    const absolutePath = path.join(process.cwd(), "public", publicPath);
    result = readJpegDimensions(absolutePath);
  } catch {
    result = null;
  }
  dimensionCache.set(publicPath, result);
  return result;
}
