"use client";

import { useState } from "react";
import { CheckCircleIcon } from "./icons";

export type ChecklistGroup = { groupTitle: string; items: string[] };

export default function ChecklistList({ groups }: { groups: ChecklistGroup[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  return (
    <div>
      <div className="mb-7 flex items-center justify-between rounded-xl bg-primary-tint px-5 py-3.5 print:hidden">
        <span className="text-[13.5px] font-bold text-navy">Tiến độ của bạn</span>
        <span className="font-mono text-[14px] font-bold text-primary">
          {doneCount}/{totalItems} mục
        </span>
      </div>

      {groups.map((group, gi) => (
        <div key={group.groupTitle} className="mb-8 last:mb-0">
          <h3 className="mb-4 text-[16px] font-bold text-navy">{group.groupTitle}</h3>
          <ul className="space-y-2.5">
            {group.items.map((item, ii) => {
              const key = `${gi}-${ii}`;
              const isChecked = !!checked[key];
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4 transition-colors duration-200 hover:border-primary/30">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="sr-only print:hidden"
                    />
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 print:hidden ${
                        isChecked
                          ? "border-primary bg-primary text-white"
                          : "border-line text-transparent"
                      }`}
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={`text-[14.5px] leading-relaxed ${
                        isChecked ? "text-body-text line-through" : "text-ink"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
