import { renderOgImage, size, contentType } from "@/lib/og";
import { LOCATIONS_DATA } from "@/lib/locationsData";

export { size, contentType };

export default async function Image() {
  const data = LOCATIONS_DATA["yen-the"];
  return renderOgImage({
    title: data.metaTitle,
    backgroundImagePath: `/images/og/dia-diem-${data.slug}.jpg`,
  });
}
