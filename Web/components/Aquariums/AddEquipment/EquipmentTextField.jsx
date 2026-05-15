"use client";

export function EquipmentTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
      />
    </div>
  );
}