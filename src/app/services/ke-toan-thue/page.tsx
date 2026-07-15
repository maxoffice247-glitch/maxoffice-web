import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { SERVICES_DATA } from "@/lib/servicesData";

const data = SERVICES_DATA["ke-toan-thue"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function KeToanThuePage() {
  return <ServicePageTemplate data={data} />;
}
