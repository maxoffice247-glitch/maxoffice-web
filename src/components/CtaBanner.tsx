import Reveal from "./Reveal";
import Button from "./Button";
import { PhoneIcon } from "./icons";

type CtaBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CtaBanner({
  eyebrow = "Liên hệ MAX OFFICE",
  title = "Sẵn sàng bắt đầu cùng MAX OFFICE?",
  description = "Nhận tư vấn miễn phí trong 15 phút — đội ngũ chuyên viên sẽ liên hệ và đề xuất giải pháp phù hợp với bạn.",
  secondaryLabel = "Đặt lịch tư vấn",
  secondaryHref = "/#lead",
}: CtaBannerProps) {
  return (
    <section id="lead" className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal
          className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[24px] bg-gradient-to-tr from-navy to-primary-dark p-8 shadow-[0_30px_70px_rgba(11,31,58,0.28)] sm:p-12 lg:grid-cols-[1.8fr_1fr] lg:p-16"
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
              Hotline: 089 8082 188 · Email: cskh@maxoffice.vn
            </p>
          </div>
          <div className="relative flex flex-col gap-3">
            <Button
              href="tel:0898082188"
              variant="primary"
              icon={<PhoneIcon className="h-3.5 w-3.5" />}
              className="w-full !px-5 !py-3 !text-[13.5px]"
            >
              Gọi ngay 089 8082 188
            </Button>
            <Button
              href="tel:0932357357"
              variant="primary"
              icon={<PhoneIcon className="h-3.5 w-3.5" />}
              className="w-full !px-5 !py-3 !text-[13.5px]"
            >
              Gọi ngay 0932 357 357
            </Button>
            <Button
              href={secondaryHref}
              variant="outline"
              className="w-full !px-5 !py-3 !text-[13.5px]"
            >
              {secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
