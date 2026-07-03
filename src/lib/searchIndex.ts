export type SearchItem = {
  title: string;
  category: string;
  href: string;
  desc: string;
};

export const SEARCH_INDEX: SearchItem[] = [
  {
    title: "Văn phòng ảo",
    category: "Dịch vụ",
    href: "/services/van-phong-ao",
    desc: "Từ 299.000đ/tháng — địa chỉ đăng ký kinh doanh hợp lệ",
  },
  {
    title: "Văn phòng trọn gói",
    category: "Dịch vụ",
    href: "/services/van-phong-tron-goi",
    desc: "Từ 4.500.000đ/tháng — không gian riêng, sẵn sàng làm việc ngay",
  },
  {
    title: "Chỗ ngồi linh động",
    category: "Dịch vụ",
    href: "/services/cho-ngoi-linh-dong",
    desc: "Từ 2.000.000đ/tháng — coworking cho freelancer & nhóm nhỏ",
  },
  {
    title: "Phòng họp theo giờ",
    category: "Dịch vụ",
    href: "/services/phong-hop",
    desc: "Từ 150.000đ/giờ — trang bị màn hình, âm thanh hiện đại",
  },
  {
    title: "Thành lập doanh nghiệp",
    category: "Dịch vụ",
    href: "/services/thanh-lap-doanh-nghiep",
    desc: "Từ 800.000đ* — Hộ kinh doanh, Công ty TNHH, Công ty Cổ phần",
  },
  {
    title: "Kế toán & thuế",
    category: "Dịch vụ",
    href: "/services/ke-toan-thue",
    desc: "Từ 800.000đ/tháng — kê khai thuế, sổ sách minh bạch",
  },
  {
    title: "Điện Biên Phủ, Quận 1",
    category: "Địa điểm",
    href: "/locations/dien-bien-phu",
    desc: "Số 95 Điện Biên Phủ, P. Tân Định — Vị trí VIP",
  },
  {
    title: "Sông Thao, Tân Bình",
    category: "Địa điểm",
    href: "/locations/song-thao",
    desc: "Số 10 Sông Thao, P. Tân Sơn Hoà — Trụ sở chính",
  },
  {
    title: "Nguyễn Oanh, Gò Vấp",
    category: "Địa điểm",
    href: "/locations/nguyen-oanh",
    desc: "238-240-242 Nguyễn Oanh, P. Gò Vấp",
  },
  {
    title: "Yên Thế, Tân Bình",
    category: "Địa điểm",
    href: "/locations/yen-the",
    desc: "92 Yên Thế, P. Tân Sơn Hòa",
  },
  {
    title: "Cộng Hoà, Tân Bình",
    category: "Địa điểm",
    href: "/locations/cong-hoa",
    desc: "123 Cộng Hoà, P. Bảy Hiền",
  },
  {
    title: "Tân Thắng, Tân Phú",
    category: "Địa điểm",
    href: "/locations/tan-thang",
    desc: "121A-123-125 Tân Thắng, P. Tân Sơn Nhì",
  },
  {
    title: "Cửu Long, Tân Bình",
    category: "Địa điểm",
    href: "/locations/cuu-long",
    desc: "06-08-10 Cửu Long, P. Tân Sơn Hòa",
  },
  {
    title: "Hoàng Việt, Tân Bình",
    category: "Địa điểm",
    href: "/locations/hoang-viet",
    desc: "1/12 Hoàng Việt, P. Tân Sơn Nhất",
  },
  {
    title: "Bàu Cát 2, Tân Bình",
    category: "Địa điểm",
    href: "/locations/bau-cat",
    desc: "24A Bàu Cát 2, P. Tân Bình",
  },
  {
    title: "Lam Sơn, Tân Bình",
    category: "Địa điểm",
    href: "/locations/lam-son",
    desc: "2-2B Lam Sơn, P. Tân Sơn Hòa",
  },
  {
    title: "Hoàng Kế Viêm, Tân Bình",
    category: "Địa điểm",
    href: "/locations/hoang-ke-viem",
    desc: "26 Hoàng Kế Viêm, P. Bảy Hiền",
  },
  {
    title: "CMT8, Quận 10",
    category: "Địa điểm",
    href: "/locations/cmt8",
    desc: "283/26-28 CMT8, P. Hoà Hưng",
  },
  {
    title: "Bảng giá Văn phòng & Coworking",
    category: "Bảng giá",
    href: "/bang-gia",
    desc: "Văn phòng ảo, trọn gói, coworking, phòng họp",
  },
  {
    title: "Bảng giá Thành lập doanh nghiệp",
    category: "Bảng giá",
    href: "/bang-gia",
    desc: "Hộ kinh doanh, Công ty TNHH, Công ty Cổ phần",
  },
  {
    title: "Bảng giá Kế toán & Thuế",
    category: "Bảng giá",
    href: "/bang-gia",
    desc: "Gói Startup, gói Business",
  },
  {
    title: "Nên chọn Hộ kinh doanh hay Công ty TNHH?",
    category: "Kiến thức",
    href: "/knowledge-center/thanh-lap-doanh-nghiep",
    desc: "So sánh ưu, nhược điểm từng loại hình doanh nghiệp",
  },
  {
    title: "5 điều cần biết trước khi thuê văn phòng ảo",
    category: "Kiến thức",
    href: "/knowledge-center/van-phong-dia-diem",
    desc: "Kinh nghiệm chọn đúng địa chỉ đăng ký kinh doanh",
  },
  {
    title: "Lịch nộp thuế doanh nghiệp cần nhớ",
    category: "Kiến thức",
    href: "/knowledge-center/ke-toan-thue",
    desc: "Tổng hợp các mốc kê khai, nộp thuế quan trọng",
  },
  {
    title: "Thủ tục mở chi nhánh tại TP.HCM",
    category: "Kiến thức",
    href: "/knowledge-center/mo-rong-kinh-doanh",
    desc: "Hướng dẫn hồ sơ, quy trình đăng ký chi nhánh",
  },
  {
    title: "Giấy Phép Kinh Doanh",
    category: "Kiến thức",
    href: "/knowledge-center/giay-phep-kinh-doanh",
    desc: "Điều kiện, thủ tục xin giấy phép con cho ngành nghề có điều kiện",
  },
  {
    title: "Pháp Lý Doanh Nghiệp",
    category: "Kiến thức",
    href: "/knowledge-center/phap-ly-doanh-nghiep",
    desc: "Quy định pháp luật, hợp đồng và rủi ro pháp lý cần biết",
  },
  {
    title: "Startup & Khởi Nghiệp",
    category: "Kiến thức",
    href: "/knowledge-center/startup-khoi-nghiep",
    desc: "Kinh nghiệm khởi nghiệp, gọi vốn và xây dựng đội ngũ",
  },
  {
    title: "Quản Lý Tài Chính",
    category: "Kiến thức",
    href: "/knowledge-center/quan-ly-tai-chinh",
    desc: "Dòng tiền, ngân sách và kiểm soát tài chính doanh nghiệp",
  },
  {
    title: "Kiến thức doanh nghiệp — Cẩm nang MAX OFFICE",
    category: "Trang",
    href: "/knowledge-center",
    desc: "8 chuyên mục kiến thức pháp lý, thuế và vận hành doanh nghiệp",
  },
  {
    title: "Blog MAX OFFICE",
    category: "Trang",
    href: "/blog",
    desc: "Bài viết về thành lập doanh nghiệp, kế toán thuế và vận hành văn phòng",
  },
  {
    title: "Văn phòng ảo có được dùng để đăng ký kinh doanh không?",
    category: "Câu hỏi thường gặp",
    href: "/#faq",
    desc: "Có, địa chỉ văn phòng ảo hoàn toàn hợp lệ",
  },
  {
    title: "Thời gian hoàn tất thủ tục thành lập công ty",
    category: "Câu hỏi thường gặp",
    href: "/#faq",
    desc: "Thông thường từ 3-5 ngày làm việc",
  },
  {
    title: "Về chúng tôi",
    category: "Trang",
    href: "/ve-chung-toi",
    desc: "Câu chuyện, tầm nhìn, sứ mệnh và hành trình phát triển của MAX OFFICE",
  },
  {
    title: "Bảng giá dịch vụ",
    category: "Trang",
    href: "/bang-gia",
    desc: "Bảng so sánh chi tiết tất cả gói dịch vụ, minh bạch không phát sinh",
  },
  {
    title: "Liên hệ MAX OFFICE",
    category: "Trang",
    href: "/lien-he",
    desc: "Nhận tư vấn miễn phí — gọi ngay 089 8082 188",
  },
  {
    title: "Tiện ích miễn phí",
    category: "Trang",
    href: "/tien-ich",
    desc: "3 công cụ miễn phí hỗ trợ doanh nghiệp",
  },
  {
    title: "Công cụ chọn gói văn phòng phù hợp",
    category: "Tiện ích",
    href: "/tien-ich/chon-goi-van-phong",
    desc: "Trả lời 5 câu hỏi để nhận gợi ý gói văn phòng phù hợp",
  },
  {
    title: "Công cụ tính chi phí thành lập công ty",
    category: "Tiện ích",
    href: "/tien-ich/tinh-chi-phi-thanh-lap",
    desc: "Ước tính chi phí thành lập theo bảng giá mới nhất",
  },
  {
    title: "Công cụ tính lệ phí môn bài",
    category: "Tiện ích",
    href: "/tien-ich/tinh-le-phi-mon-bai",
    desc: "Tính chính xác lệ phí môn bài cần đóng",
  },
];
