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

/** Payload của sự kiện 'messageFromOperator' — XÁC NHẬN qua tài liệu chính
    thức developers.tidio.com/docs/widget-listeners-events (không đoán):
    bắn khi có tin nhắn từ operator (người) HOẶC bot/Lyro AI, field fromBot
    là tín hiệu DUY NHẤT tài liệu cung cấp để phân biệt 2 loại. Tài liệu
    KHÔNG xác nhận rõ tin chào tự động/proactive có luôn được gắn
    fromBot=true hay không — đây là tín hiệu tốt nhất hiện có, không phải
    xác nhận tuyệt đối (đã nêu rõ hạn chế này khi báo cáo). Tidio KHÔNG có
    API đọc số tin chưa đọc — phải tự đếm/theo dõi thủ công như dưới đây. */
type TidioMessagePayload = {
  message?: string;
  fromBot?: boolean;
};

type TidioChatApi = {
  hide: () => void;
  show: () => void;
  open: () => void;
  close: () => void;
  on: (event: string, cb: (payload?: TidioMessagePayload) => void) => void;
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

/* ---------------------------------------------------------------------- *
 * Chỉ báo "có tin nhắn mới" trên nút Chat — xem chú thích TidioMessagePayload
 * ở trên cho phần đã xác nhận/chưa xác nhận qua tài liệu Tidio.
 *
 * Trạng thái "đang mở/đóng" (panelOpenState) KHÔNG lưu sessionStorage (mỗi
 * lần tải trang mới, Tidio luôn khởi động ở trạng thái đóng) — chỉ trạng
 * thái "có tin chưa đọc" (unreadState) mới cần lưu, để khách không mất chỉ
 * báo khi bấm F5 (tải lại toàn trang, khác điều hướng client-side vốn
 * KHÔNG unmount FloatingButtons/tidioChat.ts nên tự nhiên đã giữ được biến
 * module — xem layout.tsx: FloatingButtons là sibling cố định của
 * {children}, không nằm trong phần đổi khi chuyển trang).
 * ---------------------------------------------------------------------- */

const UNREAD_STORAGE_KEY = "max-tidio-unread";

function readStoredUnread(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(UNREAD_STORAGE_KEY) === "1";
  } catch {
    // sessionStorage bị chặn (duyệt ẩn danh nghiêm ngặt, cài đặt trình
    // duyệt...) — coi như chưa có tin chưa đọc, chỉ mất tính năng "giữ chỉ
    // báo qua F5", không lỗi/crash.
    return false;
  }
}

function writeStoredUnread(value: boolean) {
  try {
    if (typeof window === "undefined") return;
    if (value) {
      window.sessionStorage.setItem(UNREAD_STORAGE_KEY, "1");
    } else {
      window.sessionStorage.removeItem(UNREAD_STORAGE_KEY);
    }
  } catch {
    // Bỏ qua — xem readStoredUnread().
  }
}

let panelOpenState = false;
let unreadState = readStoredUnread();
let messageTrackingBound = false;
const unreadCallbacks = new Set<() => void>();

// Chuỗi thông báo cho vùng aria-live — thêm/bớt 1 zero-width space
// (​, vô hình, không đọc thành tiếng) mỗi lần bắn để buộc React coi
// đây là giá trị MỚI dù nội dung hiển thị giống hệt lần trước (React bỏ
// qua setState nếu giá trị Object.is-bằng giá trị hiện tại) — cần thiết để
// trình đọc màn hình đọc lại "có tin nhắn mới" cho MỖI tin, không chỉ tin
// đầu tiên.
let announceToggle = false;
let announceText = "";
const announceCallbacks = new Set<() => void>();

function setUnread(next: boolean) {
  if (unreadState === next) return;
  unreadState = next;
  writeStoredUnread(next);
  for (const cb of unreadCallbacks) cb();
}

function triggerAnnounce() {
  announceToggle = !announceToggle;
  announceText = "Bạn có tin nhắn mới từ MAX OFFICE" + (announceToggle ? "​" : "");
  for (const cb of announceCallbacks) cb();
}

