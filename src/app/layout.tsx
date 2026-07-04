import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchOverlay from "@/components/SearchOverlay";
import { SearchProvider } from "@/components/SearchContext";
import {
  SITE_URL,
  SITE_NAME,
  COMPANY_LEGAL_NAME,
  COMPANY_PHONE,
  COMPANY_EMAIL,
} from "@/lib/siteConfig";

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
  description:
    "MAX OFFICE đồng hành cùng hơn 500 doanh nghiệp tại 12 địa điểm trung tâm TP.HCM với văn phòng ảo, văn phòng trọn gói, coworking, phòng họp, thành lập doanh nghiệp và kế toán thuế.",
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
    <html lang="vi" className={`${beVietnamPro.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SearchProvider>
          <div className="print:hidden">
            <Header />
          </div>
          <div className="pb-24 sm:pb-0">{children}</div>
          <div className="print:hidden">
            <Footer />
          </div>
          <div className="print:hidden">
            <FloatingButtons />
            <MobileBottomNav />
            <SearchOverlay />
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
