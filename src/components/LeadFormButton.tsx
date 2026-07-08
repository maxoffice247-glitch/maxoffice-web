"use client";

import type { MouseEvent, ReactNode } from "react";
import Button from "./Button";
import { scrollToLeadForm } from "@/lib/serviceSelectEvent";

type Variant = "primary" | "outline" | "ghost" | "link";

export default function LeadFormButton({
  service,
  variant = "primary",
  className,
  children,
}: {
  /** Exact label from BookingForm's "Dịch vụ quan tâm" dropdown to pre-select, if known. */
  service?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If a lead form is already on this page, scroll to it instead of letting the
    // Link navigate — same-page "#lead-form" hrefs don't reliably scroll via
    // next/link. Otherwise let the href fall through to /lien-he as normal.
    if (scrollToLeadForm(service)) e.preventDefault();
  };

  const fallbackHref = service ? `/lien-he?service=${encodeURIComponent(service)}` : "/lien-he";

  return (
    <Button href={fallbackHref} variant={variant} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
