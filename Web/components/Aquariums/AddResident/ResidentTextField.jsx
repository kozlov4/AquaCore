"use client";

export function ResidentTextField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-base font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
      />
    </div>
  );
}