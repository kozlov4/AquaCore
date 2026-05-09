"use client";

import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const filters = [
  "Всі записи",
  "🌿 Рослини та Добрива",
  "🩺 Хвороби / Проблеми",
  "🐠 Поведінка / Нерест",
  "⚙️ Обладнання",
];

export function DiaryFilters() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[1fr_260px] gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-[#635BFF] focus-within:ring-4 focus-within:ring-[#635BFF]/10">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Пошук по нотатках (напр. водорості)..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <button className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#635BFF]/40">
            Усі екосистеми
            <ChevronDown size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {filters.map((filter, index) => (
          <motion.button
            key={filter}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              index === 0
                ? "bg-[#635BFF] text-white shadow-[0_12px_25px_rgba(99,91,255,0.28)]"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/30 hover:text-[#635BFF]"
            }`}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}