"use client";

import { DownloadIcon } from "./icons";

export default function PrintPdfButton({ label = "Tải PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-6 py-3.5 text-[15px] font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_10px_24px_rgba(15,27,45,0.08)] print:hidden"
    >
      <DownloadIcon className="h-4 w-4" />
      {label}
    </button>
  );
}
