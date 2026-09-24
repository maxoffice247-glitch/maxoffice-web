"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneIcon, MessengerIcon, ZaloIcon } from "./icons";

/** Linh vật MAX bay lượn — nay là TRIGGER DUY NHẤT của speed-dial liên hệ
    (gọi điện/Zalo/Messenger), tham khảo hiệu ứng nổi bật ở góc dưới phải
    acb.com.vn (KHÔNG phải khung chat AI của họ, chỉ lấy cảm hứng phần
    linh vật trôi nổi liên tục, theo đúng yêu cầu người dùng). Hoạt hoạ
    là WebP động tách nền từ video linh-vat-xin-chao.mp4 (chỉ tay LÊN, khớp nhãn "Liên hệ ngay" phía trên đầu) (đã bỏ
    .animate-mascot-fly cũ vì chuyển động có sẵn trong file, tránh chồng
    2 chuyển động).

    Trước đây linh vật link thẳng tới Zalo VÀ có một nút tròn speed-dial
    riêng biệt bên dưới (2 điểm chạm tách rời, dư thừa) — nay gộp làm một:
    bấm linh vật để mở/đóng popup 3 lựa chọn, dùng chung state
    `open`/`onToggle` với popup (component cha truyền vào). Component này
    dùng CHUNG cho cả mobile lẫn desktop (breakpoint responsive ngay
    trong className truyền vào, không tách 2 instance riêng) — nếu thấy
    linh vật có vẻ chưa gộp trên 1 breakpoint nào đó, khả năng cao là do
    trang đang xem chưa load code mới (cache/deploy cũ), không phải do
    component tách logic theo breakpoint.

    Vị trí bên trái của linh vật: mobile hạ từ bottom-140px xuống
    bottom-116px (thấp hơn nhưng vẫn chừa khoảng cách an toàn phía trên
    MobileBottomNav.tsx — thanh nav cao ~61-95px tuỳ home indicator, nên
    KHÔNG hạ sâu như desktop vì mobile có thêm thanh nav này). Trên
    desktop, bottom đã hạ từ 92px xuống 44px (gần đáy màn hình hơn, không
    có thanh nav nào cản), left giữ nguyên 14px.

    Popup 3 lựa chọn (xem FloatingButtons() bên dưới) neo NGAY PHÍA TRÊN
    linh vật thay vì giữ toạ độ neo cũ của nút tròn đã xoá (trước đây
    left-22/bottom-6) — bắt buộc phải đổi neo vì linh vật giờ luôn hiển
    thị kể cả khi popup đang mở (để còn bấm lại đóng), trong khi nút tròn
    cũ nằm ở một vị trí khác và linh vật trước đây tự ẩn đi lúc mở
    (`{!open && <WavingMascotBubble />}`) để tránh đúng kiểu chồng lấn
    này; giữ nguyên toạ độ neo cũ sẽ khiến các nút Zalo/Messenger đè lên
    chính linh vật khi mở popup. */
