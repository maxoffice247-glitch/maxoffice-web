"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { normalizeVN } from "@/lib/normalizeVN";
import type { BranchAddressGroup, BranchAddressOption } from "@/lib/branchAddress";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink transition-colors duration-200 placeholder:text-[14px] placeholder:italic placeholder:text-body-text/55 focus:border-primary focus:outline-none aria-[invalid=true]:border-accent sm:text-[14.5px] sm:placeholder:text-[14.5px]";

/**
 * Ô chọn địa chỉ chi nhánh MAX OFFICE có tìm kiếm (combobox, mẫu ARIA 1.2 kiểu
 * "list autocomplete"). Tìm kiếm dùng ĐÚNG hàm normalizeVN của ô tìm chi nhánh ở
 * /dia-diem (không phân biệt dấu, "Phường"="P.", bỏ "Q.") và cùng luật khớp:
 * trùng tên khu vực → hiện cả khu vực; ngược lại khớp tên/địa chỉ chi nhánh.
 *
 * Chưa chọn: hiện ô tìm + danh sách nhóm theo khu vực. Đã chọn: ô địa chỉ CHỈ ĐỌC
 * + nút "Đổi chi nhánh". `id` luôn gắn vào đúng 1 control ở mỗi trạng thái (ô tìm
 * hoặc ô chỉ đọc) để nhãn/lỗi/focus của form trỏ được tới.
 */
export default function BranchAddressCombobox({
  id,
  groups,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  groups: BranchAddressGroup[];
  /** Slug chi nhánh đang chọn, "" = chưa chọn. */
  value: string;
  onChange: (slug: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const changeBtnRef = useRef<HTMLButtonElement>(null);
  const focusAfter = useRef<"input" | "change" | null>(null);

  const selected: BranchAddressOption | null = useMemo(() => {
    for (const g of groups) {
      const o = g.options.find((x) => x.slug === value);
      if (o) return o;
    }
    return null;
  }, [groups, value]);

  const filtered = useMemo(() => {
    const nq = normalizeVN(query.trim());
    if (!nq) return groups;
    return groups
      .map((g) => ({
        ...g,
        options: normalizeVN(g.areaName).includes(nq)
          ? g.options
          : g.options.filter((o) =>
              [o.name, o.shortAddress, o.address].some((t) => normalizeVN(t).includes(nq))
            ),
      }))
      .filter((g) => g.options.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.options), [filtered]);
  const optId = (slug: string) => `${uid}-opt-${slug}`;
  const activeOption = open ? flat[Math.min(active, flat.length - 1)] : undefined;

  useEffect(() => {
    if (focusAfter.current === "input") inputRef.current?.focus();
    if (focusAfter.current === "change") changeBtnRef.current?.focus();
    focusAfter.current = null;
  }, [value]);

  useEffect(() => {
    if (open && activeOption) document.getElementById(optId(activeOption.slug))?.scrollIntoView({ block: "nearest" });
    // optId chỉ phụ thuộc uid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeOption]);

  function choose(o: BranchAddressOption) {
    focusAfter.current = "change";
    setOpen(false);
    setQuery("");
    onChange(o.slug);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(Math.max(flat.length - 1, 0));
    } else if (e.key === "Enter") {
      // Luôn chặn Enter ở đây để không vô tình gửi form khi đang chọn chi nhánh.
      e.preventDefault();
      if (open && activeOption) choose(activeOption);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <textarea
            id={id}
            readOnly
            rows={2}
            value={selected.address}
            aria-label="Địa chỉ (chi nhánh MAX OFFICE đã chọn, chỉ đọc)"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={`${inputClass} resize-none bg-bg-tint font-semibold text-navy`}
          />
          <p className="mt-1.5 text-[12.5px] text-body-text">Chi nhánh MAX OFFICE: {selected.name}</p>
        </div>
        <button
          ref={changeBtnRef}
          type="button"
          onClick={() => {
            focusAfter.current = "input";
            setQuery("");
            onChange("");
          }}
          className="min-h-[44px] shrink-0 rounded-full border-[1.5px] border-line bg-white px-5 text-[13.5px] font-bold text-navy transition-colors duration-200 hover:border-primary hover:text-primary"
        >
          Đổi chi nhánh
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOption ? optId(activeOption.slug) : undefined}
        aria-label="Tìm và chọn chi nhánh MAX OFFICE"
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="Tìm chi nhánh: tên đường, phường, quận cũ (VD: Sông Thao, Tân Sơn Hòa, Quận 1)"
        className={inputClass}
      />
      <p role="status" className="sr-only">
        {open ? (flat.length ? `${flat.length} chi nhánh phù hợp` : "Không tìm thấy chi nhánh phù hợp") : ""}
      </p>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Danh sách chi nhánh MAX OFFICE theo khu vực"
          className="absolute left-0 right-0 z-20 mt-1.5 max-h-[min(340px,55vh)] overflow-y-auto overflow-x-hidden rounded-xl border border-line bg-white shadow-[0_12px_32px_rgba(15,27,45,0.14)]"
        >
          {flat.length === 0 && (
            <p className="px-4 py-3 text-[13.5px] text-body-text">Không tìm thấy chi nhánh phù hợp. Thử gõ tên đường hoặc phường.</p>
          )}
          {filtered.map((g) => (
            <div key={g.areaSlug} role="group" aria-labelledby={`${uid}-grp-${g.areaSlug}`}>
              <div
                id={`${uid}-grp-${g.areaSlug}`}
                className="sticky top-0 bg-bg-tint px-4 py-2 text-[12px] font-bold tracking-wide text-navy uppercase"
              >
                {g.areaName}
              </div>
              {g.options.map((o) => {
                const isActive = activeOption?.slug === o.slug;
                return (
                  <div
                    key={o.slug}
                    id={optId(o.slug)}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() => setActive(flat.findIndex((x) => x.slug === o.slug))}
                    onClick={() => choose(o)}
                    className={`min-h-[44px] cursor-pointer px-4 py-2.5 ${isActive ? "bg-primary-tint" : ""}`}
                  >
                    <span className="block text-[14px] leading-snug break-words text-ink">{o.address}</span>
                    <span className="mt-0.5 block text-[12px] text-body-text">{o.name}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
