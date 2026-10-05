// Chạy: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const fees = require(SRC + "lib/setupFees.ts");
const quote = require(SRC + "lib/compositeQuote.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const { AMENDMENT_SERVICES, calculateAmendmentCombo, validateAmendmentSelection, AMENDMENT_VAT_PERCENT } = fees;
const price = (slug) => AMENDMENT_SERVICES.find((s) => s.slug === slug).price;
const ALL = AMENDMENT_SERVICES.map((s) => s.slug);

// 3 ví dụ của yêu cầu (trước VAT) + VAT + thành tiền, dùng AMENDMENT_VAT_PERCENT (hiện 8%).
const EXAMPLES = [
  { name: "đổi tên + CCCD", slugs: ["doi-ten-cong-ty", "cap-nhat-cccd"], combo: 1_000_000 },
  { name: "chuyển đổi loại hình + tăng vốn 2TV/CP + đổi SĐT", slugs: ["chuyen-doi-loai-hinh", "tang-von-2-thanh-vien", "doi-so-dien-thoai"], combo: 2_300_000 },
  { name: "3 dịch vụ cùng 700.000", slugs: ["doi-ten-cong-ty", "doi-dai-dien-phap-luat", "tang-von-1-thanh-vien"], combo: 1_700_000 },
];

test("dữ liệu giá khớp bảng trên web (13 dịch vụ, giá/thời gian)", () => {
  assert.equal(AMENDMENT_SERVICES.length, 13);
  assert.equal(price("doi-ten-cong-ty"), 700000);
  assert.equal(price("chuyen-doi-loai-hinh"), 1500000);
  assert.equal(price("cap-nhat-cccd"), 500000);
});

test("câu quy tắc combo trên web giữ nguyên từng chữ", () => {
  assert.equal(
    fees.COMBO_DISCOUNT_RULE,
    "Khi đặt từ 2 dịch vụ sửa đổi trở lên cùng lúc: dịch vụ có giá trị lớn nhất tính giá đầy đủ; các dịch vụ còn lại — giá gốc trên 500.000đ giảm còn 500.000đ, giá gốc từ 500.000đ trở xuống giảm còn 300.000đ."
  );
});

for (const ex of EXAMPLES) {
  test(`ví dụ: ${ex.name} = ${ex.combo}`, () => {
    assert.equal(calculateAmendmentCombo(ex.slugs).total, ex.combo);
    const line = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs: ex.slugs, applyCombo: true }, "vi");
    assert.ok(!("error" in line));
    const vat = Math.round((ex.combo * AMENDMENT_VAT_PERCENT) / 100);
    assert.equal(line.breakdown.subtotal, ex.combo);
    assert.equal(line.breakdown.vatRatePercent, AMENDMENT_VAT_PERCENT);
    assert.equal(line.breakdown.vatAmount, vat);
    assert.equal(line.breakdown.total, ex.combo + vat);
    assert.equal(line.bucket, "mot-lan");
  });
}

test("VAT 8% là mức chính thức (hằng số AMENDMENT_VAT_PERCENT)", () => {
  assert.equal(AMENDMENT_VAT_PERCENT, 8);
});

test("biên đúng 500.000: dịch vụ còn lại giá gốc 500.000 tính 300.000, giá gốc 500.001+ tính 500.000", () => {
  const r = calculateAmendmentCombo(["doi-ten-cong-ty", "cap-nhat-cccd"]);
  const cccd = r.items.find((i) => i.slug === "cap-nhat-cccd");
  assert.equal(cccd.finalPrice, 300000);
  const r2 = calculateAmendmentCombo(["doi-dia-chi-khac-co-so", "doi-ten-cong-ty", "doi-dai-dien-phap-luat"]);
  assert.deepEqual(r2.items.map((i) => i.finalPrice), [850000, 500000, 500000]);
});

test("chọn 1 dịch vụ: giá gốc, không giảm (cả 13 dịch vụ)", () => {
  for (const s of AMENDMENT_SERVICES) {
    const r = calculateAmendmentCombo([s.slug]);
    assert.equal(r.total, s.price);
    assert.equal(r.items[0].discounted, false);
  }
});

test("chọn 2 dịch vụ: một đủ giá, một giảm", () => {
  const r = calculateAmendmentCombo(["doi-so-dien-thoai", "chuyen-doi-loai-hinh"]);
  assert.deepEqual(r.items.map((i) => [i.slug, i.finalPrice, i.discounted]), [
    ["chuyen-doi-loai-hinh", 1500000, false],
    ["doi-so-dien-thoai", 300000, true],
  ]);
});

test("chọn cả 13 dịch vụ = 7.100.000 (1.500.000 + 10 x 500.000 + 2 x 300.000)", () => {
  const r = calculateAmendmentCombo(ALL);
  assert.equal(r.items.length, 13);
  assert.equal(r.items.filter((i) => !i.discounted).length, 1);
  assert.equal(r.total, 7_100_000);
});

