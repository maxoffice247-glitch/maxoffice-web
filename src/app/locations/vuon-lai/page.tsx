import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["vuon-lai"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/vuon-lai" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function VuonLaiPage() {
  return <LocationPageTemplate data={data} />;
}
