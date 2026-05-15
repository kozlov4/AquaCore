"use client";

import { motion } from "framer-motion";

const tasks = [
  {
    aquarium: "Головний Травник",
    title: "Внести добрива (Макро)",
    done: false,
    color: "text-[#635BFF]",
    bg: "bg-[#635BFF]/10",
  },
  {
    aquarium: "Креветочник",
    title: "Погодувати креветок (Шпинат)",
    done: false,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    aquarium: "",
    title: "Перевірити температуру",
    done: true,
    color: "text-slate-400",
    bg: "bg-slate-100",
  },
];

export function TodayPlan() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            План на сьогодні
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Залишилося виконати 2 рутини
          </p>
        </div>

        <button className="text-sm font-black text-[#635BFF] transition hover:text-[#5147f5]">
          Відкрити всі
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + index * 0.05 }}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-4 rounded-2xl border border-slate-100 px-4 py-4 transition ${
              task.done ? "bg-slate-50 opacity-55" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                task.done
                  ? "border-[#635BFF] bg-[#635BFF] text-xs text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {task.done && "✓"}
            </div>

            <div>
              {task.aquarium && (
                <span
                  className={`rounded-md px-2 py-1 text-[10px] font-black uppercase ${task.bg} ${task.color}`}
                >
                  {task.aquarium}
                </span>
              )}

              <p
                className={`mt-1 text-sm font-black ${
                  task.done ? "line-through text-slate-400" : "text-slate-950"
                }`}
              >
                {task.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}