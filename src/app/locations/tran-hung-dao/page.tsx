import type { Metadata } from "next";
import LocationPageTemplate from "@/components/LocationPageTemplate";
import { LOCATIONS_DATA } from "@/lib/locationsData";

const data = LOCATIONS_DATA["tran-hung-dao"];

export const metadata: Metadata = {
  alternates: { canonical: "/locations/tran-hung-dao" },
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function TranHungDaoPage() {
  return <LocationPageTemplate data={data} />;
}
