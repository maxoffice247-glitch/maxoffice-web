"use client";

import { useState } from "react";
import { LinkIcon, ShareIcon, FacebookIcon } from "./icons";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const openShare = (buildUrl: (pageUrl: string) => string) => {
    window.open(buildUrl(window.location.href), "_blank", "noopener");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, button simply won't confirm.
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-line py-5">
      <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-navy">
        <ShareIcon className="h-4 w-4" />
        Chia sẻ:
      </span>
      <button
        type="button"
        aria-label="Chia sẻ Facebook"
        onClick={() =>
          openShare((url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        }
        className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-tint text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        <FacebookIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Chia sẻ Zalo"
        onClick={() =>
          openShare(
            (url) => `https://zalo.me/share?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`
          )
        }
        className="flex h-9 items-center justify-center rounded-full bg-bg-tint px-3 font-mono text-[11px] font-extrabold text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Zalo
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="flex h-9 items-center gap-1.5 rounded-full bg-bg-tint px-3.5 text-[12.5px] font-bold text-navy transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        <LinkIcon className="h-4 w-4" />
        {copied ? "Đã sao chép!" : "Sao chép liên kết"}
      </button>
    </div>
  );
}
