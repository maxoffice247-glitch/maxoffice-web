import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["le-quoc-hung"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/le-quoc-hung" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function LeQuocHungPage() {
  return <LocationPageTemplate data={data} />;
}
