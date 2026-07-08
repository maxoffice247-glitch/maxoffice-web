import Image from "next/image";
import Reveal from "./Reveal";

type IntroImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
  /** Overrides the default 16:10 box for images whose real proportions differ a lot (e.g. a portrait infographic), so the frame hugs the image instead of leaving letterbox gaps. */
  aspectRatio?: string;
  /** Caps the box width when using a tall custom aspect ratio, so the row doesn't grow too tall. */
  maxWidth?: string;
};

function paragraphClass(i: number) {
  return i === 0
    ? "text-justify-vn text-[17px] leading-relaxed font-medium text-ink"
    : "text-justify-vn text-[15.5px] leading-relaxed text-body-text";
}

export default function ServiceIntro({
  paragraphs,
  image,
  stackedLayout = false,
}: {
  paragraphs: string[];
  image?: IntroImage;
  /** Full-width image on top with all paragraphs flowing below, instead of the default side-by-side grid — for wide/landscape images that would otherwise leave a lopsided narrow column next to them. */
  stackedLayout?: boolean;
}) {
  if (!image) {
    return (
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal className="mx-auto max-w-[820px] space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className={paragraphClass(i)}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    );
  }

  const isContain = image.fit === "contain";
  const imageBox = (sizes: string) => (
    <div
      className={`relative w-full overflow-hidden rounded-2xl shadow-card ${
        isContain ? "bg-bg-tint" : ""
      } ${image.maxWidth ? "mx-auto lg:mx-0" : ""}`}
      style={{
        aspectRatio: image.aspectRatio ?? "16 / 10",
        maxWidth: image.maxWidth,
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className={isContain ? "object-contain" : "object-cover"}
        style={isContain ? undefined : { objectPosition: image.objectPosition ?? "center" }}
      />
    </div>
  );

  if (stackedLayout) {
    return (
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <Reveal>{imageBox("100vw")}</Reveal>
          <Reveal delay={0.1} className="mt-8 sm:columns-2 sm:gap-x-12">
            {paragraphs.map((p, i) => (
              <p key={i} className={`${paragraphClass(i)} mb-5 break-inside-avoid last:mb-0`}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    );
  }

  const [first, ...rest] = paragraphs;

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>{imageBox("(max-width: 1024px) 100vw, 50vw")}</Reveal>
          <Reveal delay={0.1}>
            <p className={paragraphClass(0)}>{first}</p>
          </Reveal>
        </div>
        {rest.length > 0 && (
          <Reveal
            delay={0.15}
            className={`mx-auto max-w-[820px] space-y-5 ${image.maxWidth ? "mt-2" : "mt-5"}`}
          >
            {rest.map((p, i) => (
              <p key={i} className={paragraphClass(i + 1)}>
                {p}
              </p>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
