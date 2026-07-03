"use client";

import { useRef, type ChangeEvent } from "react";

type CurrencyInputProps = {
  value: string;
  onChange: (rawDigits: string) => void;
  placeholder?: string;
  unit?: string;
  className?: string;
  id?: string;
  required?: boolean;
};

export default function CurrencyInput({
  value,
  onChange,
  placeholder,
  unit = "đ",
  className = "",
  id,
  required,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onChange(raw);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const displayValue = value ? Number(value).toLocaleString("vi-VN") : "";

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        required={required}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className={`${className} !pr-11`}
      />
      <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-bold text-body-text/70">
        {unit}
      </span>
    </div>
  );
}
