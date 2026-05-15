"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const taskTypes = [
  "💧 Підміна води",
  "⚙️ Чистка фільтра",
  "🧪 Тести води",
  "🌿 Добрива",
];

export function TaskModal({ isOpen, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState("💧 Підміна води");
  const [customTitle, setCustomTitle] = useState("");
  const [date, setDate] = useState("2026-04-24");
  const [repeat, setRepeat] = useState("Кожного тижня");

  const handleSave = () => {
    const task = {
      type: selectedType,
      title: customTitle || selectedType,
      date,
      repeat,
    };

    console.log("Нове завдання:", task);

    if (onSave) onSave(task);
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
                Нове завдання
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
                <p className="mb-3 text-base font-semibold text-gray-700">
                  Тип завдання
                </p>

                <div className="flex flex-wrap gap-2">
                  {taskTypes.map((type) => {
                    const isActive = selectedType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`rounded-xl border px-4 py-2 text-base font-semibold transition ${
                          isActive
                            ? "border-blue-200 bg-blue-50 text-blue-600 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Або введіть власну назву
                </label>

                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Наприклад: Протерти скло"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Коли?
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Повторювати
                  </label>

                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                  >
                    <option>Не повторювати</option>
                    <option>Кожного дня</option>
                    <option>Кожного тижня</option>
                    <option>Кожного місяця</option>
                  </select>
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
                Зберегти завдання
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}