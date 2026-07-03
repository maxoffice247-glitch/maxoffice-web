"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import BookingForm, { type BookingFormProps } from "./BookingForm";
import { PhoneIcon, MapPinIcon } from "./icons";
import { LOCATIONS_LIST } from "@/lib/locationsData";

export default function BookingFormLayout(props: BookingFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const update = () => setFormHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sidebarStyle = formHeight
    ? ({ "--form-h": `${formHeight}px` } as CSSProperties)
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.35fr] lg:items-start">
      {/* Sidebar is pinned to the form's measured height at lg+ (via --form-h);
          internally it's a flex column so the call-block keeps its natural size
          and the location list absorbs + scrolls whatever space remains. */}
      <div
        className="flex flex-col gap-5 lg:h-[var(--form-h)]"
        style={sidebarStyle}
      >
        <div className="shrink-0 rounded-2xl border-2 border-primary/25 bg-primary-tint p-6">
          <p className="mb-4 text-[14.5px] leading-relaxed font-bold text-navy">
            Cần tư vấn ngay? Gọi hotline, chúng tôi phản hồi ngay lập tức
          </p>
          <a
            href="tel:0898082188"
            className="flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(21,101,192,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_16px_32px_rgba(21,101,192,0.4)]"
          >
            <PhoneIcon />
            Gọi tư vấn ngay 089 8082 188
          </a>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 rounded-2xl border border-line bg-white p-5 lg:overflow-y-auto">
          <h3 className="mb-3.5 px-1 text-[12px] font-bold tracking-[0.1em] text-body-text uppercase">
            12 địa điểm MAX OFFICE
          </h3>
          <ul className="space-y-1">
            {LOCATIONS_LIST.map((loc) => (
              <li key={loc.slug}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className="group flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors duration-200 hover:bg-bg-tint"
                >
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[13.5px] font-bold text-navy transition-colors duration-200 group-hover:text-primary">
                        {loc.name}
                      </span>
                      {loc.tag && (
                        <span className="rounded-full bg-accent/10 px-1.5 py-[2px] text-[9.5px] font-bold whitespace-nowrap text-accent">
                          {loc.tag}
                        </span>
                      )}
                    </span>
                    <span className="block text-[12px] text-body-text">
                      {loc.shortAddress}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={formRef}>
        <BookingForm {...props} />
      </div>
    </div>
  );
}
