"use client";

import { motion } from "framer-motion";
import { Resident } from "./Resident";

function getCompatibilityBadge(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("danger") ||
    value.includes("critical") ||
    value.includes("bad") ||
    value.includes("unsafe") ||
    value.includes("несум") ||
    value.includes("небез") ||
    value.includes("ризик") ||
    value.includes("конфлікт")
  ) {
    return {
      icon: "⛔",
      title: "Акваріум у небезпеці",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (
    value.includes("warning") ||
    value.includes("medium") ||
    value.includes("attention") ||
    value.includes("уваг")
  ) {
    return {
      icon: "⚠️",
      title: "Потрібна увага",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  if (
    value.includes("excellent") ||
    value.includes("good") ||
    value.includes("safe") ||
    value.includes("ok") ||
    value.includes("суміс") ||
    value.includes("відмін")
  ) {
    return {
      icon: "✅",
      title: "Сумісність відмінна",
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    icon: "ℹ️",
    title: "Стан сумісності",
    className: "border-blue-100 bg-blue-50 text-blue-700",
  };
}

export function PopulationTab({
  population,
  residents = [],
  isLoading,
  error,
  onReload,
  onAddResident,
}) {
  const badge = getCompatibilityBadge(population?.compatibilityStatus);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/70 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Населення акваріума
          </h2>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            Загальна кількість: {population?.totalIndividuals ?? 0}{" "}
            {population?.totalIndividuals === 1 ? "особина" : "особин"} •{" "}
            {population?.totalSpecies ?? residents.length}{" "}
            {population?.totalSpecies === 1 ? "вид" : "види"}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddResident}
          className="rounded-2xl bg-[#5B4CF6] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#5B4CF6]/20 transition hover:-translate-y-0.5 hover:bg-[#4f43df]"
        >
          + Додати жителів
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">{error}</p>

          <button
            type="button"
            onClick={onReload}
            className="mt-3 rounded-xl bg-white px-4 py-2 text-xs font-black text-red-600 shadow-sm"
          >
            Спробувати ще раз
          </button>
        </div>
      )}

      <div className={`mb-6 rounded-2xl border p-4 ${badge.className}`}>
        <p className="text-sm font-black">
          {badge.icon} {badge.title}
        </p>

        <p className="mt-1 text-sm font-semibold opacity-90">
          {population?.compatibilityText ||
            "Інформація про сумісність поки відсутня."}
        </p>

        {Array.isArray(population?.aggressiveResidents) &&
          population.aggressiveResidents.length > 0 && (
            <div className="mt-4 rounded-xl bg-white/70 p-3">
              <p className="text-xs font-black uppercase tracking-wide">
                Проблемні жителі:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {population.aggressiveResidents.map((resident) => (
                  <span
                    key={resident.id}
                    className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700"
                  >
                    {resident.name}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm font-bold text-gray-500">
          Завантаження населення...
        </div>
      ) : residents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-lg font-black text-gray-800">Жителів ще немає</p>

          <p className="mt-2 text-sm font-semibold text-gray-500">
            Натисни “Додати жителів”, обери вид, перевір сумісність і засели
            його в акваріум.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {residents.map((resident, index) => (
            <Resident
              key={resident.id || `${resident.name}-${index}`}
              name={resident.name}
              latin={resident.latin}
              count={resident.count}
              icon={resident.icon}
              settlementDate={resident.settlementDate}
              character={resident.character}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
