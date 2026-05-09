"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export function SpeciesAdvancedFiltersModal({ onClose }) {
  const [size, setSize] = useState("S (до 5 см)");
  const [difficulty, setDifficulty] = useState("Легкий");
  const [volume, setVolume] = useState(100);
  const [nutrition, setNutrition] = useState(["Всеїдні (Сухий корм)"]);

  const toggleNutrition = (item) => {
    setNutrition((prev) =>
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item]
    );
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: -40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.96 }}
        transition={{ duration: 0.28 }}
        className="fixed left-0 top-0 z-50 h-full w-[430px] overflow-y-auto rounded-r-[28px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Розширені фільтри
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <section>
            <h3 className="mb-4 font-black text-slate-900">
              Максимальний розмір
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {["S (до 5 см)", "M (5 - 10 см)", "L (10 - 20 см)", "XL (20+ см)"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      size === item
                        ? "border-[#635BFF] bg-[#635BFF]/10 text-[#5147FF] ring-2 ring-[#635BFF]/20"
                        : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-black text-slate-900">
              Складність утримання
            </h3>

            <div className="flex gap-3">
              {["Легкий", "Середній", "Складний"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDifficulty(item)}
                  className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                    difficulty === item
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-slate-200 text-slate-600 hover:border-green-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Мін. обʼєм акваріума</h3>
              <span className="font-black text-[#635BFF]">до {volume} Л</span>
            </div>

            <input
              type="range"
              min="10"
              max="500"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full accent-[#635BFF]"
            />

            <div className="mt-2 flex justify-between text-sm text-slate-400">
              <span>10 л</span>
              <span>500+ л</span>
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-black text-slate-900">Тип живлення</h3>

            <div className="space-y-3">
              {[
                "Всеїдні (Сухий корм)",
                "Рослиноїдні / Водоростоїдні",
                "Мʼясоїдні (Живий/Заморожений)",
              ].map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={nutrition.includes(item)}
                    onChange={() => toggleNutrition(item)}
                    className="h-5 w-5 accent-[#635BFF]"
                  />
                  {item}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-5">
          <button
            type="button"
            onClick={() => {
              setSize("S (до 5 см)");
              setDifficulty("Легкий");
              setVolume(100);
              setNutrition(["Всеїдні (Сухий корм)"]);
            }}
            className="text-sm font-bold text-slate-500 transition hover:text-slate-900"
          >
            Скинути все
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#635BFF] px-7 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(99,91,255,0.32)] transition hover:bg-[#5046F8]"
          >
            Показати 24 види
          </button>
        </div>
      </motion.div>
    </>
  );
}