/** Khoảng cách Levenshtein cổ điển (dynamic programming, O(n*m)) — tự viết
    thay vì thêm dependency vì thuật toán ngắn, chỉ dùng ở đúng 1 nơi
    (search.ts) với chuỗi ngắn (MST/số hợp đồng, tối đa vài chục ký tự). */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Chỉ giữ 2 hàng (hàng trước + hàng hiện tại) thay vì cả ma trận (m+1)x(n+1)
  // — đủ dùng vì chỉ cần kết quả cuối, không cần truy vết đường đi.
  let prevRow = Array.from({ length: n + 1 }, (_, j) => j);
  let currRow = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1, // xoá
        currRow[j - 1] + 1, // thêm
        prevRow[j - 1] + cost // thay
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }
  return prevRow[n];
}
