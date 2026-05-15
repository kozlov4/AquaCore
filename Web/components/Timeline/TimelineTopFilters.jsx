"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const filters = ["Усі події", "Жителі", "Параметри води", "Алерти"];

export function TimelineTopFilters({ activeType, setActiveType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <button className="flex min-w-[190px] items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800">
          Головний Травник
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveType(filter)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeType === filter
                  ? "bg-[#635BFF] text-white shadow-[0_12px_25px_rgba(99,91,255,0.28)]"
                  : filter === "Алерти"
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}