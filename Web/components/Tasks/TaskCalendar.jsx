"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const days = [
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
  "Нд",
];

const dates = [30, 31, 1, 2, 3, 4, 5, 22, 23, 24, 25, 26, 27, 28];

export function TaskCalendar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-black text-slate-950">Квітень 2026</h3>

        <div className="flex gap-2 text-slate-400">
          <button className="transition hover:text-slate-900">
            <ChevronLeft size={18} />
          </button>
          <button className="transition hover:text-slate-900">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <span
            key={day}
            className={`text-xs font-bold ${
              day === "Сб" || day === "Нд" ? "text-red-400" : "text-slate-400"
            }`}
          >
            {day}
          </span>
        ))}

        {dates.map((date, index) => (
          <button
            key={`${date}-${index}`}
            className={`h-9 rounded-lg text-sm font-bold transition ${
              date === 24
                ? "bg-[#635BFF] text-white shadow-[0_10px_20px_rgba(99,91,255,0.35)]"
                : index < 2
                ? "text-slate-300"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {date}
          </button>
        ))}
      </div>
    </motion.div>
  );
}