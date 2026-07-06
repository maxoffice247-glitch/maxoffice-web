import Image from "next/image";
import Reveal from "./Reveal";

export default function ServiceInlineImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white py-7">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card lg:mx-auto lg:max-w-[680px]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 680px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
