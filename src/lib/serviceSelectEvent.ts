/**
 * Cross-component bridge between "pick this plan/service" buttons (scattered across
 * pricing tables, tool result cards, etc.) and whichever lead form happens to be
 * mounted on the current page. A CustomEvent is used instead of prop drilling or
 * context because the button and the form usually live under unrelated ancestors
 * in the page tree (e.g. Pricing.tsx vs. BookingFormSection at the bottom of page.tsx).
 */
export const SERVICE_SELECT_EVENT = "mo:select-service";

export function dispatchServiceSelect(service: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SERVICE_SELECT_EVENT, { detail: { service } }));
}

/**
 * Scrolls to the nearest lead form on the current page (id="lead-form" on service/
 * location pages, id="lead" on the homepage/bang-gia) and pre-selects its "Dịch vụ
 * quan tâm" dropdown. Returns the form element if one was found, otherwise null so
 * the caller can fall back to a real page navigation (e.g. to /lien-he).
 */
export function scrollToLeadForm(service?: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const form = document.querySelector<HTMLElement>("#lead-form, #lead");
  if (!form) return null;
  if (service) dispatchServiceSelect(service);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  return form;
}

/** Maps a /services/[slug] route to the exact label used in the lead form's "Dịch vụ quan tâm" dropdown. */
export const SERVICE_NAME_BY_SLUG: Record<string, string> = {
  "van-phong-ao": "Văn phòng ảo",
  "van-phong-tron-goi": "Văn phòng trọn gói",
  "cho-ngoi-linh-dong": "Chỗ ngồi linh động",
  "phong-hop": "Phòng họp theo giờ",
  "thanh-lap-doanh-nghiep": "Thành lập doanh nghiệp",
  "ke-toan-thue": "Kế toán & thuế",
};
