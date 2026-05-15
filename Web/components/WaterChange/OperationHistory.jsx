"use client";

import { motion } from "framer-motion";

const operations = [
  {
    percent: "30%",
    type: "Планова підміна",
    description: "Сифонка ґрунту • Очищення скла",
    date: "19 Квітня",
    status: "Вчасно",
    color: "blue",
  },
  {
    percent: "30%",
    type: "Планова підміна",
    description: "Додано альгіцид",
    date: "12 Квітня",
    status: "Вчасно",
    color: "blue",
  },
  {
    percent: "50%",
    type: "Екстрена підміна",
    description: "Стрибок аміаку. Додано бактерії.",
    date: "8 Квітня",
    status: "Позапланово",
    color: "orange",
  },
];

export function OperationHistory() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.16, duration: 0.4 }}
    >
      <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-400">
        Історія операцій
      </h2>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {operations.map((item, index) => (
          <motion.div
            key={`${item.date}-${index}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + index * 0.06 }}
            whileHover={{ backgroundColor: "#F8FAFC" }}
            className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
                  item.color === "orange"
                    ? "bg-orange-50 text-orange-500"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {item.percent}
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  {item.type}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-slate-950">{item.date}</p>
              <p
                className={`mt-1 text-xs font-bold ${
                  item.status === "Вчасно" ? "text-green-500" : "text-orange-500"
                }`}
              >
                {item.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}