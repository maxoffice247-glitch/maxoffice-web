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
