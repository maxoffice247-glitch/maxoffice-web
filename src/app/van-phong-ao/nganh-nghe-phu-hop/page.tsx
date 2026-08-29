import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "@/components/TableOfContents";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import { ArrowRightSmallIcon } from "@/components/icons";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  alternates: { canonical: "/van-phong-ao/nganh-nghe-phu-hop" },
  title: "Văn Phòng Ảo Phù Hợp Ngành Nghề Nào? Hướng Dẫn Chi Tiết | MAX OFFICE",
  description:
    "Văn phòng ảo phù hợp ngành nghề nào? Phân biệt trụ sở chính và địa điểm kinh doanh theo Luật Doanh nghiệp 2020, lưu ý cho ngành sản xuất, kho bãi, nhà hàng và hộ kinh doanh cá thể.",
};

type Section = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

const SECTIONS: Section[] = [
  {
    id: "co-so-phap-ly",
    heading: "Văn phòng ảo hợp pháp theo quy định nào?",
    paragraphs: [
      "Theo Điều 42 Luật Doanh nghiệp 2020, trụ sở chính của doanh nghiệp là địa chỉ liên lạc, được xác định theo địa giới đơn vị hành chính, có số điện thoại và có thể là địa chỉ thuê theo hình thức dịch vụ — miễn địa chỉ đó rõ ràng, hợp pháp và không đặt tại căn hộ chung cư chỉ có chức năng để ở. Pháp luật không yêu cầu doanh nghiệp phải có hoạt động sản xuất, kinh doanh diễn ra thường xuyên tại chính địa chỉ trụ sở — đây chính là cơ sở pháp lý cho phép mô hình văn phòng ảo tồn tại hợp pháp.",
      "Bên cạnh đó, Điều 44 Luật Doanh nghiệp 2020 quy định về chi nhánh, văn phòng đại diện và địa điểm kinh doanh — đây là các đơn vị, địa chỉ RIÊNG mà doanh nghiệp có thể đăng ký bổ sung khi cần một địa điểm khác để thực hiện hoạt động kinh doanh cụ thể, tách biệt với trụ sở chính. Hai điều luật này cùng nhau tạo ra cơ chế cho phép một doanh nghiệp đăng ký trụ sở chính tại văn phòng ảo, trong khi hoạt động thực tế (nếu có) diễn ra tại một địa chỉ khác.",
    ],
  },
  {
    id: "phan-biet-tru-so-dia-diem",
    heading: "Phân biệt \"trụ sở chính\" và \"địa điểm kinh doanh\"",
    paragraphs: [
      "Đây là khái niệm quan trọng nhất cần hiểu rõ trước khi quyết định thuê văn phòng ảo, đặc biệt với các ngành nghề có hoạt động thực tế diễn ra ở một nơi khác:",
    ],
    bullets: [
      "Trụ sở chính (Điều 42): địa chỉ đăng ký công ty, địa chỉ liên lạc chính thức với cơ quan nhà nước, đối tác — có thể là địa chỉ văn phòng ảo",
      "Địa điểm kinh doanh (Điều 44): nơi thực tế diễn ra hoạt động sản xuất, bán hàng, phục vụ khách hàng — đăng ký bổ sung riêng theo đúng địa chỉ thật nơi hoạt động diễn ra",
      "Một doanh nghiệp chỉ có 1 trụ sở chính, nhưng có thể có nhiều địa điểm kinh doanh khác nhau tuỳ nhu cầu mở rộng",
    ],
  },
  {
    id: "nganh-phu-hop-nhat",
    heading: "Nhóm ngành dùng văn phòng ảo thuận tiện nhất",
    paragraphs: [
      "Những ngành nghề có hoạt động cốt lõi không gắn với một địa điểm vật lý cố định là nhóm phù hợp nhất với mô hình văn phòng ảo, vì trụ sở đăng ký gần như trùng khớp hoàn toàn với nơi công việc thực sự diễn ra (online, từ xa, hoặc theo lịch hẹn):",
    ],
    bullets: [
      "Dịch vụ, tư vấn: thiết kế, marketing, pháp lý, kế toán, tư vấn độc lập",
      "Công nghệ: phát triển phần mềm, IT outsourcing, sản phẩm số",
      "Thương mại điện tử: bán hàng online, không cần cửa hàng vật lý cố định",
      "Doanh nghiệp remote, làm việc từ xa: đội ngũ phân tán nhiều nơi, không cần văn phòng tập trung",
      "Startup giai đoạn đầu: chưa cần không gian làm việc cố định, ưu tiên tối ưu chi phí vận hành",
    ],
  },
  {
    id: "nganh-can-mat-bang",
    heading: "Ngành cần mặt bằng sản xuất, lưu kho có thuê được văn phòng ảo không?",
    paragraphs: [
      "Có. Các ngành sản xuất, gia công, kho bãi/logistics, nhà hàng ăn uống, bán lẻ có cửa hàng đều VẪN THUÊ ĐƯỢC văn phòng ảo làm trụ sở chính để đăng ký kinh doanh và giao dịch bình thường. Điều kiện duy nhất, đúng theo Điều 44 nêu trên: hoạt động sản xuất, lưu kho hoặc phục vụ khách hàng phải diễn ra tại một địa điểm kinh doanh ĐĂNG KÝ RIÊNG theo đúng địa chỉ thật — không diễn ra tại chính địa chỉ văn phòng ảo.",
      "Ví dụ thực tế: doanh nghiệp có xưởng sản xuất tại khu công nghiệp có thể đăng ký xưởng đó làm địa điểm kinh doanh, trong khi trụ sở chính đặt tại văn phòng ảo khu trung tâm thành phố để thuận tiện giao dịch, tiếp đối tác và nhận văn bản pháp lý.",
    ],
    bullets: [
      "Sản xuất, gia công: xưởng sản xuất đăng ký làm địa điểm kinh doanh riêng",
      "Kho bãi, logistics: kho hàng đăng ký làm địa điểm kinh doanh riêng",
      "Nhà hàng, quán ăn: địa chỉ quán đăng ký làm địa điểm kinh doanh riêng",
      "Bán lẻ có cửa hàng: từng cửa hàng đăng ký làm địa điểm kinh doanh riêng",
    ],
  },
  {
    id: "ho-kinh-doanh-ca-the",
    heading: "Lưu ý riêng với hộ kinh doanh cá thể",
    paragraphs: [
      "Theo Nghị định 01/2021/NĐ-CP, hộ kinh doanh có thể hoạt động tại nhiều địa điểm kinh doanh, nhưng phải chọn một nơi đăng ký làm địa điểm kinh doanh chính (trụ sở) và thông báo các địa điểm còn lại với cơ quan quản lý thuế, quản lý thị trường tại nơi đó. Trên thực tế, cơ quan đăng ký kinh doanh cấp huyện/xã ở một số địa phương có xu hướng yêu cầu địa chỉ đăng ký chính của hộ kinh doanh gắn liền chặt chẽ hơn với nơi hoạt động thực tế, so với doanh nghiệp có tư cách pháp nhân.",
      "Vì vậy, việc sử dụng văn phòng ảo làm địa chỉ đăng ký cho hộ kinh doanh cần được đánh giá theo từng trường hợp cụ thể, tuỳ ngành nghề và quy định áp dụng tại cơ quan đăng ký kinh doanh địa phương. Chúng tôi khuyến nghị bạn liên hệ trực tiếp để được tư vấn phù hợp trước khi quyết định, thay vì áp dụng chung một kết luận cho mọi trường hợp.",
    ],
  },
  {
    id: "luu-y-phap-ly-khac",
    heading: "Những lưu ý pháp lý khác cần biết",
    paragraphs: [
      "Ngoài hai điểm trên, có một vài lưu ý pháp lý khác doanh nghiệp nên nắm rõ khi lựa chọn địa chỉ đăng ký kinh doanh nói chung, không riêng gì văn phòng ảo:",
    ],
    bullets: [
      "Không đặt trụ sở tại căn hộ chung cư chỉ có chức năng để ở, theo Luật Nhà ở 2014 — quy định này áp dụng chung, không phân biệt văn phòng ảo hay văn phòng truyền thống",
      "Chi nhánh, địa điểm kinh doanh vẫn bắt buộc phải treo bảng tên tại địa chỉ đăng ký theo đúng quy định về tên doanh nghiệp — tại MAX OFFICE, mỗi chi nhánh đều có bảng tên công ty thật gắn tại toà nhà, không phải địa chỉ chỉ tồn tại trên giấy tờ",
    ],
  },
];

