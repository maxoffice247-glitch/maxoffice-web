import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["truong-chinh"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/truong-chinh" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function TruongChinhPage() {
  return <LocationPageTemplate data={data} />;
}
