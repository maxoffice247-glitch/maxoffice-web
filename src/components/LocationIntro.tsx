import Image from "next/image";
import Reveal from "./Reveal";

type InteriorImage = { src: string; alt: string; caption?: string };

export default function LocationIntro({
  name,
  image,
  interiorImages,
  paragraphs,
}: {
  name: string;
  image: string;
  interiorImages?: InteriorImage[];
  paragraphs: string[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="mx-auto w-full max-w-[380px] lg:mx-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-card">
                <Image
                  src={image}
                  alt={`Mặt tiền văn phòng ${name}`}
                  fill
                  sizes="(max-width: 1024px) 60vw, 380px"
                  className="object-cover"
                />
              </div>
              {interiorImages && interiorImages.length > 0 && (
                <div
                  className={`mt-3 grid gap-2.5 ${
                    interiorImages.length === 1 ? "grid-cols-1" : "grid-cols-3"
                  }`}
                >
                  {interiorImages.map((img) => (
                    <div key={img.src}>
                      <div
                        className={`relative overflow-hidden rounded-xl shadow-soft ${
                          interiorImages.length === 1 ? "aspect-[16/10]" : "aspect-square"
                        }`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes={
                            interiorImages.length === 1
                              ? "(max-width: 1024px) 60vw, 380px"
                              : "(max-width: 1024px) 20vw, 125px"
                          }
                          className="object-cover"
                        />
                      </div>
                      {img.caption && (
                        <p className="mt-1.5 text-[11px] leading-snug text-body-text">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
