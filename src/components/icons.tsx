type IconProps = {
  className?: string;
};

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function HeartHandshakeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.5 6C6 6 3.5 8.5 3.5 12c0 3 2 5 4.5 5v-3c-1 0-2-1-2-2.5C6 10 7 9 8.5 9V6zm10 0c-3.5 0-6 2.5-6 6 0 3 2 5 4.5 5v-3c-1 0-2-1-2-2.5 0-1.5 1-2.5 2.5-2.5V6z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MapPinLabel({ className, children }: IconProps & { children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.5 12.5L20 3M17 6l3 3M14 9l2.5 2.5" />
    </svg>
  );
}

export function ScreenIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function DocumentCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9.5 15l1.8 1.8L15 13" />
    </svg>
  );
}

export function CalculatorIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 19h1M12 19h1M16 19h1" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 6.4 7 .8-5.2 4.8 1.4 6.9-6.1-3.5-6.1 3.5 1.4-6.9L2.1 9.7l7-.8L12 2.5z" />
    </svg>
  );
}

export function ArrowRightSmallIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function HeadsetIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 13a9 9 0 0 1 18 0v3" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}

export function BadgePercentIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2l2.2 1.3 2.5-.4 1.2 2.2 2.2 1.2-.4 2.5L21 11l-1.3 2.2.4 2.5-2.2 1.2-1.2 2.2-2.5-.4L12 20l-2.2-1.3-2.5.4-1.2-2.2-2.2-1.2.4-2.5L3 11l1.3-2.2-.4-2.5 2.2-1.2 1.2-2.2 2.5.4L12 2z" />
      <path d="M9 15l6-6M9.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM14.5 15a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3.5 6l8.5 6.5L20.5 6" />
    </svg>
  );
}

export function WifiIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5.5 12.3a11 11 0 0 1 13 0" />
      <path d="M9 16.2a5.5 5.5 0 0 1 6 0" />
      <path d="M12 20v.01" />
    </svg>
  );
}

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z" />
      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3.5c-.6.6-.6 1.4 0 2M12 3.5c-.6.6-.6 1.4 0 2" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 21.5s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function SoundIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 15l6-6" />
      <path d="M10.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M13.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" />
    </svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

export function MessengerIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.052 0 11.283c0 3.596 1.797 6.799 4.605 8.888V24l4.203-2.308c1.122.31 2.305.477 3.192.477 6.627 0 12-5.052 12-11.283C24 5.052 18.627 0 12 0Zm1.191 15.193-3.061-3.263-5.976 3.263L10.599 8.71l3.13 3.263L19.637 8.71l-6.446 6.483Z" />
    </svg>
  );
}

export function ZaloIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="9.5"
        letterSpacing="-0.3"
      >
        Zalo
      </text>
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v18M7 21h10M4 7h16" />
      <path d="M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6z" />
    </svg>
  );
}

export function RocketIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2c2.5 2 4 5.5 4 9 0 2-1 4-1 4l-3 3-3-3s-1-2-1-4c0-3.5 1.5-7 4-9z" />
      <circle cx="12" cy="9" r="1.5" />
      <path d="M9 15l-3 3 1 3 3-1M15 15l3 3-1 3-3-1" />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M15 14h3" />
    </svg>
  );
}

export function TrendingUpIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M5 8.2V13a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v-1.2" />
    </svg>
  );
}

export function ZapIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" />
    </svg>
  );
}
