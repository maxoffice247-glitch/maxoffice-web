import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "link";
type Size = "md" | "lg";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const base =
  "inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap transition-all duration-300 ease-out";

const variantStyles: Record<Variant, string> = {
  primary:
    "rounded-full bg-accent text-white shadow-[0_8px_20px_rgba(229,57,53,0.28)] hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_16px_32px_rgba(229,57,53,0.38)] active:translate-y-0",
  outline:
    "rounded-full border-[1.5px] border-white/55 bg-white/8 text-white backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/18 hover:border-white/80 hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] active:translate-y-0",
  ghost:
    "rounded-full border-[1.5px] border-line bg-white text-navy hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_10px_24px_rgba(15,27,45,0.08)] active:translate-y-0",
  link: "text-accent gap-1.5 hover:gap-2.5",
};

const sizeStyles: Record<Size, string> = {
  md: "px-6 py-3.5 text-[15px]",
  lg: "px-7 py-4 text-[16px]",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  target,
  rel,
  onClick,
}: ButtonProps) {
  const isLink = variant === "link";
  const classes = `${base} ${variantStyles[variant]} ${isLink ? "text-[14.5px] font-bold" : sizeStyles[size]} ${className}`;

  return (
    <Link href={href} target={target} rel={rel} className={classes} onClick={onClick}>
      {children}
      {icon}
    </Link>
  );
}
