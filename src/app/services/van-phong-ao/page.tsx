import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SERVICES_DATA } from "@/lib/servicesData";

const data = SERVICES_DATA["van-phong-ao"];

export const metadata: Metadata = {
  alternates: { canonical: "/services/van-phong-ao" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function VanPhongAoPage() {
  return <ServicePageTemplate data={data} />;
}
