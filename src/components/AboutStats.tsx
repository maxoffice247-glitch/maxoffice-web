import Reveal from "./Reveal";
import { BuildingIcon, UsersIcon, CalendarIcon } from "./icons";

const STATS = [
  { icon: BuildingIcon, value: "12", label: "Địa điểm tại TP.HCM" },
  { icon: UsersIcon, value: "500", suffix: "+", label: "Doanh nghiệp tin dùng" },
  { icon: CalendarIcon, value: "2022", label: "Năm thành lập" },
];

export default function AboutStats() {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="grid grid-cols-1 divide-y divide-line rounded-2xl border border-line bg-white shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-7 py-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-baseline gap-0.5 font-mono text-[30px] font-bold text-primary">
                  {stat.value}
                  {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                </div>
                <div className="text-[13.5px] font-medium text-body-text">{stat.label}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
