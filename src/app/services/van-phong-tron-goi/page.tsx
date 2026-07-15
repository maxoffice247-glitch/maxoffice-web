import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SERVICES_DATA } from "@/lib/servicesData";

const data = SERVICES_DATA["van-phong-tron-goi"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  openGraph: {
    images: [
      { url: data.image.replace("/images/", "/images/og/"), width: 1200, height: 630 },
    ],
  },
};

export default function VanPhongTronGoiPage() {
  return <ServicePageTemplate data={data} />;
}
