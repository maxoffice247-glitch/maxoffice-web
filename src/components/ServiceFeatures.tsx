import Image from "next/image";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import { CheckCircleIcon } from "./icons";

export type FeatureItem = {
  title: string;
  desc: string;
};

export default function ServiceFeatures({
  eyebrow = "Tính năng",
  title,
  description,
  image,
  imageAlt,
  items,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  items: FeatureItem[];
}) {
  return (
    <section className="bg-bg-tint py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
              {eyebrow}
            </span>
            <h2 className="mb-4 font-display text-[26px] leading-[1.2] font-extrabold text-navy sm:text-[32px]">
              {title}
            </h2>
            {description && (
              <p className="mb-7 text-[15.5px] leading-relaxed text-body-text">
                {description}
              </p>
            )}
            <RevealGroup className="space-y-3.5">
              {items.map((item) => (
                <RevealItem key={item.title}>
                  <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <span className="block text-[14.5px] font-bold text-navy">
                        {item.title}
                      </span>
                      <span className="block text-[13.5px] text-body-text">{item.desc}</span>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
