"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Measures the site's fixed header at runtime (it resizes between its tall/transparent
 * and short/solid states as the page scrolls) and exposes the exact pixel height as the
 * `--header-h` CSS variable on a wrapper div, so descendants can position sticky elements
 * flush against it instead of guessing a fixed offset that drifts out of sync.
 *
 * ResizeObserver alone can miss the solid/transparent height swap (it's driven by a scroll
 * listener elsewhere, and the two effects aren't guaranteed to settle in the same frame), so
 * this also re-measures on every scroll frame — cheap, and it's exactly the moment the value
 * needs to be right.
 */
export default function HeaderOffsetProvider({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(90);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const measure = () => {
      const h = header.getBoundingClientRect().height;
      setHeaderHeight((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(header);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const style = { "--header-h": `${headerHeight}px` } as CSSProperties;

  return <div style={style}>{children}</div>;
}