test("nhiều dịch vụ cùng giá lớn nhất: chỉ một tính đủ, chọn theo thứ tự trong bảng (không phụ thuộc thứ tự chọn)", () => {
  const rev = calculateAmendmentCombo(["tang-von-1-thanh-vien", "doi-dai-dien-phap-luat", "doi-ten-cong-ty"]);
  assert.equal(rev.items[0].slug, "doi-ten-cong-ty");
  assert.equal(rev.items.filter((i) => !i.discounted).length, 1);
  const tie = calculateAmendmentCombo(["tang-von-2-thanh-vien", "doi-dai-dien-va-chu-so-huu"]);
  assert.equal(tie.items[0].slug, "doi-dai-dien-va-chu-so-huu"); // đứng trước trong bảng
  assert.equal(tie.total, 1_500_000);
});

test("kết quả không phụ thuộc thứ tự chọn", () => {
  const a = calculateAmendmentCombo(ALL).total;
  const b = calculateAmendmentCombo([...ALL].reverse()).total;
  assert.equal(a, b);
});

test("validateAmendmentSelection: từ chối rỗng, không phải mảng, id lạ, trùng, quá nhiều, không phải chuỗi", () => {
  assert.equal(validateAmendmentSelection([]).ok, false);
  assert.equal(validateAmendmentSelection(undefined).ok, false);
  assert.equal(validateAmendmentSelection("doi-ten-cong-ty").ok, false);
  assert.equal(validateAmendmentSelection(["khong-ton-tai"]).ok, false);
  assert.equal(validateAmendmentSelection(["doi-ten-cong-ty", "doi-ten-cong-ty"]).ok, false);
  assert.equal(validateAmendmentSelection([...ALL, "doi-ten-cong-ty"]).ok, false);
  assert.equal(validateAmendmentSelection([123]).ok, false);
  assert.equal(validateAmendmentSelection([null]).ok, false);
  const ok = validateAmendmentSelection(["cap-nhat-cccd", "doi-ten-cong-ty"]);
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.slugs, ["cap-nhat-cccd", "doi-ten-cong-ty"]);
});

test("resolveCompositeQuoteItem: từ chối id không tồn tại và danh sách rỗng", () => {
  for (const serviceSlugs of [[], ["khong-ton-tai"], ["doi-ten-cong-ty", "xxx"], undefined, "doi-ten-cong-ty"]) {
    const r = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs }, "vi");
    assert.ok("error" in r, JSON.stringify(serviceSlugs));
  }
});

test("giá do client tự gửi bị bỏ qua, server tự tính", () => {
  const slugs = ["doi-ten-cong-ty", "cap-nhat-cccd"];
  const honest = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs: slugs, applyCombo: true }, "vi");
  const cheat = quote.resolveCompositeQuoteItem(
    { type: "sua-doi", serviceSlugs: slugs, applyCombo: true, price: 1, total: 1, subtotal: 1, prices: { "doi-ten-cong-ty": 1 }, vatRatePercent: 0, finalPrice: 1 },
    "vi"
  );
  assert.deepEqual(cheat.breakdown, honest.breakdown);
  assert.deepEqual(cheat.amendment, honest.amendment);
  assert.equal(cheat.breakdown.total, 1_080_000);
});

test("chi tiết dòng: giá gốc/giá combo/số tiền giảm khớp và nội dung đọc từ cùng nguồn dữ liệu với bảng web", () => {
  const ex = EXAMPLES[1];
  const line = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs: ex.slugs, applyCombo: true }, "vi");
  const a = line.amendment;
  assert.equal(a.originalTotal, 1_500_000 + 1_000_000 + 500_000);
  assert.equal(a.comboTotal, 2_300_000);
  assert.equal(a.discountAmount, 700_000);
  assert.equal(a.rows.length, 3);
  for (const row of a.rows) {
    const src = AMENDMENT_SERVICES.find((s) => s.name === row.name);
    assert.ok(src, `không thấy ${row.name} trong AMENDMENT_SERVICES`);
    assert.equal(row.baseAmount, src.price);
    assert.equal(row.duration, src.duration);
  }
  assert.ok(a.comboNote && a.comboNote.includes("500.000đ") && a.comboNote.includes("300.000đ"));
  // 1 dịch vụ: không có chú thích combo
  const one = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs: ["cap-nhat-cccd"], applyCombo: true }, "vi");
  assert.equal(one.amendment.comboNote, undefined);
  assert.equal(one.amendment.discountAmount, 0);
});

