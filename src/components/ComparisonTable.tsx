import Reveal from "./Reveal";

export type ComparisonTableRow = {
  label: string;
  left: string;
  right: string;
};

export default function ComparisonTable({
  leftLabel,
  rightLabel,
  rows,
}: {
  leftLabel: string;
  rightLabel: string;
  rows: ComparisonTableRow[];
}) {
  return (
    <Reveal className="mx-auto max-w-[960px] overflow-x-auto rounded-2xl border border-line shadow-soft">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="w-[28%] px-6 py-4 text-[13.5px] font-bold text-body-text">
              Tiêu chí
            </th>
            <th className="w-[36%] bg-primary-tint px-6 py-4 text-[14px] font-bold text-primary">
              {leftLabel}
            </th>
            <th className="w-[36%] bg-accent/8 px-6 py-4 text-[14px] font-bold text-accent-dark">
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i !== rows.length - 1 ? "border-b border-line" : ""}>
              <td className="px-6 py-4 text-[14px] font-bold text-navy">{row.label}</td>
              <td className="bg-primary-tint/30 px-6 py-4 text-[13.5px] leading-relaxed text-ink">
                {row.left}
              </td>
              <td className="bg-accent/4 px-6 py-4 text-[13.5px] leading-relaxed text-ink">
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
