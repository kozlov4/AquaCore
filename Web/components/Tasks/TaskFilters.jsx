"use client";

import { motion } from "framer-motion";

export function TaskFilters({ total, overdue }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-xs font-black uppercase tracking-wide text-slate-400">
        Фільтрація
      </h3>

      <div className="space-y-2">
        <button className="flex w-full items-center justify-between rounded-xl bg-[#635BFF]/10 px-4 py-3 text-sm font-bold text-[#635BFF]">
          <span>🗓️ Всі завдання</span>
          <span className="rounded-full bg-[#635BFF]/20 px-2 py-0.5 text-xs">
            {total}
          </span>
        </button>

        <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
          <span>⚠️ Прострочені</span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-500">
            {overdue}
          </span>
        </button>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold text-slate-500">За акваріумом</p>

        <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
          Усі екосистеми
        </button>
      </div>
    </motion.div>
  );
}