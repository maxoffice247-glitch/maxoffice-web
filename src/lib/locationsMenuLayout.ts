/**
 * Bố cục dropdown "Chi nhánh" ở header (LocationsMegaMenu): 2 dải — "Khu vực trung tâm" rồi "Khu vực ngoại ô" (field `zone` của AREAS, nguồn duy nhất) — mỗi dải là
 * một lưới COLUMN_COUNT cột bằng nhau. Các khu vực trong dải được xếp lần lượt (khu vực nhiều chi nhánh trước) rồi CẮT thành COLUMN_COUNT đoạn liên tiếp sao cho cột cao
 * nhất thấp nhất có thể (duyệt mọi cách cắt, không đo DOM) nên chiều cao các cột chênh nhau tối đa khoảng 1 thẻ chi nhánh. Khu vực quá dài có thể tiếp sang cột kế (tiêu đề lặp lại
 * kèm "tiếp", tối đa 2 mảnh); một khu vực chỉ bị tách khi lợi ích cân bằng lớn hơn SPLIT_SCORE. Hoàn toàn tính từ dữ liệu tĩnh nên server và client ra cùng kết quả (CLS 0).
 *
 * Chỉ ảnh hưởng menu header: thứ tự ở /dia-diem, footer, sitemap, trang khu vực KHÔNG đổi (dùng getGroupedLocations()/AREAS như cũ). Khu vực đã ghép đôi ở /dia-diem
 * (MERGED_AREA_PAIRS) vẫn được xếp RIÊNG LẺ theo zone của chính nó trong menu này, vì ghép đôi chỉ là cách lấp hàng của lưới /dia-diem.
 */
import { AREAS, getGroupedLocations, stripLocationNameCuSuffix, type AreaZone, type LocationListItem } from "./locationsData";
import { getCheapestPriceForLocation } from "./virtualOfficePlans";

export const MENU_COLUMN_COUNT = 4;

export const ZONE_LABELS: Record<AreaZone, string> = {
  "trung-tam": "Khu vực trung tâm",
  "ngoai-o": "Khu vực ngoại ô",
};
const ZONE_ORDER: AreaZone[] = ["trung-tam", "ngoai-o"];

// Chiều cao (px) của MegaMenuLocationItem ở bề rộng cột ~241px, đo trên menu thật (Playwright, 34/34 chi nhánh): 1 dòng tên + địa chỉ + giá = 77.6; mỗi dòng tên thêm +17.9; có nhãn
// (tag) +19; không có giá -18.5. Chỉ dùng để cân cột; lệch vài px chỉ làm cột lệch nhẹ, không ảnh hưởng nội dung.
const ITEM_H = 77.6;
const NAME_EXTRA_LINE_H = 17.9;
const TAG_H = 19;
const NO_PRICE_H = 18.5;
const ITEM_GAP = 4; // gap-1 giữa các thẻ
const HEADING_H = 22.5; // tiêu đề khu vực 11px (16.5) + mb-1.5
const AREA_GAP = 14; // gap-3.5 giữa các khu vực trong cột
const NAME_CAPACITY_EM = 12.6; // tên 13px đậm trong ~175px: ngưỡng tách đúng 34/34 tên (1 dòng vs 2 dòng) theo bảng độ rộng ký tự bên dưới

/** Độ rộng ước lượng của 1 ký tự (đơn vị em, chữ có dấu tính theo chữ cái gốc) — đủ để đoán số dòng tên chi nhánh. */
function charEm(ch: string): number {
  const b = ch.normalize("NFD")[0] ?? ch;
  if (b === " ") return 0.28;
  if ("iljI.,:;'!|()".includes(b)) return 0.27;
  if ("tfrJ1-".includes(b)) return 0.38;
  if ("mwMW".includes(b)) return 0.9;
  if (b >= "0" && b <= "9") return 0.62;
  if (b >= "A" && b <= "Z") return 0.68;
  return 0.58;
}

export type MenuAreaSegment = {
  area: { slug: string; name: string };
  /** true khi đây là phần tiếp theo của khu vực đã bắt đầu ở cột trước. */
  continued: boolean;
  locations: LocationListItem[];
};

export type MenuZoneBand = { zone: AreaZone; label: string; columns: MenuAreaSegment[][]; columnHeights: number[] };

function itemHeight(loc: LocationListItem): number {
  const name = stripLocationNameCuSuffix(loc.name);
  const emWidth = [...name].reduce((sum, ch) => sum + charEm(ch), 0);
  const nameLines = Math.max(1, Math.ceil(emWidth / NAME_CAPACITY_EM));
  return ITEM_H + (nameLines - 1) * NAME_EXTRA_LINE_H + (loc.tag ? TAG_H : 0) - (getCheapestPriceForLocation(loc.slug) !== undefined ? 0 : NO_PRICE_H) + ITEM_GAP;
}

