import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | MAX OFFICE",
  description:
    "Chính sách bảo mật thông tin cá nhân của MAX OFFICE: mục đích thu thập, cách sử dụng, thời gian lưu trữ và quyền của khách hàng theo Nghị định 13/2023/NĐ-CP.",
};

const LAST_UPDATED = "10/07/2026";

type Section = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

const SECTIONS: Section[] = [
  {
    heading: "1. Mục đích thu thập thông tin",
    paragraphs: [
      "Website maxoffice.vn do Công ty TNHH MAX Office vận hành thu thập một số thông tin cá nhân khi bạn chủ động cung cấp qua các biểu mẫu trên website — bao gồm mẫu đặt lịch tham quan văn phòng, mẫu nhận tư vấn dịch vụ và popup ưu đãi.",
      "Mục đích duy nhất của việc thu thập này là để đội ngũ MAX OFFICE có thể liên hệ, tư vấn và hỗ trợ bạn về các dịch vụ mà bạn quan tâm. Chúng tôi không thu thập thông tin cá nhân của bạn cho bất kỳ mục đích nào khác ngoài mục đích tư vấn và chăm sóc khách hàng nêu trên.",
    ],
  },
  {
    heading: "2. Loại dữ liệu thu thập",
    paragraphs: ["Khi bạn điền các biểu mẫu trên website, chúng tôi có thể thu thập:"],
    bullets: ["Họ và tên", "Số điện thoại", "Địa chỉ email", "Dịch vụ quan tâm", "Ghi chú / yêu cầu cụ thể (nếu có)"],
  },
  {
    heading: "3. Cách sử dụng dữ liệu",
    paragraphs: [
      "Thông tin bạn cung cấp chỉ được sử dụng để liên hệ tư vấn về dịch vụ bạn quan tâm, sắp xếp lịch tham quan văn phòng (nếu bạn đăng ký) và gửi thông tin ưu đãi liên quan (nếu bạn đồng ý nhận).",
      "Dữ liệu được lưu trữ nội bộ qua Google Sheet phục vụ mục đích vận hành, đồng thời hệ thống gửi email thông báo tự động đến đội ngũ Chăm sóc khách hàng (CSKH) của MAX OFFICE để xử lý yêu cầu kịp thời.",
      "Chúng tôi cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào ngoài mục đích vận hành nội bộ nêu trên.",
    ],
  },
  {
    heading: "4. Thời gian lưu trữ",
    paragraphs: [
      "Thông tin cá nhân của bạn được lưu trữ trong thời gian cần thiết để phục vụ mục đích tư vấn và chăm sóc khách hàng. Sau khi nhu cầu tư vấn kết thúc hoặc theo yêu cầu của bạn, MAX OFFICE sẽ xoá hoặc ẩn danh hoá dữ liệu tương ứng.",
    ],
  },
  {
    heading: "5. Quyền của người dùng",
    paragraphs: ["Theo tinh thần Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có quyền:"],
    bullets: [
      "Yêu cầu xem lại thông tin cá nhân đã cung cấp",
      "Yêu cầu chỉnh sửa thông tin không chính xác",
      "Yêu cầu xoá thông tin cá nhân khỏi hệ thống của chúng tôi",
      "Rút lại sự đồng ý cung cấp thông tin bất kỳ lúc nào",
    ],
  },
  {
    heading: "6. Bảo mật dữ liệu",
    paragraphs: [
      "MAX OFFICE áp dụng các biện pháp kỹ thuật và quản lý hợp lý để bảo vệ thông tin cá nhân của khách hàng khỏi truy cập trái phép, mất mát hoặc sử dụng sai mục đích. Quyền truy cập vào dữ liệu khách hàng chỉ giới hạn cho những nhân sự cần thiết để thực hiện công việc tư vấn, chăm sóc khách hàng.",
    ],
  },
  {
    heading: "7. Cookie và công nghệ theo dõi",
    paragraphs: [
      "Website sử dụng Google Analytics để phân tích lưu lượng truy cập và cải thiện trải nghiệm người dùng. Công cụ này thu thập dữ liệu thống kê chung (như số lượt truy cập, trang được xem nhiều) và không thu thập thông tin định danh cá nhân của bạn thông qua cookie.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero
        image="/images/khong-gian-lam-viec.jpg"
        eyebrow="Pháp lý"
        title="Chính sách bảo mật"
        description={`Cập nhật lần cuối: ${LAST_UPDATED}`}
      />
      <Breadcrumb items={[{ label: "Chính sách bảo mật" }]} />

      <section className="py-9">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <p className="mb-8 text-[15.5px] leading-relaxed text-body-text">
            MAX OFFICE tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng. Chính sách bảo mật
            này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn truy
            cập và sử dụng website maxoffice.vn.
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
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="rounded-2xl border border-line bg-bg-tint p-6">
              <h2 className="mb-3 text-[21px] font-bold text-navy sm:text-[23px]">
                8. Thông tin liên hệ
              </h2>
              <p className="mb-2">
                Nếu có bất kỳ câu hỏi nào về Chính sách bảo mật này, hoặc muốn thực hiện các quyền
                đối với dữ liệu cá nhân của mình, vui lòng liên hệ:
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
