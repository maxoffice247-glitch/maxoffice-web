"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackEvent } from "@/lib/gtag";
import { useFirstInteraction } from "@/lib/useFirstInteraction";

const IS_PROD = process.env.NODE_ENV === "production";

/** Global click delegation so every current and future tel:/Zalo/Messenger link is tracked
 * automatically — those links live in a dozen+ components (Header, FloatingButtons,
 * MobileBottomNav, Footer, forms...) and wiring each individually would be fragile. */
function useClickTracking() {
  useEffect(() => {
    if (!IS_PROD) return;

    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest("a");
      const href = link?.getAttribute("href");
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { link_url: href });
      } else if (href.includes("zalo.me") || href.includes("facebook.com/maxoffice")) {
        trackEvent("chat_click", { link_url: href });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

/** Sends a page_view on every client-side route change — gtag's own auto pageview only
 * fires once on script load, which would undercount an App Router site's client navigations.
 * Chỉ chạy khi `shouldLoad` true (script gtag đã/sắp tải) — trước đó trackEvent() tự no-op
 * (xem lib/gtag.ts) nên gọi sớm hơn cũng không có tác dụng, không cần gate riêng ở đây, nhưng
 * vẫn nhận tham số để effect re-run đúng lúc gtag vừa sẵn sàng thay vì chỉ chờ đổi pathname. */
function usePageviewTracking(shouldLoad: boolean) {
  const pathname = usePathname();
  useEffect(() => {
    if (!IS_PROD || !shouldLoad) return;
    trackEvent("page_view", { page_path: pathname });
  }, [pathname, shouldLoad]);
}

export default function GoogleAnalytics() {
  // Trì hoãn tải GTM tới tương tác đầu tiên của người dùng — cùng lý do
  // và cùng cơ chế với DeferredTidio.tsx (xem useFirstInteraction.ts):
  // strategy="afterInteractive" cũ vẫn tải/thực thi ngay cả khi người
  // dùng chưa tương tác gì, tốn ~264ms scripting đo được trên Lighthouse
  // mobile. Đánh đổi đã xác nhận: bỏ lỡ page_view của LƯỢT TẢI TRANG ĐẦU
  // nếu khách hoàn toàn không tương tác trong phiên đó — chấp nhận được,
  // các lượt chuyển trang sau (nếu khách có tương tác) vẫn ghi nhận đúng.
  const shouldLoad = useFirstInteraction();
  useClickTracking();
  usePageviewTracking(shouldLoad);

  if (!IS_PROD || !shouldLoad) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
