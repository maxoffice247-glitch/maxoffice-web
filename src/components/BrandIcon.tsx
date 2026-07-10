import Image from "next/image";

const SRC = {
  zalo: "/images/icon-zalo.png",
  messenger: "/images/icon-messenger.png",
} as const;

const LABEL = {
  zalo: "Zalo",
  messenger: "Messenger",
} as const;

/** Real Zalo/Messenger app icon, clipped to a circle that fills its container exactly. */
export default function BrandIcon({
  type,
  className = "h-8 w-8",
  sizes = "40px",
}: {
  type: keyof typeof SRC;
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}>
      <Image src={SRC[type]} alt={LABEL[type]} fill sizes={sizes} className="object-cover" />
    </span>
  );
}
