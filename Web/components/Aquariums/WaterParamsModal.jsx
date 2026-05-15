"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WaterParamsModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: "2026-04-23",
    ph: "7.0",
    gh: "8",
    kh: "4",
    nh3: "0.0",
    no2: "0.0",
    no3: "10",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Параметри води:", formData);

    if (onSave) {
      onSave(formData);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Запис параметрів води
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
                  Дата тестування
                </label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <h3 className="mb-4 text-base font-bold uppercase text-blue-700">
                  Основні показники
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      pH
                    </label>
                    <input
                      type="number"
                      value={formData.ph}
                      onChange={(e) => handleChange("ph", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      GH
                    </label>
                    <input
                      type="number"
                      value={formData.gh}
                      onChange={(e) => handleChange("gh", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      KH
                    </label>
                    <input
                      type="number"
                      value={formData.kh}
                      onChange={(e) => handleChange("kh", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
                <h3 className="mb-4 text-base font-bold uppercase text-red-700">
                  Азотний цикл &#40;токсини&#41;
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      Аміак &#40;NH3&#41;
                    </label>
                    <input
                      type="number"
                      value={formData.nh3}
                      onChange={(e) => handleChange("nh3", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      Нітрити &#40;NO2&#41;
                    </label>
                    <input
                      type="number"
                      value={formData.no2}
                      onChange={(e) => handleChange("no2", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      Нітрати &#40;NO3&#41;
                    </label>
                    <input
                      type="number"
                      value={formData.no3}
                      onChange={(e) => handleChange("no3", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                </div>
              </div>
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
                Зберегти результати
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}