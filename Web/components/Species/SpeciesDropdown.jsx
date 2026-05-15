"use client";

import { ChevronDown } from "lucide-react";

export function SpeciesDropdown({ value, onChange, options, className = "" }) {
  return (
    <label className={`relative block ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full appearance-none rounded-xl border border-slate-200
          bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-700
          outline-none transition hover:border-[#635BFF]/40
          focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </label>
  );
}