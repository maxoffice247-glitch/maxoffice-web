export const GA_MEASUREMENT_ID = "G-CZTYQRXN2Z";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

/** No-op outside production (dev/test traffic never reaches GA4) or before gtag.js has loaded. */
export function trackEvent(name: string, params?: EventParams) {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
