"use client";

export function AquariumWaterTypeSelector({ waterType, setWaterType }) {
  return (
    <div>
      <p className="mb-3 text-base font-semibold text-gray-700">
        Тип водойми <span className="text-red-500">*</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        {["Прісноводний", "Морський"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setWaterType(type)}
            className={`rounded-xl border px-4 py-3 text-base font-semibold transition ${
              waterType === type
                ? "border-[#5B4CF6] bg-[#5B4CF6]/5 text-[#5B4CF6]"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#5B4CF6]/40"
            }`}
          >
            {type === "Прісноводний" ? "🌿" : "🌊"} {type}
          </button>
        ))}
      </div>
    </div>
  );
}