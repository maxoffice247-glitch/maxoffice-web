import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SERVICES_DATA } from "@/lib/servicesData";

const data = SERVICES_DATA["van-phong-tron-goi"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function VanPhongTronGoiPage() {
  return <ServicePageTemplate data={data} />;
}
