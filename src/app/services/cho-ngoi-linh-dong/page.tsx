import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SERVICES_DATA } from "@/lib/servicesData";

const data = SERVICES_DATA["cho-ngoi-linh-dong"];

export const metadata: Metadata = {
  alternates: { canonical: "/services/cho-ngoi-linh-dong" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function ChoNgoiLinhDongPage() {
  return <ServicePageTemplate data={data} />;
}
