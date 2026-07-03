import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import { CheckCircleIcon, CloseIcon } from "./icons";

export type ComparisonRow = {
  criteria: string;
  max: string;
  traditional: string;
};

export default function ServiceComparison({
  title,
  description,
  alternativeLabel,
  rows,
}: {
  title: string;
  description?: string;
  alternativeLabel: string;
  rows: ComparisonRow[];
}) {
  return (
    <section className="py-9">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead eyebrow="So sánh" title={title} description={description} />
        <Reveal className="mx-auto max-w-[900px] overflow-x-auto rounded-2xl border border-line shadow-soft">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[34%] px-6 py-4 text-[13.5px] font-bold text-body-text">
                  Tiêu chí
                </th>
                <th className="w-[33%] bg-primary-tint px-6 py-4 text-[13.5px] font-bold text-primary">
                  MAX OFFICE
                </th>
                <th className="w-[33%] px-6 py-4 text-[13.5px] font-bold text-body-text">
                  {alternativeLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.criteria} className={i !== rows.length - 1 ? "border-b border-line" : ""}>
                  <td className="px-6 py-4 text-[14px] font-bold text-navy">{row.criteria}</td>
                  <td className="bg-primary-tint/40 px-6 py-4 text-[13.5px] text-ink">
                    <span className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {row.max}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13.5px] text-body-text">
                    <span className="flex items-start gap-2">
                      <CloseIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-body-text/60" />
                      {row.traditional}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
