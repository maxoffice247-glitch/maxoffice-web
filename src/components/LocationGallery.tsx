"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type InteriorImage = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
  /** Real aspect ratio ("W / H") for a lone image — overrides the generic 3:4 solo box so a non-portrait photo (e.g. a square nameplate board) hugs its own shape instead of leaving letterbox gaps. */
  aspectRatio?: string;
};

function galleryClass(count: number) {
  if (count <= 1) return "grid grid-cols-1";
  if (count === 2) return "grid grid-cols-2";
  if (count === 3) {
    return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0";
  }
  if (count === 4) {
    return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0";
  }
  // 5+ images: a flat 4-col grid would strand a lone item on its own row —
  // step through mobile scroll → 2-col tablet → 3-col desktop instead.
  return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3";
}

function itemClass(count: number) {
  if (count === 1) return "mx-auto w-full max-w-[420px]";
  if (count >= 3) return "w-[68%] shrink-0 sm:w-auto";
  return "";
}

export default function LocationGallery({
  images,
  onImageClick,
}: {
  images?: InteriorImage[];
  onImageClick?: (index: number) => void;
}) {
  const count = images?.length ?? 0;
  if (!images || count === 0) return null;

  return (
    <section className="pt-3 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className={`gap-3 sm:gap-4 ${galleryClass(count)}`}>
          {images.map((img, i) => {
            // A lone interior photo (rare — e.g. a branch with only a nameplate
            // shot) is often a tall board, not a landscape snapshot — use a
            // portrait cell with object-contain so nothing gets cropped.
            const isSolo = count === 1;
            return (
              <div key={img.src} className={itemClass(count)}>
                <button
                  type="button"
                  onClick={() => onImageClick?.(i)}
                  aria-label={img.caption ?? img.alt}
                  className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card ${
                    isSolo ? "bg-bg-tint" : "aspect-[4/3]"
                  } ${isSolo && !img.aspectRatio ? "aspect-[3/4]" : ""}`}
                  style={isSolo ? { aspectRatio: img.aspectRatio } : undefined}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={isSolo ? "(max-width: 1024px) 90vw, 420px" : "(max-width: 640px) 68vw, 25vw"}
                    className={isSolo ? "object-contain" : "object-cover"}
                    style={isSolo ? undefined : { objectPosition: img.objectPosition ?? "center" }}
                  />
                </button>
                {img.caption && (
                  <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">{img.caption}</p>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
