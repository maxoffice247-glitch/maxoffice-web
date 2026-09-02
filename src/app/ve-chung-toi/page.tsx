import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import AboutStats from "@/components/AboutStats";
import AboutStory from "@/components/AboutStory";
import AboutTimeline from "@/components/AboutTimeline";
import AboutValues from "@/components/AboutValues";
import CtaBanner from "@/components/CtaBanner";
import { ACTIVE_BRANCH_COUNT } from "@/lib/locationsData";

export const metadata: Metadata = {
  alternates: { canonical: "/ve-chung-toi" },
  title: "Về MAX OFFICE - Đối Tác Vận Hành Doanh Nghiệp TP.HCM",
  description: `MAX OFFICE thành lập từ 2022, đồng hành cùng hơn 500 doanh nghiệp tại ${ACTIVE_BRANCH_COUNT} địa điểm trung tâm TP.HCM. Tìm hiểu câu chuyện, tầm nhìn, sứ mệnh và giá trị cốt lõi của chúng tôi.`,
  // KHÔNG khai báo openGraph.images ở đây — xem giải thích tại
  // src/app/tien-ich/page.tsx (metadata tĩnh khai báo trực tiếp che mất
  // opengraph-image.tsx cùng thư mục).
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-ve-chung-toi.jpg"
        eyebrow="Về chúng tôi"
        title="Đối tác vận hành doanh nghiệp toàn diện tại TP.HCM"
        description={`Từ một địa chỉ tại Tân Bình năm 2022, MAX OFFICE đã trở thành hệ thống ${ACTIVE_BRANCH_COUNT} địa điểm, đồng hành cùng hơn 500 doanh nghiệp trên hành trình khởi nghiệp và phát triển.`}
      />
      <Breadcrumb items={[{ label: "Về chúng tôi" }]} />
      <AboutStats />
      <AboutStory />
      <AboutTimeline />
      <AboutValues />
      <CtaBanner />
    </main>
  );
}
