import Image from "next/image";
import Reveal from "./Reveal";

type IntroImage = { src: string; alt: string; fit?: "cover" | "contain" };

function paragraphClass(i: number) {
  return i === 0
    ? "text-justify-vn text-[17px] leading-relaxed font-medium text-ink"
    : "text-justify-vn text-[15.5px] leading-relaxed text-body-text";
}

export default function ServiceIntro({
  paragraphs,
  image,
}: {
  paragraphs: string[];
  image?: IntroImage;
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

  const [first, ...rest] = paragraphs;
  const isContain = image.fit === "contain";

  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div
              className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card ${
                isContain ? "bg-bg-tint" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={isContain ? "object-contain" : "object-cover"}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={paragraphClass(0)}>{first}</p>
          </Reveal>
        </div>
        {rest.length > 0 && (
          <Reveal delay={0.15} className="mx-auto mt-5 max-w-[820px] space-y-5">
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
