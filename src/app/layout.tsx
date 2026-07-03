import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchOverlay from "@/components/SearchOverlay";
import { SearchProvider } from "@/components/SearchContext";

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
  title: "MAX OFFICE — Giải Pháp Vận Hành Doanh Nghiệp Toàn Diện",
  description:
    "MAX OFFICE đồng hành cùng hơn 500 doanh nghiệp tại 12 địa điểm trung tâm TP.HCM với văn phòng ảo, văn phòng trọn gói, coworking, phòng họp, thành lập doanh nghiệp và kế toán thuế.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <SearchProvider>
          <Header />
          <div className="pb-24 sm:pb-0">{children}</div>
          <Footer />
          <FloatingButtons />
          <MobileBottomNav />
          <SearchOverlay />
        </SearchProvider>
      </body>
    </html>
  );
}
