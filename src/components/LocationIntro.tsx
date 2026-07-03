import Image from "next/image";
import Reveal from "./Reveal";

export default function LocationIntro({
  name,
  image,
  paragraphs,
}: {
  name: string;
  image: string;
  paragraphs: string[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-2xl shadow-card lg:mx-0">
              <Image
                src={image}
                alt={`Mặt tiền văn phòng ${name}`}
                fill
                sizes="(max-width: 1024px) 60vw, 380px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5">
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
