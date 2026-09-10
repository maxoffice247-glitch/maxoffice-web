import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["mai-chi-tho"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/mai-chi-tho" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function MaiChiThoPage() {
  return <LocationPageTemplate data={data} />;
}
