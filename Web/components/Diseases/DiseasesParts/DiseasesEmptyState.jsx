"use client";

import { motion } from "framer-motion";

export function DiseasesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        mt-10 rounded-[28px] border border-white/80
        bg-white/80 p-6 text-center text-slate-500
        shadow-[0_24px_70px_rgba(15,23,42,0.08)]
        backdrop-blur-xl
        sm:mt-16 sm:rounded-[34px] sm:p-10
        lg:mt-20
      "
    >
      <div className="text-5xl sm:text-6xl">😔</div>

      <p className="mt-4 text-lg font-black text-slate-900 sm:text-xl">
        Нічого не знайдено
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Спробуйте змінити запит або обрати інший фільтр.
      </p>
    </motion.div>
  );
}