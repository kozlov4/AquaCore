"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddEquipmentModal({ isOpen, onClose, onSave }) {
  const [category, setCategory] = useState("Обігрів / Охолодження");
  const [model, setModel] = useState("");
  const [installedDate, setInstalledDate] = useState("2026-04-23");
  const [serviceInterval, setServiceInterval] = useState("Не потребує");

  const handleSave = () => {
    if (!model.trim()) {
      alert("Введіть модель пристрою");
      return;
    }

    onSave?.({
      category,
      model,
      installedDate,
      serviceInterval,
    });

    setModel("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Встановлення обладнання
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 px-7 py-6">
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Категорія
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                >
                  <option>Обігрів / Охолодження</option>
                  <option>Фільтрація</option>
                  <option>Освітлення</option>
                  <option>CO₂ система</option>
                  <option>Аерація</option>
                  <option>Інше</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Модель пристрою
                </label>

                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Напр: Aquael Ultra Heater 100W"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Встановлено
                  </label>

                  <input
                    type="date"
                    value={installedDate}
                    onChange={(e) => setInstalledDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Обслуговування
                  </label>

                  <select
                    value={serviceInterval}
                    onChange={(e) => setServiceInterval(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                  >
                    <option>Не потребує</option>
                    <option>Раз на тиждень</option>
                    <option>Раз на місяць</option>
                    <option>Раз на 3 місяці</option>
                    <option>Раз на 6 місяців</option>
                  </select>
                </div>
              </div>

              <p className="text-sm leading-6 text-gray-400">
                Система автоматично нагадуватиме про необхідність чистки або
                заміни деталей на основі вибраного інтервалу.
              </p>
            </div>

            <div className="flex items-center justify-end gap-4 bg-gray-50 px-7 py-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{
                  y: -2,
                  boxShadow: "0 14px 30px rgba(91,76,246,.28)",
                }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl bg-[#5B4CF6] px-6 py-3 font-semibold text-white transition hover:bg-[#4d3feb]"
              >
                Додати пристрій
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}