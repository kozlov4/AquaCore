"use client";

import { ChevronDown } from "lucide-react";

export function SpeciesDropdown({
  title,
  value,
  onChange,
  options,
  className = "",
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <div
      className={`min-w-[190px] overflow-hidden rounded-[10px] border border-[#e2e8f0] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)] ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-3">
          <span className="text-[11px] font-extrabold text-[#5b4cf6]">
            {title}
          </span>
          <ChevronDown size={14} className="text-[#5b4cf6]" />
        </div>
      )}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[42px] w-full appearance-none bg-white px-4 text-[12px] font-bold text-[#111827] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {selected && (
        <div className="border-t border-[#f1f3f7] px-4 py-2 text-[10px] font-medium text-[#98a2b3]">
          Обрано: {selected.label}
        </div>
      )}
    </div>
  );
}

export default SpeciesDropdown;