const FAQS = [
  {
    q: "Ngành sản xuất, nhà hàng có thuê được văn phòng ảo không?",
    a: "Có. Văn phòng ảo dùng làm trụ sở chính để đăng ký kinh doanh và giao dịch — hoạt động sản xuất hoặc phục vụ khách hàng vẫn diễn ra tại địa điểm kinh doanh đăng ký riêng theo đúng địa chỉ thật, không diễn ra tại chính địa chỉ văn phòng ảo.",
  },
  {
    q: "Trụ sở chính và địa điểm kinh doanh khác nhau thế nào?",
    a: "Trụ sở chính (Điều 42 Luật Doanh nghiệp 2020) là địa chỉ đăng ký công ty, có thể là văn phòng ảo. Địa điểm kinh doanh (Điều 44) là nơi thực tế diễn ra hoạt động sản xuất, bán hàng, phục vụ khách — đăng ký bổ sung riêng theo đúng địa chỉ thật.",
  },
  {
    q: "Hộ kinh doanh cá thể có thuê được văn phòng ảo không?",
    a: "Cần đánh giá theo từng trường hợp cụ thể. Theo Nghị định 01/2021/NĐ-CP, hộ kinh doanh có thể có nhiều địa điểm nhưng phải chọn 1 nơi đăng ký chính, và một số địa phương có yêu cầu riêng về việc gắn địa chỉ với hoạt động thực tế — liên hệ MAX OFFICE để được tư vấn phù hợp với ngành nghề và địa phương đăng ký của bạn.",
  },
  {
    q: "Văn phòng ảo có được đặt tại chung cư không?",
    a: "Không, nếu là căn hộ chung cư chỉ có chức năng để ở theo Luật Nhà ở 2014. MAX OFFICE chỉ cung cấp địa chỉ tại các toà nhà văn phòng hợp lệ, có đầy đủ hồ sơ pháp lý.",
  },
  {
    q: "MAX OFFICE có hỗ trợ đăng ký thêm địa điểm kinh doanh riêng ngoài trụ sở chính không?",
    a: "Có. Đội ngũ MAX OFFICE tư vấn thủ tục đăng ký địa điểm kinh doanh bổ sung theo đúng địa chỉ thực tế của bạn, song song với dịch vụ văn phòng ảo làm trụ sở chính.",
  },
];

