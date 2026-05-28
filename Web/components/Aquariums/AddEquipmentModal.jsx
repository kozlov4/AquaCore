"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    label: "Фільтрація",
    value: "Фільтрація",
    placeholderName: "Напр., Aquael Fan 1 Plus",
    placeholderSpecs: "Напр., 800 л/год",
    defaultInterval: 30,
  },
  {
    label: "Освітлення",
    value: "Освітлення",
    placeholderName: "Напр., Chihiros WRGB II",
    placeholderSpecs: "Напр., 8 годин, 70%",
    defaultInterval: 60,
  },
  {
    label: "Обігрів",
    value: "Обігрів",
    placeholderName: "Напр., Aquael Ultra Heater",
    placeholderSpecs: "Напр., 100 Вт",
    defaultInterval: 90,
  },
  {
    label: "Інше",
    value: "Інше",
    placeholderName: "Напр., CO₂ система",
    placeholderSpecs: "Будь-які деталі...",
    defaultInterval: 14,
  },
];

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AddEquipmentModal({ isOpen, onClose, onSave }) {
  const [category, setCategory] = useState("Фільтрація");
  const [name, setName] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [installationDate, setInstallationDate] = useState(todayInputDate());
  const [maintenanceIntervalDays, setMaintenanceIntervalDays] = useState("30");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = useMemo(() => {
    return categories.find((item) => item.value === category) || categories[0];
  }, [category]);

  useEffect(() => {
    if (!isOpen) return;

    setCategory("Фільтрація");
    setName("");
    setSpecifications("");
    setInstallationDate(todayInputDate());
    setMaintenanceIntervalDays("30");
    setIsSaving(false);
    setError("");
  }, [isOpen]);

  const handleCategoryChange = (item) => {
    setCategory(item.value);
    setMaintenanceIntervalDays(String(item.defaultInterval));
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError("");

      if (!name.trim()) {
        throw new Error("Введіть бренд та модель обладнання");
      }

      if (!installationDate) {
        throw new Error("Оберіть дату встановлення");
      }

      if (
        maintenanceIntervalDays &&
        Number(maintenanceIntervalDays) <= 0
      ) {
        throw new Error("Інтервал обслуговування має бути більшим за 0");
      }

      await onSave?.({
        category,
        name: name.trim(),
        specifications: specifications.trim(),
        installationDate,
        maintenanceIntervalDays: maintenanceIntervalDays
          ? Number(maintenanceIntervalDays)
          : null,
      });

      onClose?.();
    } catch (saveError) {
      setError(saveError.message || "Не вдалося додати обладнання");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-black text-gray-900">
                Нове обладнання
              </h2>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              <label className="mb-3 block text-xs font-black uppercase tracking-wide text-gray-500">
                Категорія
              </label>

              <div className="mb-5 flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = category === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleCategoryChange(item)}
                      disabled={isSaving}
                      className={`rounded-full px-4 py-2 text-xs font-black transition ${
                        active
                          ? "bg-[#5B4CF6] text-white shadow-lg shadow-[#5B4CF6]/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      } disabled:opacity-60`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                  Бренд та модель
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSaving}
                  placeholder={selectedCategory.placeholderName}
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                  Характеристики
                </label>

                <input
                  value={specifications}
                  onChange={(event) => setSpecifications(event.target.value)}
                  disabled={isSaving}
                  placeholder={selectedCategory.placeholderSpecs}
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                />
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                    Дата установки
                  </label>

                  <input
                    type="date"
                    value={installationDate}
                    onChange={(event) =>
                      setInstallationDate(event.target.value)
                    }
                    disabled={isSaving}
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-900 outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                    Обслуговування
                  </label>

                  <select
                    value={maintenanceIntervalDays}
                    onChange={(event) =>
                      setMaintenanceIntervalDays(event.target.value)
                    }
                    disabled={isSaving}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-900 outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                  >
                    <option value="7">Кожні 7 днів</option>
                    <option value="14">Кожні 14 днів</option>
                    <option value="30">Кожні 30 днів</option>
                    <option value="60">Кожні 60 днів</option>
                    <option value="90">Кожні 90 днів</option>
                    <option value="">Не вказувати</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="h-10 rounded-xl px-4 text-sm font-black text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="h-10 rounded-xl bg-[#5B4CF6] px-5 text-sm font-black text-white shadow-lg shadow-[#5B4CF6]/20 transition hover:bg-[#4f43df] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Додавання..." : "Додати пристрій"}
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