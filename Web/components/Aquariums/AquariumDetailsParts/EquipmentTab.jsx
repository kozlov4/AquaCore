"use client";

import { motion } from "framer-motion";
import { Cog, Plus, Wrench, CalendarDays, CheckCircle2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function getEquipmentIcon(category) {
  const text = String(category || "").toLowerCase();

  if (text.includes("фільтр")) return "⚙️";
  if (text.includes("світ") || text.includes("освіт")) return "💡";
  if (text.includes("обігр")) return "🌡️";
  if (text.includes("co")) return "🫧";

  return "🔧";
}

export function EquipmentTab({
  equipment = [],
  onAddEquipment,
  onServiceEquipment,
  isServiceLoading = false,
}) {
  return (
    <section className="mx-auto max-w-[960px] rounded-[28px] border border-[#eef0f4] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-10">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111827]">
            Технічне оснащення
          </h2>

          <p className="mt-2 text-[16px] font-medium text-[#98a2b3]">
            Фільтрація, світло, CO₂ та обігрів
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onAddEquipment}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex h-[58px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#635bff] to-[#8738ef] px-7 text-[16px] font-extrabold text-white shadow-[0_18px_38px_rgba(99,91,255,0.24)]"
        >
          <Plus size={21} />
          Додати пристрій
        </motion.button>
      </div>

      {equipment.length > 0 ? (
        <div className="space-y-5">
          {equipment.map((item, index) => (
            <motion.article
              key={item.id || `${item.name}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="flex flex-col gap-4 rounded-[18px] bg-[#f8fafc] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] bg-white text-[22px] shadow-sm">
                  {item.icon || getEquipmentIcon(item.category)}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-[18px] font-extrabold text-[#111827]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-[15px] font-medium text-[#98a2b3]">
                    {item.specifications || item.desc || item.category || "Без опису"}
                  </p>

                  {item.days_until_maintenance !== null &&
                    item.days_until_maintenance !== undefined && (
                      <p className="mt-1 text-xs font-bold text-[#635bff]">
                        До обслуговування: {item.days_until_maintenance} дн.
                      </p>
                    )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[13px] font-medium text-[#98a2b3]">
                    Встановлено
                  </p>

                  <p className="text-[14px] font-extrabold text-[#475467]">
                    {formatDate(item.installation_date || item.date)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isServiceLoading}
                  onClick={() => onServiceEquipment?.(item)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe3ec] bg-white px-4 text-xs font-extrabold text-[#475467] transition hover:border-[#5b4cf6] hover:text-[#5b4cf6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={15} />
                  Обслужити
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#635bff] shadow-sm">
            <Wrench size={24} />
          </div>

          <h3 className="text-lg font-extrabold text-[#111827]">
            Обладнання ще не додано
          </h3>

          <p className="mx-auto mt-2 max-w-[420px] text-sm font-medium text-[#98a2b3]">
            Додайте фільтр, світильник, обігрівач або інше обладнання для цього
            акваріума.
          </p>
        </div>
      )}
    </section>
  );
}

export default EquipmentTab;