"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClockIcon } from "./icons";

export type TimelineStep = {
  title: string;
  duration: string;
  detail: string;
  support: string;
  icon: ReactNode;
};

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

export default function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative mx-auto max-w-[820px]">
      <div
        aria-hidden
        className="absolute top-7 bottom-7 left-[27px] w-[2px] bg-line sm:left-[31px]"
      />
      <ol className="space-y-4">
        {steps.map((step, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={step.title} className="relative pl-[70px] sm:pl-[86px]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-label={`Bước ${i + 1}: ${step.title}`}
                className={`absolute top-0 left-0 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-bg shadow-soft transition-colors duration-300 ${
                  isOpen ? "bg-primary text-white" : "bg-primary-tint text-primary"
                }`}
              >
                {step.icon}
              </button>
              <div
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-300 sm:p-6 ${
                  isOpen ? "border-primary shadow-card" : "border-line hover:border-primary/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <h3 className="text-[16px] font-bold text-navy sm:text-[17px]">
                    Bước {i + 1}: {step.title}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-[12px] font-bold whitespace-nowrap text-primary">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {step.duration}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3.5 text-[14px] leading-relaxed text-body-text">
                        {step.detail}
                      </p>
                      <p className="mt-3 rounded-xl bg-bg-tint p-3.5 text-[13px] leading-relaxed text-navy">
                        <strong>MAX OFFICE hỗ trợ:</strong> {step.support}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
