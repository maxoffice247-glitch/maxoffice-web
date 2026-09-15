import { useSyncExternalStore } from "react";

/**
 * TRƯỚC ĐÂY file này còn có `waitForImages()`, `inlineImagesAsDataUrls()`,
 * `allImagesEmbedded()`, `captureQuotePng()` — toàn bộ pipeline chờ +
 * nhúng ảnh + rasterize DOM off-screen bằng html-to-image ở trình duyệt,
 * dùng cho luồng "Tải báo giá" (PlanDetailActions/PlanGroupDetailActions).
 * Sau 4 lần sửa lỗi thiếu ảnh mặt tiền/logo trên iPhone (fetch nội bộ lỗi,
 * PNG phình dung lượng, thiếu width/height <img>, card đặt quá xa khung
 * nhìn) mà lỗi vẫn còn — kể cả khi đã xác nhận qua ảnh chụp màn hình THẬT
 * từ máy lỗi rằng cả logo lẫn ảnh mặt tiền đều trắng trơn ngay trong bước
 * xem trước — kết luận nguyên nhân gốc là hạn chế ĐÃ BIẾT và không vá được
 * ở tầng ứng dụng của html-to-image trên Safari/WebKit (đóng gói nội dung
 * vào 1 SVG rồi nạp SVG đó như 1 "ảnh" để rasterize — Safari từ chối vẽ
 * ảnh raster nhúng bên trong <foreignObject> trong ngữ cảnh đó).
 *
 * Toàn bộ luồng tạo ảnh báo giá đã chuyển sang RENDER SẴN Ở SERVER (xem
 * src/app/api/quote-image/[slug]/[plan]/route.tsx và
 * src/app/api/quote-image/goi/[groupKey]/route.tsx, dùng next/og) — trình
 * duyệt khách chỉ `fetch()` về 1 blob PNG có sẵn, không cần tự chụp DOM
 * nữa, nên toàn bộ pipeline chờ/nhúng ảnh ở trên không còn cần thiết và đã
 * bị xoá. File này giờ chỉ còn phần chia sẻ file qua Web Share API, vẫn
 * dùng chung cho cả 2 luồng "Tải báo giá"/"Tải báo giá tổng hợp".
 */

/**
 * Chia sẻ thẳng ảnh báo giá qua Web Share API (mở sheet chia sẻ gốc của hệ
 * điều hành — có sẵn Zalo/Messenger/Facebook/Tin nhắn nếu máy đã cài đặt
 * app tương ứng) thay vì bắt người dùng tải file PNG về rồi tự mở lại từ
 * Ảnh/Tệp để đính kèm thủ công. CHỈ khả dụng khi trình duyệt hỗ trợ chia
 * sẻ FILE qua `navigator.canShare({ files })` — trên thực tế gần như chỉ
 * có ở trình duyệt di động (Safari iOS 15+, Chrome/Safari Android), hầu
 * hết trình duyệt desktop KHÔNG hỗ trợ chia sẻ file (dù có thể có
 * `navigator.share` cho text/URL) — nơi gọi cần tự kiểm tra hỗ trợ trước
 * (xem `canShareFiles()`) và rơi về tải file như cũ nếu không hỗ trợ.
 *
 * Trả về `true` nếu đã mở được sheet chia sẻ (kể cả khi người dùng tự bấm
 * Huỷ trong sheet đó — `AbortError`, vẫn tính là đã xử lý xong, KHÔNG phải
 * lỗi cần báo). Trả về `false` cho mọi lỗi khác để nơi gọi tự rơi về luồng
 * tải file cũ (best-effort, không throw để không chặn hẳn cả tính năng).
 */
export async function shareQuotePng(blob: Blob, filename: string, title: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    const file = new File([blob], filename, { type: "image/png" });
    const shareData = { files: [file], title };
    if (!navigator.canShare?.(shareData)) return false;
    await navigator.share(shareData);
    return true;
  } catch (err) {
    return err instanceof Error && err.name === "AbortError";
  }
}

/**
 * Trình duyệt hiện tại có hỗ trợ chia sẻ FILE qua Web Share API không —
 * dùng `File` rỗng chỉ để hỏi `navigator.canShare()`, không tạo request
 * mạng nào.
 */
function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) return false;
  try {
    const probe = new File([""], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/** `canShareFiles()` không đổi trong suốt vòng đời trang nên "subscribe"
 * là no-op — không có sự kiện nào để lắng nghe. */
function subscribeNever() {
  return () => {};
}

function getServerCanShareFiles(): boolean {
  // SSR không có `navigator` -> luôn false, khớp với lần render đầu phía
  // client trước khi hydrate xong (không lệch hydration).
  return false;
}

/**
 * Hook: trình duyệt hiện tại có hỗ trợ chia sẻ file qua Web Share API
 * không (`navigator.canShare({ files })`) — trên thực tế gần như chỉ có ở
 * trình duyệt di động (Safari iOS 15+, Chrome/Safari Android). Dùng
 * `useSyncExternalStore` thay vì `useEffect` + `setState` (giá trị không
 * đổi sau khi trang tải xong nên không cần effect đồng bộ liên tục) — vừa
 * tránh cascading render (rule `react-hooks/set-state-in-effect`), vừa
 * đọc đúng giá trị thật ngay khi cần mà không phải đợi thêm 1 lượt effect.
 */
export function useCanShareFiles(): boolean {
  return useSyncExternalStore(subscribeNever, canShareFiles, getServerCanShareFiles);
}
