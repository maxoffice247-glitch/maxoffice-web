#!/usr/bin/env node
/**
 * Kiểm tra ảnh báo giá chi nhánh: gọi route ảnh của MỌI chi nhánh/gói trên một server đang chạy (npm run dev hoặc npm start) và đo khoảng trắng ở ĐÁY ảnh bằng pixel.
 * Satori cần chiều cao ảnh cố định nên chiều cao được ước lượng theo nội dung — dữ liệu đổi (giá, quyền lợi, ưu đãi, chi nhánh mới) làm ước lượng lệch thì footer/nội dung
 * bị cắt. Khoảng trắng đáy co lại dưới ngưỡng là dấu hiệu sớm. Chạy: npm run check:quote-images  (xem docs/KIEM-TRA-ANH-BAO-GIA.md).
 *
 * Phủ: ảnh từng gói (/api/quote-image/{slug}/{plan}), ảnh nhóm gói (/api/quote-image/goi/{groupKey}), ảnh tất cả gói (/api/quote-image/{slug}/tat-ca, chi nhánh >= 2 gói; chi nhánh
 * 1 gói phải trả 404). KHÔNG phủ ảnh báo giá tổng hợp (POST /tong-hop, cần dữ liệu nhập). Chỉ dùng thư viện có sẵn của Node (zlib) để đọc PNG — không thêm phụ thuộc.
 *
 * Biến môi trường: BASE_URL (mặc định http://localhost:3000), MIN_GAP (mặc định 20), MAX_HEIGHT (mặc định 2400), CONCURRENCY (mặc định 4).
 * Mã thoát: 0 = ổn; 1 = có ảnh NGUY CƠ CẮT hoặc lỗi (HTTP/đọc PNG/404 sai kỳ vọng). Ảnh quá cao chỉ cảnh báo.
 */
const zlib = require("node:zlib");
const { SRC } = require("../tests/ts-register.cjs");

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const MIN_GAP = Number(process.env.MIN_GAP || 20);
const MAX_HEIGHT = Number(process.env.MAX_HEIGHT || 2400);
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

/** Giải mã PNG 8-bit (RGB/RGBA/xám), không interlace — đủ cho ảnh do next/og xuất ra. */
function decodePng(buf) {
  if (buf.length < 8 || buf.toString("latin1", 1, 4) !== "PNG") throw new Error("không phải PNG");
  let pos = 8;
  let w, h, bitDepth, colorType, interlace;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (!bpp || bitDepth !== 8 || interlace) throw new Error(`PNG không hỗ trợ (colorType=${colorType}, bitDepth=${bitDepth}, interlace=${interlace})`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 255;
    }
    prev = cur;
  }
  return { w, h, bpp, colorType, data: out };
}

/** Số hàng pixel TRẮNG liên tiếp tính từ đáy ảnh (trắng = R,G,B >= 250 hoặc trong suốt). */
function bottomWhiteRows(img) {
  const { w, h, bpp, colorType, data } = img;
  const hasAlpha = colorType === 6 || colorType === 4;
  let n = 0;
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * bpp;
      const transparent = hasAlpha && data[i + bpp - 1] < 10;
      const white = colorType === 0 || colorType === 4 ? data[i] >= 250 : data[i] >= 250 && data[i + 1] >= 250 && data[i + 2] >= 250;
      if (!transparent && !white) return n;
    }
    n++;
  }
  return n;
}

function buildTargets() {
  const { getAllOfferedPlans, getGroupedPlans } = require(SRC + "lib/planFinder.ts");
  const plans = getAllOfferedPlans();
  const perSlug = new Map();
  for (const p of plans) perSlug.set(p.locationSlug, (perSlug.get(p.locationSlug) || 0) + 1);
  const targets = [];
  for (const p of plans) targets.push({ kind: "goi", name: `${p.locationSlug}/${p.planKey}`, path: `/api/quote-image/${p.locationSlug}/${p.planKey}` });
  for (const g of getGroupedPlans()) targets.push({ kind: "nhom", name: `goi/${g.groupKey}`, path: `/api/quote-image/goi/${g.groupKey}` });
  for (const [slug, count] of perSlug) {
    targets.push({ kind: "tat-ca", name: `${slug}/tat-ca`, path: `/api/quote-image/${slug}/tat-ca`, expect404: count < 2 });
  }
  return targets;
}