function bindMessageTracking(api: TidioChatApi) {
  if (messageTrackingBound) return;
  messageTrackingBound = true;

  api.on("open", () => {
    panelOpenState = true;
    setUnread(false);
  });

  // 'close' cũng được bindAutoRehide() lắng nghe riêng (để hide() lại
  // launcher) — Tidio cho gắn nhiều listener cùng sự kiện, cả 2 đều chạy
  // độc lập, không xung đột.
  api.on("close", () => {
    panelOpenState = false;
  });

  api.on("messageFromOperator", (payload) => {
    if (payload?.fromBot) return; // Tin bot/Lyro AI — không tính là "tin mới" cần chú ý.
    if (panelOpenState) return; // Khung đang mở — khách đã thấy ngay, không cần chỉ báo.
    setUnread(true);
    triggerAnnounce();
  });
}

function handleReady() {
  if (readyState) return;
  readyState = true;
  const api = window.tidioChatApi;
  if (api) {
    api.hide();
    bindAutoRehide(api);
    bindMessageTracking(api);
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
    // Chủ động xoá chỉ báo NGAY khi khách bấm mở, không chờ sự kiện 'open'
    // của Tidio dội lại (bindMessageTracking() cũng làm việc này, giữ lại
    // ở đây phòng trường hợp hiếm sự kiện tới trễ/không bắn kịp).
    panelOpenState = true;
    setUnread(false);
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

/** true khi có tin nhắn mới từ operator (không phải bot) tới lúc khung chat
    đang ĐÓNG, và khách chưa mở lại để xem — dùng cho chấm đỏ trên nút Chat
    (FloatingButtons.tsx). Lazy initializer đọc đúng giá trị hiện tại
    (module-level, đã được nạp từ sessionStorage lúc file này được import —
    tức TRƯỚC lần render đầu) nên không có "nháy" chấm đỏ xuất hiện muộn sau
    khi trang đã vẽ xong. */
export function useTidioUnread(): boolean {
  // QUAN TRỌNG: khởi tạo LUÔN là false ở lần render đầu (SSR) — KHÔNG được
  // đọc `unreadState` (module-level) ngay ở đây như useTidioReady() làm
  // với readyState, vì unreadState có thể đã là true từ sessionStorage một
  // khi module này được NẠP Ở PHÍA TRÌNH DUYỆT (mã module chạy trước cả
  // React hydrate) — trong khi phía server luôn là false (không có
  // sessionStorage). Nếu lazy-init đọc thẳng unreadState, 2 lần render đầu
  // (server vs. client hydrate) sẽ lệch nhau → lỗi "Hydration failed" thật
  // (đã bắt được lỗi này khi test thủ công bằng cờ sessionStorage có sẵn từ
  // lần tải trước, xem báo cáo). Giá trị thật được đồng bộ ngay sau đó
  // trong effect — chấp nhận đánh đổi: nếu có cờ chưa đọc từ lần tải
  // trước, chấm đỏ xuất hiện chậm hơn 1 nhịp (ngay sau hydrate) thay vì có
  // sẵn ngay từ HTML server, không phải tức thời tuyệt đối.
  const [unread, setUnreadLocal] = useState(false);
  useEffect(() => {
    const cb = () => setUnreadLocal(unreadState);
    unreadCallbacks.add(cb);
    // setTimeout(0) thay vì gọi setState thẳng trong thân effect — tránh
    // lỗi lint react-hooks/set-state-in-effect (cùng kỹ thuật đã dùng ở
    // useTidioReady/MascotDecoration).
    const t = window.setTimeout(cb, 0);
    return () => {
      window.clearTimeout(t);
      unreadCallbacks.delete(cb);
    };
  }, []);
  return unread;
}

/** Chuỗi cho vùng aria-live="polite" cạnh nút Chat — rỗng ban đầu (chưa có
    gì để thông báo), đổi giá trị (kèm zero-width space luân phiên, xem
    triggerAnnounce()) mỗi khi có 1 tin nhắn mới hợp lệ tới, để trình đọc
    màn hình đọc lại được cho TỪNG tin chứ không chỉ tin đầu tiên. */
export function useTidioAnnouncement(): string {
  const [text, setText] = useState(() => announceText);
  useEffect(() => {
    const cb = () => setText(announceText);
    announceCallbacks.add(cb);
    return () => {
      announceCallbacks.delete(cb);
    };
  }, []);
  return text;
}
