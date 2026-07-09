import { KNOWLEDGE_CATEGORIES } from "./knowledgeCenterData";

export type BlogCategory = { slug: string; name: string };

export const BLOG_CATEGORIES: BlogCategory[] = KNOWLEDGE_CATEGORIES.map((c) => ({
  slug: c.slug,
  name: c.name,
}));

export function getCategoryName(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export type BlogSection = {
  /** Anchor id, also used as the Table of Contents target. */
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaqItem = { q: string; a: string };
export type BlogRelatedLink = { label: string; href: string };
export type BlogCta = {
  title: string;
  description: string;
  /** Exact label in the lead form's "Dịch vụ quan tâm" dropdown to pre-select. */
  service?: string;
  serviceHref: string;
  serviceLabel: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  author: string;
  date: string;
  readingTime: number;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  sections: BlogSection[];
  faqs: BlogFaqItem[];
  relatedLinks: BlogRelatedLink[];
  cta: BlogCta;
};

export const BLOG_POSTS: BlogPost[] = [
  // ===================== THÀNH LẬP DOANH NGHIỆP =====================
  {
    slug: "ho-kinh-doanh-vs-tnhh-vs-co-phan",
    title: "Hộ kinh doanh vs Công ty TNHH vs Công ty Cổ phần: Nên chọn loại hình nào?",
    excerpt:
      "So sánh chi tiết 3 loại hình doanh nghiệp phổ biến nhất — trách nhiệm pháp lý, thủ tục thành lập, khả năng mở rộng — để bạn chọn đúng ngay từ đầu.",
    categorySlug: "thanh-lap-doanh-nghiep",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Hộ Kinh Doanh, Công Ty TNHH Hay Cổ Phần? So Sánh Chi Tiết 2026",
    metaDescription:
      "So sánh Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần về trách nhiệm pháp lý, thủ tục, chi phí — giúp bạn chọn đúng loại hình khi khởi nghiệp tại Việt Nam.",
    heroImage: "/images/thanh-lap-doanh-nghiep.jpg",
    sections: [
      {
        id: "tong-quan",
        heading: "Vì sao lựa chọn loại hình doanh nghiệp lại quan trọng",
        paragraphs: [
          "Khi bắt đầu kinh doanh, một trong những quyết định đầu tiên và có ảnh hưởng lâu dài nhất là lựa chọn loại hình doanh nghiệp. Tại Việt Nam, ba loại hình phổ biến nhất với cá nhân và nhóm khởi nghiệp là Hộ kinh doanh, Công ty TNHH (một thành viên hoặc hai thành viên trở lên) và Công ty Cổ phần. Mỗi loại hình có đặc điểm riêng về trách nhiệm pháp lý, thủ tục thành lập, cơ cấu quản lý và khả năng mở rộng — chọn sai ngay từ đầu có thể khiến bạn phải làm thủ tục chuyển đổi loại hình sau này, tốn thêm thời gian và chi phí.",
          "Bài viết này so sánh trực tiếp ba loại hình theo các tiêu chí quan trọng nhất, giúp bạn có cái nhìn tổng quan trước khi quyết định.",
        ],
      },
      {
        id: "ho-kinh-doanh",
        heading: "Hộ kinh doanh: gọn nhẹ, phù hợp quy mô nhỏ",
        paragraphs: [
          "Hộ kinh doanh do một cá nhân hoặc các thành viên hộ gia đình đăng ký, không có tư cách pháp nhân, và chủ hộ kinh doanh chịu trách nhiệm bằng toàn bộ tài sản của mình đối với hoạt động kinh doanh. Đây là mô hình phù hợp với các hộ kinh doanh nhỏ lẻ như quán ăn, cửa hàng bán lẻ, dịch vụ cá nhân...",
        ],
        bullets: [
          "Thủ tục đăng ký đơn giản, thời gian xử lý nhanh",
          "Chế độ thuế đơn giản hơn, có thể áp dụng thuế khoán",
          "Không có tư cách pháp nhân, không tách bạch tài sản cá nhân và tài sản kinh doanh",
          "Chịu trách nhiệm vô hạn bằng toàn bộ tài sản",
          "Hạn chế khi ký hợp đồng lớn, khó gọi vốn hoặc hợp tác với đối tác cần pháp nhân",
        ],
      },
      {
        id: "cong-ty-tnhh",
        heading: "Công ty TNHH: lựa chọn phổ biến nhất cho doanh nghiệp vừa và nhỏ",
        paragraphs: [
          "Công ty TNHH có thể là một thành viên (do một cá nhân hoặc tổ chức làm chủ sở hữu) hoặc hai thành viên trở lên (tối đa 50 thành viên). Đây là loại hình có tư cách pháp nhân, các thành viên chỉ chịu trách nhiệm trong phạm vi số vốn đã cam kết góp vào công ty — tách bạch rõ ràng giữa tài sản cá nhân và tài sản doanh nghiệp.",
        ],
        bullets: [
          "Có tư cách pháp nhân, dễ dàng ký kết hợp đồng, vay vốn, hợp tác kinh doanh",
          "Trách nhiệm hữu hạn trong phạm vi vốn góp — an toàn hơn cho chủ sở hữu",
          "Cơ cấu quản lý đơn giản hơn công ty cổ phần",
          "Không được phát hành cổ phần, hạn chế trong việc huy động vốn từ đại chúng",
          "Số lượng thành viên tối đa 50, phù hợp mô hình gia đình hoặc nhóm nhỏ đối tác",
        ],
      },
      {
        id: "cong-ty-co-phan",
        heading: "Công ty Cổ phần: phù hợp khi có kế hoạch gọi vốn, mở rộng",
        paragraphs: [
          "Công ty Cổ phần yêu cầu tối thiểu 3 cổ đông sáng lập và không giới hạn số lượng cổ đông tối đa. Vốn điều lệ được chia thành các phần bằng nhau gọi là cổ phần, cổ đông chịu trách nhiệm hữu hạn trong phạm vi số cổ phần sở hữu. Đây là loại hình duy nhất trong ba loại hình được phép phát hành cổ phần để huy động vốn, kể cả niêm yết trên sàn chứng khoán khi đủ điều kiện.",
        ],
        bullets: [
          "Khả năng huy động vốn linh hoạt nhất — phát hành cổ phần, gọi vốn từ nhà đầu tư",
          "Cơ cấu quản lý phức tạp hơn: Đại hội đồng cổ đông, Hội đồng quản trị, Ban kiểm soát (tuỳ quy mô)",
          "Phù hợp doanh nghiệp có kế hoạch mở rộng nhanh, gọi vốn đầu tư hoặc lên sàn trong tương lai",
          "Yêu cầu tối thiểu 3 cổ đông sáng lập, thủ tục quản trị nội bộ chặt chẽ hơn TNHH",
        ],
      },
      {
        id: "ban-chat-khac-biet",
        heading: "Bản chất khác biệt giữa 3 loại hình, nhìn từ một câu hỏi",
        paragraphs: [
          "Nếu chỉ tóm gọn trong một câu hỏi cho mỗi loại hình, sự khác biệt cốt lõi nằm ở đây: Hộ kinh doanh trả lời cho câu \"tôi muốn bắt đầu nhanh, gọn, tự chịu trách nhiệm\"; Công ty TNHH trả lời cho câu \"tôi cần pháp nhân và muốn giới hạn rủi ro trong số vốn góp\"; Công ty Cổ phần trả lời cho câu \"tôi cần huy động vốn từ nhiều người và sẵn sàng cho một cơ cấu quản trị phức tạp hơn\". Cả ba đều là lựa chọn hợp pháp và phổ biến — không có loại hình nào ưu việt tuyệt đối, chỉ có loại hình phù hợp hơn với từng giai đoạn và mục tiêu cụ thể.",
        ],
      },
      {
        id: "nen-chon-loai-hinh-nao",
        heading: "Nên chọn loại hình nào? Gợi ý theo từng trường hợp",
        paragraphs: [
          "Không có loại hình nào \"tốt nhất\" cho tất cả mọi người — lựa chọn phù hợp phụ thuộc vào quy mô hiện tại, kế hoạch phát triển và mức độ rủi ro bạn sẵn sàng chấp nhận.",
        ],
        bullets: [
          "Kinh doanh nhỏ lẻ, một mình quản lý, chưa cần pháp nhân → Hộ kinh doanh",
          "Cần tư cách pháp nhân, muốn giới hạn rủi ro, có từ 1 đến 50 thành viên/nhóm đối tác cố định → Công ty TNHH",
          "Có kế hoạch gọi vốn từ nhiều nhà đầu tư, mở rộng nhanh, hướng đến niêm yết → Công ty Cổ phần",
        ],
      },
    ],
    faqs: [
      {
        q: "Hộ kinh doanh có thể chuyển đổi thành Công ty TNHH sau này không?",
        a: "Có. Pháp luật cho phép hộ kinh doanh chuyển đổi thành doanh nghiệp khi có nhu cầu mở rộng. Thủ tục này cần chuẩn bị hồ sơ tương tự thành lập mới — liên hệ MAX OFFICE để được tư vấn cụ thể.",
      },
      {
        q: "Công ty TNHH một thành viên và hai thành viên trở lên khác nhau thế nào?",
        a: "TNHH một thành viên chỉ có một chủ sở hữu (cá nhân hoặc tổ chức); TNHH hai thành viên trở lên có từ 2 đến 50 thành viên góp vốn. Về trách nhiệm pháp lý, cả hai đều là trách nhiệm hữu hạn trong phạm vi vốn góp.",
      },
      {
        q: "Chi phí thành lập giữa 3 loại hình có khác nhau không?",
        a: "Không. Chi phí dịch vụ thành lập tại MAX OFFICE áp dụng chung một bảng giá cho cả Hộ kinh doanh, Công ty TNHH và Công ty Cổ phần — chỉ khác nhau về hồ sơ pháp lý cần chuẩn bị.",
      },
      {
        q: "Tôi có thể tự quyết định loại hình mà không cần tư vấn không?",
        a: "Được, nhưng vì mỗi loại hình ảnh hưởng lâu dài đến trách nhiệm pháp lý và khả năng mở rộng của bạn, MAX OFFICE khuyến nghị nên trao đổi với đội ngũ tư vấn miễn phí trước khi nộp hồ sơ chính thức.",
      },
      {
        q: "Ngành nghề kinh doanh có điều kiện có ảnh hưởng đến việc chọn loại hình không?",
        a: "Có, một số ngành nghề yêu cầu vốn pháp định hoặc điều kiện riêng có thể phù hợp hơn với loại hình nhất định. Hãy liên hệ MAX OFFICE để được tư vấn cụ thể theo đúng ngành nghề bạn dự định đăng ký.",
      },
    ],
    relatedLinks: [
      { label: "Công cụ so sánh chi tiết TNHH và Cổ phần", href: "/tien-ich/so-sanh-tnhh-va-co-phan" },
      { label: "Hồ sơ thành lập Công ty TNHH cần chuẩn bị gì", href: "/blog/ho-so-thanh-lap-cong-ty-tnhh" },
      { label: "Dịch vụ thành lập doanh nghiệp MAX OFFICE", href: "/services/thanh-lap-doanh-nghiep" },
    ],
    cta: {
      title: "Chưa biết nên chọn loại hình nào?",
      description:
        "Để lại thông tin, chuyên viên MAX OFFICE tư vấn miễn phí loại hình phù hợp với mô hình kinh doanh của bạn.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/services/thanh-lap-doanh-nghiep",
      serviceLabel: "Xem dịch vụ thành lập doanh nghiệp",
    },
  },
  {
    slug: "ho-so-thanh-lap-cong-ty-tnhh",
    title: "Hồ sơ thành lập công ty TNHH cần chuẩn bị những gì?",
    excerpt:
      "Danh sách đầy đủ giấy tờ cần chuẩn bị khi thành lập Công ty TNHH — từ giấy đề nghị đăng ký đến điều lệ công ty, giúp bạn không bỏ sót hồ sơ nào.",
    categorySlug: "thanh-lap-doanh-nghiep",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Hồ Sơ Thành Lập Công Ty TNHH Cần Những Gì? Danh Sách Đầy Đủ 2026",
    metaDescription:
      "Danh sách đầy đủ hồ sơ thành lập Công ty TNHH một thành viên và hai thành viên trở lên — giấy tờ cần chuẩn bị, nơi nộp hồ sơ và lưu ý quan trọng.",
    heroImage: "/images/bang-gia-gpkd.jpg",
    sections: [
      {
        id: "ho-so-can-thiet",
        heading: "Hồ sơ thành lập Công ty TNHH gồm những gì",
        paragraphs: [
          "Theo Luật Doanh nghiệp hiện hành, hồ sơ đăng ký thành lập Công ty TNHH — dù là một thành viên hay hai thành viên trở lên — đều cần các loại giấy tờ cơ bản sau. Việc chuẩn bị đầy đủ và chính xác ngay từ đầu giúp hồ sơ được xử lý nhanh, tránh bị trả lại do thiếu sót.",
        ],
        bullets: [
          "Giấy đề nghị đăng ký doanh nghiệp (theo mẫu quy định)",
          "Điều lệ công ty",
          "Danh sách thành viên (áp dụng với Công ty TNHH hai thành viên trở lên)",
          "Bản sao hợp lệ CCCD/CMND/hộ chiếu còn hiệu lực của các thành viên góp vốn và người đại diện theo pháp luật",
          "Văn bản uỷ quyền cho người nộp hồ sơ (nếu không phải người đại diện pháp luật trực tiếp thực hiện)",
          "Đối với thành viên là tổ chức: quyết định thành lập, giấy chứng nhận đăng ký doanh nghiệp hoặc tài liệu tương đương, kèm văn bản uỷ quyền cho người đại diện quản lý phần vốn góp",
        ],
      },
      {
        id: "thong-tin-can-xac-dinh",
        heading: "Những thông tin cần xác định trước khi soạn hồ sơ",
        paragraphs: [
          "Trước khi bắt tay soạn thảo, bạn cần xác định rõ các thông tin sau vì chúng sẽ được thể hiện xuyên suốt trong hồ sơ và Giấy chứng nhận đăng ký doanh nghiệp:",
        ],
        bullets: [
          "Tên công ty (tên tiếng Việt, tên viết tắt nếu có, kiểm tra trùng tên trên Cổng thông tin quốc gia về đăng ký doanh nghiệp)",
          "Địa chỉ trụ sở chính — cần xác định rõ ràng, phù hợp mục đích kinh doanh và không thuộc khu vực bị cấm đặt trụ sở",
          "Ngành nghề kinh doanh dự kiến, mã hoá theo hệ thống ngành kinh tế Việt Nam",
          "Vốn điều lệ và tỷ lệ góp vốn giữa các thành viên",
          "Người đại diện theo pháp luật và chức danh",
        ],
      },
      {
        id: "noi-nop-ho-so",
        heading: "Nộp hồ sơ ở đâu và thời gian xử lý",
        paragraphs: [
          "Hồ sơ được nộp trực tuyến qua Cổng thông tin quốc gia về đăng ký doanh nghiệp hoặc trực tiếp tại cơ quan đăng ký kinh doanh quản lý theo địa bàn nơi doanh nghiệp đặt trụ sở chính. Thời gian xử lý thông thường trong khoảng 3 ngày làm việc kể từ khi hồ sơ hợp lệ được tiếp nhận, tuy nhiên có thể kéo dài hơn nếu hồ sơ cần bổ sung, chỉnh sửa.",
          "Vì tên gọi cơ quan quản lý và một số chi tiết thủ tục hành chính có thể có điều chỉnh theo từng giai đoạn, để đảm bảo chính xác 100% tại thời điểm bạn thực hiện thủ tục, hãy liên hệ MAX OFFICE để được cập nhật thông tin mới nhất.",
        ],
      },
      {
        id: "luu-y-quan-trong",
        heading: "Những lưu ý giúp hồ sơ không bị trả lại",
        paragraphs: ["Phần lớn hồ sơ bị trả lại hoặc yêu cầu bổ sung đến từ những lỗi có thể tránh được:"],
        bullets: [
          "Tên công ty trùng hoặc gây nhầm lẫn với doanh nghiệp đã đăng ký",
          "Ngành nghề kinh doanh chưa được mã hoá đúng theo hệ thống ngành kinh tế",
          "Thông tin thành viên, tỷ lệ vốn góp trong Điều lệ không khớp với Danh sách thành viên",
          "Địa chỉ trụ sở thiếu thông tin xác định (số nhà, phường/xã, quận/huyện)",
          "Chữ ký không đúng người có thẩm quyền theo Điều lệ công ty",
        ],
      },
      {
        id: "dich-vu-ho-tro",
        heading: "Vì sao nên để đơn vị chuyên nghiệp soạn hồ sơ",
        paragraphs: [
          "Với người lần đầu thành lập doanh nghiệp, việc tự soạn hồ sơ dễ mất thời gian tra cứu quy định và dễ sai sót ở những chi tiết nhỏ nhưng quan trọng. MAX OFFICE hỗ trợ soạn thảo toàn bộ hồ sơ thành lập Công ty TNHH, đại diện nộp hồ sơ và theo dõi tiến độ cho đến khi bạn nhận được Giấy chứng nhận đăng ký doanh nghiệp — bạn chỉ cần cung cấp thông tin cơ bản và bản sao giấy tờ tuỳ thân.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi cần chuẩn bị bao nhiêu bộ hồ sơ?",
        a: "Thông thường 1 bộ hồ sơ gốc nộp cho cơ quan đăng ký kinh doanh là đủ khi nộp trực tuyến; nếu nộp trực tiếp, nên chuẩn bị thêm bản sao lưu. MAX OFFICE sẽ hướng dẫn cụ thể khi hỗ trợ bạn thực hiện thủ tục.",
      },
      {
        q: "Công ty TNHH một thành viên có cần Danh sách thành viên không?",
        a: "Không. Danh sách thành viên chỉ áp dụng cho Công ty TNHH hai thành viên trở lên. Công ty TNHH một thành viên chỉ cần Giấy đề nghị đăng ký doanh nghiệp và Điều lệ công ty.",
      },
      {
        q: "Tôi có thể dùng địa chỉ nhà riêng làm trụ sở công ty không?",
        a: "Có thể, tuỳ vào loại bất động sản và quy định tại địa phương cụ thể. Với các trường hợp không rõ ràng, MAX OFFICE khuyến nghị liên hệ trực tiếp để được tư vấn hoặc cân nhắc sử dụng dịch vụ Văn phòng ảo.",
      },
      {
        q: "Sau khi có Giấy chứng nhận đăng ký doanh nghiệp, tôi cần làm gì tiếp theo?",
        a: "Cần khắc dấu, mở tài khoản ngân hàng, đăng ký chữ ký số, kê khai thuế ban đầu và đăng ký sử dụng hoá đơn điện tử trước khi chính thức hoạt động kinh doanh.",
      },
      {
        q: "Thời gian chuẩn bị hồ sơ mất bao lâu nếu tôi tự làm?",
        a: "Tuỳ mức độ am hiểu quy định của bạn, có thể từ vài ngày đến vài tuần nếu phải chỉnh sửa nhiều lần. Khi sử dụng dịch vụ trọn gói của MAX OFFICE, toàn bộ hồ sơ được soạn thảo và nộp trong 5-7 ngày làm việc.",
      },
    ],
    relatedLinks: [
      { label: "Hộ kinh doanh vs TNHH vs Cổ phần — nên chọn loại hình nào", href: "/blog/ho-kinh-doanh-vs-tnhh-vs-co-phan" },
      { label: "Quy trình thành lập doanh nghiệp mới nhất", href: "/blog/quy-trinh-thanh-lap-doanh-nghiep-moi-nhat" },
      { label: "Checklist thành lập doanh nghiệp", href: "/tien-ich/checklist-thanh-lap-doanh-nghiep" },
    ],
    cta: {
      title: "Để MAX OFFICE soạn hồ sơ giúp bạn",
      description:
        "Chỉ cần CCCD và thông tin cơ bản — chuyên viên MAX OFFICE lo phần còn lại, hoàn tất trong 5-7 ngày làm việc.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/services/thanh-lap-doanh-nghiep",
      serviceLabel: "Xem dịch vụ thành lập doanh nghiệp",
    },
  },
  {
    slug: "quy-trinh-thanh-lap-doanh-nghiep-moi-nhat",
    title: "Quy trình thành lập doanh nghiệp mới nhất tại Việt Nam",
    excerpt:
      "5 bước rõ ràng để thành lập doanh nghiệp đúng pháp lý — từ chuẩn bị thông tin, nộp hồ sơ đến các thủ tục bắt buộc sau khi có giấy phép.",
    categorySlug: "thanh-lap-doanh-nghiep",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 7,
    metaTitle: "Quy Trình Thành Lập Doanh Nghiệp Mới Nhất Tại Việt Nam (2026)",
    metaDescription:
      "5 bước thành lập doanh nghiệp từ chuẩn bị hồ sơ đến khai thuế ban đầu — quy trình đầy đủ, cập nhật quy định pháp luật hiện hành tại Việt Nam.",
    heroImage: "/images/dich-vu-thanh-lap-doanh-nghiep.jpg",
    sections: [
      {
        id: "buoc-1",
        heading: "Bước 1: Chuẩn bị thông tin trước khi thành lập",
        paragraphs: [
          "Trước khi soạn bất kỳ giấy tờ nào, bạn cần xác định rõ những thông tin nền tảng của doanh nghiệp — đây là bước quyết định tốc độ của toàn bộ quy trình phía sau.",
        ],
        bullets: [
          "Loại hình doanh nghiệp: Hộ kinh doanh, Công ty TNHH hay Công ty Cổ phần",
          "Tên công ty và kiểm tra trùng tên trước khi nộp hồ sơ",
          "Ngành nghề kinh doanh dự kiến",
          "Vốn điều lệ và tỷ lệ góp vốn giữa các thành viên/cổ đông",
          "Địa chỉ trụ sở chính",
          "Người đại diện theo pháp luật",
        ],
      },
      {
        id: "buoc-2",
        heading: "Bước 2: Soạn thảo hồ sơ đăng ký doanh nghiệp",
        paragraphs: [
          "Hồ sơ gồm Giấy đề nghị đăng ký doanh nghiệp, Điều lệ công ty, Danh sách thành viên/cổ đông (tuỳ loại hình) và bản sao giấy tờ tuỳ thân hợp lệ của các thành viên góp vốn và người đại diện pháp luật. Đây là bước dễ phát sinh sai sót nhất nếu bạn chưa quen với các mẫu biểu và quy định hiện hành — nên tham khảo bài viết riêng về hồ sơ thành lập Công ty TNHH nếu bạn chọn loại hình này.",
        ],
      },
      {
        id: "buoc-3",
        heading: "Bước 3: Nộp hồ sơ và nhận Giấy chứng nhận đăng ký doanh nghiệp",
        paragraphs: [
          "Hồ sơ được nộp trực tuyến qua Cổng thông tin quốc gia về đăng ký doanh nghiệp. Trong khoảng 3 ngày làm việc kể từ khi hồ sơ hợp lệ được tiếp nhận, cơ quan đăng ký kinh doanh sẽ cấp Giấy chứng nhận đăng ký doanh nghiệp nếu không có yêu cầu bổ sung, chỉnh sửa.",
        ],
      },
      {
        id: "buoc-4",
        heading: "Bước 4: Khắc dấu, công bố thông tin và mở tài khoản ngân hàng",
        paragraphs: [
          "Sau khi có Giấy chứng nhận đăng ký doanh nghiệp, doanh nghiệp cần khắc con dấu, thực hiện thủ tục công bố nội dung đăng ký doanh nghiệp theo quy định, mở tài khoản ngân hàng và thông báo số tài khoản với cơ quan đăng ký kinh doanh. Đây cũng là thời điểm phù hợp để đăng ký chữ ký số, chuẩn bị cho các thủ tục thuế ở bước tiếp theo.",
        ],
      },
      {
        id: "buoc-5",
        heading: "Bước 5: Hoàn tất thủ tục thuế ban đầu và bắt đầu hoạt động",
        paragraphs: [
          "Doanh nghiệp thực hiện hồ sơ khai thuế ban đầu với cơ quan thuế quản lý trực tiếp, đăng ký phương pháp tính thuế GTGT, đăng ký sử dụng hoá đơn điện tử và treo bảng hiệu tại trụ sở. Hoàn tất bước này, doanh nghiệp đã sẵn sàng ký hợp đồng, xuất hoá đơn và chính thức hoạt động kinh doanh đúng pháp luật.",
        ],
      },
      {
        id: "thoi-gian-thuc-hien",
        heading: "Tổng thời gian thực hiện mất bao lâu",
        paragraphs: [
          "Tuỳ mức độ đầy đủ và chính xác của hồ sơ ngay từ đầu, toàn bộ quy trình từ chuẩn bị đến khi có Giấy chứng nhận đăng ký doanh nghiệp thường mất khoảng 5-7 ngày làm việc khi sử dụng dịch vụ trọn gói có người theo dõi tiến độ liên tục. Nếu tự thực hiện và chưa quen quy trình, thời gian có thể kéo dài hơn do hồ sơ bị trả lại để bổ sung, chỉnh sửa.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi có thể tự nộp hồ sơ online mà không cần đến trực tiếp cơ quan đăng ký kinh doanh không?",
        a: "Có. Hồ sơ đăng ký doanh nghiệp có thể nộp hoàn toàn trực tuyến qua Cổng thông tin quốc gia về đăng ký doanh nghiệp, không bắt buộc phải đến nộp trực tiếp.",
      },
      {
        q: "Nếu hồ sơ bị trả lại thì phải làm sao?",
        a: "Cơ quan đăng ký kinh doanh sẽ nêu rõ lý do và nội dung cần bổ sung, chỉnh sửa. Bạn chỉnh sửa theo yêu cầu và nộp lại — quy trình này có thể kéo dài thời gian xử lý nếu hồ sơ ban đầu thiếu chính xác.",
      },
      {
        q: "Tôi có cần có mặt tại TP.HCM để thực hiện thủ tục không?",
        a: "Không bắt buộc nếu bạn sử dụng dịch vụ uỷ quyền — MAX OFFICE có thể đại diện thực hiện toàn bộ thủ tục dựa trên giấy tờ bạn cung cấp và văn bản uỷ quyền hợp lệ.",
      },
      {
        q: "Sau khi có giấy phép, bao lâu thì tôi có thể xuất hoá đơn?",
        a: "Ngay sau khi hoàn tất đăng ký sử dụng hoá đơn điện tử và được cơ quan thuế chấp nhận, doanh nghiệp có thể xuất hoá đơn. Nếu chọn gói dịch vụ có tích hợp sẵn hoá đơn điện tử, bước này được rút ngắn đáng kể.",
      },
      {
        q: "Quy trình này có áp dụng chung cho cả Hộ kinh doanh, TNHH và Cổ phần không?",
        a: "Về cơ bản 5 bước là giống nhau, chỉ khác nhau ở thành phần hồ sơ và cơ quan tiếp nhận (hộ kinh doanh đăng ký tại cơ quan cấp quận/huyện, doanh nghiệp đăng ký tại cơ quan đăng ký kinh doanh cấp tỉnh/thành phố). MAX OFFICE sẽ hướng dẫn cụ thể theo đúng loại hình bạn chọn.",
      },
    ],
    relatedLinks: [
      { label: "Xem quy trình dạng timeline trực quan", href: "/tien-ich/quy-trinh-thanh-lap-doanh-nghiep" },
      { label: "Checklist thành lập doanh nghiệp", href: "/tien-ich/checklist-thanh-lap-doanh-nghiep" },
      { label: "Dịch vụ thành lập doanh nghiệp MAX OFFICE", href: "/services/thanh-lap-doanh-nghiep" },
    ],
    cta: {
      title: "Để MAX OFFICE thực hiện toàn bộ quy trình cho bạn",
      description: "Từ soạn hồ sơ đến khi nhận giấy phép — chỉ 5-7 ngày làm việc, có người theo dõi tiến độ xuyên suốt.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/services/thanh-lap-doanh-nghiep",
      serviceLabel: "Xem dịch vụ thành lập doanh nghiệp",
    },
  },
  {
    slug: "von-dieu-le-la-gi",
    title: "Vốn điều lệ là gì? Có cần chứng minh vốn khi thành lập công ty không?",
    excerpt:
      "Vốn điều lệ là gì, có bắt buộc chứng minh số vốn khi đăng ký doanh nghiệp không, và điều gì xảy ra nếu góp vốn không đủ hoặc không đúng hạn.",
    categorySlug: "thanh-lap-doanh-nghiep",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Vốn Điều Lệ Là Gì? Có Cần Chứng Minh Vốn Khi Thành Lập Công Ty?",
    metaDescription:
      "Giải thích vốn điều lệ là gì, có cần chứng minh số dư ngân hàng khi đăng ký không, và thời hạn góp đủ vốn theo quy định pháp luật hiện hành.",
    heroImage: "/images/coworking.jpg",
    sections: [
      {
        id: "von-dieu-le-la-gi",
        heading: "Vốn điều lệ là gì?",
        paragraphs: [
          "Vốn điều lệ là tổng giá trị tài sản do các thành viên công ty TNHH, hoặc tổng mệnh giá cổ phần đã bán hoặc đã được đăng ký mua đối với công ty cổ phần, cam kết góp khi thành lập doanh nghiệp và được ghi trong Điều lệ công ty. Đây là con số thể hiện quy mô vốn ban đầu, đồng thời là cơ sở xác định trách nhiệm hữu hạn của các thành viên, cổ đông đối với các nghĩa vụ tài chính của công ty.",
        ],
      },
      {
        id: "co-can-chung-minh-von",
        heading: "Có cần chứng minh vốn khi đăng ký doanh nghiệp không?",
        paragraphs: [
          "Với đa số ngành nghề kinh doanh thông thường, pháp luật hiện hành không yêu cầu doanh nghiệp phải chứng minh số vốn thực có (ví dụ xác nhận số dư tài khoản ngân hàng) tại thời điểm đăng ký. Bạn chỉ cần kê khai mức vốn điều lệ dự kiến và cam kết góp đủ trong thời hạn quy định.",
          "Tuy nhiên, một số ngành nghề kinh doanh có điều kiện về vốn pháp định (mức vốn tối thiểu bắt buộc để được phép hoạt động) như kinh doanh bất động sản, dịch vụ bảo hiểm, hoạt động ngân hàng, chứng khoán... sẽ có yêu cầu riêng và có thể cần chứng minh hoặc xác nhận vốn theo quy định của pháp luật chuyên ngành. Vì danh mục và mức vốn pháp định có thể thay đổi theo từng thời kỳ, hãy liên hệ MAX OFFICE để được tư vấn chính xác nếu ngành nghề bạn đăng ký thuộc nhóm có điều kiện.",
        ],
      },
      {
        id: "thoi-han-gop-von",
        heading: "Thời hạn góp đủ vốn điều lệ",
        paragraphs: [
          "Theo Luật Doanh nghiệp hiện hành, các thành viên, cổ đông phải góp đủ phần vốn đã cam kết trong thời hạn 90 ngày kể từ ngày được cấp Giấy chứng nhận đăng ký doanh nghiệp, trừ trường hợp Điều lệ công ty hoặc hợp đồng đăng ký mua cổ phần quy định thời hạn ngắn hơn. Nếu sau thời hạn này mà chưa góp đủ, doanh nghiệp phải đăng ký điều chỉnh vốn điều lệ tương ứng với số vốn đã góp thực tế.",
        ],
      },
      {
        id: "nen-dang-ky-von-bao-nhieu",
        heading: "Nên đăng ký vốn điều lệ bao nhiêu?",
        paragraphs: [
          "Vì không có mức tối thiểu bắt buộc với đa số ngành nghề, nhiều doanh nghiệp mới thành lập băn khoăn nên đăng ký bao nhiêu là hợp lý. Một số yếu tố nên cân nhắc:",
        ],
        bullets: [
          "Vốn điều lệ thể hiện năng lực tài chính với đối tác, khách hàng, ngân hàng khi vay vốn",
          "Vốn điều lệ quá thấp có thể ảnh hưởng đến uy tín khi tham gia đấu thầu hoặc hợp tác dự án lớn",
          "Vốn điều lệ quá cao nhưng không có khả năng góp đủ trong 90 ngày sẽ phát sinh thủ tục điều chỉnh giảm, gây bất tiện",
          "Nên đăng ký mức vốn phù hợp với quy mô hoạt động thực tế và khả năng góp vốn của các thành viên",
        ],
      },
      {
        id: "tang-giam-von-sau-nay",
        heading: "Có thể thay đổi vốn điều lệ sau khi thành lập không?",
        paragraphs: [
          "Có. Doanh nghiệp hoàn toàn có thể tăng hoặc giảm vốn điều lệ trong quá trình hoạt động thông qua thủ tục đăng ký thay đổi nội dung đăng ký doanh nghiệp. Đây là một trong các dịch vụ pháp lý sửa đổi MAX OFFICE hỗ trợ khi doanh nghiệp có nhu cầu điều chỉnh.",
        ],
      },
    ],
    faqs: [
      {
        q: "Vốn điều lệ có phải là số tiền phải nộp vào ngân sách nhà nước không?",
        a: "Không. Vốn điều lệ là vốn do chính các thành viên, cổ đông góp vào công ty để phục vụ hoạt động kinh doanh, không phải khoản nộp cho nhà nước.",
      },
      {
        q: "Không góp đủ vốn điều lệ đúng hạn thì bị phạt không?",
        a: "Doanh nghiệp cần đăng ký điều chỉnh vốn điều lệ về đúng số vốn đã góp thực tế trong thời hạn quy định. Việc chậm trễ hoặc không thực hiện điều chỉnh có thể phát sinh rủi ro pháp lý — liên hệ MAX OFFICE để được tư vấn xử lý đúng quy định.",
      },
      {
        q: "Vốn điều lệ có liên quan đến lệ phí môn bài không?",
        a: "Trước đây mức lệ phí môn bài từng được tính dựa trên vốn điều lệ, nhưng theo quy định mới nhất, lệ phí môn bài đã chính thức bãi bỏ từ 01/01/2026 — xem chi tiết tại bài viết về bãi bỏ lệ phí môn bài.",
      },
      {
        q: "Công ty một thành viên có bắt buộc phải có vốn điều lệ không?",
        a: "Có, mọi loại hình doanh nghiệp (kể cả Công ty TNHH một thành viên) đều phải đăng ký vốn điều lệ khi thành lập.",
      },
      {
        q: "Tôi nên hỏi ai để xác định ngành nghề của mình có yêu cầu vốn pháp định không?",
        a: "Hãy liên hệ MAX OFFICE — đội ngũ tư vấn sẽ kiểm tra ngành nghề dự kiến đăng ký của bạn và thông báo nếu có yêu cầu vốn pháp định hoặc điều kiện đặc biệt nào cần lưu ý.",
      },
    ],
    relatedLinks: [
      { label: "Hồ sơ thành lập Công ty TNHH cần chuẩn bị gì", href: "/blog/ho-so-thanh-lap-cong-ty-tnhh" },
      { label: "Công cụ tính chi phí thành lập doanh nghiệp", href: "/tien-ich/tinh-chi-phi-thanh-lap" },
      { label: "Dịch vụ pháp lý sửa đổi (thay đổi vốn điều lệ)", href: "/dich-vu/dich-vu-phap-ly-sua-doi" },
    ],
    cta: {
      title: "Cần tư vấn mức vốn điều lệ phù hợp?",
      description: "Để lại thông tin, MAX OFFICE tư vấn miễn phí mức vốn điều lệ phù hợp với ngành nghề và quy mô của bạn.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/services/thanh-lap-doanh-nghiep",
      serviceLabel: "Xem dịch vụ thành lập doanh nghiệp",
    },
  },

  // ===================== KẾ TOÁN & THUẾ =====================
  {
    slug: "cac-loai-thue-doanh-nghiep-moi-thanh-lap",
    title: "Các loại thuế doanh nghiệp mới thành lập phải nộp",
    excerpt:
      "Tổng hợp đầy đủ các loại thuế mà doanh nghiệp mới thành lập cần nắm rõ để kê khai đúng hạn, tránh bị phạt do thiếu sót.",
    categorySlug: "ke-toan-thue",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 7,
    metaTitle: "Các Loại Thuế Doanh Nghiệp Mới Thành Lập Phải Nộp (2026)",
    metaDescription:
      "Tổng hợp các loại thuế doanh nghiệp mới thành lập cần nắm rõ: thuế GTGT, thuế TNDN, thuế TNCN và các nghĩa vụ thuế khác theo quy định hiện hành.",
    heroImage: "/images/ke-toan-thue.jpg",
    sections: [
      {
        id: "tong-quan-nghia-vu-thue",
        heading: "Doanh nghiệp mới thành lập cần quan tâm những loại thuế nào",
        paragraphs: [
          "Ngay sau khi có mã số thuế (đồng thời là mã số doanh nghiệp), doanh nghiệp đã phát sinh nghĩa vụ kê khai thuế, kể cả khi chưa có doanh thu. Nhiều doanh nghiệp mới thành lập bỏ sót giai đoạn này vì nghĩ \"chưa kinh doanh thì chưa cần khai\", dẫn đến bị nhắc nhở hoặc xử phạt vi phạm hành chính không đáng có. Dưới đây là các loại thuế, nghĩa vụ phổ biến nhất doanh nghiệp cần nắm rõ.",
        ],
      },
      {
        id: "thue-gtgt",
        heading: "Thuế giá trị gia tăng (GTGT)",
        paragraphs: [
          "Thuế GTGT là thuế gián thu tính trên giá trị tăng thêm của hàng hoá, dịch vụ phát sinh trong quá trình sản xuất, lưu thông đến tiêu dùng. Doanh nghiệp kê khai theo tháng hoặc theo quý (tuỳ quy mô doanh thu và thời gian hoạt động), nộp thuế dựa trên chênh lệch giữa thuế GTGT đầu ra và thuế GTGT đầu vào được khấu trừ.",
        ],
      },
      {
        id: "thue-tndn",
        heading: "Thuế thu nhập doanh nghiệp (TNDN)",
        paragraphs: [
          "Thuế TNDN tính trên thu nhập chịu thuế của doanh nghiệp sau khi trừ các khoản chi phí hợp lý, hợp lệ. Doanh nghiệp tạm nộp theo quý và quyết toán vào cuối năm tài chính. Mức thuế suất phổ thông hiện hành là 20%, một số ngành nghề hoặc doanh nghiệp thuộc diện ưu đãi đầu tư có thể áp dụng mức thuế suất khác — liên hệ MAX OFFICE để được tư vấn nếu doanh nghiệp bạn thuộc diện ưu đãi.",
        ],
      },
      {
        id: "thue-tncn",
        heading: "Thuế thu nhập cá nhân (TNCN) khấu trừ tại nguồn",
        paragraphs: [
          "Ngay khi doanh nghiệp trả lương, thù lao cho người lao động hoặc cá nhân cung cấp dịch vụ, doanh nghiệp có trách nhiệm khấu trừ thuế TNCN (nếu thu nhập đến mức chịu thuế) trước khi chi trả, sau đó kê khai và nộp thay cho người lao động theo kỳ quy định.",
        ],
      },
      {
        id: "cac-nghia-vu-khac",
        heading: "Các nghĩa vụ thuế, phí khác tuỳ ngành nghề",
        paragraphs: [
          "Ngoài ba loại thuế phổ biến trên, tuỳ ngành nghề kinh doanh cụ thể, doanh nghiệp có thể còn phát sinh:",
        ],
        bullets: [
          "Thuế xuất khẩu, thuế nhập khẩu (doanh nghiệp có hoạt động xuất nhập khẩu)",
          "Thuế tiêu thụ đặc biệt (ngành nghề kinh doanh hàng hoá, dịch vụ đặc thù)",
          "Thuế tài nguyên, thuế bảo vệ môi trường (doanh nghiệp khai thác tài nguyên hoặc có phát sinh liên quan)",
          "Các loại phí, lệ phí chuyên ngành khác theo lĩnh vực hoạt động",
        ],
      },
      {
        id: "khai-thue-ban-dau",
        heading: "Thủ tục khai thuế ban đầu khi mới thành lập",
        paragraphs: [
          "Trước đây, lệ phí môn bài cũng là một khoản doanh nghiệp mới thành lập bắt buộc phải nộp hằng năm, nhưng theo quy định mới nhất, khoản này đã chính thức bãi bỏ — xem chi tiết tại bài viết riêng về nội dung này.",
          "Sau khi nhận Giấy chứng nhận đăng ký doanh nghiệp, doanh nghiệp cần thực hiện hồ sơ khai thuế ban đầu với cơ quan thuế quản lý trực tiếp, đăng ký phương pháp tính thuế GTGT, đăng ký hình thức kế toán, đăng ký sử dụng hoá đơn điện tử... Vì thủ tục này đòi hỏi nhiều đầu việc chuyên môn, nhiều doanh nghiệp lựa chọn sử dụng dịch vụ kế toán thuế trọn gói ngay từ giai đoạn đầu để đảm bảo mọi thứ được thiết lập đúng chuẩn.",
        ],
      },
    ],
    faqs: [
      {
        q: "Doanh nghiệp chưa có doanh thu có phải kê khai thuế không?",
        a: "Có. Doanh nghiệp vẫn phải kê khai theo kỳ quy định dù chưa phát sinh doanh thu (thường gọi là kê khai \"không phát sinh\"), việc bỏ sót kê khai có thể bị xử phạt.",
      },
      {
        q: "Thuế suất thuế TNDN hiện nay là bao nhiêu?",
        a: "Mức phổ thông hiện hành là 20% trên thu nhập chịu thuế; một số trường hợp ưu đãi đầu tư áp dụng mức khác. Liên hệ MAX OFFICE để được xác định chính xác theo ngành nghề, quy mô doanh nghiệp của bạn.",
      },
      {
        q: "Kê khai thuế GTGT theo tháng hay theo quý?",
        a: "Tuỳ tiêu chí về doanh thu và thời gian hoạt động theo quy định hiện hành, doanh nghiệp mới thành lập thường được kê khai theo quý trong giai đoạn đầu. MAX OFFICE sẽ xác định kỳ kê khai phù hợp cho doanh nghiệp bạn.",
      },
      {
        q: "Nếu chậm nộp tờ khai thuế thì bị phạt thế nào?",
        a: "Mức phạt tuỳ theo số ngày chậm nộp và quy định xử phạt vi phạm hành chính về thuế hiện hành. Để tránh rủi ro này, doanh nghiệp nên có kế toán theo dõi sát các mốc thời hạn kê khai.",
      },
      {
        q: "Tôi nên tự kê khai thuế hay thuê dịch vụ kế toán?",
        a: "Với doanh nghiệp mới, chưa có bộ phận kế toán chuyên trách, sử dụng dịch vụ kế toán thuế trọn gói giúp đảm bảo kê khai đúng hạn, đúng luật ngay từ đầu — xem thêm bài viết so sánh kế toán thuê ngoài và kế toán nội bộ.",
      },
    ],
    relatedLinks: [
      { label: "Lệ phí môn bài đã chính thức bãi bỏ từ 2026", href: "/blog/bai-bo-le-phi-mon-bai-2026" },
      { label: "Kế toán thuê ngoài hay nội bộ — nên chọn phương án nào", href: "/blog/ke-toan-thue-ngoai-hay-noi-bo" },
      { label: "Dịch vụ kế toán & thuế MAX OFFICE", href: "/services/ke-toan-thue" },
    ],
    cta: {
      title: "Đừng để sai sót thuế ảnh hưởng đến doanh nghiệp mới",
      description: "MAX OFFICE giúp bạn kê khai đúng hạn, đúng luật ngay từ ngày đầu thành lập.",
      service: "Kế toán & thuế",
      serviceHref: "/services/ke-toan-thue",
      serviceLabel: "Xem dịch vụ kế toán & thuế",
    },
  },
  {
    slug: "bai-bo-le-phi-mon-bai-2026",
    title: "Lệ phí môn bài đã chính thức bãi bỏ — cập nhật quy định mới nhất 2026",
    excerpt:
      "Từ 01/01/2026, lệ phí môn bài chính thức bãi bỏ theo Nghị quyết 198/2025/QH15 — áp dụng cho mọi loại hình doanh nghiệp, hộ kinh doanh, không cần nộp tờ khai.",
    categorySlug: "ke-toan-thue",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Lệ Phí Môn Bài Đã Bãi Bỏ Từ 2026 — Cập Nhật Nghị Quyết 198/2025/QH15",
    metaDescription:
      "Từ 01/01/2026, lệ phí môn bài chính thức bãi bỏ theo Nghị quyết 198/2025/QH15, áp dụng cho mọi loại hình doanh nghiệp và hộ kinh doanh. Cập nhật chi tiết.",
    heroImage: "/images/dich-vu-ke-toan-thue.jpg",
    sections: [
      {
        id: "thong-tin-chinh-thuc",
        heading: "Thông tin chính thức: Lệ phí môn bài đã bị bãi bỏ",
        paragraphs: [
          "Theo Nghị quyết 198/2025/QH15, lệ phí môn bài chính thức bị bãi bỏ kể từ ngày 01/01/2026. Đây là thay đổi quan trọng áp dụng cho tất cả loại hình doanh nghiệp (Công ty TNHH, Công ty Cổ phần, doanh nghiệp tư nhân), hợp tác xã, hộ kinh doanh và cá nhân kinh doanh trên cả nước — không phân biệt thời điểm thành lập trước hay sau ngày quy định có hiệu lực.",
          "Kể từ mốc thời gian này, doanh nghiệp và hộ kinh doanh không còn phải nộp tờ khai lệ phí môn bài hằng năm như trước đây.",
        ],
      },
      {
        id: "le-phi-mon-bai-la-gi",
        heading: "Lệ phí môn bài trước đây là gì",
        paragraphs: [
          "Trước khi bị bãi bỏ, lệ phí môn bài là khoản thu bắt buộc hằng năm đối với tổ chức, cá nhân hoạt động sản xuất, kinh doanh, mức thu được xác định dựa trên vốn điều lệ (đối với doanh nghiệp) hoặc doanh thu (đối với hộ kinh doanh). Doanh nghiệp, hộ kinh doanh phải nộp tờ khai và nộp lệ phí theo mốc thời gian quy định trong năm, hoặc ngay khi mới thành lập — đây từng là một trong những thủ tục hành chính đầu tiên mà mọi doanh nghiệp mới đều phải thực hiện song song với khai thuế ban đầu.",
        ],
      },
      {
        id: "ai-duoc-ap-dung",
        heading: "Đối tượng áp dụng quy định bãi bỏ",
        paragraphs: ["Quy định bãi bỏ lệ phí môn bài áp dụng rộng rãi cho:"],
        bullets: [
          "Doanh nghiệp thuộc mọi loại hình: Công ty TNHH, Công ty Cổ phần, doanh nghiệp tư nhân",
          "Hợp tác xã, liên hiệp hợp tác xã",
          "Hộ kinh doanh và cá nhân kinh doanh",
          "Áp dụng không phân biệt doanh nghiệp, hộ kinh doanh thành lập trước hay sau ngày 01/01/2026",
        ],
      },
      {
        id: "khong-can-nop-to-khai",
        heading: "Không cần nộp tờ khai lệ phí môn bài",
        paragraphs: [
          "Một điểm quan trọng cần lưu ý: từ 01/01/2026, doanh nghiệp và hộ kinh doanh không còn nghĩa vụ nộp tờ khai lệ phí môn bài — nghĩa là không chỉ được miễn khoản tiền phải nộp mà cả thủ tục kê khai hành chính liên quan cũng được bãi bỏ hoàn toàn, giúp giảm bớt gánh nặng thủ tục cho doanh nghiệp, đặc biệt là doanh nghiệp mới thành lập vốn đã có nhiều đầu việc pháp lý cần xử lý trong giai đoạn đầu.",
        ],
      },
      {
        id: "cac-nghia-vu-thue-khac-van-con",
        heading: "Các nghĩa vụ thuế khác vẫn phải thực hiện đầy đủ",
        paragraphs: [
          "Việc bãi bỏ lệ phí môn bài không đồng nghĩa với việc doanh nghiệp được miễn toàn bộ nghĩa vụ thuế. Các loại thuế khác như thuế GTGT, thuế TNDN, thuế TNCN... vẫn phải được kê khai, nộp đầy đủ và đúng hạn theo quy định hiện hành. Doanh nghiệp nên xem đây là một điểm thuận lợi giúp giảm bớt một đầu việc hành chính, chứ không phải lý do để chủ quan với các nghĩa vụ thuế còn lại.",
        ],
      },
      {
        id: "y-nghia-voi-doanh-nghiep-moi",
        heading: "Ý nghĩa với doanh nghiệp, hộ kinh doanh mới thành lập",
        paragraphs: [
          "Với doanh nghiệp và hộ kinh doanh mới thành lập từ 2026 trở đi, đây là một tin tích cực: bớt đi một khoản chi phí cố định và một thủ tục kê khai trong giai đoạn đầu vốn đã có nhiều đầu việc hành chính cần xử lý. Tuy nhiên, doanh nghiệp vẫn cần thực hiện đầy đủ thủ tục khai thuế ban đầu và các nghĩa vụ thuế định kỳ khác ngay từ khi mới thành lập, để tránh việc chủ quan dẫn đến bỏ sót các nghĩa vụ thuế còn hiệu lực.",
        ],
      },
    ],
    faqs: [
      {
        q: "Lệ phí môn bài đã bị bãi bỏ chưa?",
        a: "Đã bãi bỏ. Từ ngày 01/01/2026, lệ phí môn bài chính thức bị bãi bỏ theo Nghị quyết 198/2025/QH15.",
      },
      {
        q: "Quy định này áp dụng cho những đối tượng nào?",
        a: "Áp dụng cho mọi loại hình doanh nghiệp (TNHH, Cổ phần, tư nhân), hợp tác xã, hộ kinh doanh và cá nhân kinh doanh trên cả nước.",
      },
      {
        q: "Doanh nghiệp có cần nộp tờ khai lệ phí môn bài nữa không?",
        a: "Không. Từ 01/01/2026, doanh nghiệp và hộ kinh doanh không còn phải nộp tờ khai lệ phí môn bài.",
      },
      {
        q: "Doanh nghiệp thành lập trước năm 2026 có được áp dụng không?",
        a: "Có. Quy định bãi bỏ áp dụng cho tất cả doanh nghiệp, hộ kinh doanh đang hoạt động, không phân biệt thời điểm thành lập.",
      },
      {
        q: "Vậy doanh nghiệp còn phải nộp những loại thuế, phí nào?",
        a: "Doanh nghiệp vẫn phải thực hiện đầy đủ các nghĩa vụ thuế khác như thuế GTGT, thuế TNDN, thuế TNCN... Xem chi tiết tại bài viết Các loại thuế doanh nghiệp mới thành lập phải nộp, hoặc liên hệ MAX OFFICE để được tư vấn cụ thể theo tình huống doanh nghiệp bạn.",
      },
    ],
    relatedLinks: [
      { label: "Công cụ tra cứu lệ phí môn bài", href: "/tien-ich/tinh-le-phi-mon-bai" },
      { label: "Các loại thuế doanh nghiệp mới thành lập phải nộp", href: "/blog/cac-loai-thue-doanh-nghiep-moi-thanh-lap" },
      { label: "Dịch vụ kế toán & thuế MAX OFFICE", href: "/services/ke-toan-thue" },
    ],
    cta: {
      title: "Cần tư vấn về các nghĩa vụ thuế hiện hành?",
      description: "Để lại thông tin, chuyên viên MAX OFFICE tư vấn miễn phí các nghĩa vụ thuế doanh nghiệp bạn cần nắm rõ.",
      service: "Kế toán & thuế",
      serviceHref: "/services/ke-toan-thue",
      serviceLabel: "Xem dịch vụ kế toán & thuế",
    },
  },
  {
    slug: "hoa-don-dien-tu-cho-doanh-nghiep-moi",
    title: "Hoá đơn điện tử: Doanh nghiệp mới thành lập có bắt buộc sử dụng ngay không?",
    excerpt:
      "Giải đáp doanh nghiệp mới thành lập có bắt buộc dùng hoá đơn điện tử ngay không, thủ tục đăng ký và những lưu ý quan trọng khi bắt đầu xuất hoá đơn.",
    categorySlug: "ke-toan-thue",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Hoá Đơn Điện Tử: Doanh Nghiệp Mới Thành Lập Có Bắt Buộc Dùng Ngay?",
    metaDescription:
      "Doanh nghiệp mới thành lập có bắt buộc sử dụng hoá đơn điện tử ngay không, đăng ký ở đâu và cần lưu ý gì — giải đáp theo quy định pháp luật hiện hành.",
    heroImage: "/images/ke-toan-thue.jpg",
    sections: [
      {
        id: "hoa-don-dien-tu-la-gi",
        heading: "Hoá đơn điện tử là gì",
        paragraphs: [
          "Hoá đơn điện tử là hoá đơn có mã hoặc không có mã của cơ quan thuế, được thể hiện ở dạng dữ liệu điện tử, do tổ chức, cá nhân bán hàng hoá, cung cấp dịch vụ lập để ghi nhận thông tin bán hàng hoá, cung cấp dịch vụ theo quy định pháp luật về kế toán, thuế. Theo quy định hiện hành, hoá đơn giấy truyền thống về cơ bản không còn được sử dụng, hoá đơn điện tử là hình thức bắt buộc áp dụng thống nhất trên cả nước.",
        ],
      },
      {
        id: "doanh-nghiep-moi-co-bat-buoc-khong",
        heading: "Doanh nghiệp mới thành lập có bắt buộc dùng ngay không",
        paragraphs: [
          "Có. Ngay khi doanh nghiệp mới thành lập bắt đầu phát sinh hoạt động bán hàng hoá, cung cấp dịch vụ, doanh nghiệp bắt buộc phải sử dụng hoá đơn điện tử — không có giai đoạn \"chuyển tiếp\" hay \"miễn trừ\" cho doanh nghiệp mới như một số người vẫn nghĩ. Việc đăng ký sử dụng hoá đơn điện tử nên được thực hiện song song với thủ tục khai thuế ban đầu, để doanh nghiệp có thể xuất hoá đơn ngay khi phát sinh giao dịch đầu tiên.",
        ],
      },
      {
        id: "thu-tuc-dang-ky",
        heading: "Thủ tục đăng ký sử dụng hoá đơn điện tử",
        paragraphs: [
          "Doanh nghiệp thực hiện đăng ký sử dụng hoá đơn điện tử với cơ quan thuế quản lý trực tiếp, thông qua tổ chức cung cấp giải pháp hoá đơn điện tử hoặc qua cổng thông tin điện tử của cơ quan thuế. Sau khi được cơ quan thuế chấp nhận đăng ký, doanh nghiệp cần thực hiện thông báo phát hành hoá đơn (đối với các trường hợp áp dụng) trước khi chính thức xuất hoá đơn cho khách hàng.",
        ],
        bullets: [
          "Chuẩn bị chữ ký số hợp lệ (bắt buộc để ký hoá đơn điện tử)",
          "Lựa chọn đơn vị cung cấp giải pháp hoá đơn điện tử được công nhận",
          "Thực hiện đăng ký, chờ cơ quan thuế xác nhận chấp nhận",
          "Thông báo phát hành hoá đơn (nếu thuộc diện áp dụng) trước khi sử dụng chính thức",
        ],
      },
      {
        id: "hoa-don-co-ma-khong-ma",
        heading: "Hoá đơn điện tử có mã và không có mã của cơ quan thuế",
        paragraphs: [
          "Có hai loại hoá đơn điện tử: hoá đơn điện tử có mã của cơ quan thuế (được cấp mã xác thực trước khi gửi cho người mua) và hoá đơn điện tử không có mã (áp dụng cho một số doanh nghiệp đủ điều kiện theo quy định, tự chịu trách nhiệm về tính chính xác). Phần lớn doanh nghiệp mới thành lập, quy mô vừa và nhỏ sẽ thuộc diện sử dụng hoá đơn điện tử có mã của cơ quan thuế.",
        ],
      },
      {
        id: "rui-ro-neu-cham-dang-ky",
        heading: "Rủi ro nếu chậm đăng ký hoặc xuất hoá đơn không đúng quy định",
        paragraphs: [
          "Việc chậm đăng ký sử dụng hoá đơn điện tử, hoặc xuất hoá đơn không đúng quy định (sai thông tin, không đúng thời điểm lập hoá đơn...) có thể khiến doanh nghiệp bị xử phạt vi phạm hành chính về hoá đơn, đồng thời ảnh hưởng đến việc kê khai thuế GTGT đầu ra, đầu vào của cả doanh nghiệp và đối tác giao dịch. Vì mức xử phạt cụ thể và các trường hợp ngoại lệ có thể thay đổi theo quy định từng thời kỳ, hãy liên hệ MAX OFFICE để được tư vấn chính xác cho tình huống của doanh nghiệp bạn.",
        ],
      },
      {
        id: "giai-phap-cho-doanh-nghiep-moi",
        heading: "Giải pháp cho doanh nghiệp mới thành lập",
        paragraphs: [
          "Để tránh chậm trễ trong việc xuất hoá đơn ngay từ những giao dịch đầu tiên, nhiều doanh nghiệp mới lựa chọn đăng ký hoá đơn điện tử ngay trong gói dịch vụ thành lập doanh nghiệp hoặc gói kế toán thuế trọn gói — bao gồm chữ ký số, một số lượng hoá đơn điện tử ban đầu và hỗ trợ thông báo phát hành hoá đơn, giúp doanh nghiệp sẵn sàng hoạt động ngay khi có giấy phép.",
        ],
      },
    ],
    faqs: [
      {
        q: "Doanh nghiệp mới thành lập có được dùng hoá đơn giấy tạm thời không?",
        a: "Không. Hoá đơn điện tử là hình thức bắt buộc áp dụng thống nhất, doanh nghiệp mới thành lập không có giai đoạn sử dụng hoá đơn giấy tạm thời.",
      },
      {
        q: "Chưa có chữ ký số thì có xuất được hoá đơn điện tử không?",
        a: "Không. Chữ ký số là điều kiện bắt buộc để ký và phát hành hoá đơn điện tử hợp lệ — doanh nghiệp cần đăng ký chữ ký số trước hoặc cùng lúc với thủ tục hoá đơn điện tử.",
      },
      {
        q: "Mua bao nhiêu hoá đơn điện tử là đủ cho doanh nghiệp mới?",
        a: "Tuỳ tần suất giao dịch dự kiến; doanh nghiệp có thể mua bổ sung khi dùng gần hết. MAX OFFICE có thể tư vấn số lượng phù hợp dựa trên kế hoạch kinh doanh của bạn.",
      },
      {
        q: "Hoá đơn điện tử có cần in ra giấy để lưu trữ không?",
        a: "Không bắt buộc phải in giấy, hoá đơn điện tử được lưu trữ dưới dạng dữ liệu điện tử theo đúng quy định về lưu trữ chứng từ kế toán.",
      },
      {
        q: "Tôi nên tự đăng ký hoá đơn điện tử hay nhờ dịch vụ hỗ trợ?",
        a: "Với doanh nghiệp mới, sử dụng dịch vụ kế toán thuế hoặc gói thành lập doanh nghiệp trọn gói có tích hợp sẵn hoá đơn điện tử sẽ giúp bạn tiết kiệm thời gian và đảm bảo đăng ký đúng quy trình ngay từ đầu.",
      },
    ],
    relatedLinks: [
      { label: "Các loại thuế doanh nghiệp mới thành lập phải nộp", href: "/blog/cac-loai-thue-doanh-nghiep-moi-thanh-lap" },
      { label: "Dịch vụ thành lập doanh nghiệp (Gói 2 gồm hoá đơn điện tử)", href: "/services/thanh-lap-doanh-nghiep" },
      { label: "Dịch vụ kế toán & thuế MAX OFFICE", href: "/services/ke-toan-thue" },
    ],
    cta: {
      title: "Cần đăng ký hoá đơn điện tử nhanh chóng, đúng quy trình?",
      description: "MAX OFFICE hỗ trợ đăng ký chữ ký số và hoá đơn điện tử trọn gói, sẵn sàng xuất hoá đơn ngay khi có giấy phép.",
      service: "Kế toán & thuế",
      serviceHref: "/services/ke-toan-thue",
      serviceLabel: "Xem dịch vụ kế toán & thuế",
    },
  },
  {
    slug: "ke-toan-thue-ngoai-hay-noi-bo",
    title: "Kế toán thuê ngoài hay kế toán nội bộ: Startup nên chọn phương án nào?",
    excerpt:
      "So sánh chi phí, rủi ro và sự linh hoạt giữa kế toán thuê ngoài và kế toán nội bộ — giúp startup chọn đúng phương án ngay từ giai đoạn đầu.",
    categorySlug: "ke-toan-thue",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-10",
    readingTime: 6,
    metaTitle: "Kế Toán Thuê Ngoài Hay Nội Bộ? Startup Nên Chọn Phương Án Nào",
    metaDescription:
      "So sánh kế toán thuê ngoài và kế toán nội bộ về chi phí, rủi ro và sự linh hoạt — giúp startup, doanh nghiệp mới thành lập chọn đúng phương án.",
    heroImage: "/images/dich-vu-ke-toan-thue.jpg",
    sections: [
      {
        id: "hai-phuong-an-pho-bien",
        heading: "Hai phương án phổ biến cho doanh nghiệp mới",
        paragraphs: [
          "Khi doanh nghiệp bắt đầu hoạt động, một trong những quyết định vận hành đầu tiên là xử lý nghiệp vụ kế toán, thuế như thế nào — tuyển kế toán nội bộ toàn thời gian, hay sử dụng dịch vụ kế toán thuê ngoài (outsourcing). Mỗi phương án có ưu, nhược điểm riêng, phù hợp với từng giai đoạn và quy mô khác nhau.",
        ],
      },
      {
        id: "ke-toan-noi-bo",
        heading: "Kế toán nội bộ: kiểm soát trực tiếp nhưng tốn chi phí cố định",
        paragraphs: [
          "Kế toán nội bộ là nhân sự làm việc toàn thời gian tại doanh nghiệp, trực tiếp xử lý sổ sách, chứng từ hằng ngày.",
        ],
        bullets: [
          "Ưu điểm: có mặt trực tiếp, xử lý công việc phát sinh nhanh, hiểu sâu tình hình nội bộ doanh nghiệp",
          "Nhược điểm: chi phí lương, bảo hiểm, phúc lợi cố định hằng tháng dù khối lượng công việc nhiều hay ít",
          "Nhược điểm: với startup, khối lượng chứng từ ban đầu thường chưa đủ để tận dụng hết một vị trí toàn thời gian",
          "Nhược điểm: rủi ro phụ thuộc vào năng lực và sự cập nhật quy định pháp luật của một cá nhân",
        ],
      },
      {
        id: "ke-toan-thue-ngoai",
        heading: "Kế toán thuê ngoài: linh hoạt, tối ưu chi phí giai đoạn đầu",
        paragraphs: [
          "Kế toán thuê ngoài là hình thức doanh nghiệp ký hợp đồng dịch vụ với đơn vị cung cấp dịch vụ kế toán chuyên nghiệp, xử lý toàn bộ hoặc một phần nghiệp vụ kế toán, thuế theo tháng.",
        ],
        bullets: [
          "Ưu điểm: chi phí tính theo khối lượng chứng từ thực tế phát sinh, phù hợp doanh nghiệp mới chưa có nhiều giao dịch",
          "Ưu điểm: được đội ngũ chuyên môn, cập nhật quy định pháp luật mới nhất phụ trách, giảm rủi ro sai sót",
          "Ưu điểm: không tốn chi phí tuyển dụng, đào tạo, quản lý nhân sự kế toán",
          "Nhược điểm: cần phối hợp cung cấp chứng từ, thông tin đúng hạn để đơn vị dịch vụ xử lý kịp thời",
        ],
      },
      {
        id: "bang-so-sanh-chi-phi",
        heading: "So sánh chi phí thực tế giữa hai phương án",
        paragraphs: [
          "Với một doanh nghiệp mới thành lập, chưa phát sinh nhiều hoá đơn, chi phí kế toán thuê ngoài thường thấp hơn đáng kể so với việc trả lương toàn thời gian cho một kế toán viên. Dịch vụ kế toán thuê ngoài tại MAX OFFICE có mức phí từ 500.000đ/tháng cho doanh nghiệp chưa phát sinh hoá đơn, tăng dần theo số lượng hoá đơn, chứng từ thực tế mỗi quý — trong khi mức lương thị trường cho một kế toán nội bộ toàn thời gian thường cao hơn đáng kể mức này, chưa kể chi phí bảo hiểm và các phúc lợi đi kèm.",
        ],
      },
      {
        id: "khi-nao-nen-chuyen-sang-noi-bo",
        heading: "Khi nào startup nên cân nhắc kế toán nội bộ",
        paragraphs: [
          "Kế toán thuê ngoài phù hợp với đa số doanh nghiệp trong giai đoạn đầu và cả giai đoạn tăng trưởng vừa phải. Khi quy mô giao dịch tăng lên đáng kể, có nhiều nghiệp vụ phát sinh hằng ngày cần xử lý tức thời, hoặc doanh nghiệp cần một người trực tiếp tham gia vào các quyết định tài chính nội bộ, đó là lúc nên cân nhắc xây dựng bộ phận kế toán nội bộ — có thể kết hợp song song với dịch vụ thuê ngoài cho các phần việc chuyên sâu như quyết toán thuế cuối năm.",
        ],
      },
      {
        id: "goi-y-cho-startup",
        heading: "Gợi ý cho startup và doanh nghiệp mới thành lập",
        paragraphs: [
          "Với phần lớn startup và doanh nghiệp mới thành lập tại TP.HCM, kế toán thuê ngoài là lựa chọn hợp lý để tối ưu chi phí trong giai đoạn đầu vẫn còn nhiều biến động về doanh thu, đồng thời đảm bảo tuân thủ đúng quy định pháp luật nhờ đội ngũ chuyên môn luôn cập nhật thay đổi mới nhất.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kế toán thuê ngoài có đảm bảo bảo mật thông tin doanh nghiệp không?",
        a: "Các đơn vị cung cấp dịch vụ kế toán chuyên nghiệp đều có cam kết bảo mật thông tin khách hàng trong hợp đồng dịch vụ — bạn nên kiểm tra điều khoản bảo mật trước khi ký hợp đồng.",
      },
      {
        q: "Chi phí kế toán thuê ngoài tính như thế nào?",
        a: "Thường tính theo số lượng hoá đơn, chứng từ phát sinh mỗi quý và loại hình kinh doanh (thương mại, dịch vụ, sản xuất...). Xem chi tiết bảng giá kế toán & thuế của MAX OFFICE.",
      },
      {
        q: "Doanh nghiệp có thể chuyển từ kế toán nội bộ sang thuê ngoài không?",
        a: "Hoàn toàn có thể. Nhiều doanh nghiệp chuyển đổi phương án khi nhận thấy chi phí nội bộ không còn tối ưu — liên hệ MAX OFFICE để được tư vấn lộ trình chuyển đổi phù hợp.",
      },
      {
        q: "Kế toán thuê ngoài có xử lý được quyết toán thuế cuối năm không?",
        a: "Có, dịch vụ kế toán thuê ngoài trọn gói bao gồm lập báo cáo tài chính và hỗ trợ quyết toán thuế cuối năm theo đúng quy định.",
      },
      {
        q: "Startup rất ít giao dịch có cần thuê dịch vụ kế toán không?",
        a: "Có. Ngay cả khi chưa phát sinh hoá đơn, doanh nghiệp vẫn có nghĩa vụ kê khai thuế định kỳ — dịch vụ kế toán thuê ngoài giúp đảm bảo không bỏ sót kỳ kê khai nào dù doanh thu chưa nhiều.",
      },
    ],
    relatedLinks: [
      { label: "Các loại thuế doanh nghiệp mới thành lập phải nộp", href: "/blog/cac-loai-thue-doanh-nghiep-moi-thanh-lap" },
      { label: "Bảng giá kế toán & thuế MAX OFFICE", href: "/bang-gia" },
      { label: "Dịch vụ kế toán & thuế MAX OFFICE", href: "/services/ke-toan-thue" },
    ],
    cta: {
      title: "Tối ưu chi phí kế toán ngay từ ngày đầu",
      description: "Để lại thông tin, MAX OFFICE tư vấn miễn phí phương án kế toán phù hợp với quy mô doanh nghiệp bạn.",
      service: "Kế toán & thuế",
      serviceHref: "/services/ke-toan-thue",
      serviceLabel: "Xem dịch vụ kế toán & thuế",
    },
  },

  // ===================== VĂN PHÒNG & ĐỊA ĐIỂM =====================
  {
    slug: "van-phong-ao-la-gi-co-hop-phap-khong",
    title: "Văn phòng ảo là gì? Có hợp pháp để đăng ký kinh doanh không?",
    excerpt:
      "Văn phòng ảo là gì, có hợp pháp để đăng ký kinh doanh và đăng ký thuế không — giải đáp đầy đủ cùng những lưu ý quan trọng khi lựa chọn.",
    categorySlug: "van-phong-dia-diem",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Văn Phòng Ảo Là Gì? Có Hợp Pháp Để Đăng Ký Kinh Doanh Không?",
    metaDescription:
      "Giải thích văn phòng ảo là gì, cơ sở pháp lý cho phép sử dụng địa chỉ văn phòng ảo để đăng ký kinh doanh, và những lưu ý quan trọng khi lựa chọn.",
    heroImage: "/images/van-phong-ao.jpg",
    sections: [
      {
        id: "van-phong-ao-la-gi",
        heading: "Văn phòng ảo là gì?",
        paragraphs: [
          "Văn phòng ảo (virtual office) là dịch vụ cung cấp cho doanh nghiệp một địa chỉ giao dịch, đăng ký kinh doanh hợp pháp tại một toà nhà văn phòng thực tế, mà không cần doanh nghiệp phải thuê và sử dụng không gian vật lý cố định tại đó. Doanh nghiệp sử dụng địa chỉ này để đăng ký kinh doanh, đăng ký thuế, nhận thư từ, hoá đơn, và có thể sử dụng thêm các dịch vụ đi kèm như lễ tân, phòng họp theo giờ khi cần tiếp khách hoặc đối tác.",
          "Đây là giải pháp phổ biến với doanh nghiệp mới thành lập, freelancer chuyển đổi lên mô hình công ty, hoặc doanh nghiệp muốn có địa chỉ tại khu vực trung tâm mà không phát sinh chi phí thuê văn phòng cố định.",
        ],
      },
      {
        id: "co-hop-phap-khong",
        heading: "Văn phòng ảo có hợp pháp để đăng ký kinh doanh không?",
        paragraphs: [
          "Có. Pháp luật doanh nghiệp hiện hành không cấm việc sử dụng địa chỉ văn phòng ảo (địa chỉ thuê theo hình thức dịch vụ) để đăng ký làm trụ sở chính, miễn là địa chỉ đó xác định rõ ràng, hợp pháp và không thuộc các khu vực bị hạn chế đặt trụ sở như một số loại hình chung cư chỉ có chức năng để ở. Điều kiện quan trọng nhất là đơn vị cho thuê văn phòng ảo phải có quyền sử dụng hợp pháp đối với địa chỉ đó, và địa chỉ phải có khả năng tiếp nhận công tác kiểm tra, xác minh trụ sở của cơ quan quản lý nhà nước khi cần.",
          "MAX OFFICE cung cấp địa chỉ văn phòng ảo tại các toà nhà văn phòng thực tế, có đầy đủ hồ sơ pháp lý chứng minh quyền sử dụng hợp pháp, đảm bảo doanh nghiệp đăng ký kinh doanh và đăng ký thuế thuận lợi ngay từ đầu.",
        ],
      },
      {
        id: "van-phong-ao-dung-de-lam-gi",
        heading: "Văn phòng ảo dùng để làm gì trong hoạt động của doanh nghiệp",
        paragraphs: ["Cụ thể, doanh nghiệp có thể sử dụng địa chỉ văn phòng ảo cho các mục đích sau:"],
        bullets: [
          "Đăng ký kinh doanh, đăng ký mã số thuế tại địa chỉ hợp lệ",
          "Nhận thư từ, bưu phẩm, hoá đơn, văn bản từ cơ quan nhà nước",
          "Sử dụng địa chỉ trên hoá đơn, hợp đồng, tài liệu giao dịch với khách hàng, đối tác",
          "Sử dụng phòng họp, không gian tiếp khách theo giờ khi có nhu cầu (tuỳ gói dịch vụ)",
          "Xây dựng hình ảnh chuyên nghiệp với địa chỉ tại khu vực trung tâm, thay vì địa chỉ nhà riêng",
        ],
      },
      {
        id: "nhung-luu-y-khi-chon",
        heading: "Những lưu ý khi lựa chọn dịch vụ văn phòng ảo",
        paragraphs: ["Trước khi ký hợp đồng, doanh nghiệp nên kiểm tra kỹ các điểm sau:"],
        bullets: [
          "Đơn vị cung cấp có giấy tờ chứng minh quyền sử dụng hợp pháp địa chỉ (hợp đồng thuê, giấy chứng nhận quyền sử dụng...)",
          "Địa chỉ không thuộc diện bị hạn chế đăng ký trụ sở kinh doanh",
          "Các dịch vụ đi kèm (nhận thư, phòng họp, lễ tân) có tính thêm phí hay đã bao gồm trong gói",
          "Đơn vị có nhiều chi nhánh, để dễ chuyển đổi địa chỉ nếu doanh nghiệp mở rộng sang khu vực khác",
          "Điều khoản hợp đồng về thời hạn, gia hạn và chính sách khi chấm dứt sử dụng dịch vụ",
        ],
      },
      {
        id: "khi-nao-phu-hop",
        heading: "Văn phòng ảo phù hợp với những đối tượng nào",
        paragraphs: [
          "Văn phòng ảo phù hợp nhất với doanh nghiệp mới thành lập chưa có nhu cầu không gian làm việc cố định, doanh nghiệp hoạt động chủ yếu online hoặc làm việc từ xa, và các công ty muốn tối ưu chi phí vận hành trong giai đoạn đầu nhưng vẫn cần địa chỉ đăng ký kinh doanh chuyên nghiệp tại khu vực trung tâm. Nếu doanh nghiệp của bạn cần không gian làm việc thực tế cho đội ngũ nhân sự hàng ngày, nên cân nhắc thêm phương án văn phòng trọn gói hoặc coworking space.",
        ],
      },
    ],
    faqs: [
      {
        q: "Văn phòng ảo có thể dùng để mở tài khoản ngân hàng doanh nghiệp không?",
        a: "Có. Địa chỉ văn phòng ảo hợp lệ được sử dụng làm địa chỉ đăng ký khi mở tài khoản ngân hàng doanh nghiệp, tương tự như địa chỉ trụ sở thông thường.",
      },
      {
        q: "Tôi có thể nhận hàng hoá tại địa chỉ văn phòng ảo không?",
        a: "Dịch vụ văn phòng ảo chủ yếu phục vụ tiếp nhận thư từ, hoá đơn, văn bản. Nếu bạn có nhu cầu nhận hàng hoá số lượng lớn, hãy trao đổi trước với MAX OFFICE để được tư vấn giải pháp phù hợp.",
      },
      {
        q: "Cơ quan thuế có thể đến kiểm tra trụ sở văn phòng ảo không?",
        a: "Có thể, đây là quyền của cơ quan quản lý nhà nước. Địa chỉ văn phòng ảo tại MAX OFFICE có đầy đủ hồ sơ pháp lý và luôn sẵn sàng phối hợp khi có yêu cầu kiểm tra, xác minh.",
      },
      {
        q: "Chi phí văn phòng ảo tại MAX OFFICE là bao nhiêu?",
        a: "Từ 299.000đ/tháng tuỳ gói và chi nhánh — xem chi tiết bảng giá đầy đủ tại trang dịch vụ Văn phòng ảo.",
      },
      {
        q: "Tôi có thể chuyển từ văn phòng ảo sang văn phòng trọn gói sau này không?",
        a: "Có. Đây là lộ trình phổ biến khi doanh nghiệp mở rộng quy mô — liên hệ MAX OFFICE để được tư vấn chuyển đổi phù hợp.",
      },
    ],
    relatedLinks: [
      { label: "Nên chọn văn phòng ảo hay văn phòng truyền thống", href: "/blog/nen-chon-van-phong-ao-hay-truyen-thong" },
      { label: "So sánh Văn phòng ảo và Văn phòng trọn gói", href: "/tien-ich/so-sanh-van-phong-ao-va-tron-goi" },
      { label: "Dịch vụ Văn phòng ảo MAX OFFICE", href: "/services/van-phong-ao" },
    ],
    cta: {
      title: "Cần địa chỉ đăng ký kinh doanh hợp pháp?",
      description: "MAX OFFICE cung cấp dịch vụ văn phòng ảo tại 12 chi nhánh TP.HCM, hồ sơ pháp lý đầy đủ, giá từ 299.000đ/tháng.",
      service: "Văn phòng ảo",
      serviceHref: "/services/van-phong-ao",
      serviceLabel: "Xem dịch vụ Văn phòng ảo",
    },
  },
  {
    slug: "nen-chon-van-phong-ao-hay-truyen-thong",
    title: "Nên chọn văn phòng ảo hay văn phòng truyền thống cho doanh nghiệp mới?",
    excerpt:
      "So sánh chi phí, tính linh hoạt và mức độ phù hợp giữa văn phòng ảo và văn phòng truyền thống — giúp doanh nghiệp mới quyết định đúng đắn.",
    categorySlug: "van-phong-dia-diem",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Văn Phòng Ảo Hay Văn Phòng Truyền Thống? So Sánh Cho Doanh Nghiệp Mới",
    metaDescription:
      "So sánh văn phòng ảo và văn phòng truyền thống về chi phí, tính linh hoạt và mức độ phù hợp theo từng giai đoạn — giúp doanh nghiệp mới chọn đúng ngay từ đầu.",
    heroImage: "/images/van-phong-tron-goi.jpg",
    sections: [
      {
        id: "hai-mo-hinh-khac-biet",
        heading: "Hai mô hình khác biệt về bản chất",
        paragraphs: [
          "Văn phòng ảo và văn phòng truyền thống (thuê nguyên căn hoặc thuê tầng cố định) khác nhau ở bản chất cốt lõi: văn phòng ảo cung cấp địa chỉ đăng ký hợp pháp mà không đi kèm không gian làm việc vật lý cố định, trong khi văn phòng truyền thống là không gian riêng biệt doanh nghiệp thuê và sử dụng toàn thời gian cho đội ngũ nhân sự.",
        ],
      },
      {
        id: "so-sanh-chi-phi",
        heading: "So sánh chi phí",
        paragraphs: [
          "Đây là khác biệt rõ rệt nhất giữa hai mô hình. Văn phòng ảo có chi phí cố định hàng tháng thấp, không phát sinh chi phí quản lý, điện nước, bảo trì. Văn phòng truyền thống đòi hỏi chi phí thuê mặt bằng, đặt cọc, chi phí vận hành (điện, nước, internet, vệ sinh, bảo vệ), và thường yêu cầu cam kết hợp đồng dài hạn.",
        ],
        bullets: [
          "Văn phòng ảo: chi phí cố định thấp, không phát sinh chi phí vận hành",
          "Văn phòng truyền thống: chi phí cao hơn đáng kể, gồm tiền thuê, đặt cọc, chi phí vận hành hàng tháng",
        ],
      },
      {
        id: "so-sanh-linh-hoat",
        heading: "So sánh tính linh hoạt",
        paragraphs: [
          "Văn phòng ảo cho phép doanh nghiệp thay đổi quy mô, mở rộng hoặc thu hẹp mà không bị ràng buộc bởi hợp đồng thuê mặt bằng dài hạn. Văn phòng truyền thống thường gắn với hợp đồng thuê từ 1 năm trở lên, khó điều chỉnh nhanh khi tình hình kinh doanh thay đổi.",
        ],
      },
      {
        id: "khi-nao-nen-chon-van-phong-ao",
        heading: "Khi nào nên chọn văn phòng ảo",
        paragraphs: ["Văn phòng ảo là lựa chọn hợp lý khi:"],
        bullets: [
          "Doanh nghiệp mới thành lập, đội ngũ làm việc từ xa hoặc chưa cố định nhân sự tại một địa điểm",
          "Cần tối ưu chi phí vận hành trong giai đoạn đầu",
          "Chỉ cần địa chỉ đăng ký kinh doanh hợp pháp, không cần không gian làm việc cố định",
          "Muốn có địa chỉ tại khu vực trung tâm mà không phát sinh chi phí thuê mặt bằng lớn",
        ],
      },
      {
        id: "khi-nao-nen-chon-truyen-thong",
        heading: "Khi nào nên cân nhắc văn phòng truyền thống (hoặc trọn gói)",
        paragraphs: [
          "Khi doanh nghiệp đã có đội ngũ nhân sự cố định cần làm việc tập trung hàng ngày, cần không gian tiếp khách thường xuyên, hoặc muốn xây dựng văn hoá làm việc tại văn phòng riêng, văn phòng truyền thống hoặc văn phòng trọn gói (đã có sẵn nội thất, không cần đầu tư ban đầu) sẽ phù hợp hơn. Văn phòng trọn gói là giải pháp trung gian, giữ được sự chuyên nghiệp của không gian riêng nhưng không đòi hỏi vốn đầu tư ban đầu lớn như thuê truyền thống.",
        ],
      },
      {
        id: "giai-phap-ket-hop",
        heading: "Giải pháp kết hợp: bắt đầu từ văn phòng ảo, mở rộng dần",
        paragraphs: [
          "Nhiều doanh nghiệp lựa chọn lộ trình bắt đầu với văn phòng ảo để tối ưu chi phí trong giai đoạn đầu, sau đó chuyển sang văn phòng trọn gói hoặc thuê văn phòng truyền thống khi quy mô đội ngũ và doanh thu đã ổn định. Đây là cách tiếp cận thận trọng, giúp doanh nghiệp không gánh chi phí cố định lớn ngay từ khi chưa có dòng tiền ổn định.",
        ],
      },
    ],
    faqs: [
      {
        q: "Văn phòng trọn gói khác văn phòng truyền thống như thế nào?",
        a: "Văn phòng trọn gói đã có sẵn nội thất, hạ tầng, dịch vụ vận hành đi kèm (lễ tân, internet, vệ sinh), doanh nghiệp chỉ cần dọn vào sử dụng; văn phòng truyền thống thường thuê mặt bằng trống, doanh nghiệp tự đầu tư nội thất, hạ tầng ban đầu.",
      },
      {
        q: "Có thể vừa dùng văn phòng ảo vừa thuê thêm phòng họp khi cần không?",
        a: "Có. Nhiều gói văn phòng ảo tại MAX OFFICE cho phép sử dụng phòng họp theo giờ khi bạn cần tiếp khách hoặc họp nhóm.",
      },
      {
        q: "Doanh nghiệp bao nhiêu nhân sự thì nên chuyển sang văn phòng trọn gói?",
        a: "Không có con số cố định, tuỳ vào nhu cầu làm việc tập trung thực tế của đội ngũ. MAX OFFICE có công cụ gợi ý gói văn phòng phù hợp dựa trên quy mô và ngân sách của bạn.",
      },
      {
        q: "Chi phí văn phòng trọn gói tại MAX OFFICE bắt đầu từ bao nhiêu?",
        a: "Từ 4.500.000đ/tháng tuỳ diện tích và chi nhánh — xem chi tiết tại trang dịch vụ Văn phòng trọn gói.",
      },
      {
        q: "Tôi chưa chắc nên chọn gói nào, có được tư vấn không?",
        a: "Có, đội ngũ MAX OFFICE tư vấn miễn phí dựa trên quy mô, ngân sách và kế hoạch phát triển thực tế của doanh nghiệp bạn.",
      },
    ],
    relatedLinks: [
      { label: "Văn phòng ảo là gì? Có hợp pháp không?", href: "/blog/van-phong-ao-la-gi-co-hop-phap-khong" },
      { label: "Công cụ chọn gói văn phòng phù hợp", href: "/tien-ich/chon-goi-van-phong" },
      { label: "Dịch vụ Văn phòng trọn gói MAX OFFICE", href: "/services/van-phong-tron-goi" },
    ],
    cta: {
      title: "Vẫn phân vân giữa hai lựa chọn?",
      description: "Dùng công cụ chọn gói văn phòng miễn phí, hoặc để chuyên viên MAX OFFICE tư vấn trực tiếp theo nhu cầu của bạn.",
      service: "Văn phòng ảo",
      serviceHref: "/tien-ich/chon-goi-van-phong",
      serviceLabel: "Dùng công cụ chọn gói văn phòng",
    },
  },
  {
    slug: "kinh-nghiem-chon-dia-chi-dang-ky-kinh-doanh-tphcm",
    title: "Kinh nghiệm chọn địa chỉ đăng ký kinh doanh tại TP.HCM",
    excerpt:
      "Nên chọn địa chỉ đăng ký kinh doanh ở khu vực nào tại TP.HCM, điều kiện để địa chỉ hợp lệ, và những sai lầm thường gặp cần tránh.",
    categorySlug: "van-phong-dia-diem",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Kinh Nghiệm Chọn Địa Chỉ Đăng Ký Kinh Doanh Tại TP.HCM (2026)",
    metaDescription:
      "Kinh nghiệm chọn địa chỉ đăng ký kinh doanh phù hợp tại TP.HCM — khu vực nên cân nhắc, điều kiện hợp lệ và lưu ý quan trọng cho doanh nghiệp mới.",
    heroImage: "/images/dia-diem-song-thao.jpg",
    sections: [
      {
        id: "vi-sao-dia-chi-quan-trong",
        heading: "Vì sao địa chỉ đăng ký kinh doanh quan trọng hơn bạn nghĩ",
        paragraphs: [
          "Địa chỉ trụ sở chính không chỉ là thông tin hành chính trên Giấy chứng nhận đăng ký doanh nghiệp — đây còn là địa chỉ xuất hiện trên hoá đơn, hợp đồng, hồ sơ pháp lý, và là nơi cơ quan thuế, cơ quan quản lý có thể đến kiểm tra khi cần. Chọn địa chỉ phù hợp ngay từ đầu giúp doanh nghiệp tránh phải làm thủ tục thay đổi địa chỉ về sau — một thủ tục tốn thời gian và phát sinh chi phí không cần thiết.",
        ],
      },
      {
        id: "dieu-kien-dia-chi-hop-le",
        heading: "Điều kiện để địa chỉ hợp lệ đăng ký kinh doanh",
        paragraphs: ["Một địa chỉ được coi là hợp lệ để đăng ký trụ sở kinh doanh cần đáp ứng các điều kiện sau:"],
        bullets: [
          "Địa chỉ xác định rõ ràng: số nhà, đường/phố, phường/xã, quận/huyện, tỉnh/thành phố",
          "Không thuộc nhà chung cư, nhà tập thể chỉ có chức năng để ở (trừ trường hợp có chức năng thương mại được cấp phép)",
          "Không thuộc khu vực bị cấm hoặc hạn chế theo quy hoạch địa phương",
          "Có khả năng tiếp nhận công tác kiểm tra, xác minh trụ sở khi cơ quan quản lý yêu cầu",
        ],
      },
      {
        id: "nen-chon-khu-vuc-nao",
        heading: "Nên chọn khu vực nào tại TP.HCM?",
        paragraphs: [
          "Với doanh nghiệp mới, đặc biệt là doanh nghiệp dịch vụ, thương mại, các khu vực trung tâm và cận trung tâm như Quận 1, Quận 10, Tân Bình, Gò Vấp, Tân Phú là những lựa chọn phổ biến nhờ vị trí thuận tiện di chuyển, dễ tạo ấn tượng chuyên nghiệp với đối tác, khách hàng, đồng thời chi phí văn phòng tại các khu vực này thường hợp lý hơn so với khu vực lõi trung tâm.",
          "MAX OFFICE hiện có 12 chi nhánh tại các khu vực này, cho phép doanh nghiệp chọn địa chỉ phù hợp với ngành nghề và tệp khách hàng mục tiêu.",
        ],
      },
      {
        id: "nha-rieng-hay-dich-vu",
        heading: "Dùng địa chỉ nhà riêng hay dịch vụ văn phòng ảo?",
        paragraphs: [
          "Nếu bạn có nhà riêng đáp ứng đủ điều kiện hợp lệ (không phải chung cư để ở, có thể xác minh rõ ràng), bạn có thể sử dụng làm địa chỉ đăng ký. Tuy nhiên, nhiều người kinh doanh chọn dịch vụ văn phòng ảo vì các lý do sau:",
        ],
        bullets: [
          "Địa chỉ tại khu vực trung tâm, chuyên nghiệp hơn địa chỉ nhà riêng",
          "Tránh lộ thông tin nhà riêng trên các tài liệu công khai (hoá đơn, hợp đồng, cổng thông tin doanh nghiệp)",
          "Không lo về điều kiện hợp lệ của địa chỉ (đơn vị cung cấp dịch vụ đã đảm bảo tuân thủ quy định)",
          "Dễ dàng thay đổi chi nhánh nếu cần chuyển địa chỉ trong tương lai",
        ],
      },
      {
        id: "sai-lam-thuong-gap",
        heading: "Những sai lầm thường gặp khi chọn địa chỉ",
        paragraphs: ["Một số sai lầm phổ biến khiến doanh nghiệp phải làm lại thủ tục sau khi đã đăng ký:"],
        bullets: [
          "Chọn địa chỉ chung cư để ở mà không kiểm tra chức năng thương mại",
          "Không xác nhận rõ đơn vị cho thuê văn phòng ảo có quyền sử dụng hợp pháp địa chỉ",
          "Đăng ký địa chỉ xa khu vực hoạt động thực tế, gây bất tiện khi giao dịch, tiếp khách",
          "Không cân nhắc khả năng mở rộng, dẫn đến phải đổi địa chỉ sớm sau khi thành lập",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi có thể đăng ký kinh doanh tại địa chỉ ở tỉnh khác nếu công ty hoạt động tại TP.HCM không?",
        a: "Trụ sở chính nên đặt tại nơi doanh nghiệp thực sự hoạt động hoặc dễ dàng quản lý — nếu có nhu cầu đặc biệt, hãy liên hệ MAX OFFICE để được tư vấn phương án phù hợp đúng quy định.",
      },
      {
        q: "MAX OFFICE có chi nhánh ở khu vực nào tại TP.HCM?",
        a: "MAX OFFICE hiện có 12 chi nhánh tại các khu vực trung tâm như Tân Bình, Gò Vấp, Tân Phú, Quận 10 và Quận 1 — xem chi tiết tại trang Chi nhánh.",
      },
      {
        q: "Địa chỉ văn phòng ảo có thể thay đổi sau khi đã đăng ký không?",
        a: "Có, doanh nghiệp có thể thực hiện thủ tục thay đổi địa chỉ trụ sở khi cần — MAX OFFICE có dịch vụ pháp lý sửa đổi hỗ trợ thủ tục này.",
      },
      {
        q: "Ngành nghề kinh doanh có ảnh hưởng đến việc chọn địa chỉ không?",
        a: "Có, một số ngành nghề có điều kiện yêu cầu địa điểm kinh doanh đáp ứng tiêu chuẩn riêng (diện tích, phòng cháy chữa cháy...). Liên hệ MAX OFFICE để được tư vấn cụ thể theo ngành nghề của bạn.",
      },
      {
        q: "Làm sao biết địa chỉ tôi định đăng ký có hợp lệ không?",
        a: "Bạn có thể liên hệ MAX OFFICE để được kiểm tra và tư vấn miễn phí trước khi nộp hồ sơ chính thức.",
      },
    ],
    relatedLinks: [
      { label: "Xem 12 chi nhánh MAX OFFICE tại TP.HCM", href: "/dia-diem" },
      { label: "Văn phòng ảo là gì? Có hợp pháp không?", href: "/blog/van-phong-ao-la-gi-co-hop-phap-khong" },
      { label: "Dịch vụ Văn phòng ảo MAX OFFICE", href: "/services/van-phong-ao" },
    ],
    cta: {
      title: "Chưa chắc địa chỉ định đăng ký có hợp lệ?",
      description: "Để lại thông tin, MAX OFFICE kiểm tra và tư vấn miễn phí địa chỉ đăng ký kinh doanh phù hợp với doanh nghiệp bạn.",
      service: "Văn phòng ảo",
      serviceHref: "/services/van-phong-ao",
      serviceLabel: "Xem dịch vụ Văn phòng ảo",
    },
  },
  {
    slug: "coworking-space-la-gi",
    title: "Coworking Space là gì? Phù hợp với đối tượng nào?",
    excerpt:
      "Coworking space là gì, có gì khác văn phòng truyền thống, và phù hợp với freelancer, startup hay doanh nghiệp quy mô nào.",
    categorySlug: "van-phong-dia-diem",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 5,
    metaTitle: "Coworking Space Là Gì? Phù Hợp Với Đối Tượng Nào?",
    metaDescription:
      "Coworking space là gì, khác gì với văn phòng truyền thống, và phù hợp với đối tượng nào — freelancer, startup hay doanh nghiệp nhỏ.",
    heroImage: "/images/coworking.jpg",
    sections: [
      {
        id: "coworking-la-gi",
        heading: "Coworking Space là gì?",
        paragraphs: [
          "Coworking space (không gian làm việc chung) là mô hình văn phòng chia sẻ, nơi nhiều cá nhân, đội nhóm hoặc doanh nghiệp khác nhau cùng sử dụng chung một không gian làm việc, tiện ích (bàn làm việc, phòng họp, internet, khu vực tiếp khách...) theo hình thức thuê chỗ ngồi linh động hoặc cố định theo tháng, thay vì thuê nguyên một văn phòng riêng biệt.",
        ],
      },
      {
        id: "dac-diem-noi-bat",
        heading: "Đặc điểm nổi bật của coworking space",
        paragraphs: ["Coworking space có một số đặc điểm giúp nó khác biệt với mô hình văn phòng truyền thống:"],
        bullets: [
          "Không gian mở, linh hoạt, có thể chọn chỗ ngồi cố định hoặc linh động theo nhu cầu",
          "Chi phí thấp hơn đáng kể so với thuê văn phòng riêng",
          "Có sẵn hạ tầng: internet tốc độ cao, phòng họp, khu vực tiếp khách, pantry",
          "Môi trường làm việc năng động, dễ kết nối với cộng đồng doanh nghiệp, freelancer khác",
          "Không yêu cầu cam kết hợp đồng dài hạn như văn phòng truyền thống",
        ],
      },
      {
        id: "khac-gi-van-phong-truyen-thong",
        heading: "Coworking space khác gì văn phòng truyền thống?",
        paragraphs: [
          "Khác biệt lớn nhất nằm ở tính sở hữu không gian: văn phòng truyền thống là không gian riêng biệt, khép kín cho một doanh nghiệp; coworking space là không gian dùng chung, doanh nghiệp chỉ thuê số lượng chỗ ngồi hoặc diện tích cần thiết. Điều này giúp coworking space linh hoạt hơn về chi phí và quy mô, nhưng ít riêng tư hơn so với văn phòng khép kín.",
        ],
      },
      {
        id: "phu-hop-voi-ai",
        heading: "Coworking space phù hợp với đối tượng nào?",
        paragraphs: ["Coworking space là lựa chọn phù hợp với:"],
        bullets: [
          "Freelancer, cá nhân làm việc tự do cần không gian làm việc chuyên nghiệp ngoài nhà riêng",
          "Startup giai đoạn đầu, đội ngũ nhỏ (1-10 người), chưa cần văn phòng riêng biệt",
          "Doanh nghiệp cần địa điểm tạm thời khi mở rộng sang khu vực, thành phố mới",
          "Đội nhóm dự án ngắn hạn, không cần cam kết không gian dài hạn",
          "Doanh nghiệp muốn tiết kiệm chi phí vận hành nhưng vẫn cần không gian làm việc thực tế cho nhân sự",
        ],
      },
      {
        id: "chi-phi-coworking",
        heading: "Chi phí sử dụng coworking space",
        paragraphs: [
          "Chi phí coworking space thường tính theo chỗ ngồi hoặc theo tháng, thấp hơn đáng kể so với thuê nguyên văn phòng — phù hợp với ngân sách của startup và doanh nghiệp nhỏ. Tại MAX OFFICE, dịch vụ Chỗ ngồi linh động mang lại trải nghiệm tương tự coworking space, cho phép doanh nghiệp sử dụng không gian làm việc chung tại các chi nhánh mà không cần cam kết dài hạn.",
        ],
      },
    ],
    faqs: [
      {
        q: "Coworking space có phù hợp để đăng ký kinh doanh không?",
        a: "Tuỳ đơn vị cung cấp — cần xác nhận đơn vị đó có cung cấp dịch vụ địa chỉ đăng ký kinh doanh hợp lệ đi kèm, không phải coworking space nào cũng hỗ trợ việc này. Liên hệ MAX OFFICE để được tư vấn cụ thể nếu bạn cần cả hai.",
      },
      {
        q: "Tôi có thể thuê coworking space theo ngày không?",
        a: "Có, nhiều đơn vị cung cấp gói theo ngày, theo tháng hoặc theo năm tuỳ nhu cầu sử dụng thực tế.",
      },
      {
        q: "Coworking space có phòng họp riêng không?",
        a: "Có, hầu hết coworking space đều có phòng họp dùng chung, thường tính phí theo giờ khi sử dụng.",
      },
      {
        q: "Làm việc tại coworking space có đảm bảo bảo mật thông tin không?",
        a: "Các không gian uy tín đều có khu vực làm việc riêng tư hoặc tủ khoá cá nhân; nếu công việc của bạn yêu cầu bảo mật cao, nên cân nhắc thêm phương án văn phòng trọn gói với không gian khép kín.",
      },
      {
        q: "MAX OFFICE có dịch vụ tương tự coworking space không?",
        a: "Có, dịch vụ Chỗ ngồi linh động của MAX OFFICE mang lại trải nghiệm tương tự, kèm theo địa chỉ đăng ký kinh doanh hợp lệ tại các chi nhánh trung tâm TP.HCM.",
      },
    ],
    relatedLinks: [
      { label: "Văn phòng ảo hay văn phòng truyền thống — nên chọn gì", href: "/blog/nen-chon-van-phong-ao-hay-truyen-thong" },
      { label: "Dịch vụ Chỗ ngồi linh động MAX OFFICE", href: "/services/cho-ngoi-linh-dong" },
      { label: "Xem 12 chi nhánh MAX OFFICE", href: "/dia-diem" },
    ],
    cta: {
      title: "Muốn trải nghiệm không gian làm việc chung?",
      description: "Đăng ký dùng thử Chỗ ngồi linh động tại MAX OFFICE — không gian hiện đại, đầy đủ tiện ích, không cam kết dài hạn.",
      service: "Chỗ ngồi linh động",
      serviceHref: "/services/cho-ngoi-linh-dong",
      serviceLabel: "Xem dịch vụ Chỗ ngồi linh động",
    },
  },

  // ===================== GIẤY PHÉP KINH DOANH =====================
  {
    slug: "khi-nao-can-thay-doi-giay-phep-kinh-doanh",
    title: "Khi nào doanh nghiệp cần thay đổi giấy phép kinh doanh?",
    excerpt:
      "Những trường hợp phổ biến khiến doanh nghiệp phải thực hiện thủ tục thay đổi giấy phép kinh doanh — và cần chuẩn bị những gì.",
    categorySlug: "giay-phep-kinh-doanh",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Khi Nào Doanh Nghiệp Cần Thay Đổi Giấy Phép Kinh Doanh?",
    metaDescription:
      "Các trường hợp doanh nghiệp bắt buộc phải thay đổi giấy phép kinh doanh, thủ tục cần thực hiện và chi phí tham khảo theo bảng giá MAX OFFICE.",
    heroImage: "/images/bang-gia-gpkd.jpg",
    sections: [
      {
        id: "gplkd-the-hien-gi",
        heading: "Giấy phép kinh doanh thể hiện những thông tin gì",
        paragraphs: [
          "Giấy chứng nhận đăng ký doanh nghiệp (thường gọi là giấy phép kinh doanh) thể hiện các thông tin cốt lõi của doanh nghiệp: tên công ty, địa chỉ trụ sở, vốn điều lệ, ngành nghề kinh doanh, người đại diện theo pháp luật. Khi bất kỳ thông tin nào trong số này thay đổi trong quá trình hoạt động, doanh nghiệp có nghĩa vụ đăng ký thay đổi với cơ quan đăng ký kinh doanh trong thời hạn quy định.",
        ],
      },
      {
        id: "cac-truong-hop-pho-bien",
        heading: "Các trường hợp phổ biến cần thay đổi giấy phép kinh doanh",
        paragraphs: ["Trong quá trình hoạt động, doanh nghiệp thường phải đăng ký thay đổi khi:"],
        bullets: [
          "Đổi tên công ty",
          "Thay đổi địa chỉ trụ sở chính (cùng hoặc khác quận/huyện, tỉnh/thành phố)",
          "Thay đổi người đại diện theo pháp luật",
          "Tăng hoặc giảm vốn điều lệ",
          "Bổ sung hoặc thay đổi ngành nghề kinh doanh",
          "Thay đổi thông tin thành viên, cổ đông sáng lập",
          "Chuyển đổi loại hình doanh nghiệp",
          "Cập nhật số điện thoại, CCCD của người đại diện hoặc chủ sở hữu",
        ],
      },
      {
        id: "vi-sao-phai-thay-doi",
        heading: "Vì sao phải đăng ký thay đổi thay vì để nguyên thông tin cũ",
        paragraphs: [
          "Thông tin trên Giấy chứng nhận đăng ký doanh nghiệp là căn cứ pháp lý cho mọi giao dịch, hợp đồng, hồ sơ thuế của doanh nghiệp. Nếu thông tin thực tế đã thay đổi nhưng chưa cập nhật, doanh nghiệp có thể gặp rủi ro khi ký hợp đồng, vay vốn, hoặc bị coi là vi phạm nghĩa vụ đăng ký kinh doanh. Việc đăng ký thay đổi đúng hạn giúp hồ sơ pháp lý của doanh nghiệp luôn nhất quán, minh bạch.",
        ],
      },
      {
        id: "thoi-han-dang-ky",
        heading: "Thời hạn đăng ký thay đổi",
        paragraphs: [
          "Theo quy định pháp luật doanh nghiệp hiện hành, khi có thay đổi nội dung đăng ký doanh nghiệp, doanh nghiệp phải đăng ký với cơ quan đăng ký kinh doanh trong một khoảng thời gian nhất định kể từ ngày có thay đổi. Vì thời hạn cụ thể có thể khác nhau tuỳ loại nội dung thay đổi, hãy liên hệ MAX OFFICE để được xác nhận chính xác thời hạn áp dụng cho trường hợp của bạn, tránh bị xử phạt do đăng ký trễ.",
        ],
      },
      {
        id: "chi-phi-tham-khao",
        heading: "Chi phí tham khảo cho các dịch vụ thay đổi phổ biến",
        paragraphs: [
          "MAX OFFICE cung cấp dịch vụ pháp lý sửa đổi trọn gói với bảng giá minh bạch, áp dụng chung cho mọi loại hình doanh nghiệp:",
        ],
        bullets: [
          "Thay đổi tên công ty: 700.000đ",
          "Thay đổi địa chỉ cùng cơ sở: 700.000đ — khác cơ sở: 850.000đ",
          "Thay đổi đại diện pháp luật: 700.000đ",
          "Tăng vốn điều lệ: từ 700.000đ (công ty 1 thành viên) đến 1.000.000đ (công ty 2 thành viên trở lên)",
          "Bổ sung ngành nghề (1-15 ngành): 700.000đ",
          "Chuyển đổi loại hình doanh nghiệp: 1.500.000đ",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi thay đổi nhiều thông tin cùng lúc thì tính phí thế nào?",
        a: "Dịch vụ có giá trị lớn nhất tính giá đầy đủ theo bảng giá; các dịch vụ còn lại được giảm — giá gốc trên 500.000đ giảm còn 500.000đ, giá gốc từ 500.000đ trở xuống giảm còn 300.000đ. Xem chi tiết điều kiện combo tại trang Dịch vụ pháp lý sửa đổi.",
      },
      {
        q: "Không đăng ký thay đổi đúng hạn thì có bị phạt không?",
        a: "Có thể bị xử phạt vi phạm hành chính tuỳ mức độ và thời gian chậm trễ. Nên thực hiện đăng ký thay đổi ngay khi có phát sinh để tránh rủi ro.",
      },
      {
        q: "Thời gian xử lý thủ tục thay đổi giấy phép kinh doanh mất bao lâu?",
        a: "Đa số dịch vụ tại MAX OFFICE xử lý trong 5-7 ngày làm việc, một số nội dung đơn giản như cập nhật CCCD có thể nhanh hơn.",
      },
      {
        q: "Tôi cần chuẩn bị giấy tờ gì khi thay đổi thông tin?",
        a: "Tuỳ nội dung thay đổi cụ thể, MAX OFFICE sẽ hướng dẫn chi tiết hồ sơ cần thiết — thông thường chỉ cần giấy tờ tuỳ thân và thông tin thay đổi tương ứng.",
      },
      {
        q: "Có thể tự thực hiện thủ tục thay đổi mà không cần dịch vụ hỗ trợ không?",
        a: "Có thể, nhưng dễ mất thời gian nếu chưa quen quy định và mẫu biểu — MAX OFFICE hỗ trợ thực hiện trọn gói để bạn tiết kiệm thời gian và tránh sai sót.",
      },
    ],
    relatedLinks: [
      { label: "Checklist thay đổi giấy phép kinh doanh (tải PDF)", href: "/tien-ich/checklist-thay-doi-giay-phep-kinh-doanh" },
      { label: "Bảng giá đầy đủ Dịch vụ pháp lý sửa đổi", href: "/dich-vu/dich-vu-phap-ly-sua-doi" },
      { label: "Thủ tục bổ sung ngành nghề kinh doanh", href: "/blog/thu-tuc-bo-sung-nganh-nghe-kinh-doanh" },
    ],
    cta: {
      title: "Cần thay đổi thông tin giấy phép kinh doanh?",
      description: "MAX OFFICE hỗ trợ trọn gói mọi thủ tục sửa đổi giấy phép kinh doanh, xử lý nhanh trong 5-7 ngày làm việc.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/dich-vu/dich-vu-phap-ly-sua-doi",
      serviceLabel: "Xem bảng giá dịch vụ sửa đổi",
    },
  },
  {
    slug: "thu-tuc-bo-sung-nganh-nghe-kinh-doanh",
    title: "Thủ tục bổ sung ngành nghề kinh doanh: Cần lưu ý gì?",
    excerpt:
      "Doanh nghiệp muốn mở rộng hoạt động sang lĩnh vực mới cần bổ sung ngành nghề kinh doanh như thế nào — quy trình và lưu ý quan trọng.",
    categorySlug: "giay-phep-kinh-doanh",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Thủ Tục Bổ Sung Ngành Nghề Kinh Doanh Cần Lưu Ý Gì? (2026)",
    metaDescription:
      "Hướng dẫn thủ tục bổ sung ngành nghề kinh doanh, những lưu ý quan trọng về mã ngành và chi phí thực hiện tại MAX OFFICE.",
    heroImage: "/images/dich-vu-thanh-lap-doanh-nghiep.jpg",
    sections: [
      {
        id: "khi-nao-can-bo-sung",
        heading: "Khi nào doanh nghiệp cần bổ sung ngành nghề kinh doanh",
        paragraphs: [
          "Doanh nghiệp chỉ được hoạt động trong phạm vi các ngành nghề đã đăng ký với cơ quan đăng ký kinh doanh. Khi có kế hoạch mở rộng sang lĩnh vực kinh doanh mới chưa có trong Giấy chứng nhận đăng ký doanh nghiệp — ví dụ công ty thương mại muốn thêm dịch vụ tư vấn, hoặc công ty dịch vụ muốn thêm hoạt động bán lẻ — doanh nghiệp cần thực hiện thủ tục đăng ký bổ sung ngành nghề trước khi chính thức triển khai hoạt động đó.",
        ],
      },
      {
        id: "ma-hoa-nganh-nghe",
        heading: "Ngành nghề kinh doanh cần được mã hoá đúng quy định",
        paragraphs: [
          "Mỗi ngành nghề kinh doanh khi đăng ký hoặc bổ sung đều phải được mã hoá theo Hệ thống ngành kinh tế Việt Nam hiện hành. Đây là bước dễ gây nhầm lẫn nhất với người chưa quen thủ tục — chọn sai mã ngành hoặc diễn giải chi tiết không khớp với mã ngành đã chọn có thể khiến hồ sơ bị yêu cầu chỉnh sửa.",
        ],
      },
      {
        id: "nganh-nghe-co-dieu-kien",
        heading: "Lưu ý với ngành nghề kinh doanh có điều kiện",
        paragraphs: [
          "Một số ngành nghề thuộc danh mục ngành nghề kinh doanh có điều kiện (ví dụ dịch vụ tài chính, giáo dục, y tế, bất động sản...) yêu cầu doanh nghiệp phải đáp ứng thêm điều kiện về vốn, chứng chỉ hành nghề, hoặc giấy phép con trước khi chính thức hoạt động, dù đã đăng ký bổ sung ngành nghề đó vào Giấy chứng nhận đăng ký doanh nghiệp. Vì danh mục ngành nghề có điều kiện và yêu cầu cụ thể có thể thay đổi theo quy định từng thời kỳ, hãy liên hệ MAX OFFICE để được tư vấn chính xác nếu ngành nghề bạn dự định bổ sung thuộc nhóm này.",
        ],
      },
      {
        id: "quy-trinh-thuc-hien",
        heading: "Quy trình thực hiện bổ sung ngành nghề",
        paragraphs: [],
        bullets: [
          "Xác định ngành nghề dự kiến bổ sung và mã hoá đúng theo hệ thống ngành kinh tế",
          "Kiểm tra ngành nghề có thuộc diện kinh doanh có điều kiện không",
          "Soạn hồ sơ thông báo thay đổi nội dung đăng ký doanh nghiệp",
          "Nộp hồ sơ tại cơ quan đăng ký kinh doanh",
          "Nhận Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp",
        ],
      },
      {
        id: "chi-phi-va-thoi-gian",
        heading: "Chi phí và thời gian thực hiện",
        paragraphs: [
          "Dịch vụ bổ sung ngành nghề (từ 1 đến 15 ngành trong một lần đăng ký) tại MAX OFFICE có mức phí 700.000đ, thời gian xử lý 5-7 ngày làm việc. Nếu bạn thực hiện đồng thời với các nội dung sửa đổi khác (ví dụ vừa bổ sung ngành nghề vừa đổi địa chỉ), sẽ được áp dụng ưu đãi combo theo bảng giá Dịch vụ pháp lý sửa đổi.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi có thể bổ sung nhiều ngành nghề trong một lần đăng ký không?",
        a: "Có, mức phí 700.000đ tại MAX OFFICE áp dụng cho việc bổ sung từ 1 đến 15 ngành nghề trong một lần thực hiện.",
      },
      {
        q: "Nếu tôi hoạt động ngành nghề chưa đăng ký thì sao?",
        a: "Đây là hành vi không đúng quy định, có thể bị xử phạt vi phạm hành chính. Nên đăng ký bổ sung đầy đủ trước khi chính thức triển khai hoạt động mới.",
      },
      {
        q: "Làm sao biết ngành nghề tôi muốn thêm có phải ngành nghề kinh doanh có điều kiện không?",
        a: "Liên hệ MAX OFFICE để được tra cứu và tư vấn chính xác theo quy định hiện hành.",
      },
      {
        q: "Bổ sung ngành nghề có cần thay đổi vốn điều lệ không?",
        a: "Không nhất thiết, trừ khi ngành nghề đó thuộc diện yêu cầu vốn pháp định tối thiểu.",
      },
      {
        q: "Sau khi bổ sung ngành nghề, tôi có cần thông báo gì thêm với cơ quan thuế không?",
        a: "Tuỳ ngành nghề cụ thể có thể cần cập nhật thêm thông tin với cơ quan thuế — MAX OFFICE sẽ hướng dẫn đầy đủ khi hỗ trợ bạn thực hiện thủ tục.",
      },
    ],
    relatedLinks: [
      { label: "Khi nào doanh nghiệp cần thay đổi giấy phép kinh doanh", href: "/blog/khi-nao-can-thay-doi-giay-phep-kinh-doanh" },
      { label: "Bảng giá Dịch vụ pháp lý sửa đổi", href: "/dich-vu/dich-vu-phap-ly-sua-doi" },
      { label: "Checklist thay đổi giấy phép kinh doanh", href: "/tien-ich/checklist-thay-doi-giay-phep-kinh-doanh" },
    ],
    cta: {
      title: "Cần bổ sung ngành nghề kinh doanh nhanh chóng?",
      description: "MAX OFFICE hỗ trợ tra cứu mã ngành chính xác và xử lý hồ sơ bổ sung ngành nghề trong 5-7 ngày làm việc.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/dich-vu/dich-vu-phap-ly-sua-doi",
      serviceLabel: "Xem bảng giá dịch vụ sửa đổi",
    },
  },
  {
    slug: "thay-doi-dia-chi-tru-so-cong-ty",
    title: "Thay đổi địa chỉ trụ sở công ty cần làm những gì?",
    excerpt:
      "Doanh nghiệp thay đổi địa chỉ trụ sở cần thực hiện những thủ tục gì, khác nhau ra sao giữa đổi cùng cơ sở và khác cơ sở, chi phí bao nhiêu.",
    categorySlug: "giay-phep-kinh-doanh",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Thay Đổi Địa Chỉ Trụ Sở Công Ty Cần Làm Những Gì? (2026)",
    metaDescription:
      "Hướng dẫn thủ tục thay đổi địa chỉ trụ sở công ty — cùng quận/huyện hay khác tỉnh/thành phố, hồ sơ cần chuẩn bị và chi phí tham khảo.",
    heroImage: "/images/thanh-lap-doanh-nghiep.jpg",
    sections: [
      {
        id: "khi-nao-can-doi-dia-chi",
        heading: "Khi nào doanh nghiệp cần thay đổi địa chỉ trụ sở",
        paragraphs: [
          "Doanh nghiệp thay đổi địa chỉ trụ sở khi chuyển văn phòng sang địa điểm mới, kết thúc hợp đồng thuê văn phòng ảo hoặc văn phòng trọn gói cũ, mở rộng quy mô cần không gian lớn hơn, hoặc đơn giản là muốn chuyển đến khu vực thuận tiện hơn cho hoạt động kinh doanh.",
        ],
      },
      {
        id: "thay-doi-cung-co-so-khac-co-so",
        heading: "Phân biệt thay đổi địa chỉ cùng cơ sở và khác cơ sở",
        paragraphs: [
          "Về mặt thủ tục, MAX OFFICE phân loại dịch vụ thay đổi địa chỉ thành hai trường hợp: thay đổi địa chỉ cùng cơ sở thuế quản lý (thường là chuyển trong cùng quận/huyện hoặc khu vực do cùng một cơ quan thuế quản lý) và thay đổi địa chỉ khác cơ sở thuế quản lý (chuyển sang quận/huyện, tỉnh/thành phố khác). Trường hợp khác cơ sở thường phức tạp hơn vì liên quan đến thủ tục chuyển cơ quan thuế quản lý, nên mức phí dịch vụ cũng cao hơn.",
        ],
      },
      {
        id: "ho-so-can-chuan-bi",
        heading: "Hồ sơ cần chuẩn bị khi thay đổi địa chỉ",
        paragraphs: [],
        bullets: [
          "Thông báo thay đổi nội dung đăng ký doanh nghiệp (địa chỉ trụ sở mới)",
          "Quyết định và biên bản họp về việc thay đổi địa chỉ (tuỳ loại hình doanh nghiệp)",
          "Giấy tờ chứng minh quyền sử dụng hợp pháp địa chỉ mới (hợp đồng thuê, giấy chứng nhận...)",
          "Thực hiện thủ tục chốt thuế tại cơ quan thuế cũ (nếu thay đổi khác cơ sở quản lý)",
        ],
      },
      {
        id: "quy-trinh-thuc-hien",
        heading: "Quy trình thực hiện",
        paragraphs: [],
        bullets: [
          "Xác định địa chỉ mới và chuẩn bị giấy tờ chứng minh quyền sử dụng hợp pháp",
          "Soạn hồ sơ thông báo thay đổi địa chỉ trụ sở",
          "Nộp hồ sơ tại cơ quan đăng ký kinh doanh",
          "Thực hiện thủ tục liên quan với cơ quan thuế (nếu thay đổi khác cơ sở quản lý)",
          "Cập nhật địa chỉ mới trên hoá đơn điện tử, con dấu (nếu cần), biển hiệu công ty",
        ],
      },
      {
        id: "chi-phi-tham-khao",
        heading: "Chi phí tham khảo",
        paragraphs: [
          "Theo bảng giá Dịch vụ pháp lý sửa đổi tại MAX OFFICE, thay đổi địa chỉ cùng cơ sở có mức phí 700.000đ, thay đổi địa chỉ khác cơ sở có mức phí 850.000đ, thời gian xử lý 5-7 ngày làm việc. Nếu bạn cần thực hiện thêm các nội dung sửa đổi khác cùng lúc, sẽ được áp dụng ưu đãi combo.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tôi chuyển văn phòng trong cùng quận thì có phức tạp không?",
        a: "Đơn giản hơn trường hợp chuyển khác tỉnh/thành phố hoặc khác cơ quan thuế quản lý — mức phí và thời gian xử lý cũng thấp hơn.",
      },
      {
        q: "Đổi địa chỉ có cần khắc lại con dấu không?",
        a: "Tuỳ loại con dấu doanh nghiệp đang sử dụng và nội dung thể hiện trên dấu — MAX OFFICE sẽ tư vấn cụ thể khi hỗ trợ bạn thực hiện thủ tục.",
      },
      {
        q: "Chuyển địa chỉ khác tỉnh có cần làm thủ tục gì đặc biệt không?",
        a: "Có, cần thực hiện thêm thủ tục liên quan đến chuyển cơ quan thuế quản lý — đây là lý do chi phí và thời gian xử lý cao hơn so với đổi địa chỉ cùng khu vực.",
      },
      {
        q: "Hoá đơn điện tử đã phát hành có cần làm lại khi đổi địa chỉ không?",
        a: "Hoá đơn đã phát hành trước đó vẫn có giá trị, nhưng hoá đơn phát hành sau khi đổi địa chỉ cần thể hiện đúng địa chỉ mới — MAX OFFICE sẽ hỗ trợ cập nhật thông tin này.",
      },
      {
        q: "Tôi đang dùng văn phòng ảo, muốn chuyển sang chi nhánh khác của MAX OFFICE thì sao?",
        a: "Đây là thủ tục thay đổi địa chỉ trụ sở tương tự, MAX OFFICE hỗ trợ trọn gói cả việc chuyển đổi dịch vụ văn phòng lẫn thủ tục pháp lý liên quan.",
      },
    ],
    relatedLinks: [
      { label: "Khi nào doanh nghiệp cần thay đổi giấy phép kinh doanh", href: "/blog/khi-nao-can-thay-doi-giay-phep-kinh-doanh" },
      { label: "Bảng giá Dịch vụ pháp lý sửa đổi", href: "/dich-vu/dich-vu-phap-ly-sua-doi" },
      { label: "Xem 12 chi nhánh MAX OFFICE", href: "/dia-diem" },
    ],
    cta: {
      title: "Cần hỗ trợ thay đổi địa chỉ trụ sở?",
      description: "MAX OFFICE hỗ trợ trọn gói thủ tục thay đổi địa chỉ trụ sở, kể cả trường hợp chuyển khác quận/huyện, tỉnh/thành phố.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/dich-vu/dich-vu-phap-ly-sua-doi",
      serviceLabel: "Xem bảng giá dịch vụ sửa đổi",
    },
  },
  {
    slug: "chuyen-doi-loai-hinh-doanh-nghiep-quy-trinh-chi-phi",
    title: "Chuyển đổi loại hình doanh nghiệp: Quy trình và chi phí",
    excerpt:
      "Doanh nghiệp muốn chuyển đổi loại hình (Hộ kinh doanh lên Công ty, TNHH sang Cổ phần...) cần thực hiện quy trình nào và chi phí bao nhiêu.",
    categorySlug: "giay-phep-kinh-doanh",
    author: "Đội ngũ MAX OFFICE",
    date: "2026-07-09",
    readingTime: 6,
    metaTitle: "Chuyển Đổi Loại Hình Doanh Nghiệp: Quy Trình Và Chi Phí (2026)",
    metaDescription:
      "Hướng dẫn quy trình chuyển đổi loại hình doanh nghiệp (Hộ kinh doanh lên TNHH, TNHH sang Cổ phần...) và chi phí tham khảo tại MAX OFFICE.",
    heroImage: "/images/bang-gia-gpkd.jpg",
    sections: [
      {
        id: "khi-nao-can-chuyen-doi",
        heading: "Khi nào doanh nghiệp cần chuyển đổi loại hình",
        paragraphs: [
          "Chuyển đổi loại hình doanh nghiệp thường phát sinh khi mô hình kinh doanh ban đầu không còn phù hợp với giai đoạn phát triển mới — phổ biến nhất là hộ kinh doanh phát triển đến quy mô cần tư cách pháp nhân nên chuyển thành Công ty TNHH, hoặc Công ty TNHH có kế hoạch gọi vốn từ nhiều nhà đầu tư nên chuyển thành Công ty Cổ phần.",
        ],
      },
      {
        id: "cac-huong-chuyen-doi-pho-bien",
        heading: "Các hướng chuyển đổi phổ biến",
        paragraphs: [],
        bullets: [
          "Hộ kinh doanh chuyển đổi thành doanh nghiệp (Công ty TNHH hoặc Công ty Cổ phần)",
          "Công ty TNHH một thành viên chuyển đổi thành Công ty TNHH hai thành viên trở lên (hoặc ngược lại)",
          "Công ty TNHH chuyển đổi thành Công ty Cổ phần",
          "Công ty Cổ phần chuyển đổi thành Công ty TNHH",
        ],
      },
      {
        id: "quy-trinh-chuyen-doi",
        heading: "Quy trình chuyển đổi loại hình doanh nghiệp",
        paragraphs: [],
        bullets: [
          "Xác định loại hình mục tiêu phù hợp với kế hoạch phát triển",
          "Chuẩn bị hồ sơ theo quy định tương ứng với loại hình chuyển đổi (quyết định chuyển đổi, điều lệ mới, danh sách thành viên/cổ đông mới...)",
          "Nộp hồ sơ đăng ký chuyển đổi tại cơ quan đăng ký kinh doanh",
          "Nhận Giấy chứng nhận đăng ký doanh nghiệp mới thể hiện đúng loại hình đã chuyển đổi",
          "Cập nhật thông tin trên hoá đơn điện tử, con dấu, tài khoản ngân hàng và các hồ sơ liên quan",
        ],
      },
      {
        id: "nhung-dieu-can-luu-y",
        heading: "Những điều cần lưu ý khi chuyển đổi",
        paragraphs: [
          "Doanh nghiệp sau chuyển đổi kế thừa toàn bộ quyền và nghĩa vụ của doanh nghiệp trước chuyển đổi (hợp đồng đã ký, nghĩa vụ thuế, các cam kết với đối tác...), trừ trường hợp có thoả thuận khác theo quy định pháp luật. Vì mỗi hướng chuyển đổi có quy định riêng về hồ sơ và điều kiện, doanh nghiệp nên được tư vấn cụ thể để chuẩn bị đúng và đầy đủ ngay từ đầu, tránh phải bổ sung nhiều lần.",
        ],
      },
      {
        id: "chi-phi-tham-khao",
        heading: "Chi phí và thời gian tham khảo",
        paragraphs: [
          "Dịch vụ chuyển đổi loại hình doanh nghiệp tại MAX OFFICE có mức phí 1.500.000đ, thời gian xử lý 5-7 ngày làm việc — áp dụng thống nhất, không phân biệt hướng chuyển đổi cụ thể. Nếu doanh nghiệp cần thực hiện thêm các nội dung sửa đổi khác cùng lúc (ví dụ vừa chuyển đổi loại hình vừa đổi đại diện pháp luật), sẽ được áp dụng ưu đãi combo theo bảng giá Dịch vụ pháp lý sửa đổi.",
        ],
      },
    ],
    faqs: [
      {
        q: "Chuyển đổi loại hình có phải thành lập lại từ đầu không?",
        a: "Không. Doanh nghiệp sau chuyển đổi vẫn giữ mã số doanh nghiệp/mã số thuế cũ trong đa số trường hợp và kế thừa quyền, nghĩa vụ hiện có, không cần thành lập mới hoàn toàn.",
      },
      {
        q: "Hộ kinh doanh chuyển thành công ty thì các hợp đồng cũ có còn hiệu lực không?",
        a: "Về nguyên tắc doanh nghiệp mới kế thừa quyền và nghĩa vụ, nhưng một số hợp đồng có thể cần ký lại hoặc thông báo cho đối tác — MAX OFFICE sẽ tư vấn cụ thể cho từng trường hợp.",
      },
      {
        q: "Chuyển đổi loại hình mất bao lâu?",
        a: "Thông thường 5-7 ngày làm việc tại MAX OFFICE, tuỳ độ đầy đủ của hồ sơ.",
      },
      {
        q: "Sau khi chuyển đổi, mã số thuế có thay đổi không?",
        a: "Trong đa số trường hợp chuyển đổi giữa các loại hình doanh nghiệp, mã số doanh nghiệp/mã số thuế được giữ nguyên — MAX OFFICE sẽ xác nhận cụ thể theo từng trường hợp chuyển đổi.",
      },
      {
        q: "Tôi nên chuyển từ TNHH sang Cổ phần khi nào?",
        a: "Khi có kế hoạch gọi vốn từ nhiều nhà đầu tư hoặc mở rộng số lượng cổ đông vượt quá giới hạn của Công ty TNHH — nên tham khảo bài viết so sánh Hộ kinh doanh, TNHH và Cổ phần hoặc liên hệ MAX OFFICE để được tư vấn cụ thể.",
      },
    ],
    relatedLinks: [
      { label: "Hộ kinh doanh vs TNHH vs Cổ phần — nên chọn loại hình nào", href: "/blog/ho-kinh-doanh-vs-tnhh-vs-co-phan" },
      { label: "Bảng giá Dịch vụ pháp lý sửa đổi", href: "/dich-vu/dich-vu-phap-ly-sua-doi" },
      { label: "Công cụ so sánh TNHH và Cổ phần", href: "/tien-ich/so-sanh-tnhh-va-co-phan" },
    ],
    cta: {
      title: "Cần tư vấn chuyển đổi loại hình doanh nghiệp?",
      description: "MAX OFFICE hỗ trợ trọn gói thủ tục chuyển đổi loại hình, xử lý nhanh trong 5-7 ngày làm việc.",
      service: "Thành lập doanh nghiệp",
      serviceHref: "/dich-vu/dich-vu-phap-ly-sua-doi",
      serviceLabel: "Xem bảng giá dịch vụ sửa đổi",
    },
  },
];

export const BLOG_PAGE_SIZE = 9;

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
