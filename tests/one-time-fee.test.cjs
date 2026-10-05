// Chạy: npm test — phụ phí thu một lần của gói Văn phòng ảo (addOn, hiện "Bảng hiệu công ty" gói LITE).
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const plans = require(SRC + "lib/planFinder.ts");
const vo = require(SRC + "lib/virtualOfficePlans.ts");
const quote = require(SRC + "lib/compositeQuote.ts");
const dict = require(SRC + "lib/quoteImageDictionary.ts");

const vpa = (locationSlug, planKey, months, extra = {}) =>
  quote.resolveCompositeQuoteItem({ type: "van-phong-ao", locationSlug, planKey, months, ...extra }, "vi");

test("danh sách gói có phụ phí đọc từ dữ liệu: chỉ LITE ở 6 chi nhánh, 500.000đ", () => {
  const withFee = plans.getAllOfferedPlans().filter((p) => p.oneTimeFee);
  assert.deepEqual([...new Set(withFee.map((p) => p.planKey))], ["lite"]);
  assert.deepEqual(withFee.map((p) => p.locationSlug).sort(), ["bau-cat", "cmt8", "hoang-ke-viem", "hoang-viet", "lam-son", "song-thao"]);
  for (const p of withFee) {
    assert.equal(p.oneTimeFee.price, vo.VIRTUAL_OFFICE_PLANS[p.planKey].addOn.price);
    assert.equal(p.oneTimeFee.price, 500000);
  }
  // mọi gói còn lại KHÔNG có phụ phí
  assert.ok(plans.getAllOfferedPlans().filter((p) => !p.oneTimeFee).every((p) => p.planKey !== "lite"));
});

test("LITE 299.000đ x 12 tháng + bảng hiệu: 3.588.000 + 500.000 = 4.088.000, VAT 358.800 (10% tiền thuê) + 40.000 (8% bảng hiệu) = 398.800, thành tiền 4.486.800", () => {
  for (const loc of ["song-thao", "cmt8"]) {
    const b = vpa(loc, "lite", 12).breakdown;
    assert.equal(b.rentSubtotal, 3588000);
    assert.equal(b.surcharge.amount, 500000);
    assert.equal(b.subtotal, 4088000);
    assert.equal(b.vatAmount, 398800);
    assert.equal(b.total, 4486800);
    assert.equal(b.months, 12);
  }
});

test("bỏ tích bảng hiệu: 3.588.000 + VAT 358.800 = 3.946.800, không có surcharge", () => {
  const b = vpa("song-thao", "lite", 12, { includeSurcharge: false }).breakdown;
  assert.equal(b.surcharge, undefined);
  assert.equal(b.subtotal, 3588000);
  assert.equal(b.vatAmount, 358800);
  assert.equal(b.total, 3946800);
});

test("includeSurcharge thiếu/sai kiểu -> mặc định theo dữ liệu gói (thu phụ phí)", () => {
  for (const bad of [undefined, null, "false", "true", 0, 1, [], {}]) {
    const b = vpa("song-thao", "lite", 12, bad === undefined ? {} : { includeSurcharge: bad }).breakdown;
    assert.equal(b.total, 4486800, `giá trị ${JSON.stringify(bad)}`);
  }
});

test("phụ phí không nhân số tháng và không dính ưu đãi tặng tháng (6/12/24 tháng)", () => {
  for (const months of [6, 12, 24]) {
    const line = vpa("hoang-viet", "lite", months);
    const b = line.breakdown;
    assert.equal(b.surcharge.amount, 500000);
    assert.equal(b.rentSubtotal, 299000 * months);
    assert.equal(b.subtotal, 299000 * months + 500000);
    if (months > 6) assert.ok(b.promo, "hoang-viet có tặng tháng ở 12/24 tháng");
  }
});

