"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE_PREMIUM = [0.22, 0.9, 0.32, 1] as const;

export default function PageHero({
  image,
  eyebrow,
  title,
  description,
}: {
  image: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative flex min-h-[42vh] items-center overflow-hidden pt-32 pb-16 sm:min-h-[46vh] sm:pt-36 sm:pb-20">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,19,35,0.55)] via-[rgba(11,19,35,0.62)] to-[rgba(9,15,28,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-[rgba(6,12,24,0.85)] to-transparent" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1240px] px-5 sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
      >
        <span className="mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.14em] text-[#8FC1F5] uppercase before:h-[2px] before:w-[22px] before:rounded-full before:bg-accent">
          {eyebrow}
        </span>
        <h1 className="mb-4 max-w-[760px] font-display text-[32px] leading-[1.18] font-extrabold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-[42px] lg:text-[50px]">
          {title}
        </h1>
        {description && (
          <p className="max-w-[640px] text-base text-white/86 sm:text-lg">
            {description}
          </p>
        )}
      </motion.div>
    </section>
  );
}
