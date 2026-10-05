// Chạy: npm test — Kế toán & thuế: phụ phí trong báo giá + ảnh "Bảng giá đầy đủ".
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const quote = require(SRC + "lib/compositeQuote.ts");
const { SERVICES_DATA } = require(SRC + "lib/servicesData.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const pricing = SERVICES_DATA["ke-toan-thue"].pricing;
const sc = Object.fromEntries(pricing.surcharges.map((s) => [s.key, s]));
const resolve = (item, lang = "vi") => quote.resolveCompositeQuoteItem({ type: "ke-toan-thue", ...item }, lang);
const rangeIdx = (text) => pricing.tiers.findIndex((t) => t.range === text);

test("dữ liệu: 3 nhóm phụ phí, chuỗi hiển thị trên web sinh từ đơn giá số (một nguồn duy nhất)", () => {
  assert.deepEqual(pricing.surcharges.map((s) => s.key), ["hai-quan", "hoa-don-ho", "bao-cao-tai-chinh"]);
  assert.deepEqual(pricing.surcharges.map((s) => s.billing), ["each", "month", "year"]);
  for (const s of pricing.surcharges) {
    for (const r of s.rows) {
      if (r.amount === undefined) continue;
      const suffix = s.billing === "month" ? "/tháng" : s.billing === "year" ? "/năm" : "";
      assert.equal(r.value, r.amount.toLocaleString("vi-VN") + "đ" + suffix, `${s.title} / ${r.label}`);
    }
  }
  // giá đúng như hiển thị trên web
  assert.equal(sc["hoa-don-ho"].rows[1].value, "800.000đ/tháng");
  assert.equal(sc["bao-cao-tai-chinh"].rows[1].value, "1.500.000đ/năm");
  assert.equal(sc["hai-quan"].rows[2].value, "2.000.000đ");
  // dòng Nhóm A hải quan giữ nguyên chữ, KHÔNG có đơn giá số
  assert.equal(sc["hai-quan"].rows[0].value, "100 trang + 1.000.000đ");
  assert.equal(sc["hai-quan"].rows[0].amount, undefined);
});

test("không chọn phụ phí: thẻ y hệt cũ (Nhóm B, 1-30 hoá đơn = 800.000đ/tháng, VAT 10%)", () => {
  const line = resolve({ group: "B", rangeIndex: rangeIdx("1-30 hoá đơn") });
  assert.equal(line.bucket, "thang");
  assert.equal(line.amendment, undefined);
  assert.equal(line.extraLines, undefined);
  assert.deepEqual(
    { sub: line.breakdown.subtotal, vat: line.breakdown.vatAmount, total: line.breakdown.total },
    { sub: 800000, vat: 80000, total: 880000 }
  );
});

test("ví dụ tính tay: Nhóm B + 1-30 hoá đơn + Tờ khai hải quan 1-100 trang x 3 tờ", () => {
  const line = resolve({ group: "B", rangeIndex: rangeIdx("1-30 hoá đơn"), surcharges: [{ key: "hai-quan", rowIndex: 1, quantity: 3 }] });
  // thẻ hàng tháng không đổi
  assert.equal(line.bucket, "thang");
  assert.equal(line.breakdown.total, 880000);
  // thẻ một lần: 3 x 1.000.000 = 3.000.000, VAT 10% = 300.000, thành tiền 3.300.000
  const [extra] = line.extraLines;
  assert.equal(extra.bucket, "mot-lan");
  assert.deepEqual(
    { sub: extra.breakdown.subtotal, vat: extra.breakdown.vatAmount, total: extra.breakdown.total },
    { sub: 3000000, vat: 300000, total: 3300000 }
  );
  assert.equal(extra.amendment.rows.length, 1);
  assert.equal(extra.amendment.rows[0].baseAmount, 1000000);
  assert.equal(extra.amendment.rows[0].finalAmount, 3000000);
  assert.equal(extra.amendment.rows[0].duration, "3 tờ khai × 1.000.000đ");
});

test("ví dụ đủ 3 phụ phí: Nhóm B 50-70 hoá đơn + xuất hoá đơn hộ 31-60 + hải quan 100-200 trang x2 + BCTC dưới 3 tỷ", () => {
  const line = resolve({
    group: "B",
    rangeIndex: rangeIdx("50-70 hoá đơn"),
    surcharges: [
      { key: "bao-cao-tai-chinh", rowIndex: 1 },
      { key: "hai-quan", rowIndex: 2, quantity: 2 },
      { key: "hoa-don-ho", rowIndex: 1 },
    ],
  });
  // hàng tháng: phí chính 1.500.000 (Nhóm B, 50-70) + xuất hoá đơn hộ 800.000 = 2.300.000; VAT 230.000; thành tiền 2.530.000
  assert.equal(line.bucket, "thang");
  assert.deepEqual(
    { sub: line.breakdown.subtotal, vat: line.breakdown.vatAmount, total: line.breakdown.total },
    { sub: 2300000, vat: 230000, total: 2530000 }
  );
  assert.deepEqual(line.amendment.rows.map((r) => r.finalAmount), [1500000, 800000]);
  // một lần: hải quan 2 x 2.000.000 = 4.000.000 + BCTC 1.500.000 = 5.500.000; VAT 550.000; thành tiền 6.050.000 (theo thứ tự dữ liệu, không theo thứ tự gửi)
  const [extra] = line.extraLines;
  assert.deepEqual(extra.amendment.rows.map((r) => r.finalAmount), [4000000, 1500000]);
  assert.deepEqual(
    { sub: extra.breakdown.subtotal, vat: extra.breakdown.vatAmount, total: extra.breakdown.total },
    { sub: 5500000, vat: 550000, total: 6050000 }
  );
});

test("giá client gửi kèm bị bỏ qua (price/amount/unitPrice trong phụ phí và item)", () => {
  const line = resolve({
    group: "B",
    rangeIndex: 1,
    price: "1",
    amount: 1,
    surcharges: [{ key: "hai-quan", rowIndex: 1, quantity: 2, price: 1, amount: 1, unitPrice: 1, finalAmount: 1 }],
  });
  assert.equal(line.extraLines[0].breakdown.subtotal, 2000000);
});

test("từ chối: khoá/mức không tồn tại, số lượng <= 0 hoặc không nguyên, trùng, sai nhóm, dòng không có giá", () => {
  const bad = (surcharges, group = "B") => {
    const r = resolve({ group, rangeIndex: 1, surcharges });
    assert.ok("error" in r, JSON.stringify(surcharges));
  };
  bad([{ key: "khong-co", rowIndex: 0 }]);
  bad([{ key: "hai-quan", rowIndex: 9 }]);
  bad([{ key: "hai-quan", rowIndex: -1 }]);
  bad([{ key: "hai-quan", rowIndex: 1.5 }]);
  bad([{ key: "hai-quan", rowIndex: "1" }]);
  for (const q of [0, -1, 1.5, "2", null, NaN, 100, 1e9]) bad([{ key: "hai-quan", rowIndex: 1, quantity: q }]);
  bad([{ key: "hai-quan", rowIndex: 1 }, { key: "hai-quan", rowIndex: 2 }]);
  bad([{ key: "hai-quan", rowIndex: 1 }], "A"); // Nhóm B & C không áp dụng cho Nhóm A
  bad([{ key: "hai-quan", rowIndex: 0 }], "B"); // dòng Nhóm A không có đơn giá cố định
  bad([{ key: "hai-quan", rowIndex: 0 }], "A");
  bad([{ key: "hoa-don-ho", rowIndex: 0, quantity: 2 }]); // tính theo tháng: không có số lượng
  bad("không phải mảng");
  bad([null]);
  // hợp lệ: số lượng biên 1 và 99
  assert.ok(!("error" in resolve({ group: "C", rangeIndex: 1, surcharges: [{ key: "hai-quan", rowIndex: 1, quantity: 99 }] })));
  assert.ok(!("error" in resolve({ group: "C", rangeIndex: 1, surcharges: [{ key: "hai-quan", rowIndex: 1, quantity: 1 }] })));
});

test("nhóm hoặc mức không tồn tại -> lỗi", () => {
  assert.ok("error" in resolve({ group: "D", rangeIndex: 1 }));
  assert.ok("error" in resolve({ group: "A", rangeIndex: 99 }));
  assert.ok("error" in resolve({ group: "A", rangeIndex: -1 }));
});

test("bản tiếng Anh: tên phụ phí, đơn vị, thẻ tiếng Anh", () => {
  const line = resolve({ group: "C", rangeIndex: 1, surcharges: [{ key: "hai-quan", rowIndex: 2, quantity: 2 }, { key: "hoa-don-ho", rowIndex: 0 }] }, "en");
  assert.equal(line.title, "Group C — Manufacturing/Construction/Mining");
  assert.equal(line.amendment.rows[0].name, "Accounting & tax fee");
  assert.equal(line.amendment.rows[1].name, "Invoice issuance on behalf of the client — 1-30 invoices");
  assert.equal(line.amendment.rows[1].duration, "per month");
  const extra = line.extraLines[0];
  assert.equal(extra.title, "Accounting & Tax Surcharges");
  assert.equal(extra.subtitle, "1 item");
  assert.equal(extra.amendment.rows[0].name, "Customs declaration — Groups B & C: 100-200 pages");
  assert.equal(extra.amendment.rows[0].duration, "2 declarations × 2,000,000 VND");
});

test("bảng giá đầy đủ: 9 mức x 3 nhóm đúng như web, 3 nhóm phụ phí, không breakdown", () => {
  const line = quote.resolveCompositeQuoteItem({ type: "ke-toan-bang-gia", price: 1, tiers: [] }, "vi");
  assert.equal(line.breakdown, null);
  const apl = line.accountingPriceList;
  assert.equal(apl.tiers.length, 9);
  assert.deepEqual(apl.groups.map((g) => g.label), ["Nhóm A — Thương mại", "Nhóm B — TM + Dịch vụ", "Nhóm C — SX/XD/Khai thác"]);
  pricing.tiers.forEach((t, i) => {
    assert.equal(apl.tiers[i].range, t.range);
    assert.deepEqual(apl.tiers[i].prices, [t.prices.A, t.prices.B, t.prices.C]);
  });
  assert.equal(apl.surcharges.length, 3);
  assert.deepEqual(apl.surcharges.map((s) => s.rows.length), [3, 3, 3]);
  assert.equal(apl.surcharges[1].rows[2].value, "1.000.000đ/tháng");
  assert.equal(apl.vatNote, "Giá chưa bao gồm VAT 10%.");
  // tiếng Anh
  const en = quote.resolveCompositeQuoteItem({ type: "ke-toan-bang-gia" }, "en").accountingPriceList;
  assert.equal(en.tiers[1].prices[2], "1,000,000 VND");
  assert.equal(en.tiers[0].range, "No invoices");
  assert.equal(en.surcharges[0].rows[0].value, "100 pages + 1,000,000 VND");
  assert.equal(en.surcharges[1].rows[1].value, "800,000 VND/month");
  assert.equal(en.surcharges[2].rows[2].value, "2,000,000 VND/year");
  assert.equal(en.groups[2].label, "Group C — Manufacturing/Construction/Mining");
});

test("hằng số VAT phụ phí = VAT phí kế toán (10%), tên file bảng giá kế toán", () => {
  assert.equal(quote.ACCOUNTING_VAT_PERCENT, 10);
  assert.equal(quote.ACCOUNTING_SURCHARGE_VAT_PERCENT, quote.ACCOUNTING_VAT_PERCENT);
  const d = new Date(2026, 9, 5);
  assert.equal(quote.buildCompositeQuoteFilename({ name: "X" }, d, "bang-gia-ke-toan"), "BG-BANG-GIA-KE-TOAN-051026.png");
});
