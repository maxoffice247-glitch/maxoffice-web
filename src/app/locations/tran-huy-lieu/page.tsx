import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["tran-huy-lieu"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/tran-huy-lieu" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function TranHuyLieuPage() {
  return <LocationPageTemplate data={data} />;
}
