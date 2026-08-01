import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["lam-son"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/lam-son" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function LamSonPage() {
  return <LocationPageTemplate data={data} />;
}