const tocItems = SECTIONS.map((s) => ({ id: s.id, label: s.heading }));

export default function NganhNghePhuHopPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Văn phòng ảo phù hợp với ngành nghề nào?",
    description:
      "Phân biệt trụ sở chính và địa điểm kinh doanh theo Luật Doanh nghiệp 2020, lưu ý cho ngành sản xuất, kho bãi, nhà hàng và hộ kinh doanh cá thể.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-blue.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/van-phong-ao/nganh-nghe-phu-hop`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageHero
        image="/images/van-phong-ao.jpg"
        eyebrow="Văn phòng ảo"
        title="Văn phòng ảo phù hợp với ngành nghề nào?"
        description="Giải đáp theo đúng quy định Luật Doanh nghiệp 2020 — ngành nào dùng được ngay, ngành nào cần lưu ý gì trước khi đăng ký."
      />
      <Breadcrumb
        items={[
          { label: "Văn phòng ảo", href: "/services/van-phong-ao" },
          { label: "Ngành nghề phù hợp" },
        ]}
      />

      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <TableOfContents items={tocItems} />

              <article className="text-justify-vn text-[15.5px] leading-relaxed text-body-text">
                {SECTIONS.map((section) => (
                  <section key={section.id} id={section.id} className="mb-8 scroll-mt-24 last:mb-0">
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

                <div className="mt-10 rounded-2xl border border-line bg-bg-tint p-6">
                  <p className="mb-3 text-[13px] font-bold tracking-wide text-navy uppercase">
                    Liên kết hữu ích
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/blog/van-phong-ao-la-gi-co-hop-phap-khong"
                        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                      >
                        Văn phòng ảo là gì? Có hợp pháp để đăng ký kinh doanh không?
                        <ArrowRightSmallIcon className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services/thanh-lap-doanh-nghiep"
                        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                      >
                        Dịch vụ thành lập doanh nghiệp MAX OFFICE (bao gồm hộ kinh doanh)
                        <ArrowRightSmallIcon className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services/van-phong-ao"
                        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                      >
                        Dịch vụ Văn phòng ảo MAX OFFICE
                        <ArrowRightSmallIcon className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </article>
            </div>

            <aside>
              <div className="rounded-2xl border border-line bg-white p-6">
                <p className="mb-2 text-[13px] font-bold tracking-wide text-navy uppercase">
                  Cần tư vấn nhanh?
                </p>
                <p className="mb-4 text-[13.5px] leading-relaxed text-body-text">
                  Mỗi ngành nghề, mỗi mô hình kinh doanh có thể có yêu cầu khác
                  nhau. Gọi ngay hotline để được tư vấn miễn phí, đúng với tình
                  huống cụ thể của bạn.
                </p>
                <a
                  href="tel:0898082188"
                  className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-primary hover:underline"
                >
                  089 8082 188
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Faq
        id="faq"
        eyebrow="Câu hỏi thường gặp"
        title="Câu hỏi liên quan đến ngành nghề và văn phòng ảo"
        items={FAQS}
      />

      <CtaBanner
        title="Chưa chắc mô hình kinh doanh của bạn có phù hợp?"
        description="Để lại thông tin, MAX OFFICE tư vấn miễn phí theo đúng ngành nghề và mô hình hoạt động cụ thể của bạn."
        service="Văn phòng ảo"
        secondaryLabel="Nhận tư vấn miễn phí"
      />
    </main>
  );
}