type Token = { areaIndex: number; loc: LocationListItem; h: number; firstOfArea: boolean };

/** Chiều cao cột gồm tiêu đề lặp "tiếp" nếu cột mở đầu giữa khu vực. */
function columnHeight(tokens: Token[], prefix: number[], i: number, j: number): number {
  if (i === j) return 0;
  return prefix[j] - prefix[i] + (tokens[i].firstOfArea ? 0 : HEADING_H);
}

/**
 * Chọn chỗ cắt `cols - 1` điểm trên dãy token sao cho các cột cân nhất: duyệt MỌI cách cắt (tối đa vài trăm cho 17 thẻ/4 cột) dùng tổng tiền tố nên rất nhanh; điểm = độ lệch
 * cao-thấp + SPLIT_SCORE mỗi lần tách khu vực. Mỗi khu vực chỉ được tách tối đa thành 2 mảnh (tránh xé 1 khu vực thành 3 cột). Trả về chỉ số kết thúc (không gồm) từng cột.
 */
function bestCuts(tokens: Token[], cols: number): { bounds: number[]; score: number } {
  const n = tokens.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + tokens[i].h;
  const firstTokenOfArea: number[] = [];
  const lastTokenOfArea: number[] = [];
  tokens.forEach((t, i) => {
    if (t.firstOfArea) firstTokenOfArea[t.areaIndex] = i;
    lastTokenOfArea[t.areaIndex] = i;
  });
  const areaCount = firstTokenOfArea.length;
  let best: { bounds: number[]; score: number } = { bounds: [], score: Number.POSITIVE_INFINITY };
  const bounds = new Array<number>(cols).fill(0);
  const evaluate = () => {
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    let splits = 0;
    let start = 0;
    for (const end of bounds) {
      if (end <= start) return; // không để cột rỗng
      const cont = !tokens[start].firstOfArea;
      if (cont) splits++;
      const h = prefix[end] - prefix[start] + (cont ? HEADING_H : 0);
      if (h < min) min = h;
      if (h > max) max = h;
      start = end;
    }
    // mỗi khu vực chạm tối đa 2 cột
    for (let a = 0; a < areaCount; a++) {
      let cs = 0;
      let ce = 0;
      let st = 0;
      bounds.forEach((end, ci) => {
        if (firstTokenOfArea[a] >= st && firstTokenOfArea[a] < end) cs = ci;
        if (lastTokenOfArea[a] >= st && lastTokenOfArea[a] < end) ce = ci;
        st = end;
      });
      if (ce - cs > 1) return;
    }
    const score = max - min + splits * SPLIT_SCORE;
    if (score < best.score - 1e-9) best = { bounds: [...bounds], score };
  };
  const rec = (k: number, from: number) => {
    if (k === cols - 1) {
      bounds[k] = n;
      evaluate();
      return;
    }
    for (let e = from + 1; e <= n - (cols - 1 - k); e++) {
      bounds[k] = e;
      rec(k + 1, e);
    }
  };
  rec(0, 0);
  return best;
}

/** Mọi hoán vị của mảng (tối đa 7 khu vực/dải -> 5040 hoán vị, rẻ). */
function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [x, ...rest]));
}

type AreaGroup = ReturnType<typeof getGroupedLocations>["areaGroups"][number];

const heightCache = new Map<string, number>();
function cachedItemHeight(loc: LocationListItem): number {
  let h = heightCache.get(loc.slug);
  if (h === undefined) {
    h = itemHeight(loc);
    heightCache.set(loc.slug, h);
  }
  return h;
}

function tokensFor(groups: AreaGroup[]): Token[] {
  const tokens: Token[] = [];
  groups.forEach((g, areaIndex) => {
    g.locations.forEach((loc, i) => {
      // gap giữa các thẻ chỉ nằm GIỮA các thẻ: thẻ cuối của khu vực không cộng; nếu khu vực bị tách sang cột khác thì thẻ cuối đoạn cũng không có gap (sai lệch 4px, bỏ qua).
      const lastOfArea = i === g.locations.length - 1;
      tokens.push({ areaIndex, loc, h: cachedItemHeight(loc) - (lastOfArea ? ITEM_GAP : 0) + (i === 0 ? HEADING_H + (areaIndex > 0 ? AREA_GAP : 0) : 0), firstOfArea: i === 0 });
    });
  });
  return tokens;
}