test("bản tiếng Anh: đủ tên 13 dịch vụ, thời gian dịch, chú thích combo dùng đúng hằng số", () => {
  for (const s of AMENDMENT_SERVICES) {
    assert.ok(dict.AMENDMENT_SERVICE_NAMES_EN[s.slug], `thiếu bản dịch ${s.slug}`);
  }
  assert.equal(dict.translateAmendmentDuration("5-7 ngày", "en"), "5-7 days");
  assert.equal(dict.translateAmendmentDuration("3-5 ngày", "en"), "3-5 days");
  assert.equal(dict.translateAmendmentDuration("5-7 ngày", "vi"), "5-7 ngày");
  const en = quote.resolveCompositeQuoteItem({ type: "sua-doi", serviceSlugs: ALL.slice(0, 3), applyCombo: true }, "en");
  assert.equal(en.category, "Legal Amendment Services");
  assert.ok(en.amendment.comboNote.includes("500,000 VND") && en.amendment.comboNote.includes("300,000 VND"));
  assert.ok(en.amendment.rows.every((r) => /^[\x20-\x7E]+$/.test(r.name)), "tên tiếng Anh còn ký tự không phải ASCII");
});

// ====== Chế độ TẮT combo (mặc định) ======
const OFF_SLUGS = ["doi-ten-cong-ty", "doi-dai-dien-phap-luat", "cap-nhat-cccd"];
const resolve = (item, lang = "vi") => quote.resolveCompositeQuoteItem(item, lang);

test("combo TẮT: 700.000 + 700.000 + 500.000 = 1.900.000, VAT 8% = 152.000, thành tiền 2.052.000", () => {
  for (const applyCombo of [false, undefined]) {
    const line = resolve({ type: "sua-doi", serviceSlugs: OFF_SLUGS, ...(applyCombo === undefined ? {} : { applyCombo }) });
    assert.equal(line.breakdown.subtotal, 1_900_000);
    assert.equal(line.breakdown.vatAmount, 152_000);
    assert.equal(line.breakdown.total, 2_052_000);
    assert.equal(line.amendment.comboApplied, false);
    assert.equal(line.amendment.discountAmount, 0);
    assert.equal(line.amendment.comboNote, undefined);
    assert.ok(line.amendment.rows.every((r) => !r.discounted && r.finalAmount === r.baseAmount));
  }
});

test("cùng bộ dịch vụ khi BẬT combo = 700.000 + 500.000 + 300.000 = 1.500.000 trước VAT", () => {
  const line = resolve({ type: "sua-doi", serviceSlugs: OFF_SLUGS, applyCombo: true });
  assert.equal(line.breakdown.subtotal, 1_500_000);
  assert.equal(line.breakdown.total, 1_500_000 + 120_000);
  assert.equal(line.amendment.comboApplied, true);
  assert.equal(line.amendment.discountAmount, 400_000);
  assert.ok(line.amendment.comboNote);
});

test("applyCombo sai kiểu/giá trị lạ coi là false (chỉ đúng boolean true mới bật)", () => {
  for (const bad of ["true", "yes", 1, 0, null, {}, [], "false", NaN]) {
    const line = resolve({ type: "sua-doi", serviceSlugs: OFF_SLUGS, applyCombo: bad });
    assert.equal(line.breakdown.subtotal, 1_900_000, `applyCombo=${JSON.stringify(bad)}`);
    assert.equal(line.amendment.comboApplied, false);
  }
});

test("calculateAmendmentCombo(applyCombo=false): giá gốc cho 1/2/13 dịch vụ và Chọn tất cả, theo thứ tự bảng", () => {
  assert.equal(calculateAmendmentCombo(["cap-nhat-cccd"], false).total, 500_000);
  assert.equal(calculateAmendmentCombo(["doi-ten-cong-ty", "cap-nhat-cccd"], false).total, 1_200_000);
  const all = calculateAmendmentCombo(ALL, false);
  assert.equal(all.total, AMENDMENT_SERVICES.reduce((s, x) => s + x.price, 0));
  assert.equal(all.total, 10_350_000);
  assert.deepEqual(all.items.map((i) => i.slug), ALL);
  assert.ok(all.items.every((i) => !i.discounted));
  const rev = calculateAmendmentCombo([...ALL].reverse(), false);
  assert.deepEqual(rev.items.map((i) => i.slug), ALL);
  assert.equal(calculateAmendmentCombo([], false).total, 0);
});

test("calculateAmendmentCombo mặc định (công cụ Tính chi phí) vẫn BẬT combo như cũ", () => {
  assert.equal(calculateAmendmentCombo(["doi-ten-cong-ty", "cap-nhat-cccd"]).total, 1_000_000);
  assert.equal(calculateAmendmentCombo(["doi-ten-cong-ty", "cap-nhat-cccd"], true).total, 1_000_000);
});

