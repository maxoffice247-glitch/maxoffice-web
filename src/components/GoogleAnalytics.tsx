"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackEvent } from "@/lib/gtag";

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
 * fires once on script load, which would undercount an App Router site's client navigations. */
function usePageviewTracking() {
  const pathname = usePathname();
  useEffect(() => {
    if (!IS_PROD) return;
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);
}

export default function GoogleAnalytics() {
  useClickTracking();
  usePageviewTracking();

  if (!IS_PROD) return null;

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
