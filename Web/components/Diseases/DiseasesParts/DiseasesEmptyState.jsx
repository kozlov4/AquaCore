"use client";

import { motion } from "framer-motion";

export function DiseasesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-20 rounded-[34px] border border-white/80 bg-white/80 p-10 text-center text-slate-500 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
    >
      <div className="text-6xl">😔</div>

      <p className="mt-4 text-xl font-black text-slate-900">
        Нічого не знайдено
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Спробуйте змінити запит або обрати інший фільтр.
      </p>
    </motion.div>
  );
}