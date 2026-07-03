import Reveal from "./Reveal";

export default function ServiceIntro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="py-9">
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
      </div>
    </section>
  );
}
