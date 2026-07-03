import Reveal from "./Reveal";
import Button from "./Button";

type CtaBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  secondaryLabel?: string;
};

export default function CtaBanner({
  eyebrow = "Liên hệ MAX OFFICE",
  title = "Sẵn sàng bắt đầu cùng MAX OFFICE?",
  description = "Nhận tư vấn miễn phí trong 15 phút — đội ngũ chuyên viên sẽ liên hệ và đề xuất giải pháp phù hợp với bạn.",
  secondaryLabel = "Đặt lịch tư vấn",
}: CtaBannerProps) {
  return (
    <section id="lead" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal
          className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[24px] bg-gradient-to-tr from-navy to-primary-dark p-8 shadow-[0_30px_70px_rgba(11,31,58,0.28)] sm:p-12 lg:p-16"
        >
          <div
            aria-hidden
            className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/16 blur-[2px]"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary/25 blur-[2px]"
          />
          <div className="relative">
            <span className="mb-3 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase before:h-[2px] before:w-[18px] before:rounded-full before:bg-accent">
              {eyebrow}
            </span>
            <h2 className="mb-2.5 font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-[32px]">
              {title}
            </h2>
            <p className="max-w-[440px] text-[15.5px] text-white/78">
              {description}
            </p>
            <p className="mt-3 text-[13.5px] text-white/55">
              Hotline: 089 8082 188 · Email: maxoffice247@gmail.com
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3.5">
            <Button href="tel:0898082188" variant="primary">
              Gọi ngay 089 8082 188
            </Button>
            <Button
              href="https://zalo.me/0898082188"
              variant="outline"
              target="_blank"
              rel="noopener"
            >
              {secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
