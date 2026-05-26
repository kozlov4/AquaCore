"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sizeOptions = [
  { label: "S (до 5 см)", value: "S" },
  { label: "M (5 - 10 см)", value: "M" },
  { label: "L (10 - 20 см)", value: "L" },
  { label: "XL (20+ см)", value: "XL" },
];

const difficultyOptions = [
  { label: "Легкий", value: "Легкий" },
  { label: "Середній", value: "Середній" },
  { label: "Складний", value: "Складний" },
];

const foodOptions = [
  { label: "Всеїдні (Сухий корм)", value: "Всеїдний" },
  { label: "Рослиноїдні / Водоростейди", value: "Рослиноїдний" },
  { label: "Мʼясоїдні (Живий/Заморожений)", value: "Хижий" },
];

export function SpeciesAdvancedFiltersModal({
  isOpen,
  onClose,
  maxSize,
  setMaxSize,
  difficulty,
  setDifficulty,
  minVolume,
  setMinVolume,
  foodTypes,
  setFoodTypes,
  onReset,
}) {
  const toggleFoodType = (value) => {
    setFoodTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const resetFilters = () => {
    setMaxSize("S");
    setDifficulty("Легкий");
    setMinVolume(100);
    setFoodTypes(["Всеїдний"]);

    onReset?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[430px] overflow-hidden rounded-[18px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-5">
                <h2 className="text-[16px] font-extrabold text-[#111827]">
                  Розширені фільтри
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#98a2b3] transition hover:bg-slate-100 hover:text-[#111827]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5">
                <div className="mb-6">
                  <p className="mb-3 text-[12px] font-extrabold text-[#111827]">
                    Максимальний розмір
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMaxSize(option.value)}
                        className={`h-10 rounded-[8px] border text-[12px] font-bold transition ${
                          maxSize === option.value
                            ? "border-[#5b4cf6] bg-[#eef0ff] text-[#5b4cf6]"
                            : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#5b4cf6]/40"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-[12px] font-extrabold text-[#111827]">
                    Складність утримання
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDifficulty(option.value)}
                        className={`h-9 rounded-full border px-4 text-[12px] font-bold transition ${
                          difficulty === option.value
                            ? "border-[#22c55e] bg-[#ecfdf3] text-[#16a34a]"
                            : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#22c55e]/40"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[12px] font-extrabold text-[#111827]">
                      Мін. обʼєм акваріума
                    </p>

                    <span className="text-[12px] font-extrabold text-[#5b4cf6]">
                      до {minVolume} л
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={minVolume}
                    onChange={(event) => setMinVolume(Number(event.target.value))}
                    className="w-full accent-[#5b4cf6]"
                  />

                  <div className="mt-1 flex justify-between text-[10px] font-medium text-[#98a2b3]">
                    <span>10 л</span>
                    <span>500+ л</span>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[12px] font-extrabold text-[#111827]">
                    Тип живлення
                  </p>

                  <div className="space-y-2">
                    {foodOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-[#475467]"
                      >
                        <input
                          type="checkbox"
                          checked={foodTypes.includes(option.value)}
                          onChange={() => toggleFoodType(option.value)}
                          className="h-4 w-4 rounded border-[#cbd5e1] accent-[#5b4cf6]"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#eef0f4] bg-[#f8fafc] px-6 py-5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[12px] font-bold text-[#64748b] transition hover:text-[#111827]"
                >
                  Скинути все
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-[8px] bg-[#5b4cf6] px-5 py-3 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(91,76,246,0.24)] transition hover:bg-[#4d3fe0]"
                >
                  Показати види
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SpeciesAdvancedFiltersModal;