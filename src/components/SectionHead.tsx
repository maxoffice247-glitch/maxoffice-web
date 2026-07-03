import Reveal from "./Reveal";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHead({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadProps) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`mb-12 max-w-[640px] sm:mb-14 ${isCenter ? "mx-auto text-center" : "text-left"}`}
    >
      <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
        {eyebrow}
      </span>
      <h2 className="mb-3.5 font-display text-[28px] leading-[1.2] font-extrabold text-navy sm:text-[34px] lg:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="text-[16.5px] text-body-text">{description}</p>
      )}
    </Reveal>
  );
}