test("combo BẬT mà chỉ chọn 1 dịch vụ: không giảm, comboApplied=false", () => {
  const line = resolve({ type: "sua-doi", serviceSlugs: ["cap-nhat-cccd"], applyCombo: true });
  assert.equal(line.breakdown.subtotal, 500_000);
  assert.equal(line.amendment.comboApplied, false);
  assert.equal(line.amendment.comboNote, undefined);
});

test("chọn tất cả: tắt 10.350.000 (+VAT 828.000), bật 7.100.000", () => {
  const off = resolve({ type: "sua-doi", serviceSlugs: ALL });
  assert.equal(off.breakdown.subtotal, 10_350_000);
  assert.equal(off.breakdown.vatAmount, 828_000);
  const on = resolve({ type: "sua-doi", serviceSlugs: ALL, applyCombo: true });
  assert.equal(on.breakdown.subtotal, 7_100_000);
});

test("tiếng Anh, combo tắt: không chú thích, không gạch giá", () => {
  const en = resolve({ type: "sua-doi", serviceSlugs: OFF_SLUGS }, "en");
  assert.equal(en.amendment.comboNote, undefined);
  assert.ok(en.amendment.rows.every((r) => !r.discounted));
});

// ====== Dạng "Bảng giá đầy đủ" ======
test("bảng giá đầy đủ: đủ 13 dịch vụ theo thứ tự bảng, giá chưa VAT + đã gồm VAT 8%, không tổng/breakdown", () => {
  const line = resolve({ type: "sua-doi-bang-gia" });
  assert.ok(!("error" in line));
  assert.equal(line.breakdown, null);
  assert.equal(line.priceList.rows.length, 13);
  assert.deepEqual(line.priceList.rows.map((r) => r.name), AMENDMENT_SERVICES.map((s) => s.name));
  for (const [i, r] of line.priceList.rows.entries()) {
    const src = AMENDMENT_SERVICES[i];
    assert.equal(r.priceExclVat, src.price);
    assert.equal(r.priceInclVat, src.price + Math.round((src.price * 8) / 100));
    assert.equal(r.duration, src.duration);
  }
  assert.equal(line.priceList.rows[0].priceInclVat, 756_000); // 700.000 + 8%
  assert.equal(line.priceList.rows[11].priceInclVat, 1_620_000); // 1.500.000 + 8%
  assert.equal(line.priceList.vatPercent, AMENDMENT_VAT_PERCENT);
  assert.equal(line.title, "Bảng giá dịch vụ pháp lý sửa đổi");
});

test("bảng giá đầy đủ: bỏ qua mọi dữ liệu client gửi (giá, danh sách, combo)", () => {
  const honest = resolve({ type: "sua-doi-bang-gia" });
  const cheat = resolve({ type: "sua-doi-bang-gia", serviceSlugs: ["doi-ten-cong-ty"], applyCombo: true, price: 1, prices: { "doi-ten-cong-ty": 1 }, rows: [] });
  assert.deepEqual(cheat.priceList, honest.priceList);
});

test("bảng giá đầy đủ: câu phạm vi đúng chữ trên web, bản tiếng Anh đủ cột/tên", () => {
  assert.equal(
    fees.AMENDMENT_SCOPE_NOTE,
    "Áp dụng chung cho Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần — không phân biệt loại hình."
  );
  const vi = resolve({ type: "sua-doi-bang-gia" }, "vi");
  assert.equal(vi.priceList.scopeNote, fees.AMENDMENT_SCOPE_NOTE);
  const en = resolve({ type: "sua-doi-bang-gia" }, "en");
  assert.equal(en.title, "Legal Amendment Services Price List");
  assert.equal(en.priceList.rows.length, 13);
  assert.ok(en.priceList.rows.every((r) => /^[\x20-\x7E]+$/.test(r.name) && r.duration.endsWith("days")));
  assert.equal(dict.priceListColIncl("en", 8), "Price (incl. 8% VAT)");
  assert.equal(dict.priceListColIncl("vi", 8), "Giá đã gồm VAT 8%");
  assert.ok(en.priceList.vatNote.includes("8%"));
});

test("tên file: bảng giá đầy đủ dùng BG-BANG-GIA-SUA-DOI-DDMMYY.png, ảnh thường giữ quy ước cũ", () => {
  const d = new Date(2026, 9, 5); // 05/10/2026
  assert.equal(quote.buildCompositeQuoteFilename({ companyName: "Công ty ABC" }, d, "bang-gia-sua-doi"), "BG-BANG-GIA-SUA-DOI-051026.png");
  assert.equal(quote.buildCompositeQuoteFilename({}, d, "bang-gia-sua-doi"), "BG-BANG-GIA-SUA-DOI-051026.png");
  assert.match(quote.buildCompositeQuoteFilename({ companyName: "Công ty ABC" }, d), /^BG-.+-051026\.png$/);
  assert.equal(quote.buildCompositeQuoteFilename({}, d), "BG-KHACH-LE-051026.png");
});
