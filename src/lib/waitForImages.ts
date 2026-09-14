import { useSyncExternalStore } from "react";

/**
 * Đợi mọi <img> bên trong `container` load + decode xong trước khi chụp
 * bằng html-to-image. Trước đây luồng "Tải báo giá" (PlanDetailActions,
 * PlanGroupDetailActions) không đợi gì cả — chỉ vá bằng cách gọi toPng() 2
 * lần liên tiếp, giả định lần gọi thứ 2 ảnh đã kịp tải. Trên mạng/thiết bị
 * chậm (đặc biệt Safari iOS) 2 lần gọi đó vẫn có thể chạy xong trước khi ảnh
 * tải xong, khiến ảnh xuất ra bị thiếu ảnh mặt tiền/chi nhánh.
 *
 * - Dùng `img.decode()` khi trình duyệt hỗ trợ (decode xong nghĩa là ảnh sẵn
 *   sàng để vẽ vào canvas ngay, không chỉ "đã tải xong header").
 * - Fallback sang lắng nghe sự kiện load/error cho trình duyệt cũ hơn.
 * - Không bao giờ reject vì 1 ảnh lỗi (404, mạng đứt...) — chụp ảnh báo giá
 *   thiếu 1 tấm vẫn tốt hơn là treo vô thời hạn vì Promise.all bị reject.
 * - Có timeout an toàn (mặc định 8s) phòng trường hợp trình duyệt không bao
 *   giờ bắn sự kiện load/error/decode cho 1 ảnh nào đó.
 */
export async function waitForImages(container: HTMLElement, timeoutMs?: number): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return;

  // Không hardcode 8s cố định cho mọi trường hợp — báo giá NHÓM nhiều chi
  // nhánh có thể phải tải 7+ ảnh CÙNG LÚC trên cùng 1 đường truyền mobile
  // data, tổng thời gian tải thực tế dài hơn hẳn báo giá 1 chi nhánh (2
  // ảnh: logo + mặt tiền). Ước lượng ~3s/ảnh, giới hạn trong khoảng
  // 8-20s — đủ rộng cho nhóm đông chi nhánh mà không treo vô thời hạn.
  const effectiveTimeout = timeoutMs ?? Math.min(20000, Math.max(8000, images.length * 3000));

  const perImage = images.map((img) => waitForOneImage(img));
  const safetyTimeout = new Promise<void>((resolve) => setTimeout(resolve, effectiveTimeout));

  await Promise.race([Promise.all(perImage), safetyTimeout]);
}

function waitForOneImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    // Đã có kích thước thật -> ảnh đã tải xong; vẫn gọi decode() nếu có để
    // chắc chắn frame đã sẵn sàng vẽ (decode xong mới an toàn để rasterize).
    if (typeof img.decode === "function") {
      return img.decode().catch(() => undefined);
    }
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onDone = () => {
      img.removeEventListener("load", onDone);
      img.removeEventListener("error", onDone);
      if (typeof img.decode === "function") {
        img.decode().then(resolve, () => resolve());
      } else {
        resolve();
      }
    };
    img.addEventListener("load", onDone, { once: true });
    img.addEventListener("error", onDone, { once: true });
  });
}

/**
 * NGUYÊN NHÂN THẬT của lỗi "mất ảnh mặt tiền khi xuất báo giá trên mobile"
 * (điều tra lại toàn bộ, xác nhận qua đọc thẳng source html-to-image@1.11.13,
 * node_modules/html-to-image/es/{embed-images,dataurl}.js):
 *
 * `waitForImages()` ở trên chỉ đảm bảo <img> trên TRANG đã tải+decode xong —
 * nhưng html-to-image, trước khi rasterize, tự làm MỘT bước embed RIÊNG:
 * nó gọi `fetch(url)` của chính nó (embedImageNode -> resourceToDataURL ->
 * fetchAsDataURL) để tải lại ảnh và nhúng base64 vào SVG. Fetch này ĐỘC LẬP
 * hoàn toàn với <img> đã tải xong trên trang, KHÔNG có timeout/retry, và
 * quan trọng nhất: nếu fetch đó lỗi (rớt mạng/timeout — rất dễ xảy ra trên
 * mobile data, nhất là báo giá nhóm có 7+ ảnh phải fetch cùng lúc), code
 * của html-to-image (dataurl.js) NUỐT lỗi, thay ảnh bằng placeholder RỖNG
 * (options.imagePlaceholder ?? ""), rồi CACHE VĨNH VIỄN kết quả rỗng đó
 * trong 1 object cache ở module-scope, với cache key đã STRIP phần query
 * string phía sau dấu "?" của URL (xem hàm getCacheKey trong dataurl.js) —
 * nghĩa là `cacheBust: true` (đang dùng ở
 * toBlob() trong PlanDetailActions/PlanGroupDetailActions) KHÔNG giúp ích
 * gì, vì key cache bỏ qua timestamp cacheBust. Kết quả: chỉ cần 1 lần fetch
 * lỗi, MỌI lần bấm "Tải báo giá" tiếp theo trong cùng phiên trang đều tái
 * dùng placeholder rỗng đó — ảnh mặt tiền biến mất, và biến mất "vĩnh viễn"
 * cho tới khi người dùng tải lại trang, đúng như triệu chứng người dùng mô
 * tả (không phải lỗi ngẫu nhiên 1 lần).
 *
 * ĐÃ LOẠI TRỪ 3 giả thuyết còn lại khi điều tra lại:
 * - crossOrigin/CORS: ảnh cùng origin (/images/quote/*.jpg, /images/logo-
 *   red.png, phục vụ từ chính domain), không có request nào là cross-origin
 *   nên không liên quan CORS.
 * - loading="lazy": cả PlanQuoteCard lẫn PlanGroupQuoteCard đều KHÔNG set
 *   thuộc tính `loading` trên bất kỳ <img> nào -> mặc định không lazy.
 * - Ảnh gốc quá nặng: đã xác nhận `public/images/quote/dia-diem-*.jpg` tồn
 *   tại đủ cho cả 27/27 chi nhánh, mỗi ảnh ~45–95KB (đã resize/nén riêng
 *   cho luồng xuất báo giá từ trước) — không phải ảnh gốc full-res nặng
 *   hàng trăm KB–600KB, và không có chi nhánh nào thiếu file.
 *
 * FIX: sau khi `waitForImages()` xác nhận <img> đã decode xong trong bộ nhớ
 * trình duyệt, vẽ THẲNG frame đó qua <canvas> rồi gán lại `img.src` thành
 * data: URL — html-to-image thấy `isDataUrl(src)` = true sẽ BỎ QUA hoàn
 * toàn bước fetch nội bộ (xem embedImageNode: `!(isImageElement &&
 * !isDataUrl(clonedNode.src))` return sớm), loại bỏ hẳn nguy cơ fetch lỗi
 * trên mobile — không cần gọi mạng thêm lần nào nữa để nhúng ảnh.
 */
