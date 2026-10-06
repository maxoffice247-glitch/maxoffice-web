// Chạy: npm test — Bố cục menu "Chi nhánh" ở header: 2 dải trung tâm/ngoại ô, cột cân bằng, không mất/trùng liên kết.
const test = require("node:test");
const assert = require("node:assert/strict");
const { SRC } = require("./ts-register.cjs");

const L = require(SRC + "lib/locationsData.ts");
const M = require(SRC + "lib/locationsMenuLayout.ts");

const bands = M.getLocationsMenuLayout();

test("mọi khu vực khai báo zone hợp lệ; trung tâm = Quận 1, 3, 4, 5, 10, Phú Nhuận, Bình Thạnh", () => {
  for (const a of L.AREAS) assert.ok(["trung-tam", "ngoai-o"].includes(a.zone), a.slug);
  const central = L.AREAS.filter((a) => a.zone === "trung-tam").map((a) => a.slug).sort();
  assert.deepEqual(central, ["binh-thanh-cu", "phu-nhuan-cu", "quan-1-cu", "quan-10-cu", "quan-3-cu", "quan-4-cu", "quan-5-cu"]);
});

test("2 dải theo thứ tự trung tâm -> ngoại ô, mỗi dải đủ số cột và không có cột rỗng", () => {
  assert.deepEqual(bands.map((b) => b.zone), ["trung-tam", "ngoai-o"]);
  assert.deepEqual(bands.map((b) => b.label), ["Khu vực trung tâm", "Khu vực ngoại ô"]);
  for (const b of bands) {
    assert.equal(b.columns.length, M.MENU_COLUMN_COUNT);
    for (const col of b.columns) assert.ok(col.length > 0 && col.every((seg) => seg.locations.length > 0));
  }
});

test("mọi chi nhánh đang hiển thị xuất hiện ĐÚNG 1 lần, đúng dải theo khu vực của nó", () => {
  const zoneOf = new Map(L.AREAS.map((a) => [a.slug, a.zone]));
  const expected = L.getGroupedLocations().areaGroups.flatMap((g) => g.locations.map((l) => ({ slug: l.slug, zone: zoneOf.get(g.area.slug) })));
  const seen = new Map();
  for (const b of bands) for (const col of b.columns) for (const seg of col) for (const loc of seg.locations) {
    assert.ok(!seen.has(loc.slug), `trùng: ${loc.slug}`);
    seen.set(loc.slug, b.zone);
  }
  assert.equal(seen.size, expected.length);
  assert.equal(seen.size, L.ACTIVE_BRANCH_COUNT);
  for (const e of expected) assert.equal(seen.get(e.slug), e.zone, e.slug);
});

test("chi nhánh trong từng khu vực giữ nguyên thứ tự hiện có; khu vực tách tối đa 2 mảnh liền nhau", () => {
  const order = new Map(L.getGroupedLocations().areaGroups.map((g) => [g.area.slug, g.locations.map((l) => l.slug)]));
  for (const b of bands) {
    const pieces = new Map();
    b.columns.forEach((col, ci) => col.forEach((seg) => {
      const p = pieces.get(seg.area.slug) ?? [];
      p.push({ ci, slugs: seg.locations.map((l) => l.slug), continued: seg.continued });
      pieces.set(seg.area.slug, p);
    }));
    for (const [area, ps] of pieces) {
      assert.deepEqual(ps.flatMap((p) => p.slugs), order.get(area), area);
      assert.ok(ps.length <= 2, `${area} bị tách ${ps.length} mảnh`);
      if (ps.length === 2) assert.equal(ps[1].ci, ps[0].ci + 1, `${area}: 2 mảnh phải ở 2 cột liền nhau`);
      assert.equal(ps[0].continued, false);
      if (ps.length === 2) assert.equal(ps[1].continued, true);
    }
  }
});

test("cột cân bằng: chênh cao ước lượng trong cùng dải không quá ~1 thẻ chi nhánh (110px)", () => {
  for (const b of bands) {
    const spread = Math.max(...b.columnHeights) - Math.min(...b.columnHeights);
    assert.ok(spread <= 110, `${b.label}: lệch ${Math.round(spread)}px`);
  }
});
