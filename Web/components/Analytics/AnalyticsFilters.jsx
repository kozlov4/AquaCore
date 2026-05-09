"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const parameters = [
  "Кислотність (pH)",
  "Жорсткість (GH)",
  "Аміак (NH3)",
  "Нітрити (NO2)",
  "Нітрати (NO3)",
];

const periods = ["7 Днів", "Місяць", "Рік"];

export function AnalyticsFilters() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35 }}
      className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
    >
      <button
        type="button"
        className="flex min-w-[230px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#635BFF]/40"
      >
        🐟 Головний Травник
        <ChevronDown size={17} className="text-slate-400" />
      </button>

      <div className="flex items-center gap-2">
        {parameters.map((item, index) => (
          <motion.button
            key={item}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              index === 0
                ? "bg-[#635BFF] text-white shadow-[0_12px_26px_rgba(99,91,255,0.3)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {item}
          </motion.button>
        ))}
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1">
        {periods.map((period, index) => (
          <button
            key={period}
            type="button"
            className={`rounded-lg px-3 py-2 text-xs font-black transition ${
              index === 1
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </motion.section>
  );
}