test("gói không có phụ phí (START, BASE) không đổi; includeSurcharge:false bị bỏ qua, true bị từ chối", () => {
  for (const [loc, key] of [["song-thao", "start"], ["song-thao", "base"], ["yen-the", "base"]]) {
    const plan = plans.getOfferedPlan(loc, key);
    const expectedSub = plan.price * 12;
    const b = vpa(loc, key, 12).breakdown;
    assert.equal(b.surcharge, undefined);
    assert.equal(b.subtotal, expectedSub);
    assert.equal(b.total, expectedSub + Math.round(expectedSub * 0.1));
    assert.equal(vpa(loc, key, 12, { includeSurcharge: false }).breakdown.total, b.total);
    assert.ok("error" in vpa(loc, key, 12, { includeSurcharge: true }));
  }
});

test("VAT phụ phí dùng ONE_TIME_SURCHARGE_VAT_PERCENT (8%, khác tiền thuê 10%)", () => {
  assert.equal(vo.ONE_TIME_SURCHARGE_VAT_PERCENT, 8);
  assert.equal(vpa("song-thao", "lite", 12).breakdown.surcharge.vatRatePercent, vo.ONE_TIME_SURCHARGE_VAT_PERCENT);
});

test("nhãn tiếng Việt / tiếng Anh lấy từ dữ liệu gói + khung câu trong dictionary", () => {
  assert.equal(vpa("song-thao", "lite", 12).breakdown.surcharge.label, "Phí bảng hiệu công ty (thu 1 lần)");
  const en = quote.resolveCompositeQuoteItem({ type: "van-phong-ao", locationSlug: "song-thao", planKey: "lite", months: 12 }, "en");
  assert.equal(en.breakdown.surcharge.label, "Company signage fee (one-time)");
  const fee = vo.VIRTUAL_OFFICE_PLANS.lite.addOn;
  assert.equal(dict.oneTimeFeeCheckboxLabel(fee), "Có làm bảng hiệu công ty (thu 500.000đ một lần)");
  assert.equal(
    dict.oneTimeFeePlanLine(fee),
    "+ Phí bảng hiệu công ty 500.000đ (thu duy nhất 1 lần khi làm bảng hiệu ban đầu, không thu lại khi gia hạn hợp đồng các kỳ sau)"
  );
});

test("nhóm gói lite-299k mang phụ phí; nhóm gói khác thì không", () => {
  const groups = plans.getGroupedPlans();
  const lite = groups.filter((g) => g.planName === "LITE");
  assert.ok(lite.length >= 1);
  for (const g of lite) assert.equal(g.oneTimeFee.price, 500000);
  for (const g of groups.filter((g) => g.planName !== "LITE")) assert.equal(g.oneTimeFee, undefined);
});

test("VAT tính riêng từng khoản: tiền thuê x 10% + phí bảng hiệu x 8% (6/12/24 tháng, số tay)", () => {
  const cases = [
    { months: 6, rent: 1_794_000, rentVat: 179_400, sub: 2_294_000, vat: 219_400, total: 2_513_400 },
    { months: 12, rent: 3_588_000, rentVat: 358_800, sub: 4_088_000, vat: 398_800, total: 4_486_800 },
    { months: 24, rent: 7_176_000, rentVat: 717_600, sub: 7_676_000, vat: 757_600, total: 8_433_600 },
  ];
  for (const c of cases) {
    const b = vpa("song-thao", "lite", c.months).breakdown;
    assert.equal(b.rentSubtotal, c.rent);
    assert.equal(b.subtotal, c.sub);
    assert.equal(b.vatAmount, c.vat, `${c.months} tháng`);
    assert.equal(c.vat, c.rentVat + 40_000); // 8% x 500.000
    assert.equal(b.total, c.total);
    assert.equal(b.vatRatePercent, 10);
    assert.equal(b.surcharge.vatRatePercent, 8);
    // bỏ tích: chỉ VAT 10% tiền thuê, không đổi so với trước
    const off = vpa("song-thao", "lite", c.months, { includeSurcharge: false }).breakdown;
    assert.equal(off.total, c.rent + c.rentVat);
  }
});
