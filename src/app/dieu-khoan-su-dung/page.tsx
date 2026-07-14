import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng | MAX OFFICE",
  description:
    "Điều khoản sử dụng website maxoffice.vn: phạm vi áp dụng, quyền sở hữu trí tuệ, trách nhiệm người dùng, giới hạn trách nhiệm và luật áp dụng.",
};

const LAST_UPDATED = "10/07/2026";

type Section = {
  heading: string;
  paragraphs: string[];
};

const SECTIONS: Section[] = [
  {
    heading: "1. Phạm vi áp dụng",
    paragraphs: [
      "Điều khoản sử dụng này áp dụng cho mọi cá nhân, tổ chức truy cập và sử dụng website maxoffice.vn (\"Website\") do Công Ty TNHH MAX Office (\"MAX OFFICE\", \"chúng tôi\") vận hành. Bằng việc truy cập và sử dụng Website, bạn đồng ý tuân thủ các điều khoản được nêu dưới đây.",
    ],
  },
  {
    heading: "2. Quyền sở hữu trí tuệ",
    paragraphs: [
      "Toàn bộ nội dung, hình ảnh, logo, thiết kế giao diện và các tài liệu khác trên Website thuộc quyền sở hữu của MAX OFFICE hoặc được sử dụng hợp pháp. Mọi hành vi sao chép, sử dụng hoặc phân phối lại nội dung trên Website vì mục đích thương mại mà không có sự đồng ý bằng văn bản của MAX OFFICE đều bị nghiêm cấm.",
    ],
  },
  {
    heading: "3. Trách nhiệm của người dùng",
    paragraphs: [
      "Khi điền thông tin vào các biểu mẫu trên Website (đặt lịch tham quan, nhận tư vấn, v.v.), bạn cam kết cung cấp thông tin chính xác, trung thực và cập nhật. MAX OFFICE không chịu trách nhiệm về những sai sót phát sinh do thông tin bạn cung cấp không chính xác.",
    ],
  },
  {
    heading: "4. Giới hạn trách nhiệm",
    paragraphs: [
      "Giá dịch vụ, chương trình khuyến mãi và các thông tin khác được hiển thị trên Website mang tính chất tham khảo và có thể thay đổi theo thời gian mà không cần báo trước. Thông tin, điều khoản và giá dịch vụ chính thức sẽ được xác định dựa trên hợp đồng cụ thể được ký kết trực tiếp giữa MAX OFFICE và khách hàng.",
      "MAX OFFICE nỗ lực đảm bảo thông tin trên Website chính xác và được cập nhật thường xuyên, nhưng không đảm bảo tuyệt đối về tính đầy đủ hoặc không có sai sót tại mọi thời điểm.",
    ],
  },
  {
    heading: "5. Thay đổi điều khoản",
    paragraphs: [
      "MAX OFFICE có quyền cập nhật, sửa đổi Điều khoản sử dụng này vào bất kỳ thời điểm nào, nhằm phù hợp với quy định pháp luật và tình hình hoạt động thực tế. Phiên bản cập nhật sẽ được đăng tải công khai trên Website. Việc bạn tiếp tục sử dụng Website sau khi thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
    ],
  },
  {
    heading: "6. Luật áp dụng",
    paragraphs: [
      "Điều khoản sử dụng này được xây dựng và giải thích theo quy định của pháp luật Việt Nam hiện hành.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Pháp lý"
        title="Điều khoản sử dụng"
        description={`Cập nhật lần cuối: ${LAST_UPDATED}`}
      />
      <Breadcrumb items={[{ label: "Điều khoản sử dụng" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <p className="mb-8 text-[15.5px] leading-relaxed text-body-text">
            Vui lòng đọc kỹ Điều khoản sử dụng này trước khi truy cập hoặc sử dụng website
            maxoffice.vn. Việc bạn tiếp tục sử dụng Website đồng nghĩa với việc bạn đã đọc, hiểu và
            đồng ý với toàn bộ nội dung dưới đây.
          </p>

          <article className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
            {SECTIONS.map((section) => (
              <section key={section.heading} className="mb-8 last:mb-0">
                <h2 className="mb-3 text-[21px] font-bold text-navy sm:text-[23px]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <section className="rounded-2xl border border-line bg-bg-tint p-6">
              <h2 className="mb-3 text-[21px] font-bold text-navy sm:text-[23px]">
                7. Thông tin liên hệ
              </h2>
              <p className="mb-2">
                Nếu có bất kỳ câu hỏi nào liên quan đến Điều khoản sử dụng này, vui lòng liên hệ:
              </p>
              <p className="font-semibold text-navy">Công ty TNHH MAX Office</p>
              <p>Số 10 Sông Thao, Phường Tân Sơn Hòa, Tp.HCM</p>
              <p>GCNDKDN: 0317502009 do Sở Tài Chính - Tp. Hồ Chí Minh</p>
              <p>Cấp ngày 03/10/2022</p>
              <p>Email: cskh@maxoffice.vn</p>
              <p>Hotline: 089 8082 188</p>
            </section>
          </article>

          <p className="mt-8 text-[13px] text-body-text/70">
            Ngày cập nhật gần nhất: {LAST_UPDATED}
          </p>
        </div>
      </section>
    </main>
  );
}
