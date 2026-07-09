"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export type FacadeImage = {
  src: string;
  alt: string;
  /** Real aspect ratio of the source photo ("W / H") so the box hugs it exactly with zero letterboxing. */
  aspectRatio: string;
  /** "cover" crops to a fixed box instead of hugging the real ratio — only for a facade that needs a height cap. */
  fit?: "contain" | "cover";
  objectPosition?: string;
  /** Caps the box width for an unusually tall/narrow photo, so its rendered height doesn't dwarf the intro text beside it. */
  maxWidth?: string;
};

export default function LocationFacade({
  name,
  image,
  imageSide = "right",
  paragraphs,
  onImageClick,
}: {
  name: string;
  image: FacadeImage;
  imageSide?: "left" | "right";
  paragraphs: string[];
  onImageClick?: () => void;
}) {
  const isContain = image.fit !== "cover";
  const imageOrderClass = imageSide === "left" ? "order-1" : "order-1 lg:order-2";
  const textOrderClass = imageSide === "left" ? "order-2" : "order-2 lg:order-1";

  return (
    <section className="pt-9 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className={imageOrderClass}>
            <button
              type="button"
              onClick={onImageClick}
              aria-label={`Xem lớn ảnh mặt tiền văn phòng ${name}`}
              className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card ${
                isContain ? "bg-bg-tint" : ""
              } ${image.maxWidth ? "mx-auto lg:mx-0" : ""}`}
              style={{ aspectRatio: image.aspectRatio, maxWidth: image.maxWidth }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={isContain ? "object-contain" : "object-cover"}
                style={isContain ? undefined : { objectPosition: image.objectPosition ?? "center" }}
              />
            </button>
          </Reveal>
          <Reveal delay={0.1} className={`space-y-5 ${textOrderClass}`}>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-justify-vn text-[17px] leading-relaxed font-medium text-ink"
                    : "text-justify-vn text-[15.5px] leading-relaxed text-body-text"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
