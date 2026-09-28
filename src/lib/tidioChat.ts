"use client";

import { useEffect, useState } from "react";

/**
 * Điều khiển Tidio bằng nút "Chat trực tuyến" riêng của MAX (ChatButton
 * trong FloatingButtons.tsx) thay vì bong bóng launcher mặc định — để cột
 * nút nổi đồng nhất kiểu dáng, và bong bóng chào tự động ("Chat trực
 * tuyến 👋") của Tidio không còn tự bật.
 *
 * ĐÃ KIỂM CHỨNG THỰC TẾ (không đoán, xem chú thích API tại
 * developers.tidio.com/docs/widget-other-methods) bằng cách chặn
 * Element.prototype.attachShadow để dò đúng thời điểm nội dung launcher
 * (bên trong shadow DOM của #tidio-chat) xuất hiện, so với sự kiện
 * 'ready':
 *   - Shadow root được gắn ~5,2s sau khi Tidio bắt đầu tải, nhưng lúc đó
 *     RỖNG (chỉ có 1 <div id="body"> trống) — CHƯA có launcher nào để lộ.
 *   - Nút launcher thật (<div id="button">) chỉ được thêm vào ~14-41ms
 *     SAU sự kiện 'ready'.
 *   => Gọi hide() ngay trong handler 'ready' (script
 *      "tidio-mobile-position-fix" trong DeferredTidio.tsx) là ĐỦ SỚM,
 *      không có khung hình nào launcher kịp vẽ ra màn hình trước đó —
 *      xác nhận bằng chụp màn hình liên tục nhiều giây sau ready, không
 *      thấy launcher/bong bóng chào xuất hiện dù chỉ 1 khung.
 *   - hide() ẩn TOÀN BỘ widget (không chỉ launcher) — open() một mình
 *     SAU hide() không mở được khung chat; phải gọi show() rồi mới open().
 *   - Sau khi đóng khung chat (nút X hoặc sự kiện 'close'), launcher mặc
 *     định LỘ RA LẠI vì show() đã bật lại toàn bộ widget — phải tự
 *     hide() lại ngay khi 'close' bắn ra (đã test: hide() lần 2 vẫn sạch,
 *     không lóe hình vì launcher đã tồn tại sẵn trong DOM lúc này, hide()
 *     chỉ là ẩn/hiện, không phải tạo lại từ đầu).
 */

type TidioChatApi = {
  hide: () => void;
  show: () => void;
  open: () => void;
  close: () => void;
  on: (event: string, cb: () => void) => void;
};

declare global {
  interface Window {
    tidioChatApi?: TidioChatApi;
  }
}

let readyState = false;
let closeHandlerBound = false;
const readyCallbacks = new Set<() => void>();

function bindAutoRehide(api: TidioChatApi) {
  if (closeHandlerBound) return;
  closeHandlerBound = true;
  // Tự ẩn lại NGAY khi khung chat đóng — nếu không, launcher mặc định của
  // Tidio sẽ lộ ra lại (đã xác nhận bằng test) vì show() bật lại cả widget,
  // không chỉ khung chat.
  api.on("close", () => api.hide());
}

function handleReady() {
  if (readyState) return;
  readyState = true;
  const api = window.tidioChatApi;
  if (api) {
    api.hide();
    bindAutoRehide(api);
  }
  for (const cb of readyCallbacks) cb();
  readyCallbacks.clear();
}

/** Gọi 1 lần từ script "tidio-mobile-position-fix" (DeferredTidio.tsx) —
    nơi ĐÃ có sẵn cơ chế bắt sự kiện ready đáng tin cậy (thử window.tidioChatApi.on
    trước, rồi mới tới document event 'tidioChat-ready' — theo đúng 2 nhánh
    tài liệu Tidio đưa ra), tránh phải dò lại từ đầu ở đây. */
export function notifyTidioReady() {
  handleReady();
}

/** true kể từ khi Tidio đã sẵn sàng VÀ đã bị ẩn lần đầu — dùng để
    ChatButton biết lúc nào hết cần hiện spinner chờ. */
export function useTidioReady(): boolean {
  // Lazy initializer đọc đúng giá trị hiện tại ngay từ lần render đầu (nếu
  // Tidio đã ready từ trước khi component này mount) — tránh phải gọi
  // setState đồng bộ trong effect chỉ để "đồng bộ lại" 1 giá trị đã biết
  // sẵn lúc render (đúng cảnh báo của react-hooks/set-state-in-effect).
  const [ready, setReady] = useState(() => readyState);
  useEffect(() => {
    if (readyState) {
      // Trường hợp hiếm: readyState chuyển true đúng vào khoảng giữa lúc
      // lazy initializer chạy và effect này chạy — qua setTimeout(0) thay
      // vì gọi setState thẳng trong thân effect (cùng kỹ thuật đã dùng ở
      // FloatingButtons.tsx/MascotDecoration).
      const t = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(t);
    }
    const cb = () => setReady(true);
    readyCallbacks.add(cb);
    return () => {
      readyCallbacks.delete(cb);
    };
  }, []);
  return ready;
}

/** Mở khung chat Tidio — show() TRƯỚC rồi mới open() (xem ghi chú trên đầu
    file: open() một mình sau hide() không có tác dụng). Nếu Tidio chưa kịp
    sẵn sàng (VD người dùng bấm nút Chat đúng lúc mới vào trang — click này
    CHÍNH LÀ tương tác đầu tiên nên DeferredTidio.tsx vừa mới bắt đầu tải
    script), đăng ký mở tự động ngay khi ready, không làm mất thao tác bấm
    đầu tiên của khách. Trả về hàm huỷ đăng ký (dùng khi component unmount
    giữa lúc đang chờ, tránh setState trên component đã gỡ). */
export function openTidioChat(onReady?: () => void): () => void {
  const doOpen = () => {
    const api = window.tidioChatApi;
    if (!api) return;
    api.show();
    api.open();
  };
  if (readyState) {
    doOpen();
    onReady?.();
    return () => {};
  }
  let cancelled = false;
  const cb = () => {
    if (cancelled) return;
    doOpen();
    onReady?.();
  };
  readyCallbacks.add(cb);
  return () => {
    cancelled = true;
    readyCallbacks.delete(cb);
  };
}
