import Reveal, { RevealGroup, RevealItem } from "./Reveal";

const STEPS = [
  {
    num: "01",
    title: "Bạn gửi thông tin",
    desc: "Điền form hoặc gọi hotline — chỉ mất chưa đến 1 phút.",
  },
  {
    num: "02",
    title: "Chuyên viên liên hệ",
    desc: "Chúng tôi gọi lại trong vòng 15 phút làm việc để hiểu rõ nhu cầu của bạn.",
  },
  {
    num: "03",
    title: "Nhận đề xuất phù hợp",
    desc: "Bạn nhận được giải pháp và báo giá phù hợp nhất, không áp lực, không ràng buộc.",
  },
];

export default function ContactProcess() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-[680px] text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
            Chúng tôi luôn sẵn sàng lắng nghe
          </span>
          <h2 className="mb-3.5 font-display text-[28px] leading-[1.2] font-extrabold text-navy sm:text-[34px]">
            Chỉ mất vài phút để bắt đầu
          </h2>
          <p className="text-[16.5px] text-body-text">
            Dù bạn đang tìm địa chỉ đăng ký kinh doanh, cần thành lập công ty
            hay muốn thuê văn phòng, đội ngũ MAX OFFICE luôn sẵn sàng tư vấn
            miễn phí — không ràng buộc, không áp lực.
          </p>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <RevealItem key={step.num}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-navy font-mono text-[17px] font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 text-[16.5px] font-bold text-navy">{step.title}</h3>
                <p className="text-[13.5px] text-body-text">{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
