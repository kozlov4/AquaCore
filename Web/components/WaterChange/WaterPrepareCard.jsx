"use client";

import { motion } from "framer-motion";

export function WaterPrepareCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#635BFF] p-6 text-white shadow-[0_22px_55px_rgba(99,91,255,0.28)]"
    >
      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-3xl bg-white/15 rotate-12" />

      <p className="text-xs font-black uppercase tracking-wide text-white/75">
        Вода до підготовки
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-black leading-none">18</span>
        <span className="mb-1 text-xl font-bold">Літрів</span>
      </div>

      <p className="mt-3 max-w-[210px] text-sm leading-5 text-white/80">
        Це 30% від загального обʼєму акваріума (60 л).
      </p>

      <button className="relative z-10 mt-5 w-full rounded-xl bg-white/20 px-4 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/30">
        Змінити налаштування
      </button>
    </motion.div>
  );
}