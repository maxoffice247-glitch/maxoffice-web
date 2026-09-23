import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import MobileBottomNav from "@/components/MobileBottomNav";
import ClientOverlays from "@/components/ClientOverlays";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SearchProvider } from "@/components/SearchContext";
import {
  SITE_URL,
  SITE_NAME,
  COMPANY_LEGAL_NAME,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  TRUSTED_BUSINESS_COUNT,
} from "@/lib/siteConfig";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MAX OFFICE — Giải Pháp Vận Hành Doanh Nghiệp Toàn Diện",
  description: `MAX OFFICE đồng hành cùng hơn ${TRUSTED_BUSINESS_COUNT} doanh nghiệp tại ${ACTIVE_BRANCH_COUNT} địa điểm trung tâm TP.HCM với văn phòng ảo, văn phòng trọn gói, coworking, phòng họp, thành lập doanh nghiệp và kế toán thuế.`,
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Site-wide fallback so any page without its own openGraph.images (e.g.
  // knowledge-center categories, tiện ích tools) still gets a real preview
  // image instead of falling back to a bare logo/blank card when shared.
  openGraph: {
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og/anh-hero-trang-chu.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: COMPANY_LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-blue.png`,
  telephone: COMPANY_PHONE,
  email: COMPANY_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Số 10 Sông Thao, P. Tân Sơn Hoà",
    addressLocality: "Thành phố Hồ Chí Minh",
    addressCountry: "VN",
  },
  sameAs: ["https://www.facebook.com/maxoffice.hcm/", "https://zalo.me/0898082188"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY_PHONE,
    contactType: "customer service",
    areaServed: "VN",
    availableLanguage: ["vi"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior="smooth" — globals.css đặt scroll-behavior: smooth
    // trên html (dùng cho các anchor link như #lead, #services); attribute
    // này báo cho Next.js biết đó là chủ ý, để tắt việc Next tự vô hiệu hoá
    // smooth-scroll trong lúc chuyển route — loại bỏ cảnh báo dev-only
    // "missing-data-scroll-behavior".
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${beVietnamPro.variable} ${inter.variable}`}
    >
      {/* suppressHydrationWarning CHỈ ở cấp body — không phải lỗi code: 1
          số extension ví crypto trong trình duyệt (VD TokenPocket) tự chèn
          attribute data-tp-bcm-channel-* vào <body> TRƯỚC khi React
          hydrate, khiến React so lệch với HTML server render dù nội dung
          thực tế giống hệt nhau. Đã xác nhận: (1) không xuất hiện lỗi này
          ở trình duyệt sạch không cài extension ví (browser pane dùng để
          test toàn bộ session không có extension nào, 0 lỗi hydration
          trong suốt quá trình phát triển); (2) rà soát code không có
          nhánh typeof window / Math.random() / Date.now() nào render trực
          tiếp khác nhau giữa server-client (chỗ duy nhất dùng Math.random()
          — Hero.tsx chọn ảnh nền — đã đúng pattern an toàn: state khởi tạo
          cố định, chỉ đổi giá trị bên trong useEffect sau khi mount). Xem
          https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors */}
      <body className="min-h-screen bg-bg font-sans text-ink antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-bold focus:text-white focus:shadow-lg"
        >
          Bỏ qua, đến nội dung chính
        </a>
        <SearchProvider>
          <div className="print:hidden">
            <Header />
          </div>
          <div id="main-content" className="pb-24 sm:pb-0">
            {children}
          </div>
          <div className="print:hidden">
            <Footer />
          </div>
          <div className="print:hidden">
            <FloatingButtons />
            <MobileBottomNav />
            <ClientOverlays />
          </div>
        </SearchProvider>
        {/* Widget chat Tidio — strategy "lazyOnload" (tải sau khi trang đã
            interactive, không ảnh hưởng tốc độ tải ban đầu). FloatingButtons
            đã chuyển sang góc trái nên không còn chồng lấn với Tidio (mặc
            định góc phải) trên desktop — không cần chỉnh gì thêm ở đó.
            Trên mobile, dashboard Tidio (Settings → Live Chat → Appearance
            → Visibility and position) CHỈ cho đổi Button position
            trái/phải riêng theo thiết bị, KHÔNG có ô chỉnh lề dưới
            (margin-bottom) riêng cho mobile — theo tài liệu chính thức
            (help.tidio.com, mục "Widget Position"), chỉnh lề dưới bắt
            buộc phải qua code. Xem script "tidio-mobile-position-fix" bên
            dưới để né MobileBottomNav.tsx trên mobile. */}
        <Script src="//code.tidio.co/qa16jzr1uvb5dd0hb4jysvjxzpyyjgmg.js" strategy="lazyOnload" />
        {/* Đẩy bong bóng Tidio lên cao hơn MobileBottomNav.tsx (thanh 4 nút
            dính đáy, cao ~61-95px tuỳ home indicator) trên mobile. Dùng
            đúng API JS chính thức hiện hành của Tidio
            (tidioChatApi.adjustStyles, đăng ký qua event 'ready'/
            'tidioChat-ready') thay vì án <style> CSS chèn thẳng — theo tài
            liệu Tidio, cách CSS cũ nhắm #tidio-chat-iframe đã bị khai tử,
            "sẽ ngừng hoạt động ở các bản cập nhật lớn tiếp theo".

            Selector #tidio đã TEST TRỰC TIẾP trên widget đang chạy (gọi
            tidioChatApi.adjustStyles() qua console, xem bong bóng di
            chuyển thật) — không đoán theo tài liệu suông. Lưu ý: outer
            wrapper mà Tidio chèn vào DOM của trang lại có id="tidio-chat"
            (khác với "#tidio" mà tài liệu/adjustStyles nhắm tới) — đã thử
            cả 2, chỉ "#tidio" có tác dụng, nên #tidio-chat KHÔNG dùng
            được ở đây dù nó là id "nhìn thấy được" khi đọc DOM trang
            ngoài; bong bóng thật nằm trong iframe riêng của Tidio, và
            adjustStyles() thao tác trực tiếp trong đó bằng id nội bộ
            #tidio, không liên quan đến id của wrapper ngoài. Ngưỡng
            max-width: 640px dùng chung breakpoint `sm` của Tailwind —
            đúng breakpoint FloatingButtons.tsx đang dùng để chuyển
            mobile/desktop. */}
        <Script id="tidio-mobile-position-fix" strategy="lazyOnload">
          {`
            function onTidioChatApiReady() {
              window.tidioChatApi.adjustStyles(
                '@media only screen and (max-width: 640px) { #tidio { bottom: 100px !important; } }'
              );
            }
            if (window.tidioChatApi) {
              window.tidioChatApi.on('ready', onTidioChatApiReady);
            } else {
              document.addEventListener('tidioChat-ready', onTidioChatApiReady);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
