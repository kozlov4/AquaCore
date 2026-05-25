"use client";

import { useEffect, useState } from "react";
import { X, Filter, Lightbulb, Thermometer, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const categories = [
  {
    label: "Фільтрація",
    value: "Фільтрація",
    icon: Filter,
    specsLabel: "Потужність",
    placeholder: "Напр., 800 л/год",
  },
  {
    label: "Освітлення",
    value: "Освітлення",
    icon: Lightbulb,
    specsLabel: "Графік та інтенсивність",
    placeholder: "Напр., 8 годин, 70%",
  },
  {
    label: "Обігрів",
    value: "Обігрів / Охолодження",
    icon: Thermometer,
    specsLabel: "Потужність",
    placeholder: "Напр., 100 Вт",
  },
  {
    label: "Інше",
    value: "Інше",
    icon: Wrench,
    specsLabel: "Додаткові характеристики",
    placeholder: "Будь-які деталі...",
  },
];

const maintenanceOptions = [
  {
    label: "Не потребує",
    value: "",
  },
  {
    label: "Кожні 7 днів",
    value: 7,
  },
  {
    label: "Кожні 14 днів",
    value: 14,
  },
  {
    label: "Кожні 30 днів",
    value: 30,
  },
  {
    label: "Кожні 90 днів",
    value: 90,
  },
  {
    label: "Кожні 180 днів",
    value: 180,
  },
];

export function AddEquipmentModal({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    category: "Фільтрація",
    name: "",
    specifications: "",
    installation_date: todayInputDate(),
    maintenance_interval_days: 14,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCategory =
    categories.find((category) => category.value === formData.category) ||
    categories[0];

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setIsSubmitting(false);
      setFormData({
        category: "Фільтрація",
        name: "",
        specifications: "",
        installation_date: todayInputDate(),
        maintenance_interval_days: 14,
      });
    }
  }, [isOpen]);

  const saving = isSaving || isSubmitting;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!formData.name.trim()) {
        throw new Error("Введіть бренд та модель обладнання");
      }

      await onSave?.({
        category: formData.category,
        name: formData.name.trim(),
        specifications: formData.specifications.trim(),
        installation_date: formData.installation_date,
        maintenance_interval_days: formData.maintenance_interval_days,
      });

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося додати обладнання");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) onClose?.();
            }}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[520px] overflow-hidden rounded-[20px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-7 py-5">
                <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#111827]">
                  Нове обладнання
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-slate-100 hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-7 py-6">
                {errorMessage && (
                  <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="mb-5">
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#98a2b3]">
                    Категорія
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = formData.category === category.value;

                      return (
                        <button
                          key={category.value}
                          type="button"
                          disabled={saving}
                          onClick={() => handleChange("category", category.value)}
                          className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-extrabold transition-all ${
                            isActive
                              ? "border-[#5b4cf6] bg-[#5b4cf6] text-white shadow-[0_10px_24px_rgba(91,76,246,0.22)]"
                              : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cfd7e6] hover:bg-[#f8fafc]"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <Icon size={14} />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#98a2b3]">
                      Бренд та модель
                    </label>

                    <input
                      value={formData.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      disabled={saving}
                      placeholder="Напр. Aquael Fan 1 Plus"
                      className="h-12 w-full rounded-xl border border-[#d6dbe4] px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#5b4cf6]">
                      {activeCategory.specsLabel}
                    </label>

                    <input
                      value={formData.specifications}
                      onChange={(event) =>
                        handleChange("specifications", event.target.value)
                      }
                      disabled={saving}
                      placeholder={activeCategory.placeholder}
                      className="h-12 w-full rounded-xl border border-[#c7d2fe] bg-[#f8fbff] px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#98a2b3]">
                        Дата установки
                      </label>

                      <input
                        type="date"
                        value={formData.installation_date}
                        onChange={(event) =>
                          handleChange("installation_date", event.target.value)
                        }
                        disabled={saving}
                        className="h-12 w-full rounded-xl border border-[#d6dbe4] px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#98a2b3]">
                        Обслуговування
                      </label>

                      <select
                        value={formData.maintenance_interval_days}
                        onChange={(event) =>
                          handleChange(
                            "maintenance_interval_days",
                            event.target.value
                          )
                        }
                        disabled={saving}
                        className="h-12 w-full rounded-xl border border-[#d6dbe4] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                      >
                        {maintenanceOptions.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#f8fafc] px-7 py-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl px-5 py-3 text-sm font-extrabold text-[#64748b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-xl bg-[#5b4cf6] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)] transition hover:bg-[#4d3fe0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Додавання..." : "Додати пристрій"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddEquipmentModal;