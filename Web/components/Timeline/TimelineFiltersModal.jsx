"use client";

import { X, Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const eventTypes = [
  "🌐 Усі події",
  "💧 Параметри води",
  "🐟 Населення",
  "⚙️ Обладнання",
  "✅ Обслуговування",
  "🚨 Алерти",
];

export function TimelineFiltersModal({ onClose }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.25 }}
        className="fixed left-1/2 top-1/2 z-50 w-[820px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[26px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="flex items-center gap-3 text-xl font-black text-slate-950">
            <Filter size={20} className="text-[#635BFF]" />
            Параметри відображення
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-black text-[#635BFF] transition hover:text-[#5147f5]"
          >
            Скинути всі
          </button>
        </div>

        <div className="border-t border-slate-100 px-6 py-6">
          <div className="grid grid-cols-4 gap-4">
            {["Екосистема", "Період часу", "З дати", "По дату"].map(
              (label, index) => (
                <div key={label}>
                  <label className="mb-2 block text-xs font-black uppercase text-slate-400">
                    {label}
                  </label>

                  {index < 2 ? (
                    <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800">
                      {index === 0 ? "Головний Травник (60 Л)" : "Останній місяць"}
                      <ChevronDown size={17} className="text-slate-400" />
                    </button>
                  ) : (
                    <input
                      type="date"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500 outline-none focus:border-[#635BFF]"
                    />
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-7">
            <p className="mb-3 text-xs font-black uppercase text-slate-400">
              Тип події
            </p>

            <div className="flex flex-wrap gap-3">
              {eventTypes.map((type, index) => (
                <button
                  key={type}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                    index === 0
                      ? "border-[#635BFF] bg-[#635BFF] text-white"
                      : type.includes("Алерти")
                      ? "border-red-100 bg-red-50 text-red-500"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/40"
                  }`}
                >
                  {type}
                  {type.includes("Алерти") && (
                    <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                      2
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}