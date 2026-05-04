"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AquariumSettingsModal({
  isOpen,
  aquarium,
  onClose,
  onSave,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [environment, setEnvironment] = useState("");

  useEffect(() => {
    if (aquarium) {
      setName(aquarium.name || "");
      setVolume(aquarium.volume?.replace(" л", "") || "");
      setEnvironment(aquarium.environment || "Прісноводний");
    }
  }, [aquarium]);

  const handleSave = () => {
    onSave({
      ...aquarium,
      name,
      volume: `${volume} л`,
      environment,
    });

    onClose();
  };

  const handleDelete = () => {
    onDelete(aquarium.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && aquarium && (
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
            className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Налаштування акваріума
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 px-7 py-6">
              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Назва
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Об&apos;єм &#40;Літри&#41;
                </label>

                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Тип середовища
                </label>

                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                >
                  <option>Прісноводний</option>
                  <option>Морський</option>
                  <option>Креветочник</option>
                  <option>Травник</option>
                </select>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <h3 className="text-lg font-bold text-red-600">
                  Небезпечна зона
                </h3>

                <p className="mt-2 text-sm leading-6 text-red-500">
                  Видалення акваріума назавжди знищить усю історію параметрів,
                  жителів та завдань.
                </p>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="mt-4 w-full rounded-xl border border-red-300 bg-white py-3 text-base font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Видалити акваріум
                </button>
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
                Зберегти зміни
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}