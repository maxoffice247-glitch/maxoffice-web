import { renderOgImage, size, contentType } from "@/lib/og";
import { SERVICES_DATA } from "@/lib/servicesData";

export { size, contentType };

export default async function Image() {
  const data = SERVICES_DATA["thanh-lap-doanh-nghiep"];
  return renderOgImage({
    title: data.metaTitle,
    backgroundImagePath: data.image.replace("/images/", "/images/og/"),
  });
}
