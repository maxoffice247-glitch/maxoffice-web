// Chạy: npm test — Ảnh "Báo giá tất cả các gói của chi nhánh": mô hình dữ liệu khớp nguồn của ảnh từng gói.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const bq = require(SRC + "lib/branchPlansQuote.ts");
const { getAllOfferedPlans, formatVoPrice } = require(SRC + "lib/planFinder.ts");
const { LOCATIONS_DATA, resolveTimedPromotions, getPromotionsForPlanPrice } = require(SRC + "lib/locationsData.ts");

const slugs = [...new Set(getAllOfferedPlans().map((p) => p.locationSlug))];

test("mọi chi nhánh: tên/giá/địa chỉ/ưu đãi từng gói khớp 100% nguồn của ảnh từng gói", () => {
  assert.ok(slugs.length >= 30);
  for (const slug of slugs) {
    const m = bq.buildBranchQuoteModel(slug);
    const src = getAllOfferedPlans().filter((p) => p.locationSlug === slug);
    assert.ok(m, slug);
    assert.equal(m.address, LOCATIONS_DATA[slug].address, slug);
    assert.equal(m.plans.length, src.length, slug);
    const promos = resolveTimedPromotions(LOCATIONS_DATA[slug].promotions) ?? [];
    for (const qp of m.plans) {
      const p = src.find((x) => x.planKey === qp.planKey);
      assert.ok(p, `${slug}/${qp.planKey}`);
      assert.equal(qp.planName, p.planName);
      assert.equal(qp.price, p.price);
      assert.equal(qp.priceText, formatVoPrice(p.price));
      // hiện ĐỦ toàn bộ quyền lợi, đúng thứ tự dữ liệu (không cắt bớt)
      assert.deepEqual(qp.features, p.features, `${slug}/${qp.planKey}`);
      // phụ phí một lần CHỈ ở gói có addOn
      assert.equal(Boolean(qp.oneTimeFeeLine), Boolean(p.oneTimeFee), `${slug}/${qp.planKey}`);
      // ưu đãi của gói = đúng nhóm chứa tên gói, bằng getPromotionsForPlanPrice
      const expected = getPromotionsForPlanPrice(promos, p.price).slice(0, bq.PROMO_LINES_MAX);
      const group = m.promoGroups.find((g) => g.planNames.includes(p.planName));
      assert.deepEqual(group ? group.lines : [], expected, `${slug}/${qp.planKey}`);
    }
    // giá tăng dần
    for (let i = 1; i < m.plans.length; i++) assert.ok(m.plans[i].price >= m.plans[i - 1].price, slug);
  }
});

test('quyền lợi dạng "...: Không có" được nhận diện để vẽ dấu "–"', () => {
  assert.equal(bq.isNegativeFeature("Phòng họp: Không có"), true);
  assert.equal(bq.isNegativeFeature("Không có"), true);
  assert.equal(bq.isNegativeFeature("Phòng họp: Free 6 giờ/tháng"), false);
  assert.equal(bq.isNegativeFeature("Lễ tân"), false);
});

test("chi nhánh ≥499K và <499K có nhóm ưu đãi riêng; chi nhánh không tồn tại -> null", () => {
  const hv = bq.buildBranchQuoteModel("hoang-viet");
  assert.equal(hv.promoGroups.length, 2);
  assert.deepEqual(hv.promoGroups[0].planNames, ["LITE", "START"]);
  assert.deepEqual(hv.promoGroups[1].planNames, ["BASE"]);
  assert.equal(bq.buildBranchQuoteModel("khong-co"), null);
});
