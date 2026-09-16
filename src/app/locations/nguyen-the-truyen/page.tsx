import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["nguyen-the-truyen"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/nguyen-the-truyen" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function NguyenTheTruyenPage() {
  return <LocationPageTemplate data={data} />;
}
