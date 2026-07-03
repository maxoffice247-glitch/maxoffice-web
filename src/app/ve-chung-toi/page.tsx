import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import AboutStats from "@/components/AboutStats";
import AboutStory from "@/components/AboutStory";
import AboutTimeline from "@/components/AboutTimeline";
import AboutValues from "@/components/AboutValues";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Về MAX OFFICE - Đối Tác Vận Hành Doanh Nghiệp TP.HCM",
  description:
    "MAX OFFICE thành lập từ 2022, đồng hành cùng hơn 500 doanh nghiệp tại 12 địa điểm trung tâm TP.HCM. Tìm hiểu câu chuyện, tầm nhìn, sứ mệnh và giá trị cốt lõi của chúng tôi.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        image="/images/hero-ve-chung-toi.png"
        eyebrow="Về chúng tôi"
        title="Đối tác vận hành doanh nghiệp toàn diện tại TP.HCM"
        description="Từ một địa chỉ tại Tân Bình năm 2022, MAX OFFICE đã trở thành hệ thống 12 địa điểm, đồng hành cùng hơn 500 doanh nghiệp trên hành trình khởi nghiệp và phát triển."
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
