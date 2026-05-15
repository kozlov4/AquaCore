"use client";

import { motion } from "framer-motion";

const stats = [
  {
    icon: "🌊",
    label: "Екосистеми",
    value: "2",
    color: "bg-blue-50",
  },
  {
    icon: "📋",
    label: "Завдання",
    value: "3",
    suffix: "на сьогодні",
    color: "bg-slate-100",
  },
  {
    icon: "🧪",
    label: "Параметри",
    value: "В нормі",
    color: "bg-green-50",
    green: true,
  },
  {
    icon: "🚨",
    label: "Алерти",
    value: "1",
    color: "bg-red-50",
    danger: true,
  },
];

export function DashboardStats() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="grid grid-cols-4 gap-5"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + index * 0.05 }}
          whileHover={{ y: -4 }}
          className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] ${
            stat.danger ? "border-red-200" : "border-slate-100"
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${stat.color}`}>
            {stat.icon}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-xl font-black ${
                  stat.green
                    ? "text-green-500"
                    : stat.danger
                    ? "text-red-500"
                    : "text-slate-950"
                }`}
              >
                {stat.value}
              </span>

              {stat.suffix && (
                <span className="text-sm text-slate-500">{stat.suffix}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}