"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyAquariums({ onAdd }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="text-5xl font-light tracking-[0.12em] text-gray-900"
      >
        У вас ще немає жодної екосистеми 🐠
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-8 max-w-[760px] text-sm leading-6 text-gray-400"
      >
        Створіть свій перший акваріум, щоб почати відстежувати параметри води,
        контролювати баланс та вести щоденник спостережень.
      </motion.p>

      <motion.button
        type="button"
        onClick={onAdd}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={{
          y: -3,
          boxShadow: "0 18px 40px rgba(109,93,251,0.32)",
        }}
        whileTap={{ scale: 0.97 }}
        className="mt-36 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6D5DFB] to-[#9333EA] px-8 py-4 text-base font-semibold text-white"
      >
        Додати перший акваріум
        <ArrowRight size={18} />
      </motion.button>
    </motion.section>
  );
}