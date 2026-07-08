"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up from 0 to the numeric part of `value` once, the first time it scrolls
 * into view — then stays static. Non-numeric values (shouldn't happen here, but
 * kept as a safety net) render as-is with no animation.
 */
export default function StatNumber({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const target = Number(value);
  const [display, setDisplay] = useState(Number.isNaN(target) ? value : "0");

  useEffect(() => {
    if (!isInView || Number.isNaN(target)) return;
    const controls = animate(0, target, {
      duration: prefersReducedMotion ? 0 : 1.4,
      ease: [0.22, 0.9, 0.32, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {display}
      {suffix && <span className="text-lg sm:text-xl">{suffix}</span>}
    </span>
  );
}
