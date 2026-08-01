import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["cuu-long"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/cuu-long" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function CuuLongPage() {
  return <LocationPageTemplate data={data} />;
}
