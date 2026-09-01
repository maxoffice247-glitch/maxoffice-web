import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["pasteur"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/pasteur" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function PasteurPage() {
  return <LocationPageTemplate data={data} />;
}
