import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["dien-bien-phu"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/dien-bien-phu" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function DienBienPhuPage() {
  return <LocationPageTemplate data={data} />;
}
