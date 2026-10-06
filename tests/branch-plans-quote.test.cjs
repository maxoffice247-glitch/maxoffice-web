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
      // quyền lợi hiển thị luôn là tập con của features gốc
      for (const f of qp.highlights.items) assert.ok(p.features.includes(f), `${slug}/${qp.planKey}: ${f}`);
      assert.ok(qp.highlights.items.length <= bq.HIGHLIGHT_MAX);
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

test("quyền lợi: gói cao chứa trọn gói trước thì chỉ hiện phần thêm; không thì hiện đầu danh sách", () => {
  const prev = { planName: "A", features: ["a", "b"] };
  const up = bq.selectPlanHighlights({ features: ["a", "b", "c", "d"] }, prev);
  assert.deepEqual(up, { includesPlanName: "A", items: ["c", "d"], more: 0 });
  const other = bq.selectPlanHighlights({ features: ["x", "y"] }, prev);
  assert.deepEqual(other, { items: ["x", "y"], more: 0 });
  // không cộng dồn: quyền lợi khác biệt (không có ở mọi gói) lên trước; "Không có" bị bỏ
  const all = [["c1", "c2", "x: Không có"], ["c1", "c2", "d1", "d2"]];
  assert.deepEqual(bq.selectPlanHighlights({ features: all[0] }, undefined, all), { items: ["c1", "c2"], more: 0 });
  assert.deepEqual(bq.selectPlanHighlights({ features: all[1] }, { planName: "A", features: ["zz"] }, all), { items: ["d1", "d2", "c1", "c2"], more: 0 });
  const many = bq.selectPlanHighlights({ features: Array.from({ length: 8 }, (_, i) => "f" + i) });
  assert.equal(many.items.length, 5);
  assert.equal(many.more, 3);
});

test("chi nhánh ≥499K và <499K có nhóm ưu đãi riêng; chi nhánh không tồn tại -> null", () => {
  const hv = bq.buildBranchQuoteModel("hoang-viet");
  assert.equal(hv.promoGroups.length, 2);
  assert.deepEqual(hv.promoGroups[0].planNames, ["LITE", "START"]);
  assert.deepEqual(hv.promoGroups[1].planNames, ["BASE"]);
  assert.equal(bq.buildBranchQuoteModel("khong-co"), null);
});
