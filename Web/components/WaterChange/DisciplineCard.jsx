"use client";

import { motion } from "framer-motion";

export function DisciplineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.24 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        Ваша дисципліна
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-2xl">
          🏆
        </div>

        <div>
          <p className="font-black text-slate-950">4 тижні поспіль</p>
          <p className="mt-1 text-xs text-slate-400">
            Ви не пропустили жодної підміни
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-sm text-slate-500">Середній інтервал:</span>
        <span className="text-sm font-black text-slate-950">7.2 днів</span>
      </div>
    </motion.div>
  );
}