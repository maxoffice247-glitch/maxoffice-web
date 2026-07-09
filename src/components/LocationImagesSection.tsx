"use client";

import { useState } from "react";
import LocationFacade, { type FacadeImage } from "./LocationFacade";
import LocationGallery, { type InteriorImage } from "./LocationGallery";
import Lightbox from "./Lightbox";

export default function LocationImagesSection({
  name,
  facadeImage,
  imageSide = "right",
  paragraphs,
  interiorImages,
}: {
  name: string;
  facadeImage: FacadeImage;
  imageSide?: "left" | "right";
  paragraphs: string[];
  interiorImages?: InteriorImage[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allImages = [
    { src: facadeImage.src, alt: facadeImage.alt },
    ...(interiorImages ?? []).map((img) => ({ src: img.src, alt: img.alt })),
  ];

  return (
    <>
      <LocationFacade
        name={name}
        image={facadeImage}
        imageSide={imageSide}
        paragraphs={paragraphs}
        onImageClick={() => setOpenIndex(0)}
      />
      <LocationGallery images={interiorImages} onImageClick={(i) => setOpenIndex(i + 1)} />
      <Lightbox images={allImages} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </>
  );
}