function boundsHeights(tokens: Token[], bounds: number[]): number[] {
  const prefix = [0];
  for (const t of tokens) prefix.push(prefix[prefix.length - 1] + t.h);
  let start = 0;
  return bounds.map((end) => {
    const h = columnHeight(tokens, prefix, start, end);
    start = end;
    return h;
  });
}

function buildBand(groups: AreaGroup[], bounds: number[], tokens: Token[]): { columns: MenuAreaSegment[][]; columnHeights: number[] } {
  const columns: MenuAreaSegment[][] = [];
  let start = 0;
  for (const end of bounds) {
    const col: MenuAreaSegment[] = [];
    for (let t = start; t < end; t++) {
      const tok = tokens[t];
      const last = col[col.length - 1];
      if (last && last.area.slug === groups[tok.areaIndex].area.slug) last.locations.push(tok.loc);
      else col.push({ area: groups[tok.areaIndex].area, continued: !tok.firstOfArea, locations: [tok.loc] });
    }
    columns.push(col);
    start = end;
  }
  return { columns, columnHeights: boundsHeights(tokens, bounds) };
}

/** Điểm của 1 cách xếp (càng thấp càng tốt): độ lệch cao-thấp giữa các cột (px) + phạt mỗi cặp khu vực bị đảo so với thứ tự mặc định (khu vực lớn lên trước) + phạt mỗi lần tách khu vực. */
const INVERSION_PENALTY = 6;
/** Phạt mỗi lần 1 khu vực bị tách sang cột khác (tránh xé nhỏ 1 khu vực làm nhiều mảnh chỉ để cân thêm vài px). */
const SPLIT_SCORE = 45;

export function getLocationsMenuLayout(columnCount: number = MENU_COLUMN_COUNT): MenuZoneBand[] {
  const zoneOf = new Map(AREAS.map((a) => [a.slug, a.zone]));
  // areaGroups đã theo thứ tự ưu tiên hiện có (Quận 1, Tân Bình rồi theo AREAS), chi nhánh trong khu vực giữ nguyên thứ tự.
  const { areaGroups } = getGroupedLocations();
  return ZONE_ORDER.map((zone) => {
    // thứ tự mặc định: khu vực lớn lên trước; bằng nhau thì giữ thứ tự hiện có
    const base = areaGroups
      .map((g, order) => ({ g, order }))
      .filter(({ g }) => zoneOf.get(g.area.slug) === zone)
      .sort((a, b) => b.g.locations.length - a.g.locations.length || a.order - b.order)
      .map(({ g }) => g);
    // thử mọi hoán vị, chọn cách xếp cân nhất (ưu tiên giữ gần thứ tự mặc định, ít tách khu vực)
    let best: { perm: number[]; bounds: number[]; score: number } | null = null;
    for (const perm of permutations(base.map((_, i) => i))) {
      let inversions = 0;
      let redundant = false;
      for (let i = 0; i < perm.length && !redundant; i++) {
        for (let j = i + 1; j < perm.length; j++) {
          if (perm[i] > perm[j]) {
            // khu vực lớn (>= 2 chi nhánh) luôn giữ thứ tự "lớn lên trước"; khu vực bằng số chi nhánh coi như hoán đổi được nên chỉ xét thứ tự mặc định giữa chúng
            // (bớt hàng nghìn hoán vị trùng lặp). Chỉ khu vực 1 chi nhánh được chen vào giữa để lấp chỗ cho cân.
            const sa = base[perm[i]].locations.length;
            const sb = base[perm[j]].locations.length;
            if (sa === sb || (sa >= 2 && sb >= 2)) {
              redundant = true;
              break;
            }
            inversions++;
          }
        }
      }
      if (redundant) continue;
      const tokens = tokensFor(perm.map((i) => base[i]));
      const cuts = bestCuts(tokens, columnCount);
      if (!cuts.bounds.length) continue;
      const score = cuts.score + inversions * INVERSION_PENALTY;
      if (!best || score < best.score) best = { perm, bounds: cuts.bounds, score };
    }
    const groupsInOrder = best!.perm.map((i) => base[i]);
    const built = buildBand(groupsInOrder, best!.bounds, tokensFor(groupsInOrder));
    return { zone, label: ZONE_LABELS[zone], columns: built.columns, columnHeights: built.columnHeights };
  });
}

let cachedDefaultLayout: MenuZoneBand[] | null = null;

/** Bản mặc định (MENU_COLUMN_COUNT cột) tính MỘT lần rồi nhớ lại — menu chỉ gọi khi mở lần đầu, nên không tốn thời gian ở lần tải trang. */
export function getDefaultLocationsMenuLayout(): MenuZoneBand[] {
  return (cachedDefaultLayout ??= getLocationsMenuLayout(MENU_COLUMN_COUNT));
}
