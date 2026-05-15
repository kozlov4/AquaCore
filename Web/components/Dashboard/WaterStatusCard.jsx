"use client";

import { motion } from "framer-motion";

export function WaterStatusCard() {
  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.22 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2563EB] to-[#635BFF] p-6 text-white shadow-[0_24px_60px_rgba(37,99,235,0.28)]"
    >
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rotate-45 rounded-3xl bg-white/10" />

      <div className="relative z-10 mb-8 flex items-start justify-between">
        <p className="text-xs font-black uppercase tracking-wide text-white/70">
          Статус води
        </p>

        <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
          Головний Травник
        </span>
      </div>

      <div className="relative z-10 flex items-end gap-2">
        <span className="text-5xl font-black leading-none">5</span>
        <span className="mb-1 text-sm font-bold text-white/85">
          днів з останньої підміни
        </span>
      </div>

      <div className="relative z-10 mt-5 h-2 overflow-hidden rounded-full bg-white/25">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "72%" }}
          transition={{ duration: 0.9 }}
          className="h-full rounded-full bg-white"
        />
      </div>

      <div className="relative z-10 mt-3 flex justify-between text-xs font-bold text-white/70">
        <span>19 КВІТНЯ</span>
        <span>ПЛАН: 26 КВІТНЯ</span>
      </div>
    </motion.section>
  );
}