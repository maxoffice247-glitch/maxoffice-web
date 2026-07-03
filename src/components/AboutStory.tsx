import Reveal, { RevealGroup, RevealItem } from "./Reveal";
import { BuildingIcon, HeartHandshakeIcon } from "./icons";

export default function AboutStory() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
            Câu chuyện MAX OFFICE
          </span>
          <h2 className="mb-5 font-display text-[28px] leading-[1.2] font-extrabold text-navy sm:text-[34px] lg:text-[40px]">
            Bắt đầu từ một địa chỉ, phát triển thành hệ thống 12 địa điểm
          </h2>
          <p className="text-justify-vn text-[16.5px] leading-relaxed text-body-text">
            MAX OFFICE ra đời năm 2022 tại Số 10 Sông Thao, Tân Bình, với một
            mục tiêu đơn giản: giúp doanh nghiệp Việt bắt đầu đúng luật, vận
            hành đúng tiến độ và không phải tự mình xoay sở với hàng loạt thủ
            tục pháp lý, thuế và văn phòng. Từ một trụ sở đầu tiên, chúng tôi
            đã mở rộng thành hệ thống 12 địa điểm tại các quận trung tâm
            TP.HCM, đồng hành cùng hơn 500 doanh nghiệp — từ những nhà sáng
            lập mới khởi nghiệp đến các công ty đang mở rộng quy mô.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <RevealItem>
            <div className="h-full rounded-2xl border border-line bg-white p-8">
              <div className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-primary-tint text-primary">
                <BuildingIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-[19px] font-bold text-navy">Tầm nhìn</h3>
              <p className="text-[14.5px] leading-relaxed text-body-text">
                Trở thành hệ sinh thái vận hành doanh nghiệp hàng đầu tại
                Việt Nam — nơi mọi doanh nghiệp, từ startup đến tập đoàn, đều
                tìm thấy giải pháp phù hợp để phát triển bền vững.
              </p>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="h-full rounded-2xl border border-line bg-white p-8">
              <div className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-primary-tint text-primary">
                <HeartHandshakeIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-[19px] font-bold text-navy">Sứ mệnh</h3>
              <p className="text-[14.5px] leading-relaxed text-body-text">
                Đồng hành cùng doanh nghiệp Việt từ ngày đầu khởi nghiệp đến
                khi vươn xa, bằng giải pháp văn phòng, pháp lý và tài chính
                minh bạch, chuyên nghiệp và dễ tiếp cận.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