export async function inlineImagesAsDataUrls(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map(async (img) => {
      // Đã là data: URL (vd. gọi lại lần 2 trong cùng phiên) -> bỏ qua.
      if (img.src.startsWith("data:")) return;
      // Ảnh lỗi/chưa có kích thước thật -> không có gì để vẽ, giữ nguyên
      // src gốc và để html-to-image tự xử lý theo đường fallback cũ (ảnh đó
      // vốn đã lỗi từ trước, không phải lỗi do bước inline này).
      if (!img.naturalWidth || !img.naturalHeight) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        // PNG (không phải JPEG) để giữ đúng kênh alpha của logo trong suốt
        // (logo-red.png) — ảnh mặt tiền là JPEG gốc, không có alpha nên
        // xuất PNG không ảnh hưởng gì tới hiển thị, chỉ tốn thêm vài chục KB
        // dữ liệu tạm dùng để nhúng (không phải kích thước file PNG cuối
        // cùng tải về, vốn do toBlob() ở bước sau quyết định).
        img.src = canvas.toDataURL("image/png");
      } catch {
        // Canvas bị "tainted" (chỉ xảy ra với ảnh cross-origin không có CORS
        // header — không phải trường hợp của các ảnh cùng origin ở đây) hoặc
        // lỗi khác -> giữ nguyên src gốc, để html-to-image tự fetch như cũ
        // (best-effort, không throw để không chặn cả card xuất ảnh).
      }
    })
  );
}

/**
 * Mọi <img> trong `container` đã nhúng thành công (`src` là `data:` URL)
 * chưa — dùng SAU khi gọi `inlineImagesAsDataUrls()` để phát hiện ảnh nào
 * đó vẫn còn thiếu (mạng quá chậm, vượt cả timeout đã tăng ở
 * `waitForImages()`), thay vì lặng lẽ chụp ra 1 ảnh báo giá "trông có vẻ
 * xong" nhưng thật ra thiếu ảnh mặt tiền — đúng triệu chứng người dùng đã
 * gặp phải trước khi có `captureQuotePng()` bên dưới.
 */
export function allImagesEmbedded(container: HTMLElement): boolean {
  const images = Array.from(container.querySelectorAll("img"));
  return images.every((img) => img.src.startsWith("data:"));
}

/**
 * Rasterize `node` (báo giá 1 chi nhánh hoặc báo giá nhóm) thành 1 PNG
 * Blob, đảm bảo mọi ảnh đã nhúng xong TRƯỚC khi chụp — dùng chung cho cả
 * PlanDetailActions lẫn PlanGroupDetailActions thay vì mỗi nơi tự lặp lại
 * chuỗi waitForImages -> inlineImagesAsDataUrls -> toBlob.
 *
 * Thử tối đa 2 lượt `waitForImages()` + `inlineImagesAsDataUrls()`: lượt 1
 * dùng timeout mặc định (tự co giãn theo số ảnh, xem `waitForImages()`),
 * lượt 2 (chỉ chạy nếu lượt 1 vẫn còn ảnh thiếu) đợi thêm hẳn 20s nữa cho
 * mạng cực chậm. Nếu SAU CẢ 2 lượt vẫn còn ảnh chưa nhúng được, NÉM LỖI
 * thay vì tiếp tục chụp — để nơi gọi hiện đúng thông báo "Không tạo được
 * ảnh báo giá, vui lòng thử lại" thay vì đưa cho người dùng 1 file trông
 * như hoàn chỉnh nhưng thật ra thiếu ảnh mặt tiền.
 */
export async function captureQuotePng(node: HTMLElement): Promise<Blob> {
  await waitForImages(node);
  await inlineImagesAsDataUrls(node);
  if (!allImagesEmbedded(node)) {
    await waitForImages(node, 20000);
    await inlineImagesAsDataUrls(node);
  }
  if (!allImagesEmbedded(node)) {
    throw new Error("Một hoặc nhiều ảnh chưa tải xong kịp trước khi xuất báo giá.");
  }
  const { toBlob } = await import("html-to-image");
  const blob = await toBlob(node, { pixelRatio: 1, cacheBust: true });
  if (!blob) throw new Error("toBlob returned null");
  return blob;
}

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