function WavingMascotBubble({
  className,
  open,
  onToggle,
}: {
  className?: string;
  open: boolean;
  onToggle: () => void;
}) {
  // Trì hoãn tải bản WebP ĐỘNG (nay đã nén còn ~160KB, giảm ~50% từ 324KB
  // gốc nhờ giảm còn 8fps/42 khung thay vì 16fps/84 khung — vẫn đủ mượt
  // cho 1 linh vật nền nhỏ luôn hiển thị) tới SAU KHI trang đã load xong
  // (window "load"), thay vì tải ngay từ đầu trên MỌI trang — trước đây
  // <picture><source media="prefers-reduced-motion"> chỉ tránh tải file
  // động cho người bật giảm chuyển động, nhưng người dùng bình thường vẫn
  // tải file động NGAY LẬP TỨC cùng lúc với toàn bộ tài nguyên khác của
  // trang, cộng dồn vào Lighthouse total-byte-weight/TBT dù linh vật không
  // phải nội dung chính. Hiện khung TĨNH có sẵn (~14KB) ngay từ đầu (giữ
  // đúng layout, không lệch kích thước vì cùng 174x116), đổi sang bản động
  // khi trình duyệt đã rảnh sau "load" — người dùng gần như không nhận ra
  // độ trễ vì linh vật luôn ở góc màn hình, ít khi nhìn ngay khung đầu.
  // Người bật prefers-reduced-motion: không đổi, giữ khung tĩnh vĩnh viễn.
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onLoad = () => setAnimate(true);
    if (document.readyState === "complete") {
      // Trang đã "load" xong từ trước khi effect này chạy (VD hydrate
      // muộn) — sự kiện "load" sẽ không bắn lại nữa nên phải tự kích hoạt,
      // nhưng qua setTimeout(0) thay vì gọi setState thẳng trong thân
      // effect (tránh lỗi lint react-hooks/set-state-in-effect: setState
      // đồng bộ trong effect có thể gây render dây chuyền).
      const t = window.setTimeout(onLoad, 0);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className={`z-[96] ${className ?? ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? "Đóng danh sách liên hệ" : "Mở danh sách liên hệ: gọi điện, Zalo, Messenger"}
        className="block drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110"
      >
        {/* Kích thước hiển thị 87x58 giữ nguyên (file 174x116 = 2x cho màn
            hình retina) dù đang hiện khung tĩnh hay bản động — không lệch
            layout lúc đổi ảnh. Vẫn bọc trong <picture> dù chỉ 1 <img> (không
            còn <source> vì logic prefers-reduced-motion nay xử lý bằng JS ở
            effect trên) — ESLint no-img-element bỏ qua <img> con của
            <picture> (next/image không hỗ trợ WebP động), thiếu <picture>
            sẽ làm lint báo lại warning này. */}
        <picture>
          <img
            src={
              animate
                ? "/images/mascot/linh-vat-max-chi-tay-len-v3.webp"
                : "/images/mascot/linh-vat-max-chi-tay-len-v3-tinh.webp"
            }
            alt=""
            width={174}
            height={116}
            decoding="async"
            className="block h-[58px] w-[87px] object-contain"
          />
        </picture>
      </button>
    </div>
  );
}

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

// Same icon-to-button ratio for every option, so phone/Zalo/Messenger
// never look mismatched next to each other.
const OPEN_ICON_SIZE = "h-[23px] w-[23px] sm:h-[25px] sm:w-[25px]";

const CONTACT_OPTIONS = [
  {
    key: "phone" as const,
    href: "tel:0898082188",
    label: "Gọi ngay",
    ariaLabel: "Gọi ngay 089 8082 188",
    icon: PhoneIcon,
    external: false,
    bg: "bg-accent",
  },
  {
    key: "zalo" as const,
    href: "https://zalo.me/0898082188",
    label: "Zalo",
    ariaLabel: "Nhắn tin qua Zalo",
    icon: ZaloIcon,
    external: true,
    bg: "bg-[#0068FF]",
  },
  {
    key: "messenger" as const,
    href: "https://www.facebook.com/maxoffice.hcm/",
    label: "Messenger",
    ariaLabel: "Nhắn tin qua Messenger",
    icon: MessengerIcon,
    external: true,
    bg: "bg-[#0084FF]",
  },
];

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <div ref={rootRef}>
        <WavingMascotBubble
          className="fixed left-1 bottom-[116px] sm:left-[14px] sm:bottom-[44px]"
          open={open}
          onToggle={() => setOpen((v) => !v)}
        />

        {/* Nhãn tĩnh "Liên hệ ngay" trên đầu linh vật — nay hiển thị CẢ
            mobile lẫn desktop (trước đây chỉ desktop, mobile dựa vào chữ
            có sẵn trên MobileBottomNav.tsx, nhưng theo yêu cầu mới nhất
            đã thêm cho cả mobile, thu nhỏ chữ/padding để không chiếm
            nhiều diện tích màn hình hẹp). Khác với bong bóng thoại tự
            động đã tắt hẳn trước đó ("Cần hỗ trợ? Nhắn Zalo ngay!", tự
            bật/ẩn theo chu kỳ) — đây là 1 pill tĩnh, luôn hiển thị ngay
            khi trang tải xong (kể cả lúc popup đang mở), không hẹn giờ
            ẩn/hiện, đóng vai trò chú thích VÀ là vùng bấm thứ 2 — bấm nhãn cũng mở/đóng
            popup như bấm linh vật (cùng state; ::before mở rộng vùng chạm
            thêm 8px mỗi phía cho mobile). Không tìm thấy tiền lệ style cũ nào tương tự trong git
            history (chỉ có nút CTA "Liên hệ ngay" trong Hero.tsx, không
            liên quan tới linh vật) nên tự thiết kế mới, dùng bg-accent để
            đồng bộ màu thương hiệu với các nút liên hệ khác trong cụm
            này.

            Đặt PHÍA TRÊN đầu linh vật, căn giữa theo chiều ngang bằng
            left trùng tâm ngang của linh vật rồi dùng -translate-x-1/2
            để tự căn giữa theo đúng bề rộng thật của nhãn (dùng transform
            thay vì tính cứng theo bề rộng chữ, để không lệch nếu sau này
            đổi chữ/font):
            - Mobile: linh vật left-1(4px), tâm ngang ≈ 4+43=47px; đỉnh
              đầu linh vật = 116+58=174px, +10px khoảng cách = bottom-184px.
              Cỡ chữ/padding nhỏ hơn desktop (text-[10px] px-2 py-1) vì
              màn hình hẹp.
            - Desktop: linh vật left-[14px], tâm ngang=57px; đỉnh đầu
              linh vật=44+58=102px, +10px = bottom-[112px] (không đổi).

            Vì nhãn nằm ngay phía trên linh vật, cần đẩy popup 3 lựa chọn
            (bên dưới) lên cao hơn nữa để không đè lên nhãn khi mở — xem
            giải thích ở đó. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          // aria-label PHẢI chứa đúng cụm chữ hiển thị "Liên hệ ngay" (nhãn
          // luôn hiển thị nguyên văn này, không đổi theo open/close) — trước
          // đây chỉ ghi "Mở/Đóng danh sách liên hệ...", không chứa chữ hiển
          // thị, vi phạm WCAG 2.5.3 Label in Name (Lighthouse audit
          // "label-content-name-mismatch"). Cả 2 nhánh open/false đều phải
          // bắt đầu bằng "Liên hệ ngay" vì chữ hiển thị không đổi.
          aria-label={open ? "Liên hệ ngay: đóng danh sách" : "Liên hệ ngay: gọi điện, Zalo, Messenger"}
          className="fixed left-[47px] bottom-[184px] z-[96] -translate-x-1/2 cursor-pointer rounded-full bg-accent px-2 py-1 text-[10px] leading-none font-bold whitespace-nowrap text-white shadow-[0_6px_14px_rgba(0,0,0,0.22)] before:absolute before:-inset-2 before:content-[''] sm:left-[57px] sm:bottom-[112px] sm:px-3 sm:py-1.5 sm:text-[12px] sm:shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
        >
          Liên hệ ngay
        </button>

        {/* Popup 3 lựa chọn — neo ngay phía trên nhãn "Liên hệ ngay" (nhãn
            nằm trên đỉnh linh vật cả 2 breakpoint). Mobile: nhãn chiếm
            khoảng 184-~204px (đo thực tế bên dưới sau khi build), popup
            neo từ bottom-[214px] = ~204 + 10px khoảng cách. Desktop: nhãn
            chiếm 112-136px, popup neo từ 146px = 136 + 10px (không đổi). */}
        <div className="fixed left-1 bottom-[214px] z-[97] flex flex-col items-end gap-3 sm:left-[14px] sm:bottom-[146px]">
          <AnimatePresence>
            {open &&
              [...CONTACT_OPTIONS].reverse().map((opt, idx) => (
                <motion.a
                  key={opt.key}
                  href={opt.href}
                  target={opt.external ? "_blank" : undefined}
                  rel={opt.external ? "noopener" : undefined}
                  title={opt.label}
                  aria-label={opt.ariaLabel}
                  initial={{ opacity: 0, y: 16, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: EASE_PREMIUM, delay: idx * 0.06 }}
                  className={`relative flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-110 sm:h-[50px] sm:w-[50px] ${opt.bg}`}
                >
                  <opt.icon className={OPEN_ICON_SIZE} />
                </motion.a>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
