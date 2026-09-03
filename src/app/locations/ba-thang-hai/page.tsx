import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["ba-thang-hai"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/ba-thang-hai" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function BaThangHaiPage() {
  return <LocationPageTemplate data={data} />;
}
