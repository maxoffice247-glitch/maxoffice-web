import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["ut-tich"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/ut-tich" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function UtTichPage() {
  return <LocationPageTemplate data={data} />;
}
