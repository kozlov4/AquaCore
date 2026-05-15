"use client";

import { motion } from "framer-motion";

const events = [
  {
    color: "bg-green-500",
    title: "Параметри води в нормі",
    text: "Сьогодні, 10:30",
  },
  {
    color: "bg-[#635BFF]",
    title: "Заселення жителів",
    text: "Вчора • Неон звичайний (+10)",
  },
  {
    color: "bg-slate-400",
    title: "Нова нотатка в журналі",
    text: "18 Квітня",
  },
];

export function RecentEvents() {
  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.28 }}
      className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Останні події</h2>
        <button className="text-sm font-bold text-slate-400 hover:text-[#635BFF]">
          Всі
        </button>
      </div>

      <div className="space-y-5">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 + index * 0.05 }}
            className="flex gap-4"
          >
            <span className={`mt-1 h-3 w-3 rounded-full ${event.color}`} />

            <div>
              <p className="text-sm font-black text-slate-950">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">{event.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}