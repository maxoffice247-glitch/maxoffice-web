import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["de-tham"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/de-tham" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function DeThamPage() {
  return <LocationPageTemplate data={data} />;
}
