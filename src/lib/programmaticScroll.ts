/**
 * Đánh dấu một lượt cuộn do CODE gây ra (không phải khách cuộn), để `useFirstInteraction` không coi sự kiện
 * `scroll` đó là "tương tác đầu tiên" — nếu không, cuộn tự động sẽ kích hoạt tải sớm Tidio + Google Analytics
 * (nặng CPU, vốn chỉ tải sau tương tác thật) và làm tăng Total Blocking Time. Chỉ ảnh hưởng sự kiện `scroll`:
 * chạm/click/gõ phím thật của khách vẫn tính như bình thường.
 */
let ignoreScrollUntil = 0;

/** Bỏ qua sự kiện scroll trong `ms` mili giây tới (đủ dài cho cả hiệu ứng cuộn mượt). */
export function markProgrammaticScroll(ms: number): void {
  ignoreScrollUntil = performance.now() + ms;
}

export function isProgrammaticScroll(): boolean {
  return performance.now() < ignoreScrollUntil;
}
