import Image from "next/image";
import Reveal from "./Reveal";

type InteriorImage = { src: string; alt: string; caption?: string; objectPosition?: string };

function galleryClass(count: number) {
  if (count <= 1) return "grid grid-cols-1";
  if (count === 2) return "grid grid-cols-2";
  if (count === 3) {
    return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0";
  }
  return "flex overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0";
}

function itemClass(count: number) {
  if (count === 1) return "mx-auto w-full max-w-[420px]";
  if (count >= 3) return "w-[68%] shrink-0 sm:w-auto";
  return "";
}

export default function LocationIntro({
  name,
  image,
  facadeObjectPosition,
  interiorImages,
  paragraphs,
}: {
  name: string;
  image: string;
  facadeObjectPosition?: string;
  interiorImages?: InteriorImage[];
  paragraphs: string[];
}) {
  const galleryImages: InteriorImage[] = [
    {
      src: image,
      alt: `Mặt tiền văn phòng ${name}`,
      caption: `Mặt tiền toà nhà ${name}`,
      objectPosition: facadeObjectPosition,
    },
    ...(interiorImages ?? []),
  ];
  const count = galleryImages.length;

  return (
    <section className="pt-9 pb-3">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[820px] space-y-5">
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

        <Reveal delay={0.1} className={`mt-8 gap-3 sm:gap-4 ${galleryClass(count)}`}>
          {galleryImages.map((img) => {
            // A lone facade photo (no interior gallery yet) is a tall building
            // shot — force it into a landscape/square cell with object-cover
            // and the top of the building gets cropped off. Use a portrait
            // cell with object-contain instead so the whole building shows.
            const isSoloFacade = count === 1;
            return (
              <div key={img.src} className={itemClass(count)}>
                <div
                  className={`relative overflow-hidden rounded-2xl shadow-card ${
                    isSoloFacade ? "aspect-[3/4] bg-bg-tint" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      count === 1
                        ? "(max-width: 1024px) 90vw, 420px"
                        : "(max-width: 640px) 68vw, 25vw"
                    }
                    className={isSoloFacade ? "object-contain" : "object-cover"}
                    style={
                      isSoloFacade
                        ? undefined
                        : { objectPosition: img.objectPosition ?? "center" }
                    }
                  />
                </div>
                {img.caption && (
                  <p className="mt-1.5 text-center text-[11px] leading-snug text-body-text">
                    {img.caption}
                  </p>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
