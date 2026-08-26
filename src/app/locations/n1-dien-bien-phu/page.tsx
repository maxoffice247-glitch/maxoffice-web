import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["n1-dien-bien-phu"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/n1-dien-bien-phu" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function N1DienBienPhuPage() {
  return <LocationPageTemplate data={data} />;
}
