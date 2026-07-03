import Reveal from "./Reveal";
import { BuildingIcon, UsersIcon, CalendarIcon, TagIcon } from "./icons";

const STATS = [
  {
    icon: BuildingIcon,
    value: "12",
    label: "Địa điểm tại TP.HCM",
    border: "border-r border-b border-line sm:border-b-0 sm:border-r sm:border-line",
  },
  {
    icon: UsersIcon,
    value: "500",
    suffix: "+",
    label: "Doanh nghiệp tin dùng",
    border: "border-b border-line sm:border-b-0 sm:border-r sm:border-line",
  },
  {
    icon: CalendarIcon,
    value: "2022",
    label: "Năm thành lập",
    border: "border-r border-line sm:border-r sm:border-line",
  },
  {
    icon: TagIcon,
    value: "6",
    label: "Dịch vụ cốt lõi",
    border: "",
  },
];

export default function StatsFloat() {
  return (
    <div className="relative z-20 mx-auto -mt-20 max-w-[1240px] px-5 sm:-mt-24 sm:px-8 lg:-mt-28">
      <Reveal className="grid grid-cols-2 rounded-2xl bg-white shadow-float sm:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`group flex items-center gap-4 px-5 py-6 text-left transition-colors duration-300 hover:bg-bg-tint sm:px-7 sm:py-8 ${stat.border}`}
          >
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white sm:flex">
              <stat.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="mb-1 flex items-baseline gap-0.5 font-mono text-[28px] font-bold text-primary sm:text-[34px]">
                {stat.value}
                {stat.suffix && <span className="text-lg sm:text-xl">{stat.suffix}</span>}
              </div>
              <div className="text-[13.5px] font-medium text-body-text">{stat.label}</div>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
