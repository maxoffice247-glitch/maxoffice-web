"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";

const BAR_COLOR = "#E53935";

type NavIndicatorContextValue = {
  registerRef: (key: string, node: HTMLElement | null) => void;
  setHoveredKey: (key: string | null) => void;
};

const NavIndicatorContext = createContext<NavIndicatorContextValue | null>(null);

export function useNavIndicator() {
  const ctx = useContext(NavIndicatorContext);
  if (!ctx) {
    throw new Error("useNavIndicator must be used within NavIndicatorProvider");
  }
  return ctx;
}

// Wraps the desktop nav items and renders a single sliding underline that
// tracks whichever item is hovered, falling back to the active route's item
// when nothing is hovered — instead of every item drawing its own bar.
export function NavIndicatorProvider({
  activeKey,
  children,
}: {
  activeKey: string | null;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [bar, setBar] = useState({ left: 0, width: 0, opacity: 0 });

  const displayKey = hoveredKey ?? activeKey;

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const node = displayKey ? (itemRefs.current.get(displayKey) ?? null) : null;
      if (!container || !node) {
        setBar((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      setBar({ left: nodeRect.left - containerRect.left, width: nodeRect.width, opacity: 1 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [displayKey]);

  const registerRef = (key: string, node: HTMLElement | null) => {
    if (node) itemRefs.current.set(key, node);
    else itemRefs.current.delete(key);
  };

  return (
    <NavIndicatorContext.Provider value={{ registerRef, setHoveredKey }}>
      <nav
        aria-label="Menu chính"
        ref={containerRef}
        className="relative hidden items-center gap-7 xl:flex"
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-7px] left-0 h-[2px] rounded-full transition-[transform,width,opacity] duration-300 ease-out"
          style={{
            backgroundColor: BAR_COLOR,
            width: `${bar.width}px`,
            transform: `translateX(${bar.left}px)`,
            opacity: bar.opacity,
          }}
        />
      </nav>
    </NavIndicatorContext.Provider>
  );
}

export function NavLink({
  href,
  label,
  isActive,
  solid,
}: {
  href: string;
  label: string;
  isActive: boolean;
  solid: boolean;
}) {
  const { registerRef, setHoveredKey } = useNavIndicator();

  return (
    <Link
      href={href}
      ref={(node) => registerRef(href, node)}
      onMouseEnter={() => setHoveredKey(href)}
      onMouseLeave={() => setHoveredKey(null)}
      className={`text-[14.5px] whitespace-nowrap transition-colors duration-300 ${
        isActive
          ? "font-bold text-accent"
          : `font-semibold hover:text-accent ${solid ? "text-ink" : "text-white/90"}`
      }`}
    >
      {label}
    </Link>
  );
}
