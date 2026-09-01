import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["mac-dinh-chi"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/mac-dinh-chi" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function MacDinhChiPage() {
  return <LocationPageTemplate data={data} />;
}
