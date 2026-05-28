"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function EquipmentTab({
  equipment = [],
  isLoading,
  error,
  onReload,
  onAddEquipment,
  onServiceEquipment,
  servicingEquipmentId,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/70 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Технічне оснащення
          </h2>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            Фільтрація, світло, CO₂, обігрів та інше обладнання
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEquipment}
          className="rounded-2xl bg-[#5B4CF6] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#5B4CF6]/20 transition hover:-translate-y-0.5 hover:bg-[#4f43df]"
        >
          + Додати пристрій
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

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm font-bold text-gray-500">
          Завантаження обладнання...
        </div>
      ) : equipment.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-lg font-black text-gray-800">
            Обладнання ще не додано
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-500">
            Натисни “Додати пристрій”, щоб додати фільтр, світло, обігрівач або
            інше обладнання.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {equipment.map((item) => {
            const isServicing = servicingEquipmentId === item.id;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {item.icon || "🔧"}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-gray-500">
                      {item.specifications || item.desc}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-600">
                        {item.category}
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-600">
                        Обслуговування: {item.maintenanceIntervalText}
                      </span>

                      {item.daysUntilMaintenance !== null &&
                        item.daysUntilMaintenance !== undefined && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              Number(item.daysUntilMaintenance) <= 0
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {Number(item.daysUntilMaintenance) <= 0
                              ? "Потрібне обслуговування"
                              : `До обслуговування: ${item.daysUntilMaintenance} дн.`}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400">
                      Встановлено
                    </p>

                    <p className="text-sm font-black text-gray-700">
                      {item.installationDateFormatted}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onServiceEquipment?.(item.id)}
                    disabled={isServicing}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 transition hover:border-[#5B4CF6] hover:text-[#5B4CF6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={17} />
                    {isServicing ? "Обслуговую..." : "Обслужити"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

export default EquipmentTab;