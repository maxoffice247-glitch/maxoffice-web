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
export async function waitForImages(container: HTMLElement, timeoutMs = 8000): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return;

  const perImage = images.map((img) => waitForOneImage(img));
  const safetyTimeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));

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
