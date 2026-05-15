"use client";

export function AquariumTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  suffix,
}) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 ${
            suffix ? "pr-10" : ""
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}