async function check(t) {
  try {
    const res = await fetch(BASE_URL + t.path);
    if (t.expect404) return { ...t, status: res.status === 404 ? "OK-404" : "LỖI", note: res.status === 404 ? "chi nhánh 1 gói, 404 đúng kỳ vọng" : `kỳ vọng 404, nhận ${res.status}` };
    if (!res.ok) return { ...t, status: "LỖI", note: `HTTP ${res.status}` };
    const img = decodePng(Buffer.from(await res.arrayBuffer()));
    const gap = bottomWhiteRows(img);
    const notes = [];
    let status = "OK";
    if (gap < MIN_GAP) {
      status = "NGUY CƠ CẮT";
      notes.push(`khoảng trắng đáy ${gap}px < ${MIN_GAP}px`);
    }
    if (img.h > MAX_HEIGHT) {
      if (status === "OK") status = "QUÁ CAO";
      notes.push(`cao ${img.h}px > ${MAX_HEIGHT}px`);
    }
    return { ...t, status, w: img.w, h: img.h, gap, note: notes.join("; ") };
  } catch (err) {
    return { ...t, status: "LỖI", note: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  const targets = buildTargets();
  console.log(`Kiểm tra ${targets.length} ảnh trên ${BASE_URL} (ngưỡng khoảng trắng đáy >= ${MIN_GAP}px, cao <= ${MAX_HEIGHT}px)\n`);
  const results = new Array(targets.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < targets.length) {
        const i = next++;
        results[i] = await check(targets[i]);
      }
    })
  );

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`${pad("LOẠI", 7)} ${pad("ẢNH", 40)} ${pad("KÍCH THƯỚC", 11)} ${pad("TRẮNG ĐÁY", 10)} KẾT QUẢ`);
  for (const r of results) {
    const size = r.w ? `${r.w}x${r.h}` : "-";
    const gap = r.gap === undefined ? "-" : `${r.gap}px`;
    console.log(`${pad(r.kind, 7)} ${pad(r.name, 40)} ${pad(size, 11)} ${pad(gap, 10)} ${r.status}${r.note && r.status !== "OK-404" ? ` — ${r.note}` : ""}`);
  }

  const risky = results.filter((r) => r.status === "NGUY CƠ CẮT");
  const errors = results.filter((r) => r.status === "LỖI");
  const tall = results.filter((r) => r.status === "QUÁ CAO" || (r.h && r.h > MAX_HEIGHT));
  console.log("\nTổng kết theo loại (ảnh / khoảng trắng đáy nhỏ nhất / cao nhất):");
  for (const kind of ["goi", "nhom", "tat-ca"]) {
    const rs = results.filter((r) => r.kind === kind && r.gap !== undefined);
    if (!rs.length) continue;
    const min = rs.reduce((a, b) => (b.gap < a.gap ? b : a));
    const max = rs.reduce((a, b) => (b.h > a.h ? b : a));
    console.log(`  ${pad(kind, 7)} ${pad(rs.length + " ảnh", 8)} trắng đáy nhỏ nhất ${min.gap}px (${min.name}); cao nhất ${max.h}px (${max.name})`);
  }
  console.log(`\nNGUY CƠ CẮT: ${risky.length} | LỖI: ${errors.length} | QUÁ CAO (cảnh báo): ${tall.length}`);
  if (risky.length || errors.length) {
    console.log("THẤT BẠI — xem các dòng NGUY CƠ CẮT/LỖI ở trên.");
    process.exit(1);
  }
  console.log("ĐẠT.");
}

main().catch((err) => {
  console.error("Không chạy được script:", err);
  process.exit(1);